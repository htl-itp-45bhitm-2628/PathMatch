# Datenbank (MySQL)

Alles rund um die Datenbank: Tabellen-Definitionen und Daten zum Befüllen.

**Stand:** Nur die Ordnerstruktur, noch keine SQL-Dateien.

| Ordner | Inhalt |
|---|---|
| `schema/` | Tabellen (SQL, nummeriert nach Ausführungsreihenfolge, z. B. `01_schule.sql`) |
| `seed/` | Dummy-Daten für die Entwicklung und später die echten Daten (Schulen, Angebote, Umfrage-Daten) |

## Mögliche Tabellen (Vorschlag, abgeleitet aus der Feature-Liste)

`benutzer`, `profil`, `schule`, `zweig`, `thema`, `kenntnis`, `note`, `zeugnis`, `angebot`, `favorit`, `meldung`

## Schulliste

Die Schulen stehen aktuell als XML im Prototyp (`frontend/data/schulen_ooe.xml`).
Später importiert sie das Backend (Paket `importer`) in die Tabellen `schule` und `zweig`.

## Wie die Skripte in die Datenbank kommen

Noch offen: Entweder werden `schema/` und `seed/` beim ersten Start in den MySQL-Docker-Container gemountet
(`/docker-entrypoint-initdb.d`), oder Quarkus führt sie über Flyway aus. Das entscheidet ihr im Team.
