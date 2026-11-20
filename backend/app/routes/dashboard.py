from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import (
    User,
    StudentProfile,
    StudentSkill,
    Assessment,
    Project,
    CareerGoal,
    LearningRoadmap,
    RoadmapTask,
    ActivityLog
)
from app.schemas.schemas import DashboardSummaryResponse, ActivityLogResponse

router = APIRouter(prefix="/dashboard", tags=["Career Readiness Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    skills = db.query(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    assessments = db.query(Assessment).filter(Assessment.user_id == current_user.id).all()
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    goal = db.query(CareerGoal).filter(CareerGoal.user_id == current_user.id).order_by(CareerGoal.created_at.desc()).first()
    roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == current_user.id).order_by(LearningRoadmap.created_at.desc()).first()
    recent_logs = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).order_by(ActivityLog.created_at.desc()).limit(8).all()

    # 1. Profile Completion calculation (strictly from real data)
    completion_points = 0
    max_profile_points = 6
    if profile:
        if profile.college and len(profile.college.strip()) > 1:
            completion_points += 1
        if profile.degree and len(profile.degree.strip()) > 1:
            completion_points += 1
        if profile.semester and len(profile.semester.strip()) > 0:
            completion_points += 1
        if profile.career_interest and len(profile.career_interest.strip()) > 1:
            completion_points += 1
        if profile.bio and len(profile.bio.strip()) > 5:
            completion_points += 1
        if profile.phone and len(profile.phone.strip()) > 5:
            completion_points += 1
    profile_completion = round((completion_points / max_profile_points) * 100, 1)

    # 2. Skill metrics
    total_skills = len(skills)
    verified_skills = sum(1 for s in skills if s.assessment_score is not None and s.assessment_score >= 60.0)

    # 3. Assessment metrics
    total_assessments = len(assessments)
    avg_assessment_score = 0.0
    if total_assessments > 0:
        avg_assessment_score = round(sum(a.percentage for a in assessments) / total_assessments, 1)

    # 4. Roadmap progress
    roadmap_progress = 0.0
    if roadmap and roadmap.tasks:
        completed_tasks = sum(1 for t in roadmap.tasks if t.status == "Completed")
        roadmap_progress = round((completed_tasks / len(roadmap.tasks)) * 100, 1)

    # 5. Career readiness score (Composite verifiable formula based on real evidence):
    # - Skills evidence (up to 30%)
    # - Assessment performance (up to 30%)
    # - Roadmap execution (up to 20%)
    # - Projects built (up to 20%)
    skill_evidence_score = min(30.0, (total_skills * 5.0) + (verified_skills * 5.0))
    assessment_evidence_score = min(30.0, (avg_assessment_score / 100.0) * 30.0)
    roadmap_evidence_score = (roadmap_progress / 100.0) * 20.0
    project_evidence_score = min(20.0, len(projects) * 10.0)

    career_readiness = round(skill_evidence_score + assessment_evidence_score + roadmap_evidence_score + project_evidence_score, 1)

    # 6. Radar Chart Data (Category breakdown based on actual student skills)
    category_map = {
        "Programming": 0,
        "Web Development": 0,
        "Database": 0,
        "Computer Science": 0,
        "Professional": 0,
        "Tools": 0
    }
    for s in skills:
        cat = s.skill.category if s.skill else "Programming"
        # Score calculation: Beginner = 40, Intermediate = 70, Advanced = 95; verified score overrides
        val = 70 if s.self_reported_level == "Intermediate" else (95 if s.self_reported_level == "Advanced" else 40)
        if s.assessment_score is not None:
            val = max(val, int(s.assessment_score))
        if cat in category_map:
            category_map[cat] = max(category_map[cat], val)
        else:
            category_map["Programming"] = max(category_map["Programming"], val)

    radar_data = [
        {"subject": cat, "score": val, "fullMark": 100}
        for cat, val in category_map.items()
    ]

    # 7. Recommended Next Action
    target_role = goal.target_role if goal else (profile.career_interest if profile and profile.career_interest else "Full Stack Developer")
    if total_skills == 0:
        recommended_action = {
            "title": "Add Your Core Skills",
            "description": "Log your programming and technical proficiencies in the Skills tab to enable gap analysis.",
            "action_url": "/skills",
            "action_text": "Add Skills"
        }
    elif total_assessments == 0:
        recommended_action = {
            "title": "Verify Skills via Assessment",
            "description": "Take your first technical MCQ assessment to turn self-reported skills into verified credentials.",
            "action_url": "/assessments",
            "action_text": "Start Assessment"
        }
    elif len(projects) == 0:
        recommended_action = {
            "title": "Build a Target Role Project",
            "description": f"Add or start building an industry project to showcase your practical {target_role} ability.",
            "action_url": "/projects",
            "action_text": "Explore Projects"
        }
    elif roadmap_progress < 50.0:
        recommended_action = {
            "title": "Continue Your Learning Roadmap",
            "description": f"Complete pending milestone tasks in your personalized {target_role} roadmap.",
            "action_url": "/roadmap",
            "action_text": "Go to Roadmap"
        }
    else:
        recommended_action = {
            "title": "Prepare for Technical Interviews",
            "description": "Practice mock technical interview questions with transparent rubric scoring and AI hints.",
            "action_url": "/interview",
            "action_text": "Practice Interview"
        }

    return DashboardSummaryResponse(
        student_name=current_user.name,
        target_role=target_role,
        profile_completion_percentage=profile_completion,
        career_readiness_score=career_readiness,
        total_skills=total_skills,
        verified_skills=verified_skills,
        assessments_completed=total_assessments,
        average_assessment_score=avg_assessment_score,
        projects_count=len(projects),
        roadmap_progress_percentage=roadmap_progress,
        radar_data=radar_data,
        recent_activities=[
            ActivityLogResponse(
                id=log.id,
                activity_type=log.activity_type,
                description=log.description,
                created_at=log.created_at
            )
            for log in recent_logs
        ],
        recommended_next_action=recommended_action
    )

