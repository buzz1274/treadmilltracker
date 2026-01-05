from sqlalchemy import select, delete

from app.api.user.models import User
from app.api.runs.models import Run
from app.api.runs.repository import RunsRepository
from app.core.database import Database
import csv


def convert_time_to_seconds(time):
    hours, minutes, seconds = time.split(":")
    return int(hours) * 3600 + int(minutes) * 60 + int(seconds)


with open("runs.csv", mode="r", newline="", encoding="utf-8") as file:
    repository = RunsRepository(Database())
    csv_reader = csv.reader(file)
    user = repository.execute_query(
        select(User).where(
            User.email
            == "david@sulaco.co.uk"  # ty: ignore[invalid-argument-type]
        )
    ).first()[0]

    next(csv_reader)
    repository.execute_query(delete(Run))

    for row in csv_reader:
        run = Run(
            run_date=row[0],
            user=user,
            distance_m=row[2],
            duration_s=convert_time_to_seconds(row[3]),
            calories=row[5],
            vo2max=row[4],
        )

        repository.database.session.add(run)

    repository.database.session.commit()
