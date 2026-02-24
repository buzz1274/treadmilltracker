import typer
from botocore.exceptions import ClientError
from app.core.config import settings
import boto3


class BackportDB:
    def __init__(self):
        try:
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except ClientError:
            raise RuntimeError("Failed to connect to S3")

    def backport_db(self):
        print("Backporting database")


app = typer.Typer()


@app.command()
def backport_db():
    BackportDB().backport_db()
