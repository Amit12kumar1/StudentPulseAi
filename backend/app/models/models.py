from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skills = relationship("StudentSkill", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="user", cascade="all, delete-orphan")
    career_goals = relationship("CareerGoal", back_populates="user", cascade="all, delete-orphan")
    skill_gap_analyses = relationship("SkillGapAnalysis", back_populates="user", cascade="all, delete-orphan")
    learning_roadmaps = relationship("LearningRoadmap", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    college = Column(String(200), default="", nullable=False)
    degree = Column(String(100), default="", nullable=False)
    semester = Column(String(50), default="", nullable=False)
    graduation_year = Column(Integer, default=2026, nullable=False)
    career_interest = Column(String(150), default="", nullable=False)
    bio = Column(Text, default="", nullable=True)
    phone = Column(String(50), default="", nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)  # e.g., 'Programming', 'Web Development', 'Database', 'Framework', 'Professional'
    description = Column(Text, default="", nullable=True)


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    self_reported_level = Column(String(50), default="Beginner", nullable=False)  # Beginner, Intermediate, Advanced
    assessment_score = Column(Float, nullable=True)  # Separate verified indicator (0 - 100)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), index=True, nullable=False)
    skill_tag = Column(String(100), index=True, nullable=False)
    question_text = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)  # JSON array of 4 choices
    correct_answer = Column(String(255), nullable=False)
    explanation = Column(Text, default="", nullable=True)
    difficulty = Column(String(50), default="Intermediate", nullable=False)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    category = Column(String(100), nullable=False)
    total_questions = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    completed_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="assessments")
    answers = relationship("AssessmentAnswer", back_populates="assessment", cascade="all, delete-orphan")


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), index=True, nullable=False)
    question_id = Column(Integer, ForeignKey("assessment_questions.id"), nullable=False)
    selected_answer = Column(String(255), nullable=False)
    is_correct = Column(Boolean, nullable=False)

    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("AssessmentQuestion")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(String(300), nullable=False)  # Comma-separated or tags
    github_url = Column(String(255), default="", nullable=True)
    live_url = Column(String(255), default="", nullable=True)
    status = Column(String(50), default="Completed", nullable=False)  # Planned, In Progress, Completed
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="projects")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    issuing_organization = Column(String(200), nullable=False)
    completion_date = Column(String(50), default="", nullable=True)
    credential_url = Column(String(255), default="", nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="certifications")


class CareerGoal(Base):
    __tablename__ = "career_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    target_role = Column(String(100), nullable=False)
    preferred_domain = Column(String(100), default="", nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="career_goals")


class RoleSkillRequirement(Base):
    __tablename__ = "role_skill_requirements"

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(100), index=True, nullable=False)
    skill_name = Column(String(100), nullable=False)
    required_level = Column(String(50), default="Intermediate", nullable=False)  # Beginner, Intermediate, Advanced
    priority = Column(String(50), default="High", nullable=False)  # High, Medium, Low
    category = Column(String(100), default="Technical", nullable=False)


class SkillGapAnalysis(Base):
    __tablename__ = "skill_gap_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    career_goal_id = Column(Integer, ForeignKey("career_goals.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(100), nullable=False)
    analysis_json = Column(Text, nullable=False)  # Structured JSON containing gaps, strengths, scores
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="skill_gap_analyses")


class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    target_role = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="learning_roadmaps")
    tasks = relationship("RoadmapTask", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("learning_roadmaps.id", ondelete="CASCADE"), index=True, nullable=False)
    phase = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), default="High", nullable=False)
    duration_weeks = Column(Integer, default=1, nullable=False)
    resources_json = Column(Text, default="[]", nullable=False)
    due_date = Column(String(50), default="", nullable=True)
    status = Column(String(50), default="Pending", nullable=False)  # Pending, In Progress, Completed

    roadmap = relationship("LearningRoadmap", back_populates="tasks")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    category = Column(String(100), nullable=False)
    target_role = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="Intermediate", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="interview_sessions")
    responses = relationship("InterviewResponse", back_populates="session", cascade="all, delete-orphan")


class InterviewResponse(Base):
    __tablename__ = "interview_responses"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), index=True, nullable=False)
    question = Column(Text, nullable=False)
    student_answer = Column(Text, nullable=False)
    feedback = Column(Text, nullable=False)
    score = Column(Float, default=0.0, nullable=False)
    strengths = Column(Text, default="", nullable=True)
    missing_concepts = Column(Text, default="", nullable=True)
    improved_answer = Column(Text, default="", nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    session = relationship("InterviewSession", back_populates="responses")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    activity_type = Column(String(100), nullable=False)  # Profile, Skill, Assessment, Roadmap, Project, Interview
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="activity_logs")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    skill_category = Column(String(100), index=True, nullable=False)
    skill_name = Column(String(100), index=True, nullable=False)
    resource_type = Column(String(100), nullable=False)  # Documentation, Tutorial, Course, Practice, Video
    url = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="Beginner", nullable=False)
    description = Column(Text, nullable=False)

