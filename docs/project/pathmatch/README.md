# PathMatch Click-Dummy

## Schulliste (Ordner `data`)

| Datei | Inhalt |
|---|---|
| `data/schulen_ooe.xml` | Echte Liste (Oberösterreich). **Wird aktuell verwendet.** |
| `data/dummySchulen.xml` | 10 erfundene Beispiel-Schulen. Hier ist der Aufbau der XML-Datei ausführlich erklärt. |
| `data/schulen-fallback.js` | Automatisch erzeugte Kopie der aktiven Liste, nur fürs Öffnen per Doppelklick (siehe unten). |

Welche Liste gilt, steht in `script.js` bei `SCHOOLS_URL`. Zum Umstellen (z. B. zurück auf die Dummy-Liste):

1. `SCHOOLS_URL` ändern, z. B. auf `'data/dummySchulen.xml'`.
2. `DEFAULT_PICK` (vorausgewählte Beispiel-Schule) passend setzen. Für die Dummy-Liste steht ein Hinweis daneben.
3. `python3 tools/sync-fallback.py` ausführen.

Eine neue Liste einzuspielen heißt: Datei in `data` legen, `SCHOOLS_URL` darauf zeigen lassen, Schritt 3.

- **Pflicht pro Schule:** `SKZ` (eindeutig), `Schule`, `Schultyp`. Alles andere ist optional.
- **Zweige:** Pro `<Zweig>` gibt es `<Bezeichnung>`, `<SchulstufeVon>`, `<SchulstufeBis>` und `<Themengebiete>`.
  Fehlen die Schulstufen (oder die ganzen Zweige), gilt ein Standard je Schultyp (`STUFEN_BY_TYPE` in `script.js`).
- **Themengebiete** werden bei "Kenntnisse" zuerst vorgeschlagen.
- Gibt es die SKZ aus `DEFAULT_PICK` in der Liste nicht, startet die Schulauswahl einfach leer.

## Pflichtschule

Die Schulpflicht dauert 9 Schuljahre. Der Prototyp leitet "Pflichtschule abgeschlossen" aus der Schulstufe ab
(ab der 10. Schulstufe: ja, sonst nein) und zeigt nur dazu passende Abschlüsse an. Die Regeln stehen in
`compulsoryInfo()` und `degreeChoices()` in `script.js`.

## Öffnen

- **Mit lokalem Server (empfohlen):** im Ordner `python3 -m http.server`, dann http://localhost:8000 öffnen.
  Dann wird immer direkt die XML-Datei gelesen. (In VS Code geht auch "Live Server".)
- **Per Doppelklick auf `index.html`:** Der Browser erlaubt dann kein Laden der XML-Datei. Der Prototyp nutzt
  stattdessen `data/schulen-fallback.js`. Nach jeder Änderung an der Schulliste diese Kopie neu erzeugen:
  `python3 tools/sync-fallback.py`
