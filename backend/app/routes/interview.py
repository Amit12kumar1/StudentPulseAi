from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, InterviewSession, InterviewResponse
from app.schemas.schemas import (
    InterviewGenerateRequest,
    InterviewQuestionItem,
    InterviewEvaluateRequest,
    InterviewEvaluationResponse
)
from app.services.interview_service import (
    get_interview_questions,
    evaluate_answer
)

router = APIRouter(prefix="/interview", tags=["Interview Preparation"])

@router.post("/generate", response_model=List[InterviewQuestionItem])
def generate_questions(request: InterviewGenerateRequest):
    questions = get_interview_questions(
        target_role=request.target_role,
        category=request.category,
        difficulty=request.difficulty
    )
    return questions

@router.post("/evaluate", response_model=InterviewEvaluationResponse)
async def evaluate_interview_response(
    request: InterviewEvaluateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evaluation = await evaluate_answer(
        user_id=current_user.id,
        target_role=request.target_role,
        category=request.category,
        difficulty=request.difficulty,
        question=request.question,
        student_answer=request.student_answer,
        db=db,
        session_id=request.session_id
    )
    return InterviewEvaluationResponse(
        score=evaluation["score"],
        feedback=evaluation["feedback"],
        strengths=evaluation["strengths"],
        missing_concepts=evaluation["missing_concepts"],
        improved_answer=evaluation["improved_answer"],
        is_fallback=evaluation.get("is_fallback", False)
    )

@router.get("/history")
def get_interview_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc()).limit(10).all()

    history = []
    for s in sessions:
        responses = [
            {
                "id": r.id,
                "question": r.question,
                "student_answer": r.student_answer,
                "score": r.score,
                "feedback": r.feedback,
                "strengths": r.strengths,
                "missing_concepts": r.missing_concepts,
                "improved_answer": r.improved_answer,
                "created_at": r.created_at
            }
            for r in s.responses
        ]
        history.append({
            "session_id": s.id,
            "target_role": s.target_role,
            "category": s.category,
            "difficulty": s.difficulty,
            "created_at": s.created_at,
            "responses": responses
        })
    return history

