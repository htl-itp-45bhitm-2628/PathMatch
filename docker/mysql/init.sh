#!/bin/bash
# Läuft nur beim allerersten Start des MySQL-Containers (wenn das Volume noch leer ist).
# Führt zuerst alle .sql-Dateien aus database/schema aus (Tabellen), danach database/seed (Daten),
# jeweils in alphabetischer Reihenfolge, deshalb die Dateien nummerieren: 01_schule.sql, 02_zweig.sql, ...
# Neu einlesen: docker compose down -v (löscht auch die Daten!) und wieder starten.
set -e

for dir in /sql/schema /sql/seed; do
  for file in "$dir"/*.sql; do
    [ -e "$file" ] || continue
    echo "init.sh: führe $file aus"
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < "$file"
  done
done
