from pydantic import BaseModel
from typing import List, Optional 
from app.schemas.group import ClassBase

class HomeworkBase(BaseModel):
    name: str
    creation_date: Optional[str]
    due_date: str
    max_tasks_count: int
    groups: List[str] 

class HomeworkCreateRequest(HomeworkBase):
    pass

class HomeworkResponse(HomeworkBase):
    id: int

    class Config:
        orm_mode = True

class ClassHomework(BaseModel):
    group_class: ClassBase  # Changed from class to group_class
    homework: HomeworkBase

class ClassHomeworkCreateRequest(ClassHomework):
    pass

class ClassHomeworkResponse(ClassHomework):
    id: int

    class Config:
        orm_mode = True
