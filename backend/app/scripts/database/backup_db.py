import typer
from botocore.exceptions import ClientError
from app.core.config import settings
import boto3
from mypy_boto3_s3 import S3Client
from datetime import datetime
import os
import subprocess  # nosec
import tempfile

app = typer.Typer()


class BackupDB:
    ENV_VARS = {"PGPASSWORD": settings.POSTGRES_PASSWORD}

    BACKUP_COMMAND = (
        "pg_dump --clean --inserts "
        "-U{database_username} "
        "-h{database_host}"
    )

    def __init__(self):
        self.s3_client: S3Client = self._initialize_s3_client()

    @staticmethod
    def backup_command():
        BackupDB().perform_backup()

    def perform_backup(self):
        """dump database to file and upload to S3"""
        try:
            if settings.DEVELOPMENT:
                raise RuntimeError("Backups are disabled in development mode")

            with tempfile.TemporaryDirectory() as tmp_dir:
                file_name = (
                    f"db_backup_{datetime.today().strftime('%Y-%m-%d')}.sql"
                )
                full_backup_path = f"/{tmp_dir}/{file_name}"

                self._dump_database(full_backup_path)
                self.s3_client.upload_file(
                    full_backup_path,
                    settings.AWS_S3_BUCKET_NAME,
                    f"{settings.AWS_S3_BACKUP_PATH}{file_name}",
                )
                self._clean_old_dumps()
        except ClientError:
            raise RuntimeError("Failed to upload DB dump to S3")
        except RuntimeError as e:
            raise e

    def _dump_database(self, full_backup_path: str) -> None:
        """dump database to file"""
        backup_command = self.BACKUP_COMMAND.format(
            database_username=settings.POSTGRES_USER,
            database_host=settings.POSTGRES_SERVER,
            full_backup_path=full_backup_path,
        ).split(" ")

        with open(full_backup_path, "w") as backup_file:
            subprocess.run(  # nosec
                backup_command, env=self.ENV_VARS, stdout=backup_file
            )

        if (
            not os.path.isfile(full_backup_path)
            or not (file_stats := os.stat(full_backup_path))
            or not file_stats.st_size
        ):
            raise RuntimeError("Failed to generate DB dump")

    def _clean_old_dumps(self) -> None:
        """clean old dumps from S3"""
        try:
            files = {}

            for file in self.s3_client.list_objects(
                Bucket=settings.AWS_S3_BUCKET_NAME
            )["Contents"]:
                if (
                    f"{settings.AWS_S3_BACKUP_PATH}" in file["Key"]
                    and ".sql" in file["Key"]
                ):
                    files[file["LastModified"].strftime("%s")] = file

            for i, file in enumerate(dict(sorted(files.items(), reverse=True))):
                if i > (settings.DAYS_BACKUPS_TO_KEEP - 1):
                    self.s3_client.delete_object(
                        Bucket=settings.AWS_S3_BUCKET_NAME,
                        Key=files[file]["Key"],
                    )
        except KeyError:
            raise RuntimeError("Failed to retrieve old backups")
        except (TypeError, ClientError):
            raise RuntimeError("Failed deleting old backup")

    def _initialize_s3_client(self) -> S3Client:
        """initialize boto S3 client"""
        try:
            return boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except ClientError:
            raise RuntimeError("Failed to connect to S3")


app = typer.Typer()


@app.command()
def backup_db():
    BackupDB.backup_command()
