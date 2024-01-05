
from unittest.mock import Mock
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from io import BytesIO
from starlette.datastructures import UploadFile
from tempfile import SpooledTemporaryFile

from google.cloud.storage import Blob

from app.core.storage import Client

from app.models import Homework, User, HomeworkStatus, Class, taskUserHomework
from main import app
from sqlalchemy import select


async def test_get_all_homeworks(
    client: AsyncClient, professor_user_headers: User, session: AsyncSession
):
    response = await client.get(
        "/homeworks",
        headers=professor_user_headers,
    )
    assert response.status_code == 200


async def test_get_homeworks_doesnt_exist(client: AsyncClient, professor_user_headers, session: AsyncSession):

    response = await client.get("/homeworks/get_homework_data/f4afd65a-c5b6-4ab6-a42b-81e1c4fff336", 
        headers=professor_user_headers
    )
    assert response.status_code == 204

async def test_add_homework(client: AsyncClient, professor_user_headers, session: AsyncSession):
    new_homework_data = {
        "name": "Test Homework",
        "description": "Test Description",
        "maxNumbersOfTasks": 5,
        "deadline": "2023-12-31",
        "groups": "all"
    }
    response = await client.post("/homeworks",
        headers=professor_user_headers,
        json=new_homework_data
    )
    assert response.status_code == 200

async def test_delete_homework(client: AsyncClient, professor_user_headers, homework, session: AsyncSession):
    response = await client.delete("/homeworks/"+homework.id, 
        headers=professor_user_headers
    )
    assert response.status_code == 204
    result = await session.execute(select(Homework).where(Homework.id == homework.id))
    homework = result.scalars().first()
    assert homework is  None



async def test_submit_task(client: AsyncClient, professor_user_headers, homework, session: AsyncSession):
    task_number = 1
    task_comment = "My Task Comment"

    file_content = b"fake file content"
    with SpooledTemporaryFile() as file:
        file.write(file_content)
        file.seek(0)

        url = app.url_path_for("submit_task", homework_id=str(homework.id), task_number=task_number)

        # Prepare multipart form data
        submit_task_request = {
            "images": [("test.png", file, "image/png")],
            "task_comment": task_comment,
        }

        response = await client.post(
            url,
            headers=professor_user_headers,
            data=submit_task_request
        )

        assert response.status_code == 200


async def test_submit_comment(client: AsyncClient, professor_user_headers,task, session: AsyncSession):
    task_id = task.id
    comment = "This is a test comment"

    response = await client.post(
        app.url_path_for("submit_comment"),
        headers=professor_user_headers,
        params={"task_id": task_id, "comment": comment}
    )

    assert response.status_code == 200


async def test_get_homework_user_details(client: AsyncClient, professor_user_headers,homeworkUser , session: AsyncSession):
    response = await client.get(
        app.url_path_for("get_homework_user_details", homework_user_id=homeworkUser.id, homework_id=homeworkUser.homework_id),
        headers=professor_user_headers
    )
    assert response.status_code ==200

async def test_get_homework_user_details_403(client: AsyncClient, generic_user_headers, session: AsyncSession):
    response = await client.get(
        app.url_path_for("get_homework_user_details", homework_user_id="e7854775-67ae-43c4-a1c4-64d806569f22​​", homework_id="f7854224-67ae-43c4-a1c4-64d806569f22"),
        headers=generic_user_headers
    )
    assert response.status_code ==403

async def test_update_homework_status(client: AsyncClient, professor_user_headers, homework, session: AsyncSession):
    homework_id = homework.id
    new_status = "in_progress"

    response = await client.patch(
        f"/homeworks/update-homework-status/{homework_id}/{new_status}",
        headers=professor_user_headers
    )
    assert response.status_code == 200

    result = await session.execute(select(Homework).where(Homework.id == homework_id))
    updated_homework = result.scalar()

    assert updated_homework is not None
    assert updated_homework.status == HomeworkStatus.IN_PROGRESS
    

async def test_get_homework_data(client: AsyncClient, professor_user_headers, homework ,session: AsyncSession):
    response = await client.get(
                f"/homeworks/get_homework_data/{homework.id}",
        headers=professor_user_headers
    )
    assert response.status_code == 204


async def test_delete_homework_not_found(client: AsyncClient, professor_user_headers):
    invalid_homework_id = "07e5f413-2ef8-41f2-860e-e8c2035c7fd1"

    response = await client.delete(
        app.url_path_for("delete_homework", homework_id=invalid_homework_id),
        headers=professor_user_headers
    )
    assert response.status_code == 204

async def test_submit_comment(client: AsyncClient, task, professor_user_headers, session: AsyncSession):
    response = await client.post(
        app.url_path_for("submit_comment"),
        params={"task_id": task.id, "comment": "test"},
        headers=professor_user_headers
    )
    assert response.status_code == 200

    assert response.json() == {"message": "Comment submitted successfully"}

    result = await session.execute(
        select(taskUserHomework).where(taskUserHomework.id == task.id)
    )
    updated_task = result.scalar()

    assert updated_task is not None
    assert updated_task.commentStudent == "test"

async def test_submit_comment_error(client: AsyncClient, professor_user_headers, session: AsyncSession):
    response = await client.post(
        app.url_path_for("submit_comment"),
        params={"task_id":"301baadb-6eec-40c5-bc96-fcfc5f657fc7", "comment": "test"},
        headers=professor_user_headers
    )
    assert response.status_code == 404
