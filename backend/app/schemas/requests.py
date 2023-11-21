from datetime import date
from typing import List, Literal, Union
from uuid import UUID

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


class HomeworkCreateRequest(BaseRequest):
    name: str
    maxNumbersOfTasks: int
    deadline: date


class ClassHomeworkCreateRequest(HomeworkCreateRequest):
    groups: Union[List[UUID], Literal["all"]]


class TaskComment(BaseModel):
    task_id: str
    comment: str


class GeneralComment(BaseModel):
    user_id: str
    comment: str


class UserDeleteRequest(BaseRequest):
    email: EmailStr


class ProfessorCommentsHomework(BaseRequest):
    id: str
    comment: str


class ProfessorGradesHomework(BaseRequest):
    homework_id: str
    user_id: str
    grade: int
    note: str


class ClassCreateRequest(BaseModel):
    name: str
