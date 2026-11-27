#!/bin/bash
# ./start-containers.sh         Datenbank, phpMyAdmin und Frontend
# ./start-containers.sh full    zusätzlich das Quarkus-Backend (muss in ./backend existieren)
cd "$(dirname "$0")"
if [ "$1" = "full" ]; then
  docker compose --profile full up -d --build
else
  docker compose up -d
fi
