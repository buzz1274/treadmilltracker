import os

if os.environ.get("ENVIRONMENT", "DEVELOPMENT").upper() == "DEVELOPMENT":
    from app.core.settings.development_settings import DevelopmentSettings as Settings
else:
    from app.core.settings.settings import Settings as Settings

settings = Settings()