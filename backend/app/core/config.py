from pydantic import PostgresDsn, computed_field
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "TreadmillTracker"
    API_V1_STR: str = "/api/v1"

    POSTGRES_SERVER: str = os.environ.get("DB_HOST")
    POSTGRES_PORT: int = int(os.environ.get("POSTGRES_PORT", 5432))
    POSTGRES_USER: str = os.environ.get("DB_USERNAME")
    POSTGRES_PASSWORD: str = os.environ.get("DB_PASSWORD")
    POSTGRES_DB: str = os.environ.get("DB_NAME")

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )
