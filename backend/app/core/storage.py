from pathlib import Path
from typing import Optional
from google.cloud.storage import Bucket, Client as GCSClient

from app.core import config

class Client:
    save_on_cloud: bool

    gcs_client: Optional[GCSClient]
    images_bucket: Optional[Bucket]

    local_directory: Optional[Path]

    def __init__(self) -> None:
        self.save_on_cloud = config.settings.ENVIRONMENT == "PRD"
        if (self.save_on_cloud):
            self.gcs_client = GCSClient(project=config.settings.GCP_PROJECT_ID)
            self.images_bucket = gcs_client.get_bucket(config.settings.GCP_BUCKET)
        else:
            self.local_directory = Path(__file__).resolve().parent.parent.parent
    
    def save_image(self, file):
        if (self.save_on_cloud):
            blob = self.images_bucket.blob(file)
            blob.upload_from_string(file)
