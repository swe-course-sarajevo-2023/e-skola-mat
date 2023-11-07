from pydantic import BaseModel, EmailStr


class BaseRequest(BaseModel):
    # may define additional fields or config shared across requests
    pass


class RefreshTokenRequest(BaseRequest):
    refresh_token: str


class UserUpdatePasswordRequest(BaseRequest):
    password: str


class UserCreateRequest(BaseRequest):
    email: EmailStr
    password: str


class UserDeleteRequest(BaseRequest):
    email: EmailStr


class TeacherCommentsHomework(BaseRequest):
    id: str
    comment: str


class TeacherGradesHomework(BaseRequest):
    homework_id: str
    user_id: str
    grade: int
    note: str
