#!/usr/bin/env bash

alembic upgrade head

if [ "$ENVIRONMENT" == "development" ] ; then
  uvicorn app.main:app --host=0.0.0.0 --port=8001 --reload --log-level=debug
else
  uvicorn app.main:app --host=0.0.0.0 --port=8001 --log-level=warning
fi
