from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_student():
    response = client.post("/register_student", json={
        "group_id": "1",
        "new_student": {
            "email": "test@student.com",
            "password": "password123",
            "name": "Test",
            "surname": "Student"
        }
    })
    assert response.status_code == 200
    assert "email" in response.json()

def test_delete_student():
    response = client.delete("/delete_student", json={
        "email": "test@student.com"
    })
    assert response.status_code == 200
    assert response.json() == {"detail": "Student deleted successfully"}

def test_list_students():
    class_id = "1"  
    response = client.get(f"/list_students/{class_id}")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_comment_homework():
    response = client.post("/comment_homework", json={
        "id": "1",
        "comment": "BRAVO!"
    })
    assert response.status_code == 200
    assert response.json() == {"detail": "Successfully added a comment"}

def test_grade_homework():
    response = client.post("/grade_homework", json={
        "user_id": "1",
        "homework_id": "1",
        "grade": 8,
        "note": "BRAVO!"
    })
    assert response.status_code == 200
    assert "grade" in response.json()