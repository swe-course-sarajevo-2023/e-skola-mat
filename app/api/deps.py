import time
from collections.abc import AsyncGenerator
from typing import List
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core import config, security
from app.core.session import async_session
from app.models import User, UserRole

from sqlalchemy.dialects import postgresql

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="auth/access-token")

async def get_db() -> AsyncSession:
    # Procitamo env varijable
    ENVIRONMENT = os.environ.get("ENVIRONMENT")
    if ENVIRONMENT == "TEST":
        DATABASE_HOSTNAME = os.environ.get("DEFAULT_DATABASE_HOSTNAME")
        DATABASE_USER = os.environ.get("DEFAULT_DATABASE_USER")
        DATABASE_PASSWORD = os.environ.get("DEFAULT_DATABASE_PASSWORD")
        DATABASE_PORT = os.environ.get("DEFAULT_DATABASE_PORT")
        DATABASE_DB = os.environ.get("DEFAULT_DATABASE_DB")
    else:
        DATABASE_HOSTNAME = os.environ.get("TEST_DATABASE_HOSTNAME")
        DATABASE_USER = os.environ.get("TEST_DATABASE_USER")
        DATABASE_PASSWORD = os.environ.get("TEST_DATABASE_PASSWORD")
        DATABASE_PORT = os.environ.get("TEST_DATABASE_PORT")
        DATABASE_DB = os.environ.get("TEST_DATABASE_DB")

    # Konstrukcija url-a baze
    DATABASE_URL = f"postgresql+asyncpg://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOSTNAME}:{DATABASE_PORT}/{DATABASE_DB}"

    async_engine = create_async_engine(DATABASE_URL, echo=True)
    AsyncSessionFactory = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )
    db: AsyncSession = AsyncSessionFactory()
    try:
        yield db
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    finally:
        await db.close()

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


async def get_current_user(
    session: AsyncSession = Depends(get_session), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, config.settings.SECRET_KEY, algorithms=[security.JWT_ALGORITHM]
        )
    except jwt.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials.",
        )
    # JWT guarantees payload will be unchanged (and thus valid), no errors here
    token_data = security.JWTTokenPayload(**payload)

    if token_data.refresh:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, cannot use refresh token",
        )
    now = int(time.time())
    if now < token_data.issued_at or now > token_data.expires_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, token expired or not yet valid",
        )

    result = await session.execute(select(User).options(joinedload(User.Role)).where(User.id == token_data.sub))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

async def has_roles(roles: List[UserRole],current_user: User = Depends(get_current_user)):
    if current_user.Role is None:
        raise HTTPException(status_code=403, detail="User has no role assigned")

    for role in roles:
        if current_user.Role.role.name != role.name:
            raise HTTPException(status_code=403, detail="Forbidden")

    return current_user

class RoleCheck:
    def __init__(self, roles: List[UserRole]):
        self.roles = roles

    async def __call__(self, current_user: User = Depends(get_current_user)):
        return await has_roles(self.roles, current_user)

