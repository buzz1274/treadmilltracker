from app.api.runs.models import Run
from app.api.user.models import User
from sqlmodel import Session, select
from app.core.database import db_connection
import csv


def get_user(session: Session, email: str, full_name: str):
    user = session.exec(select(User).where(User.email == email)).first()

    if not user:
        user = User(email=email, full_name=full_name)
        session.add(user)
        session.commit()
        session.refresh(user)

    return user


def import_runs(session: Session, user: User):
    def convert_time_to_seconds(time):
        hours, minutes, seconds = time.split(":")
        return int(hours) * 3600 + int(minutes) * 60 + int(seconds)

    with open("runs.csv", mode="r", newline="", encoding="utf-8") as file:
        csv_reader = csv.reader(file)
        next(csv_reader)

        for row in csv_reader:
            run = Run(
                run_date=row[0],
                user=user,
                distance_m=row[2],
                duration_s=convert_time_to_seconds(row[3]),
                calories=row[5],
                vo2max=row[4],
            )

            session.add(run)

        session.commit()


with db_connection() as session:
    user = get_user(session, "david@sulaco.co.uk", full_name="David Exelby")

    import_runs(session, user)
