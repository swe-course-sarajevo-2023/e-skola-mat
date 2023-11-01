from pydantic import BaseModel
from typing import List, Optional  

class ClassBase(BaseModel):
    name: str

class ClassCreateRequest(ClassBase):
    pass

class ClassResponse(ClassBase):
    id: int

    class Config:
        orm_mode = True
