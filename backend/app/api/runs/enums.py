from enum import Enum


class Interval(str, Enum):
    days = "days"
    weeks = "weeks"
    months = "months"
    years = "years"


class PersonalBestType(str, Enum):
    DISTANCE = "distance"
    DURATION = "duration"
    SPEED = "speed"
