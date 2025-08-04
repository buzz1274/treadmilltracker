#!/usr/bin/env sh

echo VITE_GOOGLE_OAUTH2_CLIENT_ID="$GOOGLE_OAUTH2_CLIENT_ID" > .env

if [ "$ENVIRONMENT" = "development" ] ; then
  npm run dev
else
  cd /opt/treadmilltracker_frontend_public/ && cp -r ../treadmilltracker.zz50.co.uk/dist .
  sleep infinity
fi