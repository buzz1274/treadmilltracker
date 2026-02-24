from app.core.settings.settings import Settings


class DevelopmentSettings(Settings):
    DEVELOPMENT: bool = True
    CORS_ORIGINS: list[str] = ["https://dev.treadmilltracker.zz50.co.uk:5124"]
    SESSION_SAME_SITE: str = "lax"

    SQL_ALCHEMY_ECHO: bool = False
