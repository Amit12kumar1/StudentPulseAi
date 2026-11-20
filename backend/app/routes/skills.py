from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, Skill, StudentSkill, ActivityLog
from app.schemas.schemas import (
    SkillResponse,
    StudentSkillResponse,
    StudentSkillCreate,
    StudentSkillUpdate
)

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillResponse])
def get_all_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.category, Skill.name).all()

@router.get("/my-skills", response_model=List[StudentSkillResponse])
def get_my_skills(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_skills = db.query(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    results = []
    for us in user_skills:
        results.append(StudentSkillResponse(
            id=us.id,
            skill_id=us.skill_id,
            skill_name=us.skill.name if us.skill else "Unknown",
            category=us.skill.category if us.skill else "General",
            self_reported_level=us.self_reported_level,
            assessment_score=us.assessment_score,
            updated_at=us.updated_at
        ))
    return results

@router.post("/my-skills", response_model=StudentSkillResponse, status_code=status.HTTP_201_CREATED)
def add_my_skill(
    skill_in: StudentSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if skill exists in master catalog, else create it
    skill = db.query(Skill).filter(Skill.name.ilike(skill_in.skill_name.strip())).first()
    if not skill:
        skill = Skill(
            name=skill_in.skill_name.strip(),
            category=skill_in.category or "Technical",
            description=f"Skill added by student: {skill_in.skill_name.strip()}"
        )
        db.add(skill)
        db.flush()

    # Check if user already added this skill
    user_skill = db.query(StudentSkill).filter(
        StudentSkill.user_id == current_user.id,
        StudentSkill.skill_id == skill.id
    ).first()

    if user_skill:
        user_skill.self_reported_level = skill_in.self_reported_level
    else:
        user_skill = StudentSkill(
            user_id=current_user.id,
            skill_id=skill.id,
            self_reported_level=skill_in.self_reported_level
        )
        db.add(user_skill)

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Skill",
        description=f"Added skill '{skill.name}' with level '{skill_in.self_reported_level}'."
    )
    db.add(log)
    db.commit()
    db.refresh(user_skill)

    return StudentSkillResponse(
        id=user_skill.id,
        skill_id=skill.id,
        skill_name=skill.name,
        category=skill.category,
        self_reported_level=user_skill.self_reported_level,
        assessment_score=user_skill.assessment_score,
        updated_at=user_skill.updated_at
    )

@router.put("/my-skills/{id}", response_model=StudentSkillResponse)
def update_my_skill(
    id: int,
    skill_update: StudentSkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_skill = db.query(StudentSkill).filter(
        StudentSkill.id == id,
        StudentSkill.user_id == current_user.id
    ).first()

    if not user_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student skill not found.")

    user_skill.self_reported_level = skill_update.self_reported_level
    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Skill",
        description=f"Updated self-reported proficiency of '{user_skill.skill.name}' to '{skill_update.self_reported_level}'."
    )
    db.add(log)
    db.commit()
    db.refresh(user_skill)

    return StudentSkillResponse(
        id=user_skill.id,
        skill_id=user_skill.skill_id,
        skill_name=user_skill.skill.name,
        category=user_skill.skill.category,
        self_reported_level=user_skill.self_reported_level,
        assessment_score=user_skill.assessment_score,
        updated_at=user_skill.updated_at
    )

@router.delete("/my-skills/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_skill(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_skill = db.query(StudentSkill).filter(
        StudentSkill.id == id,
        StudentSkill.user_id == current_user.id
    ).first()

    if not user_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student skill not found.")

    db.delete(user_skill)
    db.commit()
    return None

