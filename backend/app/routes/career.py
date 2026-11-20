from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, CareerGoal, RoleSkillRequirement, ActivityLog
from app.schemas.schemas import CareerGoalCreate, CareerGoalResponse

router = APIRouter(prefix="/career", tags=["Career Goals"])

@router.get("/roles")
def get_available_roles(db: Session = Depends(get_db)):
    roles_query = db.query(RoleSkillRequirement.role_name).distinct().all()
    roles = [r[0] for r in roles_query]
    
    role_details = []
    for r in roles:
        reqs = db.query(RoleSkillRequirement).filter(RoleSkillRequirement.role_name == r).all()
        role_details.append({
            "role_name": r,
            "skills": [
                {"name": req.skill_name, "level": req.required_level, "priority": req.priority}
                for req in reqs
            ]
        })
    return role_details

@router.get("/goals", response_model=List[CareerGoalResponse])
def get_career_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(CareerGoal).filter(
        CareerGoal.user_id == current_user.id
    ).order_by(CareerGoal.created_at.desc()).all()

@router.post("/goals", response_model=CareerGoalResponse, status_code=status.HTTP_201_CREATED)
def set_career_goal(
    goal_in: CareerGoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if a goal already exists for this user, if so update it, else create
    goal = db.query(CareerGoal).filter(
        CareerGoal.user_id == current_user.id
    ).order_by(CareerGoal.created_at.desc()).first()

    if goal:
        goal.target_role = goal_in.target_role.strip()
        goal.preferred_domain = goal_in.preferred_domain or ""
    else:
        goal = CareerGoal(
            user_id=current_user.id,
            target_role=goal_in.target_role.strip(),
            preferred_domain=goal_in.preferred_domain or ""
        )
        db.add(goal)

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Career Goal",
        description=f"Set target career goal to '{goal.target_role}'."
    )
    db.add(log)
    db.commit()
    db.refresh(goal)
    return goal

