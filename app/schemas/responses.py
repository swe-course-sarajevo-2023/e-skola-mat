from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Union, Literal
from datetime import date, datetime
from typing import Optional

class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class HomeworkResponse(BaseModel):
    name: str
    maxNumbersOfProblems: int
    deadline: date
    dateOfCreation: date
    id: str

class ClassHomeworkResponse(HomeworkResponse):
    groups: Union[List[UUID], Literal['all']]

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
    note: str
class ClassResponse(BaseModel):
    id: str
    name: str

class ProblemUserHomeworkImageResponse(BaseModel):
    id: str
    image_path: Optional[str]
    comment_teacher: Optional[str]
    comment_student: Optional[str]

class ProblemUserHomeworkResponse(BaseModel):
    id: str
    order_number_of_the_task: Optional[int]
    commentTeacher: Optional[str]
    commentStudent: Optional[str]
    images: List[ProblemUserHomeworkImageResponse]

class HomeworkUserDetailsResponse(BaseModel):
    id: str
    user_id: str
    grade: Optional[int]
    note: Optional[str]
    problems: List[ProblemUserHomeworkResponse]