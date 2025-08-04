#!/usr/bin/env bash

if [ "$ENVIRONMENT" == "development" ] ; then
  uvicorn main:app --host 0.0.0.0:8000 --reload --log-level debug
else
  uvicorn main:app --log-level=debug
fi