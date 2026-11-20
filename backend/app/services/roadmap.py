import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import (
    LearningRoadmap,
    RoadmapTask,
    Resource,
    ActivityLog
)

ROADMAP_TEMPLATES = {
    "Java Developer": [
        {
            "phase": "Phase 1: Core Java & OOP",
            "title": "Master Java Fundamentals & OOP",
            "description": "Deep dive into JVM memory model, OOP principles, Exception Handling, and the Collections Framework.",
            "priority": "High",
            "duration_weeks": 2,
            "skill_tag": "Core Java"
        },
        {
            "phase": "Phase 2: Database & Backend",
            "title": "SQL Relational Queries & JDBC",
            "description": "Connect Java applications with PostgreSQL/MySQL using JDBC, connection pools, and transactional queries.",
            "priority": "High",
            "duration_weeks": 2,
            "skill_tag": "SQL"
        },
        {
            "phase": "Phase 3: Frameworks & APIs",
            "title": "Build Microservices with Spring Boot",
            "description": "Develop production-ready RESTful APIs, Spring Data JPA, JWT security, and unit testing with JUnit.",
            "priority": "High",
            "duration_weeks": 3,
            "skill_tag": "Spring Boot"
        },
        {
            "phase": "Phase 4: Placement & Interview Prep",
            "title": "DSA & Mock Java Technical Interviews",
            "description": "Practice top Java DSA problems, concurrency questions, and system design case studies.",
            "priority": "Medium",
            "duration_weeks": 2,
            "skill_tag": "Data Structures & Algorithms"
        }
    ],
    "Python Developer": [
        {
            "phase": "Phase 1: Python Core & Data Structures",
            "title": "Advanced Python & Algorithmic Foundations",
            "description": "Generators, decorators, context managers, async IO, and standard data structures.",
            "priority": "High",
            "duration_weeks": 2,
            "skill_tag": "Python"
        },
        {
            "phase": "Phase 2: Modern Web Backend",
            "title": "High-Performance APIs with FastAPI",
            "description": "Build asynchronous REST endpoints, Pydantic data schemas, SQLAlchemy ORM, and dependency injection.",
            "priority": "High",
            "duration_weeks": 3,
            "skill_tag": "FastAPI"
        },
        {
            "phase": "Phase 3: Database & Containerization",
            "title": "PostgreSQL Schema Design & Docker Deployments",
            "description": "Design relational models, optimize indexing, write migrations, and containerize with Docker.",
            "priority": "Medium",
            "duration_weeks": 2,
            "skill_tag": "SQL"
        },
        {
            "phase": "Phase 4: Applied Capstone & System Design",
            "title": "Production API Architecture & Interview Drills",
            "description": "Build an end-to-end full stack service with automated tests, CI/CD, and live documentation.",
            "priority": "High",
            "duration_weeks": 2,
            "skill_tag": "System Design"
        }
    ],
    "Full Stack Developer": [
        {
            "phase": "Phase 1: Modern Frontend Core",
            "title": "Modern React & Responsive UI",
            "description": "Component architecture, React Hooks, State Management, and Tailwind CSS design patterns.",
            "priority": "High",
            "duration_weeks": 3,
            "skill_tag": "React.js"
        },
        {
            "phase": "Phase 2: Server-Side Engineering",
            "title": "REST APIs with Node.js & Express",
            "description": "Server middleware, authentication tokens, rate limiting, and database models.",
            "priority": "High",
            "duration_weeks": 3,
            "skill_tag": "REST APIs"
        },
        {
            "phase": "Phase 3: Data Persistence & Integration",
            "title": "Relational & Document Database Mastery",
            "description": "Query optimization, indexes, and full-stack integration with PostgreSQL or MongoDB.",
            "priority": "Medium",
            "duration_weeks": 2,
            "skill_tag": "SQL"
        },
        {
            "phase": "Phase 4: Portfolio Capstone & Prep",
            "title": "Deploy Full-Stack Application & Interview Practice",
            "description": "Build a live SaaS project with auth, dashboard, and public repo; practice frontend/backend interview drills.",
            "priority": "High",
            "duration_weeks": 2,
            "skill_tag": "Problem Solving"
        }
    ]
}

def generate_roadmap_for_student(user_id: int, target_role: str, db: Session) -> LearningRoadmap:
    # Check if a roadmap already exists for this role
    existing = db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == user_id,
        LearningRoadmap.target_role == target_role
    ).first()

    if existing:
        return existing

    # Choose template or default to Software Engineer / Full Stack
    template = ROADMAP_TEMPLATES.get(target_role, ROADMAP_TEMPLATES.get("Full Stack Developer"))

    roadmap = LearningRoadmap(
        user_id=user_id,
        title=f"{target_role} Career Roadmap",
        target_role=target_role
    )
    db.add(roadmap)
    db.flush()

    for item in template:
        # Match resources
        res_list = db.query(Resource).filter(
            Resource.skill_name.ilike(f"%{item['skill_tag']}%")
        ).limit(2).all()

        resources_data = [
            {"title": r.title, "url": r.url, "type": r.resource_type} for r in res_list
        ]

        task = RoadmapTask(
            roadmap_id=roadmap.id,
            phase=item["phase"],
            title=item["title"],
            description=item["description"],
            priority=item["priority"],
            duration_weeks=item["duration_weeks"],
            resources_json=json.dumps(resources_data),
            status="Pending"
        )
        db.add(task)

    log = ActivityLog(
        user_id=user_id,
        activity_type="Roadmap",
        description=f"Generated personalized 4-phase learning roadmap for '{target_role}'."
    )
    db.add(log)
    db.commit()
    db.refresh(roadmap)
    return roadmap

