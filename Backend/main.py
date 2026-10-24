import os
import re
import json
import time
import logging
import hashlib
import threading
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request, Response, Header, Security, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("wander_ccu_backend")

# Load environment variables strictly from server environment / local env files
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(ROOT_DIR, ".env.local"))
load_dotenv(os.path.join(ROOT_DIR, ".env"))
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL_POOLED") or os.getenv("DATABASE_URL")
DATABASE_URL_UNPOOLED = os.getenv("DATABASE_URL_UNPOOLED") or os.getenv("DATABASE_URL")
NEON_BRANCH = os.getenv("NEON_BRANCH", "production")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "wander_ccu_secret_admin_key_2026")

DATA_FILE = os.path.join(os.path.dirname(__file__), "reviews.json")

# Rate Limiting, Spam, and Concurrency configuration
RATE_LIMIT_SECONDS = 60
MAX_WORDS = 150
MAX_RATE_LIMIT_ENTRIES = 5000

# Thread-safe in-memory stores
_rate_limit_lock = threading.Lock()
last_submission_times: dict[str, float] = {}

_duplicate_lock = threading.Lock()
recent_review_hashes: dict[str, float] = {}

_id_lock = threading.Lock()
_id_counter = 0

_file_write_lock = threading.Lock()


def generate_unique_review_id() -> int:
    """Generate a collision-free monotonic 64-bit integer ID using microsecond timestamp and atomic counter."""
    global _id_counter
    with _id_lock:
        _id_counter = (_id_counter + 1) % 1000
        return int(time.time() * 1000000) * 1000 + _id_counter


def get_client_ip(request: Request) -> str:
    """Extract client IP securely without trusting spoofed client-supplied identity headers."""
    forwarded_for = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
        if client_ip:
            return client_ip
    if request.client and request.client.host:
        return request.client.host
    return "unknown_client"


app = FastAPI(
    title="WANDER.CCU Review & Feedback API",
    description="Secure FastAPI Backend for WANDER.CCU Kolkata Travel Journal with Neon PostgreSQL",
    version="1.1.0"
)

# Custom validation exception handler for clean, user-friendly 422 error messages
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        msg = err.get("msg", "Invalid input")
        if msg.startswith("Value error, "):
            msg = msg.replace("Value error, ", "")
        errors.append(msg)
    message = "; ".join(errors) if errors else "Invalid submission data."
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": message}
    )

# Bearer token security scheme for optional OpenAPI documentation
bearer_scheme = HTTPBearer(auto_error=False)


def verify_admin_auth(
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
    bearer_creds: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme)
) -> bool:
    """Authenticate administrative requests using X-Admin-Key header or Bearer token."""
    provided_key: Optional[str] = None
    if x_admin_key:
        provided_key = x_admin_key.strip()
    elif bearer_creds and bearer_creds.credentials:
        provided_key = bearer_creds.credentials.strip()

    if not provided_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide X-Admin-Key header or Bearer authorization token."
        )

    if provided_key != ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Invalid administrator credentials."
        )

    return True


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


# Restrict CORS to trusted origins
DEFAULT_ALLOWED_ORIGINS = [
    "https://kolkata-ccu.onrender.com",
    "https://wander-ccu.travel",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
env_origins = os.getenv("ALLOWED_ORIGINS")
allowed_origins = [o.strip() for o in env_origins.split(",") if o.strip()] if env_origins else DEFAULT_ALLOWED_ORIGINS
allowed_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", r"^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?|https:\/\/.*\.vercel\.app)$")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "X-Admin-Key"],
)


def _clean_conn_str(val: Optional[str]) -> Optional[str]:
    """Strip leading/trailing whitespace and surrounding quotes."""
    if not val:
        return None
    cleaned = val.strip().strip('"').strip("'").strip()
    return cleaned if cleaned else None


# Module-level cached working connection string
_active_db_url: Optional[str] = None


def get_db_connection():
    """Get a direct connection to Neon PostgreSQL with resilient multi-endpoint fallback."""
    global _active_db_url

    candidates: List[str] = []
    if _active_db_url:
        candidates.append(_active_db_url)

    for env_var in ["DATABASE_URL_POOLED", "DATABASE_URL", "DATABASE_URL_UNPOOLED"]:
        raw = os.getenv(env_var)
        cleaned = _clean_conn_str(raw)
        if cleaned:
            if "<PASSWORD>" in cleaned:
                logger.error(f"[{env_var}] contains placeholder '<PASSWORD>'. Update with real Neon database password in Render environment variables.")
                continue
            if cleaned not in candidates:
                candidates.append(cleaned)
            # Add variant without channel_binding=require in case client libpq does not support it
            if "channel_binding=" in cleaned:
                alt = re.sub(r'([?&])channel_binding=[^&]*(&|$)', r'\1', cleaned).rstrip('&').rstrip('?')
                if alt not in candidates:
                    candidates.append(alt)

    if not candidates:
        return None

    last_error = None
    for url in candidates:
        try:
            conn = psycopg2.connect(url)
            _active_db_url = url
            return conn
        except Exception as e:
            last_error = e

    if last_error:
        logger.error(f"Failed to connect to Neon PostgreSQL: {last_error}")
    return None



def init_db():
    """Initialize Neon PostgreSQL reviews table and seed from reviews.json if empty."""
    conn = get_db_connection()
    if not conn:
        logger.warning("Neon DATABASE_URL not available or unreachable. Operating in JSON fallback mode.")
        return

    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS reviews (
                    id BIGINT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    role VARCHAR(100) NOT NULL DEFAULT 'Peer Reviewer',
                    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                    review TEXT NOT NULL,
                    date VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()

            # Check if any reviews exist
            cur.execute("SELECT COUNT(*) FROM reviews;")
            count = cur.fetchone()[0]

            if count == 0 and os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, "r", encoding="utf-8") as f:
                        existing = json.load(f)
                    for item in existing:
                        cur.execute("""
                            INSERT INTO reviews (id, name, role, rating, review, date)
                            VALUES (%s, %s, %s, %s, %s, %s)
                            ON CONFLICT (id) DO NOTHING;
                        """, (
                            item["id"],
                            item["name"],
                            item.get("role", "Peer Reviewer"),
                            item["rating"],
                            item["review"],
                            item["date"]
                        ))
                    conn.commit()
                    logger.info(f"Successfully migrated {len(existing)} reviews from JSON into Neon PostgreSQL.")
                except Exception as seed_err:
                    logger.warning(f"Failed seeding initial reviews: {seed_err}")
    except Exception as e:
        logger.error(f"Error during Neon DB initialization: {e}")
    finally:
        conn.close()


# Initialize database schema on startup
@app.on_event("startup")
def on_startup():
    init_db()


def load_reviews_from_file() -> List[dict]:
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_reviews_to_file(reviews: List[dict]):
    """Thread-safe atomic write to reviews.json to prevent race conditions and file corruption."""
    with _file_write_lock:
        temp_file = f"{DATA_FILE}.tmp.{os.getpid()}"
        try:
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(reviews, f, indent=2, ensure_ascii=False)
                f.flush()
                os.fsync(f.fileno())
            os.replace(temp_file, DATA_FILE)
        except Exception as e:
            logger.warning(f"Error saving backup reviews.json: {e}")
            if os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except Exception:
                    pass


# URL and script spam pattern detection
URL_PATTERN = re.compile(r'(https?://|www\.|\b[a-z0-9.-]+\.(?:com|org|net|xyz|ru|cn|io|co|biz|info|tk|top|buzz)\b)', re.IGNORECASE)
SCRIPT_PATTERN = re.compile(r'(<\s*script|javascript\s*:|<\s*img|<\s*iframe)', re.IGNORECASE)


class ReviewCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    role: Optional[str] = Field(default="Peer Reviewer", max_length=100)
    rating: int = Field(default=5, ge=1, le=5)
    review: str = Field(..., min_length=2)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Name cannot be empty.")
        if SCRIPT_PATTERN.search(clean):
            raise ValueError("Invalid characters in name.")
        return clean

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: Optional[str]) -> str:
        if not v or not v.strip():
            return "Peer Reviewer"
        return v.strip()

    @field_validator("review")
    @classmethod
    def validate_review_content(cls, v: str) -> str:
        clean = v.strip()
        if len(clean) < 2:
            raise ValueError("Please provide at least 2 characters of feedback.")
        if SCRIPT_PATTERN.search(clean):
            raise ValueError("Review contains prohibited markup or script elements.")
        if URL_PATTERN.search(clean):
            raise ValueError("Reviews cannot contain web links or promotional URLs.")

        words = clean.split()
        if len(words) > MAX_WORDS:
            raise ValueError(
                f"Review exceeds the limit of {MAX_WORDS} words (contains {len(words)} words). "
                f"Please limit your review to 150 words or fewer."
            )
        return clean


class ReviewUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, max_length=100)
    rating: Optional[int] = Field(None, ge=1, le=5)
    review: Optional[str] = Field(None, min_length=2)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        clean = v.strip()
        if not clean:
            raise ValueError("Name cannot be empty.")
        if SCRIPT_PATTERN.search(clean):
            raise ValueError("Invalid characters in name.")
        return clean

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        clean = v.strip()
        return clean if clean else "Peer Reviewer"

    @field_validator("review")
    @classmethod
    def validate_review_content(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        clean = v.strip()
        if len(clean) < 2:
            raise ValueError("Please provide at least 2 characters of feedback.")
        if SCRIPT_PATTERN.search(clean):
            raise ValueError("Review contains prohibited markup or script elements.")
        if URL_PATTERN.search(clean):
            raise ValueError("Reviews cannot contain web links or promotional URLs.")
        words = clean.split()
        if len(words) > MAX_WORDS:
            raise ValueError(
                f"Review exceeds the limit of {MAX_WORDS} words (contains {len(words)} words)."
            )
        return clean


class ReviewResponse(BaseModel):
    id: int
    name: str
    role: str
    rating: int
    review: str
    date: str


@app.get("/")
def read_root():
    """Sanitized root endpoint without leaking internal database engines or branch names."""
    return {
        "status": "online",
        "service": "WANDER.CCU Kolkata Travel Journal API",
        "version": "1.1.0",
        "endpoints": {
            "health": "GET /api/health",
            "list_reviews": "GET /api/reviews",
            "get_review": "GET /api/reviews/{id}",
            "submit_review": "POST /api/reviews",
            "update_review": "PUT /api/reviews/{id} (Admin Protected)",
            "delete_review": "DELETE /api/reviews/{id} (Admin Protected)",
        },
    }


@app.get("/api/health")
def health_check():
    """Sanitized health check without exposing database engine version or exception details."""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
            conn.close()
            return {
                "status": "healthy",
                "database": "connected",
            }
        except Exception:
            return {
                "status": "degraded",
                "database": "unavailable",
            }
    return {
        "status": "fallback",
        "database": "offline_fallback",
    }


@app.get("/api/reviews", response_model=List[ReviewResponse])
def get_reviews():
    """Retrieve all reviews, reading directly from Neon PostgreSQL with JSON fallback."""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, name, role, rating, review, date FROM reviews ORDER BY id DESC;")
                rows = cur.fetchall()
            conn.close()
            return [dict(r) for r in rows]
        except Exception as e:
            logger.error(f"Error fetching reviews from Neon: {e}")
            if conn:
                conn.close()

    # Fallback to file storage if database query failed
    return load_reviews_from_file()


@app.get("/api/reviews/{review_id}", response_model=ReviewResponse)
def get_single_review(review_id: int):
    """Retrieve a single review by ID from Neon PostgreSQL with JSON fallback."""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, name, role, rating, review, date FROM reviews WHERE id = %s;", (review_id,))
                row = cur.fetchone()
            conn.close()
            if row:
                return dict(row)
        except Exception as e:
            logger.error(f"Error fetching review {review_id} from Neon: {e}")
            if conn:
                conn.close()

    # Fallback to file storage
    file_reviews = load_reviews_from_file()
    for item in file_reviews:
        if item.get("id") == review_id:
            return item

    raise HTTPException(status_code=404, detail=f"Review with id {review_id} not found.")


@app.post("/api/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(review_data: ReviewCreate, request: Request):
    """
    Save a new review into Neon PostgreSQL.
    Enforces server-side IP-based rate limiting (1 review / 60 seconds per IP)
    and spam duplicate rejection. Client-supplied identity headers are ignored.
    """
    client_ip = get_client_ip(request)
    now = time.time()

    # 1. Server-side Rate Limiting strictly by IP
    with _rate_limit_lock:
        stale_threshold = now - 600
        stale_keys = [k for k, ts in last_submission_times.items() if ts < stale_threshold]
        for k in stale_keys:
            last_submission_times.pop(k, None)

        if len(last_submission_times) > MAX_RATE_LIMIT_ENTRIES:
            last_submission_times.clear()

        if client_ip in last_submission_times:
            elapsed = now - last_submission_times[client_ip]
            if elapsed < RATE_LIMIT_SECONDS:
                remaining = int(RATE_LIMIT_SECONDS - elapsed) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Rate limit reached: You can submit at most 1 review every 60 seconds. Please wait {remaining} second{'s' if remaining != 1 else ''}."
                )

    # 2. Duplicate Submission Detection (prevent repeated automated re-posts within 5 minutes)
    content_hash = hashlib.sha256(f"{review_data.name.lower()}:{review_data.review.lower()}".encode("utf-8")).hexdigest()
    with _duplicate_lock:
        dup_stale = now - 300
        dup_stale_keys = [k for k, ts in recent_review_hashes.items() if ts < dup_stale]
        for k in dup_stale_keys:
            recent_review_hashes.pop(k, None)

        if content_hash in recent_review_hashes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A review with identical feedback has already been submitted recently."
            )

    # 3. Collision-free Unique ID generation
    new_entry = {
        "id": generate_unique_review_id(),
        "name": review_data.name.strip(),
        "role": review_data.role.strip() if review_data.role and review_data.role.strip() else "Peer Reviewer",
        "rating": review_data.rating,
        "review": review_data.review.strip(),
        "date": datetime.now().strftime("%b %d, %Y"),
    }

    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO reviews (id, name, role, rating, review, date)
                    VALUES (%s, %s, %s, %s, %s, %s);
                """, (
                    new_entry["id"],
                    new_entry["name"],
                    new_entry["role"],
                    new_entry["rating"],
                    new_entry["review"],
                    new_entry["date"]
                ))
                conn.commit()
            conn.close()
            logger.info(f"Saved review {new_entry['id']} to Neon PostgreSQL.")
        except Exception as e:
            logger.error(f"Error saving review to Neon PostgreSQL: {e}")
            if conn:
                conn.close()

    # Always keep local backup up to date as well
    try:
        file_reviews = load_reviews_from_file()
        file_reviews.insert(0, new_entry)
        save_reviews_to_file(file_reviews)
    except Exception as e:
        logger.warning(f"Failed local file backup: {e}")

    # 4. Record submission timestamps after successful creation
    with _rate_limit_lock:
        last_submission_times[client_ip] = time.time()
    with _duplicate_lock:
        recent_review_hashes[content_hash] = time.time()

    return new_entry


@app.put("/api/reviews/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    update_data: ReviewUpdate,
    _auth: bool = Security(verify_admin_auth)
):
    """
    Update an existing review in Neon PostgreSQL and file storage.
    Protected operation: Requires valid admin credentials (X-Admin-Key or Bearer token).
    """
    # Fetch existing review first
    existing: Optional[dict] = None
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, name, role, rating, review, date FROM reviews WHERE id = %s;", (review_id,))
                row = cur.fetchone()
                if row:
                    existing = dict(row)
        except Exception as e:
            logger.error(f"Error querying review {review_id} for update: {e}")

    if not existing:
        file_reviews = load_reviews_from_file()
        for item in file_reviews:
            if item.get("id") == review_id:
                existing = item
                break

    if not existing:
        if conn:
            conn.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Review with id {review_id} not found.")

    # Apply updates
    updated_name = update_data.name.strip() if update_data.name is not None else existing["name"]
    updated_role = update_data.role.strip() if update_data.role is not None else existing.get("role", "Peer Reviewer")
    updated_rating = update_data.rating if update_data.rating is not None else existing["rating"]
    updated_review = update_data.review.strip() if update_data.review is not None else existing["review"]

    updated_entry = {
        "id": review_id,
        "name": updated_name,
        "role": updated_role,
        "rating": updated_rating,
        "review": updated_review,
        "date": existing["date"],
    }

    # Update in Neon DB
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE reviews
                    SET name = %s, role = %s, rating = %s, review = %s
                    WHERE id = %s;
                """, (updated_name, updated_role, updated_rating, updated_review, review_id))
                conn.commit()
            conn.close()
            logger.info(f"Updated review {review_id} in Neon PostgreSQL.")
        except Exception as e:
            logger.error(f"Error updating review {review_id} in Neon: {e}")
            if conn:
                conn.close()

    # Update in local file backup
    try:
        file_reviews = load_reviews_from_file()
        for i, item in enumerate(file_reviews):
            if item.get("id") == review_id:
                file_reviews[i] = updated_entry
                break
        save_reviews_to_file(file_reviews)
    except Exception as e:
        logger.warning(f"Failed updating local file backup: {e}")

    return updated_entry


@app.delete("/api/reviews/{review_id}")
def delete_review(
    review_id: int,
    _auth: bool = Security(verify_admin_auth)
):
    """
    Delete an existing review from Neon PostgreSQL and file storage.
    Protected operation: Requires valid admin credentials (X-Admin-Key or Bearer token).
    """
    deleted_from_db = False
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM reviews WHERE id = %s RETURNING id;", (review_id,))
                res = cur.fetchone()
                if res:
                    deleted_from_db = True
                conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Error deleting review {review_id} from Neon: {e}")
            if conn:
                conn.close()

    deleted_from_file = False
    try:
        file_reviews = load_reviews_from_file()
        initial_len = len(file_reviews)
        file_reviews = [r for r in file_reviews if r.get("id") != review_id]
        if len(file_reviews) < initial_len:
            deleted_from_file = True
            save_reviews_to_file(file_reviews)
    except Exception as e:
        logger.warning(f"Failed updating file backup during deletion: {e}")

    if not deleted_from_db and not deleted_from_file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Review with id {review_id} not found.")

    return {"message": "Review deleted successfully", "id": review_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
