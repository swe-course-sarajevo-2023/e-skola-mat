from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Class
from app.schemas.requests import ClassCreateRequest
from main import app


async def test_get_all_groups(client: AsyncClient, professor_user_headers, session: AsyncSession):
    response = await client.get(
        "/groups/groups",
        headers=professor_user_headers,
    )
    assert response.status_code == 200

async def test_get_group(client: AsyncClient, professor_user_headers: dict):
    class_id = "bd65600d-8669-4903-8a14-af88203add38" 
    response = await client.get(
        f"/groups/class?class_id={class_id}",
        headers=professor_user_headers,
    )
    assert response.status_code == 200    

async def test_create_group(client: AsyncClient, professor_user_headers, session: AsyncSession):
    class_data = {"name": "New Test Group"} 
    response = await client.post(
        "/groups/groups",
        json=class_data,
        headers=professor_user_headers,
    )
    assert response.status_code == 200
    created_class = response.json()
    assert created_class['name'] == class_data['name']

    result = await session.execute(select(Class).where(Class.id == created_class['id']))
    group_in_db = result.scalar_one_or_none()
    assert group_in_db is not None
    assert group_in_db.name == class_data['name']
