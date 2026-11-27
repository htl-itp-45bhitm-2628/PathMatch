# Backend (Java, Quarkus)

Hier kommt das Quarkus-Projekt hin (REST-API, Matching-Algorithmus, Anbindung an MySQL).

**Stand:** Nur die Ordnerstruktur. Das Quarkus-Projekt selbst (`pom.xml`, `application.properties`, Java-Klassen)
ist noch nicht angelegt.

## Geplante Pakete (`src/main/java/at/htl/pathmatch/`)

| Paket | Inhalt |
|---|---|
| `entity` | JPA-Entities (Tabellen) |
| `repository` | Datenzugriff (Panache-Repositories) |
| `dto` | Objekte, die die REST-API ein- und ausgibt |
| `service` | Geschäftslogik (Profil, Favoriten, Angebote, …) |
| `resource` | REST-Endpunkte |
| `matching` | Matching-Algorithmus (Profil gegen Angebote) |
| `importer` | Einlesen von Daten, z. B. die Schulliste aus `schulen_ooe.xml` |
| `security` | Registrierung, Login, E-Mail-Bestätigung |

Tests liegen unter `src/test/java/at/htl/pathmatch/` mit derselben Paketstruktur.

## Quarkus-Projekt anlegen

`quarkus create app` legt immer einen neuen Ordner an und bricht ab, wenn der Zielordner schon existiert.
Darum das Projekt in einem leeren Ordner generieren und den Inhalt danach hier hineinkopieren (die vorhandenen
Ordner bleiben dabei bestehen):

```bash
quarkus create app at.htl:pathmatch --extension=rest-jackson,hibernate-orm-panache,jdbc-mysql --output-directory=/tmp/pm
cp -R /tmp/pm/pathmatch/. backend/
```

Die Extensions und der Paketname (`at.htl.pathmatch`) sind ein Vorschlag und lassen sich ändern.
