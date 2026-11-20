from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, Resource, CareerGoal, StudentSkill
from app.schemas.schemas import ResourceResponse, ProjectRecommendationResponse
from app.services.project_recommendation import get_recommended_projects

router = APIRouter(prefix="/resources", tags=["Learning Resources & Project Recommendations"])

@router.get("", response_model=List[ResourceResponse])
def get_all_resources(skill: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Resource)
    if skill:
        query = query.filter(Resource.skill_name.ilike(f"%{skill}%"))
    return query.all()

@router.get("/projects", response_model=ProjectRecommendationResponse)
def get_project_recommendations(
    role: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_role = role
    if not target_role:
        goal = db.query(CareerGoal).filter(CareerGoal.user_id == current_user.id).order_by(CareerGoal.created_at.desc()).first()
        target_role = goal.target_role if goal else "Full Stack Developer"

    # Identify user's skills
    student_skills = db.query(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    user_skill_names = [s.skill.name for s in student_skills if s.skill]

    projects = get_recommended_projects(target_role)
    return ProjectRecommendationResponse(
        target_role=target_role,
        recommendations=projects,
        is_fallback=False
    )

