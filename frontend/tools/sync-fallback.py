#!/usr/bin/env python3
"""Erzeugt dummySchulen-fallback.js aus dummySchulen.xml.

Warum? Öffnet man index.html per Doppelklick (file://), erlaubt der Browser kein fetch() auf
dummySchulen.xml. Dann nutzt der Prototyp diese eingebettete Kopie. Über einen lokalen Server
(z. B. `python3 -m http.server`) wird immer direkt dummySchulen.xml gelesen.

Nach jeder Änderung an dummySchulen.xml einmal ausführen:  python3 tools/sync-fallback.py
"""
import json
import pathlib
import xml.dom.minidom

root = pathlib.Path(__file__).resolve().parent.parent
xml_text = (root / "dummySchulen.xml").read_text(encoding="utf-8")
xml.dom.minidom.parseString(xml_text.encode("utf-8"))  # bricht mit Fehlermeldung ab, wenn das XML kaputt ist

out = (
    "/* AUTOMATISCH ERZEUGT aus dummySchulen.xml (python3 tools/sync-fallback.py). Nicht von Hand ändern.\n"
    "   Wird nur genutzt, wenn dummySchulen.xml nicht per fetch() geladen werden kann (Öffnen per Doppelklick). */\n"
    "window.PATHMATCH_SCHULEN_XML = " + json.dumps(xml_text, ensure_ascii=False) + ";\n"
)
(root / "dummySchulen-fallback.js").write_text(out, encoding="utf-8")
print("dummySchulen-fallback.js geschrieben (" + str(len(out)) + " Zeichen)")
