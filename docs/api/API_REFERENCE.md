# StudentPulse AI â€” REST API Reference
**Base URL:** `http://localhost:8000/api`  
**Interactive Swagger UI:** `http://localhost:8000/docs`  
**ReDoc Documentation:** `http://localhost:8000/redoc`

---

## 1. Authentication
All protected routes require the HTTP header:
`Authorization: Bearer <access_token>`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new student profile | No |
| `POST` | `/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/auth/me` | Fetch currently authenticated user | Yes |

---

## 2. Student Profile
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/profile` | Get student profile details | Yes |
| `PUT` | `/profile` | Update profile (academics, bio, phone) | Yes |

---

## 3. Skills & Competencies
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/skills` | Get master skill directory | No |
| `GET` | `/skills/my-skills` | Get authenticated student's logged skills | Yes |
| `POST` | `/skills/my-skills` | Add or update a student skill | Yes |
| `PUT` | `/skills/my-skills/{id}` | Update self-reported skill proficiency | Yes |
| `DELETE` | `/skills/my-skills/{id}` | Remove a skill from student profile | Yes |

---

## 4. Technical Skill Assessments
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/assessments/categories` | List assessment categories | No |
| `GET` | `/assessments/questions?category={category}` | Fetch category MCQs | No |
| `POST` | `/assessments/submit` | Submit answers & calculate verified score | Yes |
| `GET` | `/assessments/results` | View past assessment history | Yes |

---

## 5. Skill Gap Analysis
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/analysis/skill-gap` | Execute deterministic & AI gap analysis for target role | Yes |
| `GET` | `/analysis/skill-gap/history`| View student's past gap analyses | Yes |

---

## 6. Learning Roadmap
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/roadmap?role={role}` | Get active 4-phase learning roadmap | Yes |
| `POST` | `/roadmap/generate?target_role={role}` | Generate personalized roadmap | Yes |
| `PUT` | `/roadmap/tasks/{id}` | Update milestone task status | Yes |

---

## 7. Project Recommendations & Portfolio
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/resources/projects?role={role}` | Get AI capstone project blueprints | Yes |
| `GET` | `/projects` | List student's saved projects | Yes |
| `POST` | `/projects` | Add project to profile | Yes |
| `PUT` | `/projects/{id}` | Update project details / URLs | Yes |
| `DELETE` | `/projects/{id}` | Delete project | Yes |

---

## 8. Interview Preparation
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/interview/generate` | Generate role & category interview questions | No |
| `POST` | `/interview/evaluate` | Evaluate student answer against rubric | Yes |
| `GET` | `/interview/history` | View past interview practice sessions | Yes |

---

## 9. Dashboard & Analytics
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Get aggregated readiness metrics & radar chart data | Yes |
| `GET` | `/resources` | View verified documentation and practice resources | No |
| `GET` | `/health` | Check API, database, and AI service status | No |

