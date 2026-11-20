from typing import List, Dict, Any

PROJECT_CATALOGUE = [
    {
        "roles": ["Full Stack Developer", "Backend Developer", "Java Developer"],
        "title": "College Placement & Student Management System",
        "description": "An enterprise portal for tracking student placement readiness, company drives, and mock test scores.",
        "problem_statement": "Universities struggle to centrally monitor student interview preparedness, skill proficiencies, and corporate recruitment statuses.",
        "technologies": ["React.js", "FastAPI / Spring Boot", "PostgreSQL", "REST APIs", "Tailwind CSS"],
        "features": [
            "Role-based access for Students, Placement Officers, and Recruiters",
            "Resume parsing and skill verification badge system",
            "Interactive analytics dashboard showing placement percentages by branch",
            "Real-time interview scheduling and feedback logging"
        ],
        "difficulty_level": "Intermediate",
        "skills_developed": ["RESTful Architecture", "Relational Database Design", "State Management", "JWT Authentication"],
        "implementation_steps": [
            "Design PostgreSQL schema with foreign keys for students, drives, and applications",
            "Implement JWT authentication and CRUD REST endpoints",
            "Build responsive React frontend with dashboard analytics charts",
            "Deploy frontend to Vercel and backend to Render/Docker"
        ],
        "expected_outcome": "A production-grade full stack SaaS application demonstrating real-world CRUD and auth capabilities."
    },
    {
        "roles": ["Java Developer", "Backend Developer", "Software Engineer"],
        "title": "High-Throughput Banking & Transaction Ledger Service",
        "description": "A transactional banking microservice that handles fund transfers, account balances, and audit trails with ACID compliance.",
        "problem_statement": "Financial applications require strict concurrency controls, idempotent transactions, and zero-loss audit logging.",
        "technologies": ["Core Java", "Spring Boot", "PostgreSQL", "JDBC", "Docker", "REST APIs"],
        "features": [
            "Transactional money transfers with pessimistic locking against race conditions",
            "Immutable ledger for complete debit/credit audit logging",
            "Idempotency key enforcement to prevent duplicate transfers",
            "Comprehensive integration test suite with Testcontainers"
        ],
        "difficulty_level": "Advanced",
        "skills_developed": ["Concurrency & Multithreading", "Database Transactions (ACID)", "Spring Data JPA", "Defensive API Design"],
        "implementation_steps": [
            "Set up Spring Boot project with Spring Data JPA and PostgreSQL",
            "Implement account balance lock mechanisms using SELECT ... FOR UPDATE",
            "Create REST endpoints for deposit, withdrawal, and transfer with validation",
            "Write JUnit and Mockito test cases simulating concurrent debit requests"
        ],
        "expected_outcome": "A robust backend service showcasing enterprise backend skills and deep relational database mastery."
    },
    {
        "roles": ["Python Developer", "Data Analyst", "AI/ML Engineer"],
        "title": "Algorithmic Job Market & Skill Trend Intelligence Dashboard",
        "description": "An automated data extraction and NLP pipeline analyzing trending tech skills across tech job postings.",
        "problem_statement": "Students and career advisors lack quantitative data on which frameworks and tools are seeing rising demand in entry-level hiring.",
        "technologies": ["Python", "FastAPI", "Pandas", "NumPy", "Scikit-Learn", "React.js"],
        "features": [
            "Automated scraping and cleaning of technology job descriptions",
            "TF-IDF and frequency analysis of required technical competencies",
            "Salary vs. skill correlation regression analysis",
            "Interactive web dashboard with keyword trend charts"
        ],
        "difficulty_level": "Intermediate",
        "skills_developed": ["Data Cleaning & Preprocessing", "Exploratory Data Analysis (EDA)", "FastAPI Endpoint Design", "Data Visualization"],
        "implementation_steps": [
            "Collect and clean text dataset of software engineering job postings",
            "Extract keywords using regular expressions and Scikit-Learn TF-IDF vectorizer",
            "Build FastAPI REST endpoints to serve aggregated trend statistics",
            "Connect React dashboard with Recharts to visualize top skills"
        ],
        "expected_outcome": "An end-to-end data product demonstrating Python analysis and data visualization skills."
    },
    {
        "roles": ["Frontend Developer", "Full Stack Developer"],
        "title": "Interactive Collaborative Code Playground & Editor",
        "description": "A browser-based IDE featuring real-time code editing, live preview, and syntax highlighting.",
        "problem_statement": "Learning developers need an instant sandbox to experiment with HTML, CSS, and JavaScript without local toolchains.",
        "technologies": ["React.js", "TypeScript", "Tailwind CSS", "Monaco Editor", "Web Workers"],
        "features": [
            "Split-pane code editor supporting HTML, CSS, and JS with Monaco editor",
            "Sandboxed iframe execution for live instant preview",
            "LocalStorage autosave and export as zip",
            "Dark and light theme toggle with responsive mobile preview mode"
        ],
        "difficulty_level": "Intermediate",
        "skills_developed": ["DOM Sandboxing", "TypeScript Interface Typing", "React Custom Hooks", "Modern CSS Layouts"],
        "implementation_steps": [
            "Initialize React with TypeScript and configure Monaco Editor component",
            "Set up communication between parent application and sandboxed iframe",
            "Add debounced live compile and console logging capture",
            "Add project download and cloud snippet sharing functionality"
        ],
        "expected_outcome": "A visually impressive frontend web application showing deep client-side architecture expertise."
    }
]

def get_recommended_projects(target_role: str, missing_skills: List[str] = None) -> List[Dict[str, Any]]:
    # Match projects matching the target role
    matched = [p for p in PROJECT_CATALOGUE if target_role in p["roles"]]
    if not matched:
        # Fallback to general full-stack or backend projects
        matched = PROJECT_CATALOGUE[:2]
    return matched

