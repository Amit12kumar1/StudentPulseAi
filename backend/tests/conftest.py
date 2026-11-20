import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
from app.database.seed_data import seed_database
from app.core.security import create_access_token
from app.models.models import User, StudentProfile

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(client):
    # Register test user
    payload = {
        "name": "Alex Developer",
        "email": "alex.test@byteforce.edu",
        "password": "Password123!",
        "college": "MIT Engineering",
        "degree": "B.Tech Computer Science",
        "semester": "Semester 6",
        "graduation_year": 2026,
        "career_interest": "Java Developer"
    }
    client.post("/api/auth/register", json=payload)
    login_res = client.post("/api/auth/login", json={
        "email": "alex.test@byteforce.edu",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def second_user_headers(client):
    payload = {
        "name": "Sarah Student",
        "email": "sarah.test@byteforce.edu",
        "password": "SecurePassword456!",
        "college": "Stanford Tech",
        "degree": "B.S. Information Systems",
        "semester": "Semester 4",
        "graduation_year": 2027,
        "career_interest": "Python Developer"
    }
    client.post("/api/auth/register", json=payload)
    login_res = client.post("/api/auth/login", json={
        "email": "sarah.test@byteforce.edu",
        "password": "SecurePassword456!"
    })
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

