#!/bin/bash
# Stoppt alle Container (die Daten in der Datenbank bleiben erhalten).
# Datenbank komplett zurücksetzen (löscht alle Daten): docker compose down -v
cd "$(dirname "$0")"
docker compose --profile full down
