#!/usr/bin/env bash

ACTION=$1

if [ "$ACTION" == "alembic-upgrade" ]; then
  docker exec -it treadmilltracker-backend bash -c "alembic upgrade head"
elif [ "$ACTION" == "alembic-autogenerate" ]; then
  docker exec -it treadmilltracker-backend bash -c "alembic revision --autogenerate"
elif [ "$ACTION" == "eslint" ]; then
  docker exec -it treadmilltracker-frontend sh -c "./bin/eslint.sh"
fi
