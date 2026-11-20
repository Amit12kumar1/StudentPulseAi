import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, LearningRoadmap, RoadmapTask, CareerGoal, ActivityLog
from app.schemas.schemas import (
    RoadmapResponse,
    RoadmapTaskResponse,
    RoadmapTaskUpdate
)
from app.services.roadmap import generate_roadmap_for_student

router = APIRouter(prefix="/roadmap", tags=["Learning Roadmap"])

def _format_roadmap(roadmap: LearningRoadmap) -> RoadmapResponse:
    tasks = roadmap.tasks or []
    completed = sum(1 for t in tasks if t.status == "Completed")
    total = len(tasks)
    progress = round((completed / total) * 100, 1) if total > 0 else 0.0

    task_responses = []
    for t in tasks:
        resources = []
        if t.resources_json:
            try:
                resources = json.loads(t.resources_json)
            except Exception:
                resources = []
        task_responses.append(RoadmapTaskResponse(
            id=t.id,
            phase=t.phase,
            title=t.title,
            description=t.description,
            priority=t.priority,
            duration_weeks=t.duration_weeks,
            due_date=t.due_date or "",
            status=t.status,
            resources=resources
        ))

    return RoadmapResponse(
        id=roadmap.id,
        title=roadmap.title,
        target_role=roadmap.target_role,
        total_tasks=total,
        completed_tasks=completed,
        progress_percentage=progress,
        tasks=task_responses,
        created_at=roadmap.created_at
    )

@router.get("", response_model=RoadmapResponse)
def get_current_roadmap(
    role: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == current_user.id)
    if role:
        query = query.filter(LearningRoadmap.target_role == role)
    roadmap = query.order_by(LearningRoadmap.created_at.desc()).first()

    if not roadmap:
        # Determine target role
        target_role = role
        if not target_role:
            goal = db.query(CareerGoal).filter(CareerGoal.user_id == current_user.id).order_by(CareerGoal.created_at.desc()).first()
            target_role = goal.target_role if goal else "Full Stack Developer"
        roadmap = generate_roadmap_for_student(current_user.id, target_role, db)

    return _format_roadmap(roadmap)

@router.post("/generate", response_model=RoadmapResponse)
def generate_roadmap(
    target_role: str = "Full Stack Developer",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = generate_roadmap_for_student(current_user.id, target_role, db)
    return _format_roadmap(roadmap)

@router.put("/tasks/{id}", response_model=RoadmapTaskResponse)
def update_task_status(
    id: int,
    update: RoadmapTaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(RoadmapTask).join(LearningRoadmap).filter(
        RoadmapTask.id == id,
        LearningRoadmap.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap task not found.")

    task.status = update.status
    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Roadmap",
        description=f"Updated roadmap task '{task.title}' to '{update.status}'."
    )
    db.add(log)
    db.commit()
    db.refresh(task)

    resources = []
    if task.resources_json:
        try:
            resources = json.loads(task.resources_json)
        except Exception:
            resources = []

    return RoadmapTaskResponse(
        id=task.id,
        phase=task.phase,
        title=task.title,
        description=task.description,
        priority=task.priority,
        duration_weeks=task.duration_weeks,
        due_date=task.due_date or "",
        status=task.status,
        resources=resources
    )

