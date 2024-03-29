from datetime import datetime
from typing import List, Literal, Optional, Union
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models import HomeworkStatus


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class HomeworkResponse(BaseModel):
    name: str
    maxNumbersOfTasks: int
    deadline: datetime
    dateOfCreation: datetime
    id: str
    status: HomeworkStatus


class ClassHomeworkResponse(HomeworkResponse):
    groups: Union[List[UUID], Literal["all"]]


class AccessTokenResponse(BaseResponse):
    token_type: str
    access_token: str
    expires_at: int
    issued_at: int
    refresh_token: str
    refresh_token_expires_at: int
    refresh_token_issued_at: int


class UserResponse(BaseResponse):
    id: str
    email: EmailStr


class GradeResponse(BaseResponse):
    id: str
    user_id: str
    homework_id: str
    grade: int


class CommentResponse(BaseResponse):
    id: str
    user_id: str
    homework_id: str
    note: str


class TaskCommentResponse(BaseResponse):
    id: str


class ClassResponse(BaseModel):
    id: str
    name: str


class taskUserHomeworkImageResponse(BaseModel):
    id: str
    image_path: Optional[str]
    comment_professor: Optional[str]
    comment_student: Optional[str]


class taskUserHomeworkResponse(BaseModel):
    id: str
    order_number_of_the_task: Optional[int]
    commentProfessor: Optional[str]
    commentStudent: Optional[str]
    images: List[taskUserHomeworkImageResponse]


class HomeworkUserDetailsResponse(BaseModel):
    id: str
    user_id: str
    grade: Optional[int]
    note: Optional[str]
    note_user: Optional[str]
    tasks: List[taskUserHomeworkResponse]


class VerifyTokenResponse(BaseModel):
    id: str


class ReviewedHomeworkResponse(HomeworkResponse):
    homework_id: str
    grade: int
    note: Optional[str]
    note_student: Optional[str]
