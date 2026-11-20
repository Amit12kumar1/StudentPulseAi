def test_skill_gap_analysis_java_developer(client, auth_headers):
    # Select Java Developer
    payload = {"target_role": "Java Developer"}
    res = client.post("/api/analysis/skill-gap", headers=auth_headers, json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["target_role"] == "Java Developer"
    assert data["total_required_skills"] >= 6
    assert "readiness_percentage" in data
    assert "ai_insights" in data
    assert len(data["ai_insights"]) > 10

    # Alex has Core Java and SQL, but is missing Spring Boot, JDBC, REST APIs, Git & GitHub
    missing_skill_names = [s["skill_name"] for s in data["missing_skills"]]
    assert "Spring Boot" in missing_skill_names or "JDBC" in missing_skill_names

    # Check history
    hist_res = client.get("/api/analysis/skill-gap/history", headers=auth_headers)
    assert hist_res.status_code == 200
    assert len(hist_res.json()) >= 1

