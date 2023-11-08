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
    groups: Union[List[str], Literal['all']]

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

# class HomeworkUserResponse(BaseModel):
#     id: str
#     user_id: str
#     homework_id: str
#     grade: Optional[int]
#     note: Optional[str]

# class ProblemUserHomeworkResponse(BaseModel):
#     id: str
#     user_id: str
#     homework_id: str
#     order_number_of_the_task: int
#     commentTeacher: Optional[str]
#     commentStudent: Optional[str]

# class ProblemUserHomeworkImageResponse(BaseModel):
#     id: str
#     problem_user_homework_id: str
#     image_path: str
#     comment_teacher: Optional[str]
#     comment_student: Optional[str]

# class HomeworkDetailsResponse(BaseModel):
#     homework: HomeworkResponse
#     homework_user: HomeworkUserResponse
#     problems: List[ProblemUserHomeworkResponse]
#     images: List[ProblemUserHomeworkImageResponse]




###############
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

#############
# class ProblemUserHomeworkImageResponse(BaseModel):
#     id: str
#     image_path: Optional[str]
#     comment_teacher: Optional[str]
#     comment_student: Optional[str]


# class ProblemUserHomeworkResponse(BaseModel):
#     id: str
#     order_number_of_the_task: Optional[int]
#     commentTeacher: Optional[str]
#     commentStudent: Optional[str]
#     images: List[ProblemUserHomeworkImageResponse]


# class HomeworkUserResponse(BaseModel):
#     id: str
#     grade: Optional[int]
#     note: Optional[str]
#     problems: List[ProblemUserHomeworkResponse]


# class HomeworkDetailResponse(BaseModel):
#     id: str
#     name: Optional[str]
#     dateOfCreation: Optional[datetime]
#     deadline: Optional[datetime]
#     maxNumbersOfProblems: Optional[int]
#     user_homework: HomeworkUserResponse