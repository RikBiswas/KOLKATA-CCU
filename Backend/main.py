import os
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Portfolio Review & Feedback API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "reviews.json")


def load_reviews() -> List[dict]:
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_reviews(reviews: List[dict]):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(reviews, f, indent=2, ensure_ascii=False)


class ReviewCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    role: Optional[str] = Field(default="Peer Reviewer", max_length=100)
    rating: int = Field(default=5, ge=1, le=5)
    review: str = Field(..., min_length=1, max_length=2000)


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
        "message": "Portfolio Feedback API is running",
        "endpoints": {
            "get_reviews": "GET /api/reviews",
            "submit_review": "POST /api/reviews"
        }
    }


@app.get("/api/reviews", response_model=List[ReviewResponse])
def get_reviews():
    """Retrieve all submitted reviews from the local JSON storage file."""
    return load_reviews()


@app.post("/api/reviews", response_model=ReviewResponse, status_code=201)
def submit_review(review_data: ReviewCreate):
    """Save a new review into reviews.json and return the saved review item."""
    reviews = load_reviews()
    new_entry = {
        "id": int(datetime.now().timestamp() * 1000),
        "name": review_data.name.strip(),
        "role": review_data.role.strip() if review_data.role and review_data.role.strip() else "Peer Reviewer",
        "rating": review_data.rating,
        "review": review_data.review.strip(),
        "date": datetime.now().strftime("%b %d, %Y"),
    }
    # Prepend newest review first
    reviews.insert(0, new_entry)
    save_reviews(reviews)
    return new_entry


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
