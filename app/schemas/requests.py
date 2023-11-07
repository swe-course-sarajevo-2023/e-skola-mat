from pydantic import BaseModel, EmailStr
from typing import List, Union, Literal
from datetime import date
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
    maxNumbersOfProblems: int
    deadline: date

class ClassHomeworkCreateRequest(HomeworkCreateRequest):
    groups: Union[List[str], Literal['all']]

class TaskComment(BaseModel):
    task_id: str
    comment: str

class GeneralComment(BaseModel):
    user_id: str
    comment: str

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


