from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.models.models import User, StudentProfile, CareerGoal, ActivityLog
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Create user
    user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password)
    )
    db.add(user)
    db.flush()

    # Create associated student profile
    profile = StudentProfile(
        user_id=user.id,
        college=user_in.college or "",
        degree=user_in.degree or "",
        semester=user_in.semester or "",
        graduation_year=user_in.graduation_year or 2026,
        career_interest=user_in.career_interest or "Full Stack Developer"
    )
    db.add(profile)

    # Create default career goal
    career_goal = CareerGoal(
        user_id=user.id,
        target_role=user_in.career_interest or "Full Stack Developer",
        preferred_domain="Software Engineering"
    )
    db.add(career_goal)

    # Activity log
    log = ActivityLog(
        user_id=user.id,
        activity_type="Auth",
        description="Created StudentPulse AI account and initialized profile."
    )
    db.add(log)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(subject=user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

