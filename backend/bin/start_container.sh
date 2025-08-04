#!/usr/bin/env bash

if [ "$ENVIRONMENT" == "development" ] ; then
  uvicorn main:app --host 0.0.0.0 --reload --log-level debug
else
  sleep infinity
fi