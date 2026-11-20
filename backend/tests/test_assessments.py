def test_assessment_flow_and_score(client, auth_headers):
    # Fetch questions for Programming Skills
    q_res = client.get("/api/assessments/questions?category=Programming Skills")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) > 0

    first_q = questions[0]
    q_id = first_q["id"]

    # Submit assessment answer
    submit_payload = {
        "category": "Programming Skills",
        "answers": [
            {
                "question_id": q_id,
                "selected_answer": "The JVM marks it for collection when memory runs low or during cyclic GC sweeps"
            }
        ]
    }
    sub_res = client.post("/api/assessments/submit", headers=auth_headers, json=submit_payload)
    assert sub_res.status_code == 200
    result = sub_res.json()
    assert result["total_questions"] == 1
    assert result["score"] == 1
    assert result["percentage"] == 100.0

    # Verify assessment results history
    hist_res = client.get("/api/assessments/results", headers=auth_headers)
    assert hist_res.status_code == 200
    assert len(hist_res.json()) >= 1

    # Verify that the student's skill has now acquired verified assessment evidence
    my_skills_res = client.get("/api/skills/my-skills", headers=auth_headers)
    assert my_skills_res.status_code == 200
    java_skill = next((s for s in my_skills_res.json() if "Java" in s["skill_name"]), None)
    if java_skill:
        assert java_skill["assessment_score"] is not None
        assert java_skill["assessment_score"] >= 90.0

