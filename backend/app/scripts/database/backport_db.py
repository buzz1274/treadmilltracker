import typer
from botocore.exceptions import ClientError
from app.core.config import settings
from mypy_boto3_s3 import S3Client
import boto3
import tempfile
import subprocess  # nosec
import os


class BackportDB:
    ENV_VARS = {"PGPASSWORD": settings.POSTGRES_PASSWORD}
    IMPORT_COMMAND = "psql " "-U{database_username} " "-h{database_host} "

    def __init__(self):
        self.s3_client: S3Client = self._initialize_s3_client()

    @staticmethod
    def backport_command():
        BackportDB().perform_backport()

    def perform_backport(self):
        try:
            if not settings.DEVELOPMENT:
                raise RuntimeError("Backports are disabled in production mode")

            with tempfile.TemporaryDirectory() as tmp_dir:
                file: dict = self._get_latest_backup_file()
                file_name: str = file["Key"].split("/")[-1]
                file_name: str = f"{tmp_dir}/{file_name}"

                self.s3_client.download_file(
                    settings.AWS_S3_BUCKET_NAME, file["Key"], file_name
                )

                if (
                    not os.path.isfile(file_name)
                    or not (file_stats := os.stat(file_name))
                    or not file_stats.st_size
                ):
                    raise FileNotFoundError

                import_command = self.IMPORT_COMMAND.format(
                    database_username=settings.POSTGRES_USER,
                    database_host=settings.POSTGRES_SERVER,
                ).split(" ")

                with open(file_name, "r") as backup_file:
                    subprocess.run(  # nosec
                        import_command, env=self.ENV_VARS, stdin=backup_file
                    )

        except (KeyError, IndexError, FileNotFoundError):
            raise RuntimeError("Failed to retrieve DB dump")
        except RuntimeError as e:
            raise e

    def _get_latest_backup_file(self) -> dict:
        files: dict = {}

        for file in self.s3_client.list_objects(
            Bucket=settings.AWS_S3_BUCKET_NAME
        )["Contents"]:
            if (
                f"{settings.AWS_S3_BACKUP_PATH}" in file["Key"]
                and ".sql" in file["Key"]
            ):
                files[file["LastModified"].strftime("%s")] = file

        file: dict = dict(sorted(files.items(), reverse=True))

        return file[list(file)[0]]

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
def backport_db():
    BackportDB.backport_command()
