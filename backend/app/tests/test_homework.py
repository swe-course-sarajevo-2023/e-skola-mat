from fastapi.testclient import TestClient
from main import app
from io import BytesIO

client = TestClient(app)

def test_get_homework_data():
    response = client.get("/get_homework_data/1")
    assert response.status_code == 200
    assert "homework" in response.json()

def test_get_homeworks():
    response = client.get("/get_homeworks/1") 
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_submit_homework():
    homework_id = "1"  
    task_number = 1  

    files = {
        "images": (BytesIO(b"image data"), "test.jpg")
    }
    data = {
        "task_comment": "Test comment"
    }

    response = client.post(f"/submit-homework/{homework_id}/task/{task_number}", files=files, data=data)
    assert response.status_code == 200
    assert response.json() == {"message": "Homework task submitted successfully"}

def test_delete_homework():
    homework_id = "1"
    response = client.delete(f"/delete_homework/{homework_id}")
    assert response.status_code == 204
