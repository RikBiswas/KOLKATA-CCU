import os
import time
import shutil
import pytest
from fastapi.testclient import TestClient
from Backend.main import app, ADMIN_API_KEY, last_submission_times, recent_review_hashes, DATA_FILE

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def preserve_data_file():
    """Preserve baseline reviews.json content before and after test session."""
    backup_file = f"{DATA_FILE}.test_backup"
    if os.path.exists(DATA_FILE):
        shutil.copyfile(DATA_FILE, backup_file)
    yield
    if os.path.exists(backup_file):
        shutil.copyfile(backup_file, DATA_FILE)
        try:
            os.remove(backup_file)
        except Exception:
            pass


@pytest.fixture(autouse=True)
def reset_in_memory_stores():
    """Clear in-memory rate-limit and duplicate stores before each test to ensure deterministic tests."""
    last_submission_times.clear()
    recent_review_hashes.clear()
    yield
    last_submission_times.clear()
    recent_review_hashes.clear()


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "endpoints" in data
    assert "health" in data["endpoints"]
    assert "list_reviews" in data["endpoints"]
    assert "submit_review" in data["endpoints"]


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    # Ensure no database credentials or connection strings are leaked
    for key, val in data.items():
        assert "postgresql://" not in str(val)
        assert "neondb_owner" not in str(val)


def test_security_headers():
    response = client.get("/")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert "strict-origin-when-cross-origin" in response.headers["Referrer-Policy"]


def test_cors_preflight_and_origins():
    # Test allowed origin
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
    }
    response = client.options("/api/reviews", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_get_reviews():
    response = client.get("/api/reviews")
    assert response.status_code == 200
    reviews = response.json()
    assert isinstance(reviews, list)
    if len(reviews) > 0:
        first = reviews[0]
        assert "id" in first
        assert "name" in first
        assert "rating" in first
        assert "review" in first


def test_get_single_review_not_found():
    response = client.get("/api/reviews/999999999999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_submit_review_success():
    payload = {
        "name": f"Test Explorer {int(time.time())}",
        "role": "Heritage Walker",
        "rating": 5,
        "review": "A wonderfully peaceful morning walk through Dalhousie Square colonial lanes.",
    }
    response = client.post("/api/reviews", json=payload, headers={"X-Forwarded-For": "192.168.1.101"})
    assert response.status_code == 201
    created = response.json()
    assert created["name"] == payload["name"]
    assert created["rating"] == 5
    assert created["role"] == "Heritage Walker"
    assert "id" in created
    assert "date" in created

    # Fetch it by ID to verify read single endpoint
    get_res = client.get(f"/api/reviews/{created['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == created["id"]


def test_submit_review_validation_errors():
    # 1. Empty name
    res = client.post("/api/reviews", json={
        "name": "   ",
        "rating": 5,
        "review": "Nice Kolkata heritage walk.",
    })
    assert res.status_code == 422

    # 2. Prohibited script markup
    res = client.post("/api/reviews", json={
        "name": "<script>alert('xss')</script>",
        "rating": 5,
        "review": "Nice walk around Victoria Memorial.",
    })
    assert res.status_code == 422

    # 3. URL spam prohibited
    res = client.post("/api/reviews", json={
        "name": "Spammer",
        "rating": 5,
        "review": "Visit https://spam-travel-deals.xyz for cheap tickets now!",
    })
    assert res.status_code == 422

    # 4. Less than 2 characters
    res = client.post("/api/reviews", json={
        "name": "Explorer",
        "rating": 5,
        "review": "a",
    })
    assert res.status_code == 422

    # 5. Rating out of bounds
    res = client.post("/api/reviews", json={
        "name": "Explorer",
        "rating": 6,
        "review": "Wonderful Kolkata walk.",
    })
    assert res.status_code == 422


def test_duplicate_submission_detection():
    payload = {
        "name": f"Unique Traveler {int(time.time())}",
        "rating": 5,
        "review": "St. Pauls Cathedral stained glass windows are magnificent in the late afternoon.",
    }
    # First submission succeeds
    res1 = client.post("/api/reviews", json=payload, headers={"X-Forwarded-For": "192.168.1.102"})
    assert res1.status_code == 201

    # Second identical submission from another IP triggers duplicate rejection
    res2 = client.post("/api/reviews", json=payload, headers={"X-Forwarded-For": "192.168.1.103"})
    assert res2.status_code == 400
    assert "identical feedback" in res2.json()["detail"].lower()


def test_rate_limiting():
    ip = "192.168.1.104"
    payload1 = {
        "name": "Speedy Walker",
        "rating": 5,
        "review": "First review about College Street coffee house.",
    }
    payload2 = {
        "name": "Speedy Walker",
        "rating": 5,
        "review": "Second review about Kumartuli potters colony.",
    }

    res1 = client.post("/api/reviews", json=payload1, headers={"X-Forwarded-For": ip})
    assert res1.status_code == 201

    # Immediate second submission from same IP triggers 429
    res2 = client.post("/api/reviews", json=payload2, headers={"X-Forwarded-For": ip})
    assert res2.status_code == 429
    assert "rate limit reached" in res2.json()["detail"].lower()


def test_protected_update_review_authorization():
    # First create a review
    create_res = client.post("/api/reviews", json={
        "name": "Original Author",
        "rating": 4,
        "review": "Original review text regarding Princep Ghat sunset.",
    }, headers={"X-Forwarded-For": "192.168.1.105"})
    assert create_res.status_code == 201
    rev_id = create_res.json()["id"]

    # 1. Update without auth -> 401
    res_no_auth = client.put(f"/api/reviews/{rev_id}", json={"rating": 5})
    assert res_no_auth.status_code == 401

    # 2. Update with invalid auth -> 403
    res_bad_auth = client.put(
        f"/api/reviews/{rev_id}",
        json={"rating": 5},
        headers={"X-Admin-Key": "wrong-secret-key"}
    )
    assert res_bad_auth.status_code == 403

    # 3. Update with valid X-Admin-Key -> 200
    res_valid_header = client.put(
        f"/api/reviews/{rev_id}",
        json={"name": "Updated Author", "rating": 5, "review": "Updated review text with magnificent views."},
        headers={"X-Admin-Key": ADMIN_API_KEY}
    )
    assert res_valid_header.status_code == 200
    data = res_valid_header.json()
    assert data["name"] == "Updated Author"
    assert data["rating"] == 5

    # 4. Update with Bearer token authorization
    res_valid_bearer = client.put(
        f"/api/reviews/{rev_id}",
        json={"role": "Lead Architect"},
        headers={"Authorization": f"Bearer {ADMIN_API_KEY}"}
    )
    assert res_valid_bearer.status_code == 200
    assert res_valid_bearer.json()["role"] == "Lead Architect"


def test_protected_delete_review_authorization():
    # First create a review
    create_res = client.post("/api/reviews", json={
        "name": "Delete Author",
        "rating": 3,
        "review": "This note will be safely deleted in automated testing.",
    }, headers={"X-Forwarded-For": "192.168.1.106"})
    assert create_res.status_code == 201
    rev_id = create_res.json()["id"]

    # 1. Delete without auth -> 401
    res_no_auth = client.delete(f"/api/reviews/{rev_id}")
    assert res_no_auth.status_code == 401

    # 2. Delete with invalid auth -> 403
    res_bad_auth = client.delete(f"/api/reviews/{rev_id}", headers={"X-Admin-Key": "invalid-key"})
    assert res_bad_auth.status_code == 403

    # 3. Delete with valid auth -> 200
    res_valid = client.delete(f"/api/reviews/{rev_id}", headers={"X-Admin-Key": ADMIN_API_KEY})
    assert res_valid.status_code == 200
    assert res_valid.json()["id"] == rev_id

    # 4. Confirm deleted review now returns 404
    get_res = client.get(f"/api/reviews/{rev_id}")
    assert get_res.status_code == 404
