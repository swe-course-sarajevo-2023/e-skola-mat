import asyncio

from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import config, security
from app.core.session import async_session
from app.models import User, Role, Class  

async def insert_roles_and_groups(session: AsyncSession):
    roles = ["Profesor", "Asistent", "Student"]
    for role in roles:
        existing_role = await session.execute(select(Role).where(Role.role == role))
        if not existing_role.scalars().first():
            session.add(Role(role=role))

    groups = ["A", "B", "C", "D", "E"]
    for group in groups:
        existing_group = await session.execute(select(Class).where(Class.name == group))
        if not existing_group.scalars().first():
            session.add(Class(name=group))

    await session.commit()

async def main() -> None:
    print("Start initial data")
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.email == config.settings.FIRST_SUPERUSER_EMAIL)
        )
        user = result.scalars().first()

        if user is None:
            new_superuser = User(
                email=config.settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=security.get_password_hash(
                    config.settings.FIRST_SUPERUSER_PASSWORD
                ),
            )
            session.add(new_superuser)
            await session.commit()
            print("Superuser was created")
        else:
            print("Superuser already exists in database")

        # Insert roles and groups
        await insert_roles_and_groups(session)
        print("Roles and groups added")

        print("Initial data created")

if __name__ == "__main__":
    asyncio.run(main())
