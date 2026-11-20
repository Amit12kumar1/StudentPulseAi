from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import (
    StudentSkill,
    RoleSkillRequirement,
    SkillGapAnalysis,
    CareerGoal,
    ActivityLog
)
from app.services.ai_service import ai_service
import json

LEVEL_WEIGHTS = {
    "beginner": 1,
    "intermediate": 2,
    "advanced": 3
}

async def analyze_skill_gap(user_id: int, target_role: str, db: Session) -> Dict[str, Any]:
    # 1. Fetch requirements for the target role
    requirements = db.query(RoleSkillRequirement).filter(
        RoleSkillRequirement.role_name == target_role
    ).all()

    # Fallback to standard role requirements if role not directly found
    if not requirements:
        requirements = db.query(RoleSkillRequirement).filter(
            RoleSkillRequirement.role_name == "Software Engineer"
        ).all()
        target_role = "Software Engineer"

    # 2. Fetch student's current recorded skills
    student_skills = db.query(StudentSkill).filter(
        StudentSkill.user_id == user_id
    ).all()

    student_skill_map = {}
    for ss in student_skills:
        skill_name = ss.skill.name if ss.skill else ""
        if skill_name:
            student_skill_map[skill_name.lower()] = ss

    strong_skills = []
    improving_skills = []
    missing_skills = []

    total_req_points = 0.0
    student_points = 0.0

    for req in requirements:
        req_name = req.skill_name
        req_level_num = LEVEL_WEIGHTS.get(req.required_level.lower(), 2)
        priority_weight = 1.5 if req.priority.lower() == "high" else (1.0 if req.priority.lower() == "medium" else 0.8)

        total_req_points += req_level_num * priority_weight

        student_record = student_skill_map.get(req_name.lower())

        if student_record:
            st_level = student_record.self_reported_level
            st_level_num = LEVEL_WEIGHTS.get(st_level.lower(), 1)
            verified_score = student_record.assessment_score

            # Check if verified assessment exists
            is_verified_strong = verified_score is not None and verified_score >= 70.0
            is_level_sufficient = st_level_num >= req_level_num

            if is_verified_strong or (verified_score is None and is_level_sufficient):
                item = {
                    "skill_name": req_name,
                    "category": req.category,
                    "status": "Strong",
                    "student_level": st_level,
                    "required_level": req.required_level,
                    "priority": req.priority,
                    "assessment_score": verified_score,
                    "gap_reason": "Proficiency meets or exceeds target role threshold."
                }
                strong_skills.append(item)
                student_points += req_level_num * priority_weight
            else:
                reason = "Assessment score below verified threshold." if verified_score is not None else f"Current level ({st_level}) is below target requirement ({req.required_level})."
                item = {
                    "skill_name": req_name,
                    "category": req.category,
                    "status": "Needs Improvement",
                    "student_level": st_level,
                    "required_level": req.required_level,
                    "priority": req.priority,
                    "assessment_score": verified_score,
                    "gap_reason": reason
                }
                improving_skills.append(item)
                student_points += min(st_level_num, req_level_num * 0.7) * priority_weight
        else:
            item = {
                "skill_name": req_name,
                "category": req.category,
                "status": "Missing",
                "student_level": None,
                "required_level": req.required_level,
                "priority": req.priority,
                "assessment_score": None,
                "gap_reason": "No self-reported or assessment evidence recorded."
            }
            missing_skills.append(item)

    readiness = 0.0
    if total_req_points > 0:
        readiness = round(min(100.0, (student_points / total_req_points) * 100), 1)

    # 3. AI or deterministic explanation
    strong_names = [s["skill_name"] for s in strong_skills]
    improving_names = [s["skill_name"] for s in improving_skills]
    missing_names = [s["skill_name"] for s in missing_skills]

    ai_result = await ai_service.explain_skill_gap(target_role, strong_names, improving_names, missing_names)
    insights = ai_result.get("insights", "")
    is_fallback = ai_result.get("is_fallback", False) or not ai_service.is_available

    analysis_payload = {
        "target_role": target_role,
        "readiness_percentage": readiness,
        "total_required_skills": len(requirements),
        "strong_skills": strong_skills,
        "improving_skills": improving_skills,
        "missing_skills": missing_skills,
        "ai_insights": insights,
        "is_fallback": is_fallback
    }

    # Save to SkillGapAnalysis history
    new_analysis = SkillGapAnalysis(
        user_id=user_id,
        target_role=target_role,
        analysis_json=json.dumps(analysis_payload)
    )
    db.add(new_analysis)

    # Log activity
    log = ActivityLog(
        user_id=user_id,
        activity_type="Skill Gap",
        description=f"Generated skill gap analysis for target role '{target_role}' with {readiness}% readiness."
    )
    db.add(log)
    db.commit()

    return analysis_payload

