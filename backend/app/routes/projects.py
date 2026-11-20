from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, Project, ActivityLog
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def get_my_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Project).filter(
        Project.user_id == current_user.id
    ).order_by(Project.created_at.desc()).all()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    proj_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = Project(
        user_id=current_user.id,
        title=proj_in.title.strip(),
        description=proj_in.description.strip(),
        technologies=proj_in.technologies.strip(),
        github_url=proj_in.github_url or "",
        live_url=proj_in.live_url or "",
        status=proj_in.status or "Completed"
    )
    db.add(project)

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Project",
        description=f"Added project '{project.title}' with tech stack: {project.technologies}."
    )
    db.add(log)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{id}", response_model=ProjectResponse)
def update_project(
    id: int,
    proj_in: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    if proj_in.title is not None:
        project.title = proj_in.title.strip()
    if proj_in.description is not None:
        project.description = proj_in.description.strip()
    if proj_in.technologies is not None:
        project.technologies = proj_in.technologies.strip()
    if proj_in.github_url is not None:
        project.github_url = proj_in.github_url.strip()
    if proj_in.live_url is not None:
        project.live_url = proj_in.live_url.strip()
    if proj_in.status is not None:
        project.status = proj_in.status

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    db.delete(project)
    db.commit()
    return None

