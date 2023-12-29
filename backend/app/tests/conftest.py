import asyncio
from unittest.mock import Mock
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.storage import Client, get_storage_client
from main import app 
from app.models import Base, User, Role, Class, Homework, HomeworkStatus ,taskUserHomework, HomeworkUser
import os
from sqlalchemy import select, delete
from app.core import  security
from collections.abc import AsyncGenerator
import pytest_asyncio
from datetime import datetime


TEST_DATABASE_HOSTNAME = os.getenv("TEST_DATABASE_HOSTNAME", "localhost")
TEST_DATABASE_USER = os.getenv("TEST_DATABASE_USER", "postgres")
TEST_DATABASE_PASSWORD = os.getenv("TEST_DATABASE_PASSWORD", "postgres")
TEST_DATABASE_PORT = os.getenv("TEST_DATABASE_PORT", "37270")
TEST_DATABASE_DB = os.getenv("TEST_DATABASE_DB", "postgres")

DATABASE_URL = (
    f"postgresql+asyncpg://{TEST_DATABASE_USER}:{TEST_DATABASE_PASSWORD}"
    f"@{TEST_DATABASE_HOSTNAME}:{TEST_DATABASE_PORT}/{TEST_DATABASE_DB}"
)

# Set up the async engine and session for SQLAlchemy
async_engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(
    async_engine, expire_on_commit=False, class_=AsyncSession
)

generic_user_id = "958750c6-453d-4113-bb6a-f0c7175c51fd"
generic_user_email = "temp@test.com"
generic_user_password = "temp"
generic_user_password_hash = security.get_password_hash(generic_user_password)
generic_user_access_token = security.create_jwt_token(
    str(generic_user_id), 60 * 60 * 24, refresh=False
)[0]


default_user_id = "b75365d9-7bf9-4f54-add5-aeab333a087b"
default_user_email = "geralt@test.com"
default_user_password = "prof"
default_user_password_hash = security.get_password_hash(default_user_password)
default_user_access_token = security.create_jwt_token(
    str(default_user_id), 60 * 60 * 24, refresh=False
)[0]


professor_user_id = "1d354b3e-025d-4467-83ad-fc7a12c25804"
professor_user_email = "professor@test.com"
professor_user_password = "geralt"
professor_user_password_hash = security.get_password_hash(professor_user_password)
professor_user_access_token = security.create_jwt_token(
    str(professor_user_id), 60 * 60 * 24, refresh=False
)[0]

homework_user_test_id = "8dfdac55-37ec-42d3-9605-638ca228e75e"

test_homework_id="845cf571-d71c-4088-8c20-f5084ee1c06e"
task_id="07e5f413-2ef8-41f2-860e-e8c2035c7fd1"

roles = {
    "ADMINISTRATOR": "5ce5b10d-3910-4ad0-87ad-362aa177fac6",
    "PROFESSOR": "cd531696-90f7-4819-a197-001242917651",
    "STUDENT": "dca326bc-03dd-4f2b-a086-24c6fae5ecb0",
    "TA": "301baadb-6eec-40c5-bc96-fcfc5f657fc7",
    "GUEST": "6a0d7933-e24b-4526-9347-02430bfe108b"
}


def storage_client():
    storage_client = Client()
    storage_client.save_image = Mock(return_value="blob_name")
    return storage_client

app.dependency_overrides[get_storage_client] = storage_client


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def create_test_database():
    # Create the test database
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    # Insert predefined roles
    async with async_session() as session:
        for role_name, role_id in roles.items():
            role = Role(id=role_id, role=role_name)
            session.add(role)
        groups = ["A", "B", "C", "D", "E"]
        for group in groups:
            session.add(Class(name=group))
        await session.commit()

    yield  # This is where the testing happens

    # Teardown: Drop the test database
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as test_client:
        yield test_client

@pytest.fixture
async def default_user(create_test_database):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.email == default_user_email))
        user = result.scalars().first()
        if user is None:
            new_user = User(
                email=default_user_email,
                hashed_password=default_user_password_hash,
                role_id=roles["PROFESSOR"]
            )
            new_user.id = default_user_id
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            return new_user
        return user


@pytest.fixture
def default_user_headers(default_user: User):
    return {"Authorization": f"Bearer {default_user_access_token}"}

@pytest.fixture
async def professor_user(create_test_database):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.email == professor_user_email))
        user = result.scalars().first()
        if user is None:
            new_user = User(
                email=professor_user_email,
                hashed_password=professor_user_password_hash,
                role_id=roles["PROFESSOR"]
            )
            new_user.id = professor_user_id
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            return new_user
        return user
    
@pytest.fixture
def professor_user_headers(professor_user: User):
    return {"Authorization": f"Bearer {professor_user_access_token}"}

@pytest.fixture
async def generic_user(create_test_database):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.email == generic_user_email))
        user = result.scalars().first()
        if user is None:
            new_user = User(
                email=generic_user_email,
                hashed_password=generic_user_password_hash,
                role_id=roles["GUEST"]

            )
            new_user.id = generic_user_id
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            return new_user
        return user
    
@pytest.fixture
def generic_user_headers(generic_user: User):
    return {"Authorization": f"Bearer {generic_user_access_token}"}



@pytest.fixture
async def homework(create_test_database):
    async with async_session() as session:
        result = await session.execute(select(Homework).where(Homework.id == test_homework_id))
        homework = result.scalars().first()
        if homework is None:
            new_homework = Homework(
                name="Example Homework",
                dateOfCreation=datetime.now(),
                deadline=datetime.now(), 
                maxNumbersOfTasks=5,
                status=HomeworkStatus.NOT_STARTED,
                id=test_homework_id
            )
            session.add(new_homework)
            await session.commit()
            await session.refresh(new_homework)
            return new_homework
        return homework
        

@pytest.fixture
async def homeworkUser(homework,professor_user):
    async with async_session() as session:
        result = await session.execute(select(HomeworkUser).where(HomeworkUser.id == homework_user_test_id))
        homework_user = result.scalars().first()
        if homework_user is None:
            new_homework_user = HomeworkUser(
                user_id=professor_user.id,
                homework_id=homework.id,
                id=homework_user_test_id
            )
            session.add(new_homework_user)
            await session.commit()
            await session.refresh(new_homework_user)
            return new_homework_user
        return homework_user


@pytest.fixture
async def task(homework, professor_user):
    async with async_session() as session:
        result = await session.execute(select(taskUserHomework).where(taskUserHomework.id == task_id))
        task = result.scalars().first()
        if task is None:
            new_task_submission = taskUserHomework(
            user_id=professor_user.id,
            homework_id=homework.id,
            order_number_of_the_task=2,
            commentStudent="test comment 2",
            )
            session.add(new_task_submission)
            await session.commit()
            await session.refresh(new_task_submission)
            return new_task_submission
        return homework


@pytest_asyncio.fixture(autouse=True)
async def session(create_test_database) -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
        

@pytest_asyncio.fixture(scope="session")
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(app=app, base_url="http://test") as client:
        client.headers.update({"Host": "localhost"})
        yield client