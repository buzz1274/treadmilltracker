from sqlalchemy import Select, Delete, Update
from sqlmodel import create_engine, Session

from app.core.config import Settings

from typing import Annotated

from fastapi import Depends


class Database:
    def __init__(self):
        self.session: Session = Session(
            create_engine(str(Settings().SQLALCHEMY_DATABASE_URI))
        )


class Repository:
    def __init__(self, database: Annotated[Database, Depends(Database)]):
        self.database = database

    def execute_query(self, query: Select | Delete | Update):
        return self.database.session.exec(
            query
        )  # ty: ignore[no-matching-overload]
