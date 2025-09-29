from sqlmodel import create_engine, Session
from app.core.config import Settings
from contextlib import contextmanager


@contextmanager
def db_connection():
    engine = create_engine(str(Settings().SQLALCHEMY_DATABASE_URI))

    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()
