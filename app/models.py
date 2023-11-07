"""
SQL Alchemy models declaration.
https://docs.sqlalchemy.org/en/14/orm/declarative_styles.html#example-two-dataclasses-with-declarative-table
Dataclass style for powerful autocompletion support.

https://alembic.sqlalchemy.org/en/latest/tutorial.html
Note, it is used by alembic migrations logic, see `alembic/env.py`

Alembic shortcuts:
# create migration
alembic revision --autogenerate -m "migration_name"

# apply all migrations
alembic upgrade head
"""
import uuid

from sqlalchemy import TIMESTAMP, DateTime, String, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass

class Role(Base):
    __tablename__ = "roles"
    
    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    role = mapped_column(String, nullable=True)

class User(Base):
    __tablename__ = "user_model"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(
        String(254), nullable=False, unique=True, index=True    
    )
    name = mapped_column(String(100), nullable=True)
    surname = mapped_column(String(100), nullable=True)
    username = mapped_column(String(100), nullable=True)
    role_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey('roles.id'), nullable=True)  # Foreign Key to Role table
    Role: Mapped[Role] = relationship("Role", backref="users")  # ORM-level relationship with Mapped type annotation
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)

class Homework(Base):
    __tablename__ = "homework"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    name = mapped_column(String(100), nullable=True)
    dateOfCreation = mapped_column(TIMESTAMP, nullable=True)
    deadline =  mapped_column(TIMESTAMP, nullable=True)
    maxNumbersOfProblems =  mapped_column(Integer, nullable=True)

class Class(Base):
    __tablename__ = "class"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    name = mapped_column(String(100), nullable=True)
    
class ClassHomework(Base):
    __tablename__ = "classHomework"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    class_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('class.id'), nullable=True
    )
    homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('homework.id'), nullable=True
    )
    Class: Mapped[Class] = relationship("Class", backref="class_homeworks")
    Homework: Mapped[Homework] = relationship("Homework", backref="class_homeworks")
    
class HomeworkUser(Base):
    __tablename__ = "homework-user"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('user_model.id'), nullable=True
    )
    homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('homework.id'), nullable=True
    )
    grade: Mapped[Integer] = mapped_column(
        Integer, nullable=True
    )
    note: Mapped[String] = mapped_column(
        String(255), nullable=True
    )

    User: Mapped[User] = relationship("User", backref="homework_users")
    Homework: Mapped[Homework] = relationship("Homework", backref="homework_users")

class ProblemUserHomework(Base):
    __tablename__ = "problem-user-homework"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('user_model.id'), nullable=True
    )
    homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('homework.id'), nullable=True
    )
    order_number_of_the_task: Mapped[Integer] = mapped_column(
        Integer, nullable=True
    )
    commentTeacher: Mapped[String] = mapped_column(
        String(255), nullable=True
    )
    commentStudent: Mapped[String] = mapped_column(
        String(255), nullable=True
    )
    User: Mapped[User] = relationship("User", backref="problem_user_homeworks")
    Homework: Mapped[Homework] = relationship("Homework", backref="problem_user_homeworks")

class Image(Base):
    __tablename__ = "images"

    id = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    filename = mapped_column(String, nullable=False)
    file_path = mapped_column(String, nullable=False)
    created_at = mapped_column(DateTime(timezone=True), server_default=func.now())

class ProblemUserHomeworkImage(Base):
    __tablename__ = "problem-user-homework-image"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    problem_user_homework_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('problem-user-homework.id'), nullable=True
    )
    image_id = mapped_column(UUID(as_uuid=True), ForeignKey('images.id'), nullable=True)
    comment_teacher: Mapped[str] = mapped_column(
        String(255), nullable=True
    )
    comment_student: Mapped[str] = mapped_column(
        String(255), nullable=True
    )

    # Relationship to the ProblemUserHomework model
    ProblemUserHomework: Mapped[ProblemUserHomework] = relationship(
        "ProblemUserHomework", backref="images"
    )
class UserClass(Base):
    __tablename__ = "user-class"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )    
    class_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('class.id'), nullable=True
    )
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey('user_model.id'), nullable=True
    )
    
    # Relationships to the Class and User models
    Class: Mapped[Class] = relationship("Class", backref="class_users")
    User: Mapped[User] = relationship("User", backref="class_users")

   