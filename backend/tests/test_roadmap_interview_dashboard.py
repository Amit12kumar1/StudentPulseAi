def test_roadmap_flow(client, auth_headers):
    # Generate roadmap
    res = client.post("/api/roadmap/generate?target_role=Java Developer", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["target_role"] == "Java Developer"
    assert len(data["tasks"]) >= 4

    first_task = data["tasks"][0]
    task_id = first_task["id"]
    assert first_task["status"] == "Pending"

    # Update task to Completed
    update_res = client.put(f"/api/roadmap/tasks/{task_id}", headers=auth_headers, json={
        "status": "Completed"
    })
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "Completed"

    # Check updated roadmap
    get_res = client.get("/api/roadmap?role=Java Developer", headers=auth_headers)
    assert get_res.status_code == 200
    updated_roadmap = get_res.json()
    assert updated_roadmap["completed_tasks"] >= 1
    assert updated_roadmap["progress_percentage"] > 0

def test_interview_preparation(client, auth_headers):
    # Generate interview questions
    gen_res = client.post("/api/interview/generate", json={
        "target_role": "Java Developer",
        "category": "Technical Interview",
        "difficulty": "Intermediate"
    })
    assert gen_res.status_code == 200
    questions = gen_res.json()
    assert len(questions) > 0

    first_q = questions[0]

    # Evaluate student answer
    eval_res = client.post("/api/interview/evaluate", headers=auth_headers, json={
        "target_role": "Java Developer",
        "category": "Technical Interview",
        "difficulty": "Intermediate",
        "question": first_q["question"],
        "student_answer": "In Java HashMap, objects are indexed by their hashCode. If collisions occur, entries are stored in a linked list, which turns into a balanced red-black tree once the threshold exceeds 8."
    })
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert eval_data["score"] >= 60.0
    assert len(eval_data["feedback"]) > 10
    assert len(eval_data["improved_answer"]) > 10

def test_dashboard_metrics(client, auth_headers):
    # Create a project first
    proj_res = client.post("/api/projects", headers=auth_headers, json={
        "title": "Hospital Management System",
        "description": "Full stack microservice in Java and Spring Boot.",
        "technologies": "Java, Spring Boot, PostgreSQL, Docker",
        "github_url": "https://github.com/alex/hospital-system",
        "live_url": "https://hospital.example.com",
        "status": "Completed"
    })
    assert proj_res.status_code == 201

    # Fetch dashboard summary
    dash_res = client.get("/api/dashboard/summary", headers=auth_headers)
    assert dash_res.status_code == 200
    dash = dash_res.json()

    assert dash["student_name"] == "Alex Developer"
    assert dash["projects_count"] >= 1
    assert dash["total_skills"] >= 2
    assert dash["career_readiness_score"] > 0
    assert len(dash["radar_data"]) >= 5
    assert len(dash["recent_activities"]) >= 1

def test_user_data_isolation(client, auth_headers, second_user_headers):
    # User 1 creates a project
    proj_res = client.post("/api/projects", headers=auth_headers, json={
        "title": "Private User 1 Project",
        "description": "Confidential repository",
        "technologies": "C++, Algorithms",
        "status": "In Progress"
    })
    proj_id = proj_res.json()["id"]

    # User 2 tries to delete User 1's project -> Must return 404
    del_res = client.delete(f"/api/projects/{proj_id}", headers=second_user_headers)
    assert del_res.status_code == 404

    # User 2 lists projects -> should NOT see User 1's project
    u2_projects = client.get("/api/projects", headers=second_user_headers).json()
    assert all(p["id"] != proj_id for p in u2_projects)

