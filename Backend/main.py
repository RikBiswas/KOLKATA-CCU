import os
import json
import time
import logging
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("neon_backend")

# Load environment variables from .env.local or .env in project root
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(ROOT_DIR, ".env.local"))
load_dotenv(os.path.join(ROOT_DIR, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL_UNPOOLED = os.getenv("DATABASE_URL_UNPOOLED")
NEON_BRANCH = os.getenv("NEON_BRANCH", "production")

DATA_FILE = os.path.join(os.path.dirname(__file__), "reviews.json")

# Rate Limiting & Word Limit configuration
RATE_LIMIT_SECONDS = 60
MAX_WORDS = 150
last_submission_times: dict[str, float] = {}


def get_client_ip(request: Request) -> str:
    """Extract client IP, taking into account X-Forwarded-For if behind a proxy."""
    forwarded_for = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown_client"

app = FastAPI(title="Portfolio Review & Feedback API (Neon Postgres)")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(reviews, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.warning(f"Error saving backup reviews.json: {e}")


class ReviewCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    role: Optional[str] = Field(default="Peer Reviewer", max_length=100)
    rating: int = Field(default=5, ge=1, le=5)
    review: str = Field(..., min_length=1)

    @field_validator("review")
    @classmethod
    def validate_word_limit(cls, v: str) -> str:
        words = v.strip().split()
        if len(words) == 0:
            raise ValueError("Review cannot be empty.")
        if len(words) > MAX_WORDS:
            raise ValueError(f"Review exceeds the limit of {MAX_WORDS} words (contains {len(words)} words). Please limit your review to 150 words or fewer.")
        return v.strip()


class ReviewResponse(BaseModel):
    id: int
    name: str
    role: str
    rating: int
    review: str
    date: str


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Portfolio Feedback API",
        "backend": "Neon Lakebase PostgreSQL",
        "branch": NEON_BRANCH,
        "rate_limit": f"1 review per {RATE_LIMIT_SECONDS} seconds per user",
        "word_limit": f"maximum {MAX_WORDS} words",
        "endpoints": {
            "health": "GET /api/health",
            "get_reviews": "GET /api/reviews",
            "submit_review": "POST /api/reviews"
        }
    }


@app.get("/api/health")
def health_check():
    """Verify Neon PostgreSQL health and connection status."""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                pg_version = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM reviews;")
                review_count = cur.fetchone()[0]
            conn.close()
            return {
                "status": "healthy",
                "database": "connected",
                "provider": "Neon",
                "branch": NEON_BRANCH,
                "postgres_version": pg_version,
                "review_count": review_count,
                "rate_limit_seconds": RATE_LIMIT_SECONDS,
                "max_words": MAX_WORDS
            }
        except Exception as e:
            return {
                "status": "degraded",
                "database": f"error: {str(e)}",
                "provider": "Neon"
            }
    return {
        "status": "fallback",
        "database": "offline (using local JSON storage)",
        "provider": "Local"
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
    """Save a new review into Neon PostgreSQL. The 60-second rate limiter applies after the user submits."""
    # 1. Enforce 150-word maximum limit
    words = review_data.review.strip().split()
    if len(words) > MAX_WORDS:
        raise HTTPException(
            status_code=400,
            detail=f"Review exceeds the limit of {MAX_WORDS} words. You provided {len(words)} words. Please shorten your feedback to {MAX_WORDS} words or fewer."
        )

    # 2. Identify the specific user via Client ID header or User Name + IP
    client_id = request.headers.get("x-client-id") or request.headers.get("X-Client-Id")
    client_ip = get_client_ip(request)
    user_key = f"client:{client_id.strip()}" if client_id and client_id.strip() else f"user:{client_ip}:{review_data.name.strip().lower()}"

    now = time.time()

    # Prune stale records older than 10 minutes
    stale_threshold = now - 600
    for key, ts in list(last_submission_times.items()):
        if ts < stale_threshold:
            last_submission_times.pop(key, None)

    # Check if this user previously submitted a review within the last 60 seconds
    if user_key in last_submission_times:
        elapsed = now - last_submission_times[user_key]
        if elapsed < RATE_LIMIT_SECONDS:
            remaining = int(RATE_LIMIT_SECONDS - elapsed) + 1
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit reached: Each user can submit at most 1 review every 60 seconds. Please wait {remaining} second{'s' if remaining != 1 else ''}."
            )

    new_entry = {
        "id": int(datetime.now().timestamp() * 1000),
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

    # 3. Apply the 60-second rate limiter rule AFTER the user successfully submits the review
    last_submission_times[user_key] = time.time()

    return new_entry


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
