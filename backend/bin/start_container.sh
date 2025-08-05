#!/usr/bin/env bash

if [ "$ENVIRONMENT" == "development" ] ; then
  uvicorn main:app --host=0.0.0.0 --port=8001 --reload --log-level=debug
else
  uvicorn main:app --host=0.0.0.0 --port=8001 --log-level=warning
fi