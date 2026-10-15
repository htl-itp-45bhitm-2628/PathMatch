# PathMatch – Prompt Log (UI/UX Click Dummy, Figma Make)

Target: Desktop 1440×900 · Team: Laurent Mc Neall, David Lachner, Julian Forster
Usage: run prompts in order, one at a time. Attach moodboard + wireframes to Prompt 0. Log results below each prompt.

---

## Prompt 0 – Context & Design System

```
Build a clickable desktop prototype (1440x900) for "PathMatch".

App: helps Austrian students (14+) close to graduation find matching study programs, apprenticeships, internships, jobs. Flow: sign up -> school data -> skills (sliders) + interests (chips + free text) -> matched results -> favorite + categorize.

Tech (strict):
- Plain HTML, CSS, vanilla JS only. No React, Tailwind, frameworks, libraries, backend, DB.
- Hardcoded sample data. Nothing persists (localStorage allowed for favorites).
- Login/signup = UI only; buttons just navigate.
- Files: index.html, signup-1.html, signup-2.html, signup-3.html, results.html, favorites.html, style.css, script.js.

Design system (strict, no other colors/fonts):
- --navy #244B68: headings, logo, nav, key text
- --blue #478DFF: primary buttons, active states, links, sliders, highlights
- --light-blue #A8C7FA: secondary buttons, selected chips, accent tints
- --grey #C4C7C5: borders, dividers, placeholders, input fill at 25% opacity
- --white #FFFFFF: page bg, cards
- --black #000000: body text
- Headings: Fira Sans Bold/ExtraBold, navy. Body/labels/buttons: Sansation.
- Logo: round light-blue icon with navy curved path symbol + "PathMatch" ("Path" regular, "Match" bold), navy.
- Radius: inputs/cards 12px, buttons pill. Soft subtle shadows. 8px spacing grid. Lots of whitespace.
- Style: clean, calm, friendly, youthful but not childish. Big headings with one keyword in --blue. No emojis.
- UI language: German, informal "du".

Do not add features, pages or elements not specified. No chat, video, social feed, ads.

This step: create style.css (variables, fonts, components: primary/secondary button, input, select, checkbox, radio, chip, slider, card, modal) and a component overview page.
```

**Result / changes:** _…_

---

## Prompt 1 – Landing + Login Overlay

```
Create index.html using the design system.

Header: logo left; right "Anmelden" (secondary), "Konto erstellen" (primary -> signup-1).

Hero (left-aligned):
- H1: "Finde deinen nächsten Schritt nach der Schule." ("Schritt" in --blue)
- Sub: "Gib an, was du kannst und was dich interessiert – PathMatch zeigt dir passende Studien, Lehrstellen, Praktika und Jobs."
- Primary "Jetzt starten" -> signup-1.
- Right: preview card "Software Engineering – FH OÖ Hagenberg · 92 % Match".

Section "So funktioniert's", 3 cards:
1. "Profil anlegen" – Schule, Schulstufe, Zweig angeben.
2. "Kenntnisse & Interessen" – Skills per Slider, Interessen beschreiben.
3. "Passende Ergebnisse" – ansehen, favorisieren, ordnen.

Login modal (on "Anmelden"): dimmed backdrop, centered. Logo, "Willkommen zurück", fields "E-Mail", "Passwort", link "Passwort vergessen?", primary "Anmelden" -> results.html, "Noch kein Konto? Konto erstellen". X closes.
```

**Result / changes:** _…_

---

## Prompt 2 – Signup Step 1: Personal & School

```
Create signup-1.html.

Top: logo + progress bar "Schritt 1 von 3" (--blue on --grey).
Centered card ~560px, H1 "Erzähl uns von dir".

Fields (in order):
1. E-Mail*
2. Passwort*
3. Vorname*, Nachname* (side by side)
4. "Abschluss": checkbox "Pflichtschule abgeschlossen". Only if checked, show select "Höchster Abschluss": Pflichtschule, Lehrabschluss, Matura, Berufsreifeprüfung.
5. "Deine aktuelle Schule":
   - Select "Welche Schule besuchst du gerade?"*: HTL Leonding, HTL Linz Paul-Hahn-Straße, BG/BRG Linz Khevenhüllerstraße, HAK Linz, BORG Linz
   - Select "Zweig": Informatik, Medientechnik, Elektronik, Medizintechnik
   - Select "Schulstufe": 9.–13.
   - Select "Schuljahr": 1.–5. Jahrgang

Bottom right: primary "Weiter →" -> signup-2.
Validation (JS): empty required field -> red border + "Bitte ausfüllen".
Prefill: Laura Berger, laura.berger@schule.at, HTL Leonding, Informatik, 13. Schulstufe, 5. Jahrgang.
No extra fields.
```

**Result / changes:** _…_

---

## Prompt 3 – Signup Step 2: After School

```
Create signup-2.html, same layout as step 1, "Schritt 2 von 3".

H1: "Was möchtest du nach der Schule machen?" ("nach der Schule" in --blue)

3 selectable cards in a row (single choice), navy line icon + short text:
- "Studieren" – Uni oder FH
- "Arbeiten" – Lehre, Praktikum oder Job
- "Ich weiß es noch nicht" – zeig mir beides
Selected: --blue border, light --light-blue fill.

Below:
- Input "Bevorzugter Standort" (prefill Linz) + select "Umkreis": 10 km, 25 km, 50 km, ganz Österreich
- Input "Verfügbar ab" (month/year, prefill Juli 2027)

Bottom: "← Zurück" (text) -> signup-1, primary "Weiter →" -> signup-3.
```

**Result / changes:** _…_

---

## Prompt 4 – Signup Step 3: Skills & Interests

```
Create signup-3.html, same layout, "Schritt 3 von 3".

H1 (Fira Sans ExtraBold): "Was sind deine Interessen und Kenntnisse?" ("Interessen" in --blue)

A) Pill select "Themengebiet auswählen" (--light-blue bg, navy text): Programmieren, Design & Medien, Elektronik & Technik, Wirtschaft, Naturwissenschaften, Sprachen. Default: Programmieren. Switching swaps the chips below (use fitting sample chips per topic).

B) Skills (Programmieren):
- Label: "Mit welchen Programmiersprachen hast du bereits gearbeitet?"
- 3-col chip grid on light-blue panel: Java, C++, C#, Android, Swift, Python, Rust, Go, Andere. Multi-select; selected = --blue bg, white text.
- Per selected chip: row "Wie gut bist du in [X]?" + slider 1–10 + value display.
- Preselected: Java 8, Python 6, C# 5.

C) Textarea "Was interessiert dich sonst noch?", placeholder: "z. B. Ich baue gern kleine Spiele, interessiere mich für Datenschutz und würde gern im Ausland studieren …"
Hint (small, navy): "Dein Text wird ausgewertet, um bessere Vorschläge zu finden. Freiwillig."

Bottom: "← Zurück" -> signup-2, primary "Ergebnisse anzeigen →" -> results.
```

**Result / changes:** _…_

---

## Prompt 5 – Results (Matching)

```
Create results.html (core screen).

App header (all logged-in pages): logo left; nav "Ergebnisse" (active), "Favoriten" center; right avatar "LB" + "Abmelden" -> index.

Content:
- H1 "Deine Matches, Laura" ("Matches" in --blue), sub "6 Vorschläge passend zu deinem Profil".
- Left sidebar 280px, filters: Art (Studium, Lehre, Praktikum, Job), Fachbereich (Informatik, Medien, Technik, Wirtschaft) as checkboxes; select Umkreis; button "Filter zurücksetzen".
- Main: search "Nach Beruf, Studium oder Stichwort suchen" + select "Sortieren": Beste Übereinstimmung, Neueste, Entfernung. Then card list (1 per row).

Result card:
- Left: circular match % in --blue.
- Title (Fira Sans, navy), provider + city, type chip (light-blue).
- Line: "Passt, weil: Java 8/10 · Interesse an Spieleentwicklung · Zweig Informatik"
- Small grey: "Zuletzt aktualisiert: 02.10.2026"
- Right: heart toggle (outline -> filled --blue), text button "Details".
- "Details" expands: "Das erfüllst du bereits" (checkmarks), "Das könnte noch fehlen" (info icons), link "Zur Bewerbung" (no action), small grey note "Ein Match ist keine Zusage für einen Platz."

Sample data:
1. Software Engineering (Bachelor) – FH OÖ Campus Hagenberg – 92% – Studium
2. Informatik (Bachelor) – JKU Linz – 88% – Studium
3. Praktikum Softwareentwicklung (Java) – Nordlicht Software GmbH, Linz – 85% – Praktikum
4. Medieninformatik und Visual Computing (Bachelor) – TU Wien – 79% – Studium
5. Lehre Applikationsentwicklung – Coding – Donaupixel IT GmbH, Wels – 74% – Lehre
6. Junior Data Analyst (Teilzeit) – Alpenwert Analytics, Linz – 68% – Job

JS: filter, search, sort on sample data. Hearts saved to localStorage.
Empty state: "Keine Treffer mit diesen Filtern. Versuch es mit weniger Einschränkungen." + "Filter zurücksetzen".
```

**Result / changes:** _…_

---

## Prompt 6 – Favorites & Categories

```
Create favorites.html, same app header ("Favoriten" active).

- H1 "Deine Favoriten" ("Favoriten" in --blue).
- Category pills: "Alle", "Studium", "Arbeit", "Später ansehen", "+ Kategorie". Active = --blue/white, inactive = --light-blue/navy.
- "+ Kategorie" opens modal: input "Name der Kategorie", button "Erstellen" -> adds pill (session only).
- 2-col compact cards: match %, title, provider, city, type chip, select "Kategorie" (all categories incl. custom), filled heart.
- Heart click -> confirm modal "Aus Favoriten entfernen?" ("Abbrechen" / "Entfernen") -> card removed.
- Load favorites from localStorage (hearted on results). Default if empty storage: Software Engineering (Studium), Informatik JKU (Studium), Praktikum Nordlicht (Arbeit), Lehre Donaupixel (Später ansehen).
- Empty category: "Hier ist noch nichts. Markiere Vorschläge auf der Ergebnisseite mit dem Herz." + button "Zu den Ergebnissen".
```

**Result / changes:** _…_

---

## Prompt 7 – Linking & Polish

```
Review the whole prototype. Fix without adding pages or features:
1. Flow works: index -> signup-1 -> 2 -> 3 -> results <-> favorites -> Abmelden -> index. Also index -> login modal -> results. "Zurück" goes one step back.
2. Only design-system colors and fonts. Replace any others with CSS variables.
3. Consistent spacing, button sizes, radii, shadows across pages.
4. All controls keyboard-accessible with visible --blue focus ring.
5. Sufficient contrast: no light text on --light-blue, no --grey text for important content.
6. Code stays plain HTML/CSS/vanilla JS.
```

**Result / changes:** _…_

---

## Fix Prompts (if needed)

**Framework used:**
```
Rewrite as plain HTML/CSS/vanilla JS using the file structure from Prompt 0. No React/Tailwind/build tools. Keep look and behavior.
```

**Off-system colors/fonts:**
```
[Page] uses colors/fonts outside the design system. Replace with style.css variables, Fira Sans and Sansation only.
```

**Unrequested elements:**
```
Remove [element]. Not requested. Stick to the spec.
```

**Too playful:**
```
Too playful for 14+ users. Calmer and more mature: fewer icons, no emojis, more whitespace, accent color sparingly.
```
