import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import (
    User,
    Assessment,
    AssessmentAnswer,
    AssessmentQuestion,
    Skill,
    StudentSkill,
    ActivityLog
)
from app.schemas.schemas import (
    AssessmentQuestionResponse,
    AssessmentSubmit,
    AssessmentResultResponse
)

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(AssessmentQuestion.category).distinct().all()
    return [c[0] for c in categories]

@router.get("/questions", response_model=List[AssessmentQuestionResponse])
def get_assessment_questions(category: str, db: Session = Depends(get_db)):
    questions = db.query(AssessmentQuestion).filter(
        AssessmentQuestion.category.ilike(f"%{category}%")
    ).all()

    if not questions:
        # Fallback to general questions
        questions = db.query(AssessmentQuestion).limit(5).all()

    response = []
    for q in questions:
        options = json.loads(q.options_json) if q.options_json else []
        response.append(AssessmentQuestionResponse(
            id=q.id,
            category=q.category,
            skill_tag=q.skill_tag,
            question_text=q.question_text,
            options=options,
            difficulty=q.difficulty
        ))
    return response

@router.post("/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    submission: AssessmentSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not submission.answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment submission contains no answers."
        )

    correct_count = 0
    total_count = len(submission.answers)
    skill_performance: Dict[str, Dict[str, Any]] = {}

    # Create assessment record
    assessment = Assessment(
        user_id=current_user.id,
        category=submission.category,
        total_questions=total_count,
        score=0,
        percentage=0.0
    )
    db.add(assessment)
    db.flush()

    for ans in submission.answers:
        question = db.query(AssessmentQuestion).filter(AssessmentQuestion.id == ans.question_id).first()
        if not question:
            continue

        is_correct = (ans.selected_answer.strip().lower() == question.correct_answer.strip().lower())
        if is_correct:
            correct_count += 1

        # Track per-skill tag breakdown
        tag = question.skill_tag
        if tag not in skill_performance:
            skill_performance[tag] = {"correct": 0, "total": 0}
        skill_performance[tag]["total"] += 1
        if is_correct:
            skill_performance[tag]["correct"] += 1

        answer_record = AssessmentAnswer(
            assessment_id=assessment.id,
            question_id=question.id,
            selected_answer=ans.selected_answer,
            is_correct=is_correct
        )
        db.add(answer_record)

    percentage = round((correct_count / total_count) * 100, 1) if total_count > 0 else 0.0
    assessment.score = correct_count
    assessment.percentage = percentage

    # Update verified assessment_score in StudentSkill table
    for skill_name, perf in skill_performance.items():
        skill_pct = round((perf["correct"] / perf["total"]) * 100, 1)
        # Find matching skill
        skill = db.query(Skill).filter(Skill.name.ilike(f"%{skill_name}%")).first()
        if skill:
            student_skill = db.query(StudentSkill).filter(
                StudentSkill.user_id == current_user.id,
                StudentSkill.skill_id == skill.id
            ).first()
            if student_skill:
                student_skill.assessment_score = skill_pct
            else:
                # Add verified skill
                student_skill = StudentSkill(
                    user_id=current_user.id,
                    skill_id=skill.id,
                    self_reported_level="Intermediate" if skill_pct >= 60 else "Beginner",
                    assessment_score=skill_pct
                )
                db.add(student_skill)

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="Assessment",
        description=f"Completed '{submission.category}' assessment: {correct_count}/{total_count} ({percentage}%)."
    )
    db.add(log)
    db.commit()
    db.refresh(assessment)

    breakdown = {
        "score": correct_count,
        "total": total_count,
        "percentage": percentage,
        "skill_breakdown": {
            k: {
                "correct": v["correct"],
                "total": v["total"],
                "percentage": round((v["correct"] / v["total"]) * 100, 1)
            }
            for k, v in skill_performance.items()
        }
    }

    return AssessmentResultResponse(
        id=assessment.id,
        category=assessment.category,
        total_questions=assessment.total_questions,
        score=assessment.score,
        percentage=assessment.percentage,
        completed_at=assessment.completed_at,
        breakdown=breakdown
    )

@router.get("/results", response_model=List[AssessmentResultResponse])
def get_assessment_results(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assessments = db.query(Assessment).filter(
        Assessment.user_id == current_user.id
    ).order_by(Assessment.completed_at.desc()).all()

    results = []
    for a in assessments:
        results.append(AssessmentResultResponse(
            id=a.id,
            category=a.category,
            total_questions=a.total_questions,
            score=a.score,
            percentage=a.percentage,
            completed_at=a.completed_at,
            breakdown={"score": a.score, "total": a.total_questions, "percentage": a.percentage}
        ))
    return results

