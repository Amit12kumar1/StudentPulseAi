# StudentPulse AI
### AI-Powered Student Success, Skill & Career Readiness Platform

**Team Name:** Byte Force  
**Core Philosophy:** `EVIDENCE â†’ INSIGHT â†’ ACTION`

---

## ðŸŒŸ Overview

**StudentPulse AI** is a complete, full-stack, AI-powered career readiness and skill enhancement platform built for engineering and college students. 

Unlike platforms that present static placeholder data or fabricate readiness scores, StudentPulse AI calculates student readiness metrics **strictly from real, saved student evidence**:
- **Evidence:** Self-reported skills, academic background, portfolio projects, certifications, and verified MCQ technical assessments.
- **Insight:** Deterministic role-skill benchmark matching and Google Gemini AI to analyze exact capability gaps (Strong, Needs Improvement, Missing).
- **Action:** Structured 4-phase learning roadmaps, AI capstone project blueprints, and interview preparation with objective rubric evaluations.

---

## ðŸš€ Key Modules & Capabilities

1. **Modern SaaS Landing Page:**
   - Highlights the *Evidence â†’ Insight â†’ Action* paradigm, guided 4-step workflow, and platform capabilities.
2. **Secure Authentication & Tenant Isolation:**
   - Bcrypt password hashing, JWT bearer tokens, and private user-isolated records.
3. **Unified Student Capability Profile:**
   - Academics, self-reported skills, projects with GitHub/live URLs, and certifications.
4. **Verified Technical Skill Assessments:**
   - Real MCQ examinations across 8 domains (Programming, DSA, DBMS, Web Dev, Software Engineering, AI/ML, Communication, Problem Solving).
   - Correct answers, score calculations, and automatic syncing to the student's verified skill indicators.
5. **AI Skill Gap Analysis:**
   - Benchmark comparison against configurable industry roles (Java Developer, Python Developer, Full Stack, Frontend, Backend, Data Analyst, Data Scientist, AI/ML Engineer, Software Engineer).
   - Priority gap sorting (High, Medium, Low) and transparent AI explanations.
6. **Personalized 4-Phase Learning Roadmap:**
   - Actionable timeline (Foundations, Core Stack, Capstone Projects, Placement Preparation) with verified resource links and progress tracking.
7. **AI Project Recommendations:**
   - Full capstone project blueprints tailored to the student's target role and missing skills with one-click adoption into their portfolio.
8. **AI Technical Interview Preparation:**
   - Interactive simulator evaluating student answers on conceptual depth, keywords, and structural clarity with objective scoring and model answers.
9. **Career Readiness Dashboard:**
   - Recharts Radar chart, dynamic readiness meter computed from saved records, empty-state guidance, and recent audit logs.

---

## ðŸ› ï¸ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router DOM
- **Backend:** Python 3.14+, FastAPI, SQLAlchemy, Pydantic v2, PyJWT, Bcrypt
- **Database:** SQLite (default for local zero-configuration development), fully compatible with PostgreSQL via `DATABASE_URL`
- **AI & Intelligence:** Google Gemini API with transparent, deterministic rule-based fallback ensuring zero downtime
- **Testing:** Pytest (13 unit and integration tests covering all critical flows)

---

## ðŸ’» Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python3 -m venv ../venv
source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend API server (runs on port 8000)
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check Endpoint: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 5173)
npm run dev
```
- Open browser at: [http://localhost:5173](http://localhost:5173)

---

## ðŸ§ª Running Automated Tests

Run the complete backend test suite:
```bash
cd backend
PYTHONPATH=. pytest -v
```
All 13 test suites verify:
- Student registration, duplicate checks, login, and JWT validation.
- Profile management and skill updates.
- MCQ assessment scoring and verified skill syncing.
- Deterministic skill-gap identification for Java Developer and other roles.
- Learning roadmap generation and status toggling.
- Interview question generation and rubric evaluation.
- Dashboard metric computations and tenant data isolation.

---

## ðŸ›¡ï¸ Responsible AI & Security

- **Zero-Hallucination Policy:** AI does not invent student credentials, certifications, or employment history.
- **Explainable Fallbacks:** The platform maintains 100% functionality even when offline or without a Gemini API key.
- **Fair Guidance:** Assessments and interview scores are provided for formative growth and transparently disclosed as educational benchmarks rather than official employment guarantees.

---

## ðŸ‘¥ Team
**Byte Force**

