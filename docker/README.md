# Docker

Die Docker-Umgebung für PathMatch. Basis ist das PHP-Template vom letzten Jahr, umgebaut für Quarkus.
Die `docker-compose.yml`, `.env.example` und die Start-Skripte liegen im Projektordner (Root).

| Datei | Zweck |
|---|---|
| `mysql/init.sh` | Läuft beim ersten Start der Datenbank und führt `database/schema/*.sql` und danach `database/seed/*.sql` aus |
| `backend/Dockerfile` | Baut das Quarkus-Backend aus `backend/` und startet es |
| `backend/Dockerfile.dockerignore` | Eigene Ignore-Liste für den Backend-Build (siehe Kommentar in der Datei) |

## Starten

```bash
cp .env.example .env            # einmalig, Passwörter anpassen
./start-containers.sh           # Datenbank, phpMyAdmin, Frontend
./start-containers.sh full      # zusätzlich das Backend als Container (braucht das Quarkus-Projekt in backend/)
./shutdown-containers.sh        # alles stoppen
```

| Dienst | Adresse |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |
| phpMyAdmin | http://localhost:8081 (root / Passwort aus `.env`) |
| MySQL | `localhost:3306`, Datenbank `pathmatch` |

## Was gegenüber dem PHP-Template anders ist

- **Behalten:** MySQL und phpMyAdmin, die Start- und Stopp-Skripte.
- **Ersetzt:** Der PHP/Apache-Container mit Xdebug ist weg. Statt `htdocs/` liefert ein nginx-Container den Ordner `frontend/` aus.
  Das Backend ist ein eigener Container (Quarkus statt PHP), den Debugger macht jetzt Java auf Port 5005.
- **Neu:** Datenbank, Benutzer und Passwörter kommen aus `.env`. Die SQL-Skripte werden automatisch eingelesen.
  Der MySQL-Server nutzt `utf8mb4`, damit Umlaute in Schul- und Zweignamen stimmen. Die Version ist fest (`mysql:8.4`) statt `latest`.

## Arbeiten mit Quarkus

**Variante A: Backend lokal mit `quarkus dev` (zum Entwickeln empfohlen).** Live-Reload und Debugger funktionieren ohne Umweg.
Nur Datenbank und Frontend laufen in Docker (`./start-containers.sh`). Im Backend in `application.properties`:

```properties
quarkus.datasource.db-kind=mysql
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/pathmatch
quarkus.datasource.username=pathmatch
quarkus.datasource.password=pathmatch
quarkus.http.cors.enabled=true
quarkus.http.cors.origins=http://localhost:3000
```

**Variante B: alles in Docker** (`./start-containers.sh full`), z. B. zum Testen des Gesamtsystems. Hier setzt die
`docker-compose.yml` die Datenbank-Verbindung über Umgebungsvariablen. Nach jeder Code-Änderung muss neu gebaut werden.

**Debuggen:** Bei `quarkus dev` lauscht der Debugger automatisch auf Port 5005, im Container ebenfalls.
In VS Code oder IntelliJ eine "Remote JVM Debug"- bzw. "Attach"-Konfiguration auf `localhost:5005` anlegen.

## Datenbank neu aufsetzen

Die SQL-Skripte laufen nur beim allerersten Start. Nach Änderungen an `database/schema` oder `database/seed`:

```bash
docker compose down -v          # löscht auch alle Daten in der Datenbank
./start-containers.sh
```

## Noch nicht getestet

Die Compose-Datei ist auf Syntaxfehler geprüft und das `init.sh` mit einem Platzhalter für `mysql` durchgespielt.
Die Container selbst wurden noch nicht gestartet, und das Backend-Dockerfile geht davon aus, dass `backend/` ein
Quarkus-Projekt mit Maven (`pom.xml`) und Java 21 ist.
