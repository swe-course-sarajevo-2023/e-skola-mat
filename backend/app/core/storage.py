import io
from pathlib import Path
from typing import Optional
from uuid import uuid4
from fastapi import UploadFile
from google.cloud.storage import Bucket, Client as GCSClient

from app.core import config

class Client:
    save_on_cloud: bool

    gcs_client: Optional[GCSClient]
    images_bucket: Optional[Bucket]

    local_directory: Optional[Path]

    def __init__(self) -> None:
        self.save_on_cloud = True
        if (self.save_on_cloud):
            self.gcs_client = GCSClient(project=config.settings.GCP_PROJECT_ID)
            self.images_bucket = self.gcs_client.get_bucket(config.settings.GCP_BUCKET)
        else:
            self.local_directory = Path(__file__).resolve().parent.parent.parent
    
    def save_image(self, file: UploadFile):
        if (self.save_on_cloud):
            blob = self.images_bucket.blob(str(uuid4()))
            blob.upload_from_file(file.file)
            return blob.name
        else:
            unique_filename = str(uuid4())
            file_path = self.local_directory / (unique_filename + file.filename)
            with file_path.open("wb") as buffer:
                buffer.write(file.read())
    
    async def get_image(self, filename):
        if (self.save_on_cloud):
            file_stream = io.BytesIO()
            blob = self.images_bucket.blob(filename)
            blob.download_to_file(file_stream)
            file_stream.seek(0)
            return file_stream