from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.database.seed_data import seed_database
from app.services.ai_service import ai_service
from app.schemas.schemas import HealthResponse

# Routers
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.skills import router as skills_router
from app.routes.assessments import router as assessments_router
from app.routes.projects import router as projects_router
from app.routes.career import router as career_router
from app.routes.analysis import router as analysis_router
from app.routes.roadmap import router as roadmap_router
from app.routes.interview import router as interview_router
from app.routes.dashboard import router as dashboard_router
from app.routes.resources import router as resources_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Seed default data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Student Success, Skill & Career Readiness Platform by Byte Force",
    lifespan=lifespan
)

# CORS Middleware
origins = settings.CORS_ORIGINS
if isinstance(origins, list):
    allowed_origins = origins
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(skills_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(career_router, prefix=settings.API_V1_STR)
app.include_router(analysis_router, prefix=settings.API_V1_STR)
app.include_router(roadmap_router, prefix=settings.API_V1_STR)
app.include_router(interview_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(resources_router, prefix=settings.API_V1_STR)

@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check():
    ai_status = "Gemini API Connected" if ai_service.is_available else "Rule-based Fallback Active (Zero Failure Guaranteed)"
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        database="connected",
        ai_status=ai_status
    )

@app.get("/")
def root():
    return {
        "message": "Welcome to StudentPulse AI API",
        "documentation": "/docs",
        "philosophy": "Evidence -> Insight -> Action",
        "team": "Byte Force"
    }

