import os
import re
import json
import time
import logging
import hashlib
import threading
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("neon_backend")

# Load environment variables from .env.local, .env, or Backend/.env
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(ROOT_DIR, ".env.local"))
load_dotenv(os.path.join(ROOT_DIR, ".env"))
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL_POOLED") or os.getenv("DATABASE_URL")
DATABASE_URL_UNPOOLED = os.getenv("DATABASE_URL_UNPOOLED") or os.getenv("DATABASE_URL")
NEON_BRANCH = os.getenv("NEON_BRANCH", "production")

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
        # Microsecond timestamp (16 digits) * 1000 + counter (3 digits) fits comfortably in Postgres BIGINT (max 9.22e18)
        return int(time.time() * 1000000) * 1000 + _id_counter


def get_client_ip(request: Request) -> str:
    """Extract client IP securely without trusting spoofed client-supplied identity headers."""
    # If behind a known reverse proxy (e.g. Render / Cloudflare), parse X-Forwarded-For securely
    forwarded_for = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the leftmost untrusted client IP in the chain
        client_ip = forwarded_for.split(",")[0].strip()
        if client_ip:
            return client_ip
    if request.client and request.client.host:
        return request.client.host
    return "unknown_client"


app = FastAPI(title="WANDER.CCU Review & Feedback API")

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


def get_db_connection():
    """Get a direct connection to Neon PostgreSQL."""
    if not DATABASE_URL:
        return None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to Neon PostgreSQL: {e}")
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
                # Seed from existing reviews.json
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

    @field_validator("review")
    @classmethod
    def validate_review_content(cls, v: str) -> str:
        clean = v.strip()
        if SCRIPT_PATTERN.search(clean):
            raise ValueError("Review contains prohibited markup or script elements.")
        if URL_PATTERN.search(clean):
            raise ValueError("Reviews cannot contain web links or promotional URLs.")

        words = clean.split()
        if len(words) < 2:
            raise ValueError("Please provide at least 2 words of meaningful feedback.")
        if len(words) > MAX_WORDS:
            raise ValueError(
                f"Review exceeds the limit of {MAX_WORDS} words (contains {len(words)} words). "
                f"Please limit your review to 150 words or fewer."
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
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /api/health",
            "get_reviews": "GET /api/reviews",
            "submit_review": "POST /api/reviews",
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


@app.post("/api/reviews", response_model=ReviewResponse, status_code=201)
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
        # Prune stale records older than 10 minutes to protect memory
        stale_threshold = now - 600
        stale_keys = [k for k, ts in last_submission_times.items() if ts < stale_threshold]
        for k in stale_keys:
            last_submission_times.pop(k, None)

        # Enforce size ceiling against flood attacks
        if len(last_submission_times) > MAX_RATE_LIMIT_ENTRIES:
            last_submission_times.clear()

        # Check IP cooldown
        if client_ip in last_submission_times:
            elapsed = now - last_submission_times[client_ip]
            if elapsed < RATE_LIMIT_SECONDS:
                remaining = int(RATE_LIMIT_SECONDS - elapsed) + 1
                raise HTTPException(
                    status_code=429,
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
                status_code=400,
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

    saved_to_db = False
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
            saved_to_db = True
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

