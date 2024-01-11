import io
from pathlib import Path
from typing import Optional
from uuid import uuid4

from fastapi import UploadFile
from google.cloud.storage import Bucket
from google.cloud.storage import Client as GCSClient

from app.core import config


class Client:
    save_on_cloud: bool

    gcs_client: Optional[GCSClient]
    images_bucket: Optional[Bucket]

    local_directory: Optional[Path]

    @classmethod
    def from_google_project(
        cls,
        project=config.settings.GCP_PROJECT_ID,
        bucket_name=config.settings.GCP_BUCKET,
    ):
        gcs_client = GCSClient(project=config.settings.GCP_PROJECT_ID)
        images_bucket = gcs_client.get_bucket(config.settings.GCP_BUCKET)
        return cls(gcs_client=gcs_client, images_bucket=images_bucket)

    def __init__(
        self,
        save_on_cloud=True,
        gcs_client=None,
        images_bucket=None,
        local_directory=None,
    ) -> None:
        self.save_on_cloud = save_on_cloud
        if self.save_on_cloud:
            self.gcs_client = gcs_client
            self.images_bucket = images_bucket
        else:
            self.local_directory = local_directory

    def save_image(self, file: UploadFile):
        if (self.save_on_cloud):
            blob = self.images_bucket.blob(str(uuid4()) + "_" + file.filename)
            blob.upload_from_file(file.file)
            return (blob.public_url, blob.name)
        else:
            unique_filename = str(uuid4())
            file_path = self.local_directory / (unique_filename + file.filename)
            with file_path.open("wb") as buffer:
                buffer.write(file.read())

    async def get_image(self, filename):
        if self.save_on_cloud:
            file_stream = io.BytesIO()
            blob = self.images_bucket.blob(filename)
            blob.download_to_file(file_stream)
            file_stream.seek(0)
            return file_stream


def get_storage_client():
    return Client.from_google_project()
