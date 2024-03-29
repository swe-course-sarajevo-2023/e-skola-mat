from datetime import date
from typing import List, Literal, Union
from uuid import UUID

from fastapi import UploadFile
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
    name: str
    surname: str


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


class ProfessorGradesHomework(BaseRequest):
    homework_id: str
    user_id: str
    grade: int


class ProfessorCommentsHomework(BaseRequest):
    homework_id: str
    user_id: str
    note: str


class ClassCreateRequest(BaseModel):
    name: str


class SubmitTaskRequest(BaseModel):
    task_comment: str
    images: List[UploadFile]
