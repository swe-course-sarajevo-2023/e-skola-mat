import time

import jwt
from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core import config, security
from app.models import User
from app.schemas.requests import RefreshTokenRequest
from app.schemas.responses import AccessTokenResponse, VerifyTokenResponse

router = APIRouter()


@router.post("/access-token", response_model=security.AccessTokenResponse)
async def login_access_token(
    session: AsyncSession = Depends(deps.get_session),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """OAuth2 compatible token, get an access token for future requests using username and password"""

    # Fetch the user by email (assuming form_data.username is the email)
    result = await session.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    # Handle case where user is not found
    if user is None:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Verify the password
    if not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Fetch the role from the user object
    user_role = user.Role.role.value if user.Role else None

    # Generate the access token response including the user's role
    return security.generate_access_token_response(str(user.id), user_role)


@router.post("/refresh-token", response_model=AccessTokenResponse)
async def refresh_token(
    input: RefreshTokenRequest,
    session: AsyncSession = Depends(deps.get_session),
):
    """OAuth2 compatible token, get an access token for future requests using refresh token"""
    try:
        payload = jwt.decode(
            input.refresh_token,
            config.settings.SECRET_KEY,
            algorithms=[security.JWT_ALGORITHM],
        )
    except (jwt.DecodeError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, unknown error",
        )

    # JWT guarantees payload will be unchanged (and thus valid), no errors here
    token_data = security.JWTTokenPayload(**payload)

    if not token_data.refresh:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, cannot use access token",
        )
    now = int(time.time())
    if now < token_data.issued_at or now > token_data.expires_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, token expired or not yet valid",
        )

    result = await session.execute(select(User).where(User.id == token_data.sub))
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return security.generate_access_token_response(str(user.id))


@router.get("/verify-token", response_model=VerifyTokenResponse)
def verify_access_token(authorization=Header(...)):
    """Verify the access token"""
    try:
        # Decode the token and extract claims
        _, token = authorization.split(" ")
        result = jwt.decode(
            token,
            key=config.settings.SECRET_KEY,
            algorithms=[security.JWT_ALGORITHM],
        )

        return VerifyTokenResponse(id=result["sub"])  # Token is valid
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
