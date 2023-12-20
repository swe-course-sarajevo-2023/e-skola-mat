import time
from collections.abc import AsyncGenerator
from typing import List

import jwt
from app.core.session import async_session
from app.models import User, UserRole
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core import config, security

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="auth/access-token")


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

    result = await session.execute(
        select(User).options(joinedload(User.Role)).where(User.id == token_data.sub)
    )
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


async def has_roles(
    roles: List[UserRole], current_user: User = Depends(get_current_user)
):
    if len(roles) == 0:
        return current_user
    if current_user.Role is None:
        raise HTTPException(status_code=403, detail="User has no role assigned")
    has_needed_roles = False
    for role in roles:
        if current_user.Role.role.name == role.name:
            has_needed_roles = True
    if not has_needed_roles:
        raise HTTPException(status_code=403, detail="Forbidden")
    return current_user


class RoleCheck:
    def __init__(self, roles: List[UserRole]):
        self.roles = roles

    async def __call__(self, current_user: User = Depends(get_current_user)):
        return await has_roles(self.roles, current_user)
