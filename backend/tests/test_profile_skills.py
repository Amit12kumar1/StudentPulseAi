def test_get_and_update_profile(client, auth_headers):
    # Get profile
    res = client.get("/api/profile", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Alex Developer"
    assert data["college"] == "MIT Engineering"

    # Update profile
    update_res = client.put("/api/profile", headers=auth_headers, json={
        "college": "MIT School of Computing",
        "bio": "Aspiring enterprise Java engineer eager to master microservices.",
        "phone": "+1 555-0199"
    })
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["college"] == "MIT School of Computing"
    assert updated_data["bio"] == "Aspiring enterprise Java engineer eager to master microservices."

def test_add_and_update_skills(client, auth_headers):
    # Add Java skill
    res = client.post("/api/skills/my-skills", headers=auth_headers, json={
        "skill_name": "Core Java",
        "category": "Programming",
        "self_reported_level": "Intermediate"
    })
    assert res.status_code == 201
    data = res.json()
    skill_id = data["id"]
    assert data["skill_name"] == "Core Java"
    assert data["self_reported_level"] == "Intermediate"

    # Add SQL skill
    res_sql = client.post("/api/skills/my-skills", headers=auth_headers, json={
        "skill_name": "SQL",
        "category": "Database",
        "self_reported_level": "Beginner"
    })
    assert res_sql.status_code == 201

    # Update skill level
    update_res = client.put(f"/api/skills/my-skills/{skill_id}", headers=auth_headers, json={
        "self_reported_level": "Advanced"
    })
    assert update_res.status_code == 200
    assert update_res.json()["self_reported_level"] == "Advanced"

    # List my skills
    list_res = client.get("/api/skills/my-skills", headers=auth_headers)
    assert list_res.status_code == 200
    skills_list = list_res.json()
    assert len(skills_list) >= 2

