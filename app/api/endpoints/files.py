from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import ProblemUserHomeworkImage, User
from app.schemas.requests import UserCreateRequest, UserUpdatePasswordRequest
from app.schemas.responses import UserResponse

from fastapi.responses import FileResponse
import shutil
from pathlib import Path
import os


router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent  
IMAGES_DIR = BASE_DIR / "images"

@router.post("/upload/")
async def upload_file(file: UploadFile, db: AsyncSession = Depends(deps.get_session)):
    file_path = IMAGES_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())
    new_image = ProblemUserHomeworkImage(image_path=str(file_path))
    db.add(new_image)
    await db.commit()
    return {"image_id": str(new_image.id), "filename": file.filename}

@router.get("/images/{image_id}")
async def read_image(image_id: str, db: AsyncSession = Depends(deps.get_session)):
    image = await db.execute(select(ProblemUserHomeworkImage).where(ProblemUserHomeworkImage.id == image_id))
    image = image.scalar_one_or_none()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(Path(image.image_path))

@router.delete("/images/{image_id}")
async def delete_image(image_id: str, db: AsyncSession = Depends(deps.get_session)):
    image = await db.execute(select(ProblemUserHomeworkImage).where(ProblemUserHomeworkImage.id == image_id))
    image = image.scalar_one_or_none()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    await db.execute(delete(ProblemUserHomeworkImage).where(ProblemUserHomeworkImage.id == image_id))
    await db.commit()
    file_path = Path(image.image_path)
    if file_path.exists():
        file_path.unlink()
    return {"detail": "Image deleted successfully"}
