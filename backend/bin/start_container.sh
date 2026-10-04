#!/usr/bin/env bash
set -euo pipefail

alembic upgrade head

if [ "$ENVIRONMENT" == "development" ] ; then
  exec uvicorn app.main:app --host=0.0.0.0 --port=8001 --reload --log-level=debug
else
  exec uvicorn app.main:app --host=0.0.0.0 --port=8001 --log-level=warning
fi
