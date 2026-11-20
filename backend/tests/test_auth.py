def test_register_success(client):
    res = client.post("/api/auth/register", json={
        "name": "Jordan Lee",
        "email": "jordan.lee@byteforce.edu",
        "password": "Password123!",
        "college": "Caltech",
        "degree": "B.S. Software Engineering",
        "semester": "Semester 5",
        "graduation_year": 2026,
        "career_interest": "Full Stack Developer"
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "jordan.lee@byteforce.edu"
    assert data["user"]["name"] == "Jordan Lee"

def test_register_duplicate_email_fails(client):
    res = client.post("/api/auth/register", json={
        "name": "Jordan Lee Duplicate",
        "email": "jordan.lee@byteforce.edu",
        "password": "Password123!"
    })
    assert res.status_code == 400
    assert "already exists" in res.json()["detail"]

def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "email": "jordan.lee@byteforce.edu",
        "password": "Password123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data

def test_login_invalid_password_fails(client):
    res = client.post("/api/auth/login", json={
        "email": "jordan.lee@byteforce.edu",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401

def test_get_me(client, auth_headers):
    res = client.get("/api/auth/me", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "alex.test@byteforce.edu"

