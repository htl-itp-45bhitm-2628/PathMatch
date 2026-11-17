# PathMatch Click-Dummy

## Schulen austauschen (dummySchulen.xml)

Die Schulen stehen in `dummySchulen.xml` und werden beim Start eingelesen. Zum Austauschen mit den echten Daten
reicht es, die `<Schuldaten>`-Blöcke zu ersetzen. Der Aufbau und alle Felder sind oben in der Datei erklärt.

- **Pflicht:** `SKZ` (eindeutig), `Schule`, `Schultyp`. Alles andere ist optional.
- **Zweige fehlen noch?** Kein Problem. Ohne `<Zweige>` bleibt das Feld "Zweig" leer und die Schulstufen
  kommen aus einem Standard je Schultyp (`STUFEN_BY_TYPE` in `script.js`, z. B. HTL 9 bis 13, AHS 5 bis 12).
- **Zweige mit Themengebieten:** pro `<Zweig>` kann man `<SchulstufeVon>`, `<SchulstufeBis>` und
  `<Themengebiete>` angeben. Die Themengebiete werden bei "Kenntnisse" zuerst vorgeschlagen.
- Die vorausgewählte Beispiel-Schule steht in `DEFAULT_PICK` (`script.js`). Gibt es diese SKZ nicht mehr,
  startet die Schulauswahl einfach leer.

## Pflichtschule

Die Schulpflicht dauert 9 Schuljahre. Der Prototyp leitet "Pflichtschule abgeschlossen" aus der Schulstufe ab
(ab der 10. Schulstufe: ja, sonst nein) und zeigt nur dazu passende Abschlüsse an. Die Regeln stehen in
`compulsoryInfo()` und `degreeChoices()` in `script.js`.

## Öffnen

- **Mit lokalem Server (empfohlen):** im Ordner `python3 -m http.server`, dann http://localhost:8000 öffnen.
  Dann wird immer direkt `dummySchulen.xml` gelesen. (In VS Code geht auch "Live Server".)
- **Per Doppelklick auf `index.html`:** Der Browser erlaubt dann kein Laden der XML-Datei. Der Prototyp nutzt
  stattdessen die Kopie in `dummySchulen-fallback.js`. Nach jeder Änderung an `dummySchulen.xml` diese Kopie neu erzeugen:

      python3 tools/sync-fallback.py
