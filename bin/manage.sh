#!/usr/bin/env bash

ACTION=$1

if [ "$ACTION" == "alembic-upgrade" ]; then
  docker exec -it treadmilltracker-backend bash -c "alembic upgrade head"
elif [ "$ACTION" == "alembic-autogenerate" ]; then
  docker exec -it treadmilltracker-backend bash -c "alembic revision --autogenerate"
elif [ "$ACTION" == "backport-db" ]; then
  docker exec -it treadmilltracker-backend bash -c "python -m app.scripts.main database backport-db"
elif [ "$ACTION" == "eslint" ]; then
  docker exec -it treadmilltracker-frontend sh -c "./bin/eslint.sh"
elif [ "$ACTION" == "ty" ]; then
  docker exec -it treadmilltracker-backend sh -c "./bin/ty.sh"
fi
