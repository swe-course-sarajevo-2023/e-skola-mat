import asyncio
import uuid

from app.core.session import async_session
from app.models import Class, Role, User, UserRole
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import config, security


async def insert_roles_and_groups(session: AsyncSession):
    role_uuids = {}
    for role in UserRole:
        existing_role = await session.execute(select(Role).where(Role.role == role))
        if not existing_role.scalars().first():
            role_uuid = uuid.uuid4()
            session.add(Role(role=role.name, id=role_uuid))
            role_uuids[role.name] = role_uuid

    groups = ["A", "B", "C", "D", "E"]
    for group in groups:
        existing_group = await session.execute(select(Class).where(Class.name == group))
        if not existing_group.scalars().first():
            session.add(Class(name=group))

    await session.commit()
    return role_uuids


async def main() -> None:
    print("Start initial data")

    async with async_session() as session:
        role_uuids = await insert_roles_and_groups(session)
        print("Roles and groups added")

        result = await session.execute(
            select(User).where(User.email == config.settings.FIRST_SUPERUSER_EMAIL)
        )
        user = result.scalars().first()

        if user is None:
            admin_uuid = role_uuids.get("ADMINISTRATOR")
            new_superuser = User(
                email=config.settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=security.get_password_hash(
                    config.settings.FIRST_SUPERUSER_PASSWORD
                ),
                role_id=admin_uuid,
            )
            session.add(new_superuser)
            await session.commit()
            print("Superadmin was created")
        else:
            print("Superuser already exists in database")

        result = await session.execute(
            select(User).where(User.email == "professor@example.com")
        )
        user = result.scalars().first()

        if user is None:
            professor_uuid = role_uuids.get("PROFESSOR")
            professor_user = User(
                email="professor@example.com",
                hashed_password=security.get_password_hash(
                    "test123",
                ),
                role_id=professor_uuid,
            )
            session.add(professor_user)
            await session.commit()
            print("Test professor was created")
        else:
            print("Test professor already exists in database")

        print("Initial data created")


if __name__ == "__main__":
    asyncio.run(main())
