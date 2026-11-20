from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- Auth ---
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    college: Optional[str] = ""
    degree: Optional[str] = ""
    semester: Optional[str] = ""
    graduation_year: Optional[int] = 2026
    career_interest: Optional[str] = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class TokenData(BaseModel):
    user_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Profile ---
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    semester: Optional[str] = None
    graduation_year: Optional[int] = None
    career_interest: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    college: str
    degree: str
    semester: str
    graduation_year: int
    career_interest: str
    bio: Optional[str] = ""
    phone: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Skills ---
class SkillResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = ""
    model_config = ConfigDict(from_attributes=True)

class StudentSkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = "Technical"
    self_reported_level: str = "Beginner"  # Beginner, Intermediate, Advanced

class StudentSkillUpdate(BaseModel):
    self_reported_level: str

class StudentSkillResponse(BaseModel):
    id: int
    skill_id: int
    skill_name: str
    category: str
    self_reported_level: str
    assessment_score: Optional[float] = None
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Assessments ---
class AssessmentQuestionResponse(BaseModel):
    id: int
    category: str
    skill_tag: str
    question_text: str
    options: List[str]
    difficulty: str

class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str

class AssessmentSubmit(BaseModel):
    category: str
    answers: List[AnswerSubmit]

class AssessmentResultResponse(BaseModel):
    id: int
    category: str
    total_questions: int
    score: int
    percentage: float
    completed_at: datetime
    breakdown: Dict[str, Any]
    model_config = ConfigDict(from_attributes=True)

# --- Projects ---
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: str
    technologies: str
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""
    status: Optional[str] = "Completed"

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    technologies: str
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Certifications ---
class CertificationCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    issuing_organization: str
    completion_date: Optional[str] = ""
    credential_url: Optional[str] = ""

class CertificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    issuing_organization: str
    completion_date: Optional[str] = ""
    credential_url: Optional[str] = ""
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Career Goals ---
class CareerGoalCreate(BaseModel):
    target_role: str
    preferred_domain: Optional[str] = ""

class CareerGoalResponse(BaseModel):
    id: int
    user_id: int
    target_role: str
    preferred_domain: Optional[str] = ""
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Skill Gap Analysis ---
class SkillGapRequest(BaseModel):
    target_role: str

class SkillGapAnalysisItem(BaseModel):
    skill_name: str
    category: str
    status: str  # 'Strong', 'Needs Improvement', 'Missing'
    student_level: Optional[str] = None
    required_level: str
    priority: str
    assessment_score: Optional[float] = None
    gap_reason: str

class SkillGapResponse(BaseModel):
    target_role: str
    readiness_percentage: float
    total_required_skills: int
    strong_skills: List[SkillGapAnalysisItem]
    improving_skills: List[SkillGapAnalysisItem]
    missing_skills: List[SkillGapAnalysisItem]
    ai_insights: str
    is_fallback: bool
    created_at: datetime

# --- Learning Roadmap ---
class RoadmapTaskResponse(BaseModel):
    id: int
    phase: str
    title: str
    description: str
    priority: str
    duration_weeks: int
    due_date: Optional[str] = ""
    status: str
    resources: List[Dict[str, Any]] = []
    model_config = ConfigDict(from_attributes=True)

class RoadmapTaskUpdate(BaseModel):
    status: str  # Pending, In Progress, Completed

class RoadmapResponse(BaseModel):
    id: int
    title: str
    target_role: str
    total_tasks: int
    completed_tasks: int
    progress_percentage: float
    tasks: List[RoadmapTaskResponse]
    created_at: datetime

# --- Project Recommendations ---
class ProjectRecommendationItem(BaseModel):
    title: str
    description: str
    problem_statement: str
    technologies: List[str]
    features: List[str]
    difficulty_level: str
    skills_developed: List[str]
    implementation_steps: List[str]
    expected_outcome: str

class ProjectRecommendationResponse(BaseModel):
    target_role: str
    recommendations: List[ProjectRecommendationItem]
    is_fallback: bool

# --- Interview Prep ---
class InterviewGenerateRequest(BaseModel):
    target_role: str
    category: str = "Technical Interview"
    difficulty: str = "Intermediate"

class InterviewQuestionItem(BaseModel):
    id: int
    category: str
    difficulty: str
    question: str
    hint: str
    model_answer: str

class InterviewEvaluateRequest(BaseModel):
    session_id: Optional[int] = None
    target_role: str
    category: str
    difficulty: str = "Intermediate"
    question: str
    student_answer: str

class InterviewEvaluationResponse(BaseModel):
    score: float
    feedback: str
    strengths: str
    missing_concepts: str
    improved_answer: str
    is_fallback: bool

# --- Resources ---
class ResourceResponse(BaseModel):
    id: int
    title: str
    skill_category: str
    skill_name: str
    resource_type: str
    url: str
    difficulty: str
    description: str
    model_config = ConfigDict(from_attributes=True)

# --- Dashboard & Activity ---
class ActivityLogResponse(BaseModel):
    id: int
    activity_type: str
    description: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DashboardSummaryResponse(BaseModel):
    student_name: str
    target_role: str
    profile_completion_percentage: float
    career_readiness_score: float
    total_skills: int
    verified_skills: int
    assessments_completed: int
    average_assessment_score: float
    projects_count: int
    roadmap_progress_percentage: float
    radar_data: List[Dict[str, Any]]
    recent_activities: List[ActivityLogResponse]
    recommended_next_action: Dict[str, str]

class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    ai_status: str

