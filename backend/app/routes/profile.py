from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, StudentProfile, ActivityLog
from app.schemas.schemas import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Student Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(
            user_id=current_user.id,
            college="",
            degree="",
            semester="",
            graduation_year=2026,
            career_interest="Full Stack Developer"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return ProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        college=profile.college,
        degree=profile.degree,
        semester=profile.semester,
        graduation_year=profile.graduation_year,
        career_interest=profile.career_interest,
        bio=profile.bio or "",
        phone=profile.phone or "",
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    if profile_in.name is not None and profile_in.name.strip():
        current_user.name = profile_in.name.strip()

    if profile_in.college is not None:
        profile.college = profile_in.college.strip()
    if profile_in.degree is not None:
        profile.degree = profile_in.degree.strip()
    if profile_in.semester is not None:
        profile.semester = profile_in.semester.strip()
    if profile_in.graduation_year is not None:
        profile.graduation_year = profile_in.graduation_year
    if profile_in.career_interest is not None:
        profile.career_interest = profile_in.career_interest.strip()
    if profile_in.bio is not None:
        profile.bio = profile_in.bio.strip()
    if profile_in.phone is not None:
        profile.phone = profile_in.phone.strip()

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Profile",
        description="Updated student profile information."
    )
    db.add(log)
    db.commit()
    db.refresh(profile)

    return ProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        college=profile.college,
        degree=profile.degree,
        semester=profile.semester,
        graduation_year=profile.graduation_year,
        career_interest=profile.career_interest,
        bio=profile.bio or "",
        phone=profile.phone or "",
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

