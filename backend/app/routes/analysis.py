import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, SkillGapAnalysis
from app.schemas.schemas import SkillGapRequest, SkillGapResponse
from app.services.skill_gap import analyze_skill_gap

router = APIRouter(prefix="/analysis", tags=["Skill Gap Analysis"])

@router.post("/skill-gap", response_model=SkillGapResponse)
async def generate_skill_gap_analysis(
    request: SkillGapRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis_data = await analyze_skill_gap(
        user_id=current_user.id,
        target_role=request.target_role,
        db=db
    )
    analysis_data["created_at"] = json.loads(json.dumps(analysis_data)).get("created_at") or None
    from datetime import datetime, timezone
    return SkillGapResponse(
        target_role=analysis_data["target_role"],
        readiness_percentage=analysis_data["readiness_percentage"],
        total_required_skills=analysis_data["total_required_skills"],
        strong_skills=analysis_data["strong_skills"],
        improving_skills=analysis_data["improving_skills"],
        missing_skills=analysis_data["missing_skills"],
        ai_insights=analysis_data["ai_insights"],
        is_fallback=analysis_data["is_fallback"],
        created_at=datetime.now(timezone.utc)
    )

@router.get("/skill-gap/history")
def get_analysis_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(SkillGapAnalysis).filter(
        SkillGapAnalysis.user_id == current_user.id
    ).order_by(SkillGapAnalysis.created_at.desc()).limit(10).all()

    results = []
    for r in records:
        try:
            data = json.loads(r.analysis_json)
            data["id"] = r.id
            data["created_at"] = r.created_at
            results.append(data)
        except Exception:
            continue
    return results

