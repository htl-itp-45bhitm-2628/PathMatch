/* PathMatch – Click-Dummy
   Reines Vanilla-JS. Alle Daten sind Beispieldaten, es gibt kein Backend.
   Favoriten und Kategorien werden nur im Browser (localStorage) gemerkt. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var icon = function (id, cls) { return '<svg class="i ' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  var has = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };

  /* ---------- Speicher (fällt still auf Arbeitsspeicher zurück) ---------- */
  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem('pathmatch.' + k); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem('pathmatch.' + k, JSON.stringify(v)); } catch (e) { /* ignorieren */ }
    },
    clear: function () {
      try { localStorage.removeItem('pathmatch.favs'); localStorage.removeItem('pathmatch.cats'); } catch (e) { /* ignorieren */ }
    }
  };

  /* ---------- Beispieldaten ---------- */
  var TOPICS = {
    prog:   { label: 'Programmieren',        q: 'Mit welchen Programmiersprachen hast du bereits gearbeitet?', items: ['Java', 'C++', 'C#', 'Android', 'Swift', 'Python', 'Rust', 'Go', 'Andere'] },
    design: { label: 'Design & Medien',      q: 'Womit hast du im Bereich Design und Medien schon gearbeitet?', items: ['Figma', 'Photoshop', 'Illustrator', 'Videoschnitt', '3D-Modellierung', 'Fotografie', 'UI/UX-Design', 'Animation', 'Webdesign'] },
    tech:   { label: 'Elektronik & Technik', q: 'Welche technischen Bereiche kennst du schon?', items: ['Schaltungstechnik', 'Mikrocontroller', 'Löten', 'Netzwerktechnik', 'CAD', 'Robotik', 'Messtechnik', 'Linux', '3D-Druck'] },
    biz:    { label: 'Wirtschaft',           q: 'Welche wirtschaftlichen Kenntnisse hast du?', items: ['Excel', 'Buchhaltung', 'Marketing', 'Projektmanagement', 'Präsentieren', 'Verkauf', 'Statistik', 'Recht', 'Startups'] },
    sci:    { label: 'Naturwissenschaften',  q: 'In welchen Fächern fühlst du dich sicher?', items: ['Mathematik', 'Physik', 'Chemie', 'Biologie', 'Geografie', 'Astronomie'] },
    lang:   { label: 'Sprachen',             q: 'Welche Sprachen sprichst du?', items: ['Englisch', 'Französisch', 'Spanisch', 'Italienisch', 'Tschechisch', 'Russisch', 'Kroatisch', 'Türkisch', 'Andere Sprache'] }
  };

  // Ausgangswerte der Beispiel-Schülerin. Die Match-Werte unten gelten für genau diese Angaben.
  var DEFAULT_SKILLS = [
    ['Java', 'prog', 8], ['Python', 'prog', 6], ['C#', 'prog', 5],
    ['Mathematik', 'sci', 7], ['Englisch', 'lang', 8]
  ];
  var DEFAULT_LEVEL = {};
  DEFAULT_SKILLS.forEach(function (s) { DEFAULT_LEVEL[s[0]] = s[2]; });

  var FIELDS = ['Informatik', 'Medien & Design', 'Technik', 'Wirtschaft'];
  var TYPES = ['Studium', 'Lehre', 'Praktikum', 'Job'];
  var TYPE_ICON = { Studium: 'i-cap', Lehre: 'i-tool', Praktikum: 'i-clock', Job: 'i-briefcase' };
  var DISTANCES = [['all', 'Ganz Österreich'], ['10', '10 km'], ['35', '35 km'], ['100', '100 km']];

  var OFFERS = [
    {
      id: 'fhooe-se', title: 'Software Engineering', degree: 'Bachelor (BSc)',
      provider: 'FH Oberösterreich, Campus Hagenberg', city: 'Hagenberg im Mühlkreis', km: 31,
      type: 'Studium', field: 'Informatik', base: 94, updated: '2026-10-02',
      skills: ['Java', 'C#'], why: ['Zweig Informatik', 'Interesse an Spieleentwicklung'],
      ok: ['Matura an einer HTL, voraussichtlich Juni 2027', 'Gute Kenntnisse in Java und C#', 'Interesse an praxisnaher Softwareentwicklung'],
      gap: ['Aufnahmeverfahren mit Bewerbungsgespräch', 'Erste Erfahrung mit Teamprojekten nach Scrum ist von Vorteil'],
      facts: [['Dauer', '6 Semester'], ['Beginn', 'Wintersemester 2027'], ['Form', 'Vollzeit']],
      apply: 'Bewerbung online über das Portal der Fachhochschule'
    },
    {
      id: 'jku-ai', title: 'Artificial Intelligence', degree: 'Bachelor (BSc)',
      provider: 'Johannes Kepler Universität Linz', city: 'Linz', km: 12,
      type: 'Studium', field: 'Informatik', base: 89, updated: '2026-09-28',
      skills: ['Python', 'Mathematik', 'Englisch'], why: ['Interesse an künstlicher Intelligenz'],
      ok: ['Matura, voraussichtlich Juni 2027', 'Grundlagen in Python', 'Interesse an künstlicher Intelligenz'],
      gap: ['Sichere Mathematik, vor allem Analysis und Statistik', 'Lehrveranstaltungen teilweise auf Englisch'],
      facts: [['Dauer', '6 Semester'], ['Beginn', 'Wintersemester 2027'], ['Form', 'Vollzeit']],
      apply: 'Zulassung online über die Universität'
    },
    {
      id: 'jku-inf', title: 'Informatik', degree: 'Bachelor (BSc)',
      provider: 'Johannes Kepler Universität Linz', city: 'Linz', km: 12,
      type: 'Studium', field: 'Informatik', base: 86, updated: '2026-09-21',
      skills: ['Java', 'Python', 'Mathematik'], why: ['Zweig Informatik'],
      ok: ['Matura, voraussichtlich Juni 2027', 'Programmiererfahrung in mehreren Sprachen', 'Technischer Schulzweig'],
      gap: ['Theoretische Informatik und Mathematik nehmen viel Platz ein'],
      facts: [['Dauer', '6 Semester'], ['Beginn', 'Winter- oder Sommersemester'], ['Form', 'Vollzeit, flexibel']],
      apply: 'Zulassung online über die Universität'
    },
    {
      id: 'nordlicht', title: 'Praktikum Backend-Entwicklung', degree: 'Java',
      provider: 'Nordlicht Software GmbH', city: 'Linz', km: 7,
      type: 'Praktikum', field: 'Informatik', base: 84, updated: '2026-10-09',
      skills: ['Java'], why: ['Pflichtpraktikum der HTL möglich', 'In deiner Nähe'],
      ok: ['Java-Kenntnisse', 'Verfügbar im Sommer', 'Technische Ausbildung'],
      gap: ['Erfahrung mit Datenbanken (SQL)', 'Arbeiten mit Git im Team'],
      facts: [['Dauer', '2 Monate, Juli bis August'], ['Zeit', 'Vollzeit, 38,5 h'], ['Bezahlung', 'Laut Kollektivvertrag']],
      apply: 'Bewerbung mit Lebenslauf und Zeugnis direkt beim Unternehmen'
    },
    {
      id: 'tuw-mi', title: 'Medieninformatik und Visual Computing', degree: 'Bachelor (BSc)',
      provider: 'Technische Universität Wien', city: 'Wien', km: 188,
      type: 'Studium', field: 'Medien & Design', base: 78, updated: '2026-09-15',
      skills: ['C#', 'Mathematik', 'UI/UX-Design'], why: ['Interesse an Spieleentwicklung'],
      ok: ['Matura, voraussichtlich Juni 2027', 'Programmiererfahrung', 'Interesse an Grafik und Spielen'],
      gap: ['Umzug nach Wien nötig', 'Erfahrung mit Gestaltung oder 3D von Vorteil'],
      facts: [['Dauer', '6 Semester'], ['Beginn', 'Wintersemester 2027'], ['Form', 'Vollzeit']],
      apply: 'Zulassung online über die Universität'
    },
    {
      id: 'donaupixel', title: 'Lehre Applikationsentwicklung – Coding', degree: 'verkürzt nach Matura',
      provider: 'Donaupixel IT GmbH', city: 'Wels', km: 22,
      type: 'Lehre', field: 'Informatik', base: 73, updated: '2026-10-06',
      skills: ['Java', 'C#'], why: ['Zweig Informatik'],
      ok: ['Programmiererfahrung', 'HTL-Abschluss verkürzt die Lehrzeit'],
      gap: ['Bewerbungsgespräch und kleine Programmieraufgabe', 'Pendeln nach Wels'],
      facts: [['Dauer', 'ca. 2 Jahre'], ['Beginn', 'September 2027'], ['Lehrlingseinkommen', 'Laut Kollektivvertrag']],
      apply: 'Bewerbung per E-Mail mit Lebenslauf und letztem Zeugnis'
    },
    {
      id: 'alpenwert', title: 'Junior Data Analyst', degree: 'Teilzeit, 20 h',
      provider: 'Alpenwert Analytics GmbH', city: 'Linz', km: 8,
      type: 'Job', field: 'Wirtschaft', base: 67, updated: '2026-10-11',
      skills: ['Python', 'Mathematik', 'Excel', 'Statistik'], why: ['Neben dem Studium möglich'],
      ok: ['Grundlagen in Python', 'Gutes Zahlenverständnis'],
      gap: ['Sicherer Umgang mit Excel', 'Statistik-Grundlagen', 'Erste Erfahrung mit SQL'],
      facts: [['Stunden', '20 pro Woche'], ['Beginn', 'nach Vereinbarung'], ['Ort', 'Linz, teilweise Homeoffice']],
      apply: 'Bewerbung über das Karriereportal des Unternehmens'
    },
    {
      id: 'fhooe-hsd', title: 'Hardware-Software-Design', degree: 'Bachelor (BSc)',
      provider: 'FH Oberösterreich, Campus Hagenberg', city: 'Hagenberg im Mühlkreis', km: 31,
      type: 'Studium', field: 'Technik', base: 61, updated: '2026-09-30',
      skills: ['Java', 'C++', 'Mikrocontroller', 'Schaltungstechnik'], why: ['Technischer Schulzweig'],
      ok: ['Matura an einer HTL', 'Programmiererfahrung'],
      gap: ['Grundlagen der Elektronik', 'Hardwarenahe Programmierung in C oder C++'],
      facts: [['Dauer', '6 Semester'], ['Beginn', 'Wintersemester 2027'], ['Form', 'Vollzeit']],
      apply: 'Bewerbung online über das Portal der Fachhochschule'
    }
  ];
  var OFFER_BY_ID = {};
  OFFERS.forEach(function (o) { OFFER_BY_ID[o.id] = o; });

  /* ---------- Schulen (kommen aus einer XML-Datei im Ordner data) ---------- */
  // Welche Liste der Prototyp nutzt: data/schulen_ooe.xml (echte Daten) oder data/dummySchulen.xml (Beispieldaten).
  // Nach dem Umstellen einmal `python3 tools/sync-fallback.py` ausführen (siehe README).
  var SCHOOLS_URL = 'data/schulen_ooe.xml';
  // Vorausgewählte Schule der Beispiel-Schülerin (SKZ, Name des Zweigs, Schulstufe)
  // (HTL Leonding in schulen_ooe.xml. Für dummySchulen.xml: skz '401901', branch 'Informatik'.)
  var DEFAULT_PICK = { skz: '410427', branch: 'Informatik – Smart Cyber Systems', stufe: 13 };
  // Falls die Schulliste nicht geladen werden kann, gelten diese Werte
  var PROFILE_FALLBACK = { school: 'HTL Leonding', skz: '', schoolType: '', branch: 'Informatik', level: '13. Schulstufe', stufe: 13, year: '5. Jahrgang', topics: ['prog', 'tech'], compulsory: true, degree: 'Pflichtschulabschluss' };
  var COMPULSORY_YEARS = 9;   // Schulpflicht in Österreich: 9 Schuljahre
  var MAX_HITS = 8;           // so viele Treffer zeigt die Schulsuche auf einmal

  // Schulstufen je Schultyp. Gilt, wenn ein Zweig keine Angabe hat oder die Schule gar keine Zweige.
  // Reihenfolge zählt: der erste Treffer im Schultyp gewinnt.
  var STUFEN_BY_TYPE = [
    ['volksschule', 1, 4],
    ['sonderschule', 1, 9],
    ['polytechnisch', 9, 9],
    ['berufsschule', 10, 13],
    ['mittelschule', 5, 8], ['hauptschule', 5, 8],
    ['oberstufenrealgymnasium', 9, 12], ['borg', 9, 12],
    ['allgemeinbildende', 5, 12], ['gymnasium', 5, 12], ['ahs', 5, 12],
    ['handelsschule', 9, 11], ['fachschule', 9, 11], ['mittlere', 9, 11],
    ['höhere', 9, 13], ['handelsakademie', 9, 13], ['bildungsanstalt', 9, 13], ['htl', 9, 13], ['hak', 9, 13],
    ['humanberufliche', 9, 13], ['technische', 9, 13], ['kaufmännische', 9, 13], ['lehrerbildende', 9, 13], ['land- und forstwirtschaftliche', 9, 13]
  ];
  var STUFEN_FALLBACK = [5, 13];

  var SCHOOLS = [];
  var SCHOOL_BY_ID = {};
  var schools = { ready: false, error: '', source: '' };

  function stufenForType(type) {
    var t = String(type || '').toLowerCase();
    for (var i = 0; i < STUFEN_BY_TYPE.length; i++) if (t.indexOf(STUFEN_BY_TYPE[i][0]) > -1) return [STUFEN_BY_TYPE[i][1], STUFEN_BY_TYPE[i][2]];
    return STUFEN_FALLBACK;
  }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss'); }
  function topicKey(txt) {
    var t = String(txt || '').trim().toLowerCase();
    var keys = Object.keys(TOPICS);
    for (var i = 0; i < keys.length; i++) if (keys[i].toLowerCase() === t || TOPICS[keys[i]].label.toLowerCase() === t) return keys[i];
    return null;
  }

  // XML-Hilfen: Tags werden ohne Rücksicht auf Groß- und Kleinschreibung gefunden
  function kids(el, name) {
    var out = [], n = name.toLowerCase();
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (c.localName.toLowerCase() === n) out.push(c);
    return out;
  }
  function kidText(el, name) {
    var k = kids(el, name)[0];
    return k ? k.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  // Offizielle Schulnamen sind lang. Damit man auch mit den gängigen Abkürzungen findet (z. B. "HAK Wels"),
  // hängen wir sie an den Suchtext an.
  var SEARCH_ABBREVIATIONS = [
    [/handelsakademie/, 'hak'], [/handelsschule/, 'has'], [/technische bundeslehranstalt|hohere technische/, 'htl'],
    [/oberstufenrealgymnasium/, 'borg'], [/realgymnasium/, 'brg'], [/wirtschaftliche berufe/, 'hlw'],
    [/elementarpadagogik/, 'bafep'], [/polytechnische/, 'pts']
  ];
  function searchAbbreviations(text) {
    var t = norm(text);
    return SEARCH_ABBREVIATIONS.filter(function (a) { return a[0].test(t); }).map(function (a) { return a[1]; }).join(' ');
  }

  function parseSchools(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, 'application/xml');
    var bad = doc.getElementsByTagName('parsererror')[0];
    if (bad) throw new Error('Die Schulliste ist kein gültiges XML: ' + bad.textContent.trim().split('\n')[0]);
    var list = [], seen = {};
    Array.prototype.forEach.call(doc.getElementsByTagName('Schuldaten'), function (el, i) {
      var name = kidText(el, 'Schule');
      if (!name) return;
      var id = kidText(el, 'SKZ') || ('schule-' + (i + 1));
      if (seen[id]) return;
      seen[id] = true;
      var type = kidText(el, 'Schultyp');
      var def = stufenForType(type);
      var zEl = kids(el, 'Zweige')[0];
      var zweige = zEl ? kids(zEl, 'Zweig').map(function (z) {
        var zname = kidText(z, 'Bezeichnung');
        if (!zname) return null;
        var von = parseInt(kidText(z, 'SchulstufeVon'), 10), bis = parseInt(kidText(z, 'SchulstufeBis'), 10);
        if (!(von > 0)) von = def[0];
        if (!(bis > 0)) bis = def[1];
        if (bis < von) bis = von;
        var topics = [], tEl = kids(z, 'Themengebiete')[0];
        if (tEl) kids(tEl, 'Themengebiet').forEach(function (t) {
          var k = topicKey(t.textContent);
          if (k && topics.indexOf(k) === -1) topics.push(k);
        });
        return { name: zname, von: von, bis: bis, topics: topics };
      }).filter(Boolean) : [];
      var school = {
        id: id, name: name, type: type, zweige: zweige,
        street: kidText(el, 'Straße'), zip: kidText(el, 'PLZ'), city: kidText(el, 'Ort'),
        phone: kidText(el, 'Telefon'), email: kidText(el, 'E-Mail'), web: kidText(el, 'Webseite')
      };
      school.hay = norm([name, type, school.zip, school.city].join(' ')) + ' ' + searchAbbreviations(name + ' ' + type);
      school.nameN = norm(name);
      list.push(school);
    });
    if (!list.length) throw new Error('In der Schulliste wurde keine Schule gefunden (erwartet: <Schulen><Schuldaten>…).');
    list.sort(function (a, b) { return a.name.localeCompare(b.name, 'de'); });
    return list;
  }

  // Lädt die Schulliste (SCHOOLS_URL). Beim Öffnen per Doppelklick (file://) verbietet der Browser fetch();
  // dann gilt die eingebettete Kopie aus data/schulen-fallback.js (erzeugt mit tools/sync-fallback.py).
  function loadSchools() {
    return fetch(SCHOOLS_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (text) { return { text: text, source: 'xml' }; }, function (err) {
        if (window.PATHMATCH_SCHULEN_XML) {
          if (window.console) console.warn('PathMatch: ' + SCHOOLS_URL + ' konnte nicht geladen werden (' + err.message + '). Es wird die eingebettete Kopie aus data/schulen-fallback.js genutzt. Für die echte Datei den Prototyp über einen lokalen Server öffnen.');
          return { text: window.PATHMATCH_SCHULEN_XML, source: 'fallback' };
        }
        throw new Error(SCHOOLS_URL + ' konnte nicht geladen werden (' + err.message + ').');
      })
      .then(function (res) {
        SCHOOLS = parseSchools(res.text);
        SCHOOL_BY_ID = {};
        SCHOOLS.forEach(function (sc) { SCHOOL_BY_ID[sc.id] = sc; });
        schools.source = res.source;
        schools.ready = true;
      })
      .catch(function (err) {
        schools.error = err.message;
        if (window.console) console.error('PathMatch: ' + err.message);
      });
  }

  function searchSchools(query) {
    var terms = norm(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return SCHOOLS.slice();
    return SCHOOLS.filter(function (sc) {
      return terms.every(function (t) { return sc.hay.indexOf(t) > -1; });
    }).map(function (sc) {
      return { sc: sc, rank: sc.nameN.indexOf(terms[0]) === 0 ? 0 : sc.nameN.indexOf(terms[0]) > -1 ? 1 : 2 };
    }).sort(function (a, b) { return a.rank - b.rank || a.sc.name.localeCompare(b.sc.name, 'de'); })
      .map(function (x) { return x.sc; });
  }

  // Schulstufen, die es im Zweig (oder, ohne Zweig, im Schultyp) gibt
  function stufeRange(school, zweig) {
    return zweig ? [zweig.von, zweig.bis] : stufenForType(school ? school.type : '');
  }
  // Wievielte Klasse bzw. welcher Jahrgang ist das? Rechnet sich aus der Schulstufe.
  function yearText(school, zweig, stufe) {
    if (!school || !stufe) return '';
    var r = stufeRange(school, zweig), n = stufe - r[0] + 1, t = school.type.toLowerCase();
    var unit = t.indexOf('berufsschule') > -1 ? 'Lehrjahr'
      : (t.indexOf('oberstufenreal') === -1 && /volksschule|sonderschule|mittelschule|hauptschule|polytechn|allgemeinbildende|gymnasium|^ahs$/.test(t)) ? 'Klasse'
      : 'Jahrgang';
    return n + '. ' + unit;
  }
  // Pflichtschule = 9 Schuljahre. Wer in der 10. Schulstufe oder höher ist, hat sie abgeschlossen.
  function compulsoryInfo(stufe) {
    if (!stufe) return { done: false, text: 'Sobald du deine Schulstufe gewählt hast, tragen wir das für dich ein.' };
    if (stufe > COMPULSORY_YEARS) return { done: true, text: 'Du bist in der ' + stufe + '. Schulstufe, die 9 Pflichtschuljahre hast du damit schon hinter dir.' };
    if (stufe === COMPULSORY_YEARS) return { done: false, text: 'Du bist in der 9. Schulstufe, dem letzten Pflichtschuljahr. Abgeschlossen hast du die Pflichtschule, sobald du dieses Schuljahr bestehst.' };
    return { done: false, text: 'Du bist in der ' + stufe + '. Schulstufe. Die Pflichtschule dauert 9 Schuljahre, du hast sie also noch nicht abgeschlossen.' };
  }
  // Welche höchsten Abschlüsse zur aktuellen Schule passen: Wer gerade in einer Matura-Schule ist, hat noch keine Matura.
  // Wer in der Berufsschule ist, steckt mitten in der Lehre (also noch kein Lehrabschluss), kann aber schon maturiert haben.
  function degreeChoices(school) {
    var t = school ? school.type.toLowerCase() : '';
    if (t.indexOf('berufsschule') > -1) return ['Pflichtschulabschluss', 'Reifeprüfung (Matura)', 'Berufsreifeprüfung'];
    return ['Pflichtschulabschluss', 'Lehrabschluss'];
  }

  var DEFAULT_CATS = ['Erste Wahl', 'Vielleicht', 'Später ansehen'];
  var DEFAULT_FAVS = { 'fhooe-se': 'Erste Wahl', 'jku-ai': 'Erste Wahl', 'nordlicht': 'Vielleicht', 'donaupixel': 'Später ansehen' };
  var GOAL_TEXT = { study: 'Studieren', work: 'Arbeiten', open: 'Ich weiß es noch nicht' };

  /* ---------- Ablauf der Registrierung (Unterseiten) ---------- */
  var GROUPS = [
    { name: 'Über dich', desc: 'Konto, Name, Schule, Abschluss' },
    { name: 'Nach der Schule', desc: 'Studieren, arbeiten oder offen' },
    { name: 'Kenntnisse und Interessen', desc: 'Auswählen, bewerten, beschreiben' }
  ];
  var FLOW = [
    { id: 'signup-account', group: 0, name: 'Konto' },
    { id: 'signup-name', group: 0, name: 'Name' },
    { id: 'signup-school', group: 0, name: 'Schule' },
    { id: 'signup-degree', group: 0, name: 'Abschluss' },
    { id: 'signup-goal', group: 1, name: 'Ziel' },
    { id: 'signup-skills', group: 2, name: 'Kenntnisse' },
    { id: 'signup-rating', group: 2, name: 'Bewertung' },
    { id: 'signup-interests', group: 2, name: 'Interessen' }
  ];
  var STEP_BY_ID = {};
  FLOW.forEach(function (s) { STEP_BY_ID[s.id] = s; });
  var EDIT_FLOW = ['signup-skills', 'signup-rating', 'signup-interests'];
  var ALIASES = { signup1: 'signup-account', signup2: 'signup-goal', signup3: 'signup-skills', matching: 'results' };

  /* ---------- Zustand ---------- */
  var state = {
    screen: 'start',
    goal: 'open',
    topic: 'prog',
    topicSig: '',
    skills: [],
    profile: {},
    favs: store.get('favs', null) || JSON.parse(JSON.stringify(DEFAULT_FAVS)),
    cats: store.get('cats', null) || DEFAULT_CATS.slice(),
    filters: { type: 'Alle', fields: [], dist: 'all', q: '', sort: 'match' },
    favTab: 'Alle',
    editing: false,
    snapshot: null,
    pendingRemove: null,
    drawerId: null,
    selectedId: null,
    visibleIds: [],
    favSelectedId: null,
    favVisibleIds: [],
    paneOpen: { results: false, favorites: false },
    railOpen: true
  };
  DEFAULT_SKILLS.forEach(function (s) { state.skills.push({ name: s[0], topic: s[1], level: s[2] }); });

  var saveFavs = function () { store.set('favs', state.favs); store.set('cats', state.cats); };
  var isFav = function (id) { return has(state.favs, id); };
  var skillLevel = function (name) {
    for (var i = 0; i < state.skills.length; i++) if (state.skills[i].name === name) return state.skills[i].level;
    return 0;
  };
  var activeFlow = function () { return state.editing ? EDIT_FLOW : FLOW.map(function (s) { return s.id; }); };

  /* ---------- Matching (vereinfachte Demo-Logik) ---------- */
  function scored() {
    return OFFERS.map(function (o) {
      var delta = 0;
      o.skills.forEach(function (s) { delta += skillLevel(s) - (DEFAULT_LEVEL[s] || 0); });
      var match = Math.max(30, Math.min(99, Math.round(o.base + delta)));
      return Object.assign({}, o, { match: match });
    });
  }
  function scoredById(id) {
    var list = scored();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function reasons(o) {
    var list = o.skills
      .filter(function (s) { return skillLevel(s) > 0; })
      .sort(function (a, b) { return skillLevel(b) - skillLevel(a); })
      .slice(0, 2)
      .map(function (s) { return s + ' ' + skillLevel(s) + '/10'; });
    if (state.goal === 'study' && o.type === 'Studium') list.push('Dein Ziel: Studieren');
    if (state.goal === 'work' && o.type !== 'Studium') list.push('Dein Ziel: Arbeiten');
    var branch = (state.profile.branch || '').toLowerCase(), topics = state.profile.topics || [];
    return list.concat(o.why.filter(function (w) {
      if (w === 'Zweig Informatik') return branch.indexOf('informatik') > -1;       // gilt nur für diesen Zweig
      if (w === 'Technischer Schulzweig') return topics.indexOf('tech') > -1;
      return true;
    }));
  }
  function matchLabel(m) { return m >= 85 ? 'Sehr gute Übereinstimmung' : m >= 70 ? 'Gute Übereinstimmung' : 'Teilweise passend'; }
  var RING_C = 2 * Math.PI * 28;
  // Je höher die Übereinstimmung, desto kräftiger die Farbe: Hellblau -> Blau -> Dunkelblau
  var RING_STOPS = [[55, [168, 199, 250]], [78, [71, 141, 255]], [100, [36, 75, 104]]];
  function ringColor(v) {
    v = Math.max(RING_STOPS[0][0], Math.min(100, v));
    for (var i = 1; i < RING_STOPS.length; i++) {
      var a = RING_STOPS[i - 1], b = RING_STOPS[i];
      if (v <= b[0]) {
        var f = (v - a[0]) / (b[0] - a[0]);
        return 'rgb(' + a[1].map(function (c, k) { return Math.round(c + (b[1][k] - c) * f); }).join(',') + ')';
      }
    }
    return 'rgb(36,75,104)';
  }
  function ringDash(v) { return (RING_C * v / 100).toFixed(1) + ' ' + RING_C.toFixed(1); }
  function ring(value, opts) {
    opts = opts || {};
    var dash = opts.empty ? '0 ' + RING_C.toFixed(1) : ringDash(value);
    return '<div class="ring' + (opts.small ? ' ring--sm' : '') + '" role="img" aria-label="' + value + ' Prozent Übereinstimmung">' +
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="ring-track" cx="32" cy="32" r="28"/>' +
      '<circle class="ring-bar" cx="32" cy="32" r="28" style="stroke:' + ringColor(value) + '" stroke-dasharray="' + dash + '" data-dash="' + ringDash(value) + '"/></svg>' +
      '<span class="ring-value" aria-hidden="true">' + value + '<small>%</small></span></div>';
  }
  function formatDate(iso) { var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function initials() { return ((state.profile.first || 'L')[0] + (state.profile.last || 'H')[0]).toUpperCase(); }

  /* ---------- Navigation ---------- */
  var SCREENS = ['start'].concat(FLOW.map(function (s) { return s.id; }), ['matching', 'results', 'favorites', 'account']);
  var matchTimers = [];

  function go(name, opts) {
    opts = opts || {};
    if (ALIASES[name] && name !== 'matching') name = ALIASES[name];
    if (SCREENS.indexOf(name) === -1) name = 'start';
    if (name !== 'matching') { matchTimers.forEach(clearTimeout); matchTimers = []; }
    if (name.indexOf('signup-') === 0 && state.editing && EDIT_FLOW.indexOf(name) === -1) state.editing = false;

    var prev = state.screen;
    closePop();
    $$('.modal').forEach(function (m) { if (!m.hidden) m.hidden = true; });
    document.body.classList.remove('modal-open');
    state.screen = name;

    var isSignup = name.indexOf('signup-') === 0;
    var isApp = name === 'results' || name === 'favorites' || name === 'account';
    $('#shell-start').hidden = name !== 'start';
    $('#shell-signup').hidden = !isSignup;
    $('#shell-matching').hidden = name !== 'matching';
    $('#shell-app').hidden = !isApp;
    $$('[data-view]').forEach(function (el) { el.hidden = el.dataset.view !== name; });
    $$('[data-nav]').forEach(function (el) {
      if (el.dataset.nav === name) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    $('#shell-app').classList.toggle('is-full', name === 'results' || name === 'favorites');
    $('#shell-app').classList.toggle('is-account', name === 'account');
    if (isApp) moveNavInd();
    if (name === 'start') { buildStomps(); initHow(); }

    if (isSignup) showStep(name, prev);
    if (name === 'matching') runMatching();
    if (name === 'results') renderResults(opts.animate === false ? false : 'full');
    if (name === 'favorites') renderFavs();
    if (name === 'account') renderAccount();
    updateBadge();

    try { history.replaceState(null, '', '#' + name); } catch (e) { /* in manchen Rahmen nicht erlaubt */ }
    if (!opts.keepScroll) window.scrollTo(0, 0);
    if (!opts.noFocus) {
      var root = isSignup ? $('[data-step="' + name + '"]') : isApp ? $('[data-view="' + name + '"]') : $('#shell-' + name);
      var h = root && root.querySelector('h1');
      if (h) { try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
    }
  }

  function closeMobileAccount(restoreFocus) { var menu = $('#mobile-account-menu'), btn = $('#account-menu-toggle'), wasOpen = menu && !menu.hidden; if (wasOpen) menu.hidden = true; if (btn) { btn.setAttribute('aria-expanded', 'false'); if (restoreFocus && wasOpen) btn.focus(); } }
  function toggleMobileAccount() { var menu = $('#mobile-account-menu'), btn = $('#account-menu-toggle'); if (!menu || !btn) return; menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); }
  function openMobileFilter() { document.body.classList.add('mobile-filter-open'); $('#filter-backdrop').hidden = false; $('#filter-rail').setAttribute('role', 'dialog'); $('#filter-rail').setAttribute('aria-modal', 'true'); $('#mobile-filter-close').focus(); }
  function closeMobileFilter() { document.body.classList.remove('mobile-filter-open'); var back = $('#filter-backdrop'); if (back) back.hidden = true; var rail = $('#filter-rail'); if (rail) { rail.removeAttribute('role'); rail.removeAttribute('aria-modal'); } var opener = $('#mobile-filter-open'); if (opener && document.activeElement === $('#mobile-filter-close')) opener.focus(); }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#mobile-account')) closeMobileAccount();
    var closer = e.target.closest('[data-close]');
    if (closer) { var m = closer.closest('.modal'); if (m) closeModal(m); }
    var link = e.target.closest('[data-go]');
    if (link) { e.preventDefault(); closeMobileAccount(); closeMobileFilter(); go(link.dataset.go); return; }
    if (e.target.closest('[data-open-login]')) { showLoginView(); openModal('modal-login'); }
    if (e.target.closest('[data-reset-filters]')) resetFilters();
    if (e.target.closest('[data-logout]')) { closeMobileAccount(); closeMobileFilter(); go('start'); toast('Du hast dich abgemeldet.'); }
    if (e.target.closest('#account-menu-toggle')) { e.preventDefault(); toggleMobileAccount(); }
    if (e.target.closest('#mobile-filter-open')) { openMobileFilter(); }
    if (e.target.closest('#mobile-filter-close') || e.target.closest('#filter-backdrop')) { closeMobileFilter(); }
  });

  /* ---------- Registrierung: Unterseiten ---------- */
  function showStep(name, prev) {
    var flow = activeFlow();
    var idx = flow.indexOf(name);
    var prevIdx = flow.indexOf(prev);
    var dir = prevIdx > idx ? 'enter-back' : 'enter-fwd';

    $$('[data-step]').forEach(function (form) {
      var on = form.dataset.step === name;
      form.hidden = !on;
      form.classList.remove('enter-fwd', 'enter-back');
      if (on && !reduceMotion && prev !== name) { void form.offsetWidth; form.classList.add(dir); }
    });

    renderStepper(name);
    var pct = Math.round((idx + 1) / flow.length * 100);
    $('#progress-bar').style.width = pct + '%';
    $('.progress').setAttribute('aria-valuenow', pct);

    var step = STEP_BY_ID[name];
    var groupSteps = FLOW.filter(function (s) { return s.group === step.group; });
    var eyebrow = state.editing
      ? 'Angaben bearbeiten · Teil ' + (idx + 1) + ' von ' + flow.length
      : 'Schritt ' + (step.group + 1) + ' von ' + GROUPS.length + (groupSteps.length > 1 ? ' · Teil ' + (groupSteps.indexOf(step) + 1) + ' von ' + groupSteps.length : '');
    var form = $('[data-step="' + name + '"]');
    $('[data-eyebrow]', form).textContent = eyebrow;

    var back = $('[data-back]', form);
    back.textContent = idx === 0 ? (state.editing ? 'Abbrechen' : 'Zur Startseite') : 'Zurück';
    var next = $('[data-next]', form);
    if (idx === flow.length - 1) next.firstChild.textContent = state.editing ? 'Neu berechnen ' : 'Ergebnisse anzeigen ';
    else next.firstChild.textContent = 'Weiter ';

    $('#rail-logo').dataset.go = state.editing ? 'results' : 'start';
    $('#rail-note-text').textContent = state.editing
      ? 'Deine persönlichen Daten und deine Schule änderst du in deinem Konto.'
      : 'Du entscheidest, was du angibst. Deine Angaben kannst du später jederzeit ändern.';

    if (name === 'signup-skills') { renderTopicSelect(); renderChips(); renderSelection(); }
    if (name === 'signup-rating') renderRatings();
    if (name === 'signup-interests') updateCount();
  }

  function renderStepper(name) {
    var flow = activeFlow();
    var idx = flow.indexOf(name);
    var groups = state.editing
      ? [{ name: 'Kenntnisse und Interessen', desc: '', steps: EDIT_FLOW, icon: 'i-sliders' }]
      : GROUPS.map(function (g, gi) {
          return { name: g.name, desc: g.desc, steps: FLOW.filter(function (s) { return s.group === gi; }).map(function (s) { return s.id; }) };
        });

    $('#stepper').innerHTML = groups.map(function (g, gi) {
      var first = flow.indexOf(g.steps[0]);
      var last = flow.indexOf(g.steps[g.steps.length - 1]);
      var status = idx > last ? 'is-done' : idx >= first ? 'is-current' : '';
      var dot = status === 'is-done' ? icon('i-check') : g.icon ? icon(g.icon) : String(gi + 1);
      var subs = '';
      if (status === 'is-current' && g.steps.length > 1) {
        subs = '<ol class="substeps">' + g.steps.map(function (id) {
          var si = flow.indexOf(id);
          var cls = si < idx ? 'is-done' : si === idx ? 'is-current' : '';
          return '<li class="' + cls + '"' + (si === idx ? ' aria-current="step"' : '') + '><span class="sub-dot"></span>' + esc(STEP_BY_ID[id].name) + '</li>';
        }).join('') + '</ol>';
      }
      return '<li class="' + status + '"' + (status === 'is-current' && g.steps.length === 1 ? ' aria-current="step"' : '') + '>' +
        '<span class="step-dot">' + dot + '</span>' +
        '<span class="step-text"><span class="step-name step-name-desktop">' + esc(g.name) + '</span><span class="step-name step-name-mobile">' + esc(['Profil', 'Ziel', 'Skills'][gi] || 'Skills') + '</span>' +
        (subs || (g.desc ? '<span class="step-desc">' + esc(g.desc) + '</span>' : '')) + '</span></li>';
    }).join('');
  }

  function stepBack() {
    var flow = activeFlow();
    var idx = flow.indexOf(state.screen);
    if (idx > 0) { go(flow[idx - 1]); return; }
    if (state.editing) {
      if (state.snapshot) {
        state.skills = state.snapshot.skills;
        interests.value = state.snapshot.interests;
      }
      state.editing = false;
      state.snapshot = null;
      go('results', { animate: false });
      return;
    }
    go('start');
  }
  $$('[data-back]').forEach(function (b) { b.addEventListener('click', stepBack); });

  /* Validierung */
  function setError(input, msg) {
    var field = input.closest('.field');
    var err = document.getElementById(input.id + '-err');
    if (field) field.classList.toggle('has-error', !!msg);
    if (!err) return;
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-errormessage', err.id);
      err.innerHTML = icon('i-info') + '<span>' + esc(msg) + '</span>';
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      err.hidden = true;
    }
  }
  function validate(input) {
    if (input.dataset.combo) {
      if (pickers[input.dataset.combo] && pickers[input.dataset.combo].hasSchool()) return '';
      return schools.error ? 'Die Schulliste konnte nicht geladen werden.' : 'Bitte such deine Schule und wähl sie aus der Liste aus.';
    }
    var v = input.value.trim();
    if (!v) return input.dataset.msg || 'Bitte ausfüllen.';
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Bitte gib eine gültige E-Mail-Adresse ein, z. B. name@example.com.';
    if (input.type === 'password' && input.autocomplete === 'new-password' && v.length < 8) return 'Das Passwort braucht mindestens 8 Zeichen.';
    return '';
  }
  function validateAll(root) {
    var firstBad = null;
    $$('[data-required]', root).forEach(function (input) {
      if (input.disabled) { setError(input, ''); return; }
      var msg = validate(input);
      setError(input, msg);
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  $$('[data-required]').forEach(function (input) {
    input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
      if (input.getAttribute('aria-invalid')) setError(input, validate(input));
    });
  });

  $$('[data-step]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll(form)) return;
      var name = form.dataset.step;
      if (name === 'signup-goal') {
        var checked = $('input[name="goal"]:checked', form);
        state.goal = checked ? checked.value : 'open';
        state.filters.type = state.goal === 'study' ? 'Studium' : 'Alle';
      }
      readProfile();
      var flow = activeFlow();
      var idx = flow.indexOf(name);
      if (idx < flow.length - 1) go(flow[idx + 1]);
      else go('matching');
    });
  });

  /* ---------- Schulauswahl: Schule -> Zweig -> Schulstufe -> Pflichtschule und Abschluss ----------
     Gleicher Baustein für die Registrierung (Präfix "f") und das Konto (Präfix "a"). */
  var pickers = {};
  function setHint(node, text) {
    var target = node.querySelector('span') || node;
    target.textContent = text;
  }

  function createPicker(x) {
    var el = {
      school: $('#' + x + '-school'), list: $('#' + x + '-school-list'), status: $('#' + x + '-school-status'), card: $('#' + x + '-school-card'),
      branch: $('#' + x + '-branch'), branchHint: $('#' + x + '-branch-hint'),
      level: $('#' + x + '-level'), levelHint: $('#' + x + '-level-hint'),
      compulsory: $('#' + x + '-compulsory'), compHint: $('#' + x + '-compulsory-hint'),
      degWrap: $('#' + x + '-degree-wrap'), degree: $('#' + x + '-degree')
    };
    var pk = { school: null, zweig: null, stufe: 0, hits: [], active: -1, open: false };

    /* Kärtchen mit Überblick über die gewählte Schule */
    function renderCard() {
      var sc = pk.school;
      if (!sc) { el.card.hidden = true; el.card.innerHTML = ''; return; }
      var addr = [sc.street, [sc.zip, sc.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
      var html = '';
      if (sc.type) html += '<span class="tag">' + icon('i-cap') + esc(sc.type) + '</span>';
      html += '<p class="school-card-name">' + esc(sc.name) + '</p>';
      if (addr) html += '<p class="school-card-line">' + icon('i-pin') + '<span>' + esc(addr) + '</span></p>';
      if (sc.zweige.length) html += '<p class="school-card-line">' + icon('i-list') + '<span>' + sc.zweige.length + (sc.zweige.length === 1 ? ' Zweig' : ' Zweige') + ' an dieser Schule</span></p>';
      if (pk.zweig && pk.zweig.topics.length) {
        html += '<div class="school-card-topics"><span>Vorgeschlagene Themengebiete für „' + esc(pk.zweig.name) + '“. Du siehst sie bei den Kenntnissen zuerst:</span><div class="mini-chips">' +
          pk.zweig.topics.map(function (k) { return '<span class="pill">' + esc(TOPICS[k].label) + '</span>'; }).join('') + '</div></div>';
      }
      el.card.innerHTML = html;
      el.card.hidden = false;
    }

    /* Zweig */
    function fillBranches() {
      var sc = pk.school, sel = el.branch;
      setError(sel, '');
      el.branchHint.hidden = true;
      if (!sc) { sel.innerHTML = '<option value="">Zuerst Schule wählen</option>'; sel.disabled = true; return; }
      if (!sc.zweige.length) {
        sel.innerHTML = '<option value="">Kein Zweig hinterlegt</option>';
        sel.disabled = true;
        el.branchHint.textContent = 'Für diese Schule sind noch keine Zweige hinterlegt. Du kannst trotzdem weitermachen.';
        el.branchHint.hidden = false;
        return;
      }
      sel.disabled = false;
      sel.innerHTML = '<option value="">Zweig auswählen</option>' + sc.zweige.map(function (z, i) {
        return '<option value="' + i + '">' + esc(z.name) + '</option>';
      }).join('');
      sel.value = pk.zweig ? String(sc.zweige.indexOf(pk.zweig)) : '';
    }
    /* Schulstufe */
    function fillLevels() {
      var sc = pk.school, sel = el.level;
      setError(sel, '');
      if (!sc) { pk.stufe = 0; sel.innerHTML = '<option value="">Zuerst Schule wählen</option>'; sel.disabled = true; return; }
      if (sc.zweige.length && !pk.zweig) { pk.stufe = 0; sel.innerHTML = '<option value="">Zuerst Zweig wählen</option>'; sel.disabled = true; return; }
      var r = stufeRange(sc, pk.zweig);
      if (pk.stufe < r[0] || pk.stufe > r[1]) pk.stufe = 0;
      if (r[0] === r[1]) pk.stufe = r[0];      // gibt es nur eine Schulstufe, ist sie klar
      var html = '<option value="">Schulstufe auswählen</option>';
      for (var n = r[0]; n <= r[1]; n++) html += '<option value="' + n + '">' + n + '. Schulstufe</option>';
      sel.innerHTML = html;
      sel.disabled = false;
      sel.value = pk.stufe ? String(pk.stufe) : '';
    }
    /* Pflichtschule und Abschluss hängen an der Schulstufe */
    function syncCompulsory() {
      var info = compulsoryInfo(pk.stufe);
      el.compulsory.checked = info.done;
      el.degWrap.hidden = !info.done;
      setHint(el.compHint, info.text);
      var choices = degreeChoices(pk.school), cur = el.degree.value;
      el.degree.innerHTML = choices.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
      el.degree.value = choices.indexOf(cur) > -1 ? cur : choices[0];
    }
    function syncAll() {
      fillLevels();
      var yt = yearText(pk.school, pk.zweig, pk.stufe);
      el.levelHint.textContent = yt ? 'Das heißt bei dir: ' + yt + '.' : '';
      renderCard();
      syncCompulsory();
    }

    /* Schulsuche (Combobox) */
    function setActive(i) {
      pk.active = i;
      $$('.combo-opt', el.list).forEach(function (o, k) { o.classList.toggle('is-active', k === i); });
      var cur = i > -1 ? el.list.querySelector('.combo-opt[data-i="' + i + '"]') : null;
      if (cur) { el.school.setAttribute('aria-activedescendant', cur.id); cur.scrollIntoView({ block: 'nearest' }); }
      else el.school.removeAttribute('aria-activedescendant');
    }
    function renderList() {
      // Steht die gewählte Schule im Feld, zeigen wir die ganze Liste, damit man leicht wechseln kann
      var q = pk.school && norm(el.school.value) === pk.school.nameN ? '' : el.school.value;
      var html = '', all = [];
      pk.hits = [];
      if (schools.error) html = '<li class="combo-note" role="presentation">Die Schulliste konnte nicht geladen werden.</li>';
      else if (!schools.ready) html = '<li class="combo-note" role="presentation">Schulen werden geladen …</li>';
      else {
        all = searchSchools(q);
        pk.hits = all.slice(0, MAX_HITS);
        html = pk.hits.map(function (sc, i) {
          var meta = [sc.type, [sc.zip, sc.city].filter(Boolean).join(' ')].filter(Boolean).join(' · ');
          return '<li class="combo-opt" role="option" id="' + x + '-school-opt-' + i + '" data-i="' + i + '" aria-selected="' + !!(pk.school && pk.school.id === sc.id) + '">' +
            '<span class="combo-name">' + esc(sc.name) + '</span>' + (meta ? '<span class="combo-meta">' + esc(meta) + '</span>' : '') + '</li>';
        }).join('');
        if (!all.length) html = '<li class="combo-note" role="presentation">Keine Schule gefunden. Versuch es mit dem Ort oder der Postleitzahl.</li>';
        else if (all.length > pk.hits.length) html += '<li class="combo-note" role="presentation">Und ' + (all.length - pk.hits.length) + ' weitere. Gib mehr vom Namen ein, um die Liste einzugrenzen.</li>';
      }
      el.list.innerHTML = html;
      el.status.textContent = !schools.ready ? '' : all.length === 1 ? '1 Schule gefunden.' : all.length + ' Schulen gefunden.';
      pk.active = -1;
      el.school.removeAttribute('aria-activedescendant');
    }
    function openList() { el.list.hidden = false; el.school.setAttribute('aria-expanded', 'true'); pk.open = true; }
    function closeList() { el.list.hidden = true; el.school.setAttribute('aria-expanded', 'false'); el.school.removeAttribute('aria-activedescendant'); pk.open = false; pk.active = -1; }
    function showList() { renderList(); openList(); }

    function clearSchool() {
      pk.school = null; pk.zweig = null; pk.stufe = 0;
      fillBranches();
      syncAll();
    }
    function pickSchool(sc) {
      var changed = !pk.school || pk.school.id !== sc.id;
      pk.school = sc;
      el.school.value = sc.name;
      closeList();
      setError(el.school, '');
      if (changed) { pk.zweig = null; pk.stufe = 0; }
      if (changed && sc.zweige.length === 1) pk.zweig = sc.zweige[0];
      fillBranches();
      syncAll();
    }

    el.school.addEventListener('input', function () {
      if (pk.school && norm(el.school.value) !== pk.school.nameN) clearSchool();
      var exact = SCHOOLS.filter(function (sc) { return sc.nameN === norm(el.school.value.trim()); });
      if (!pk.school && exact.length === 1) { pickSchool(exact[0]); return; }
      showList();
    });
    el.school.addEventListener('click', function () { if (!pk.open) showList(); });
    el.school.addEventListener('blur', closeList);
    el.school.addEventListener('keydown', function (e) {
      var n = pk.hits.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!pk.open) showList();
        n = pk.hits.length;
        if (!n) return;
        var step = e.key === 'ArrowDown' ? 1 : -1;
        setActive(pk.active === -1 ? (step === 1 ? 0 : n - 1) : (pk.active + step + n) % n);
      } else if (e.key === 'Enter' && pk.open) {
        e.preventDefault();
        if (pk.active > -1) pickSchool(pk.hits[pk.active]);
        else if (n === 1 && el.school.value.trim()) pickSchool(pk.hits[0]);
        else if (n) setActive(0);
      } else if (e.key === 'Escape' && pk.open) {
        e.preventDefault(); closeList();
      } else if (e.key === 'Tab') closeList();
    });
    // mousedown würde dem Feld den Fokus nehmen, bevor der Klick ankommt
    el.list.addEventListener('mousedown', function (e) { e.preventDefault(); });
    el.list.addEventListener('click', function (e) {
      var o = e.target.closest('.combo-opt');
      if (o) pickSchool(pk.hits[+o.dataset.i]);
    });

    el.branch.addEventListener('change', function () {
      pk.zweig = el.branch.value === '' ? null : pk.school.zweige[+el.branch.value];
      syncAll();
    });
    el.level.addEventListener('change', function () {
      pk.stufe = el.level.value ? +el.level.value : 0;
      syncAll();
    });

    var api = {
      hasSchool: function () { return !!pk.school; },
      setValue: function (v) {
        pk.school = SCHOOL_BY_ID[v.skz] || null;
        el.school.value = pk.school ? pk.school.name : '';
        pk.zweig = null;
        if (pk.school) {
          var zi = -1;
          pk.school.zweige.forEach(function (z, i) { if (z.name === v.branch) zi = i; });
          if (zi > -1) pk.zweig = pk.school.zweige[zi];
          else if (pk.school.zweige.length === 1) pk.zweig = pk.school.zweige[0];
        }
        pk.stufe = v.stufe || 0;
        setError(el.school, '');
        closeList();
        fillBranches();
        if (v.degree) el.degree.value = v.degree;
        syncAll();
        if (v.degree) el.degree.value = v.degree;
      },
      read: function () {
        var sc = pk.school, z = pk.zweig, st = pk.stufe;
        return {
          skz: sc ? sc.id : '', school: sc ? sc.name : '', schoolType: sc ? sc.type : '',
          branch: z ? z.name : '', stufe: st, level: st ? st + '. Schulstufe' : '',
          year: yearText(sc, z, st), topics: z ? z.topics.slice() : [],
          compulsory: el.compulsory.checked, degree: el.degree.value
        };
      }
    };
    fillBranches();
    syncAll();
    return api;
  }
  pickers.f = createPicker('f');
  pickers.a = createPicker('a');

  function readProfile() {
    var pick = pickers.f.read(), fb = PROFILE_FALLBACK;
    // Ist die Schule gewählt, gelten die Angaben aus der Schulauswahl (auch ein leerer Zweig). Sonst die Ausgangswerte.
    var hasSchool = !!pick.skz;
    state.profile = {
      first: $('#f-first').value.trim() || 'Lena',
      last: $('#f-last').value.trim() || 'Hofer',
      email: $('#f-email').value.trim() || 'lena.hofer@example.com',
      school: hasSchool ? pick.school : fb.school,
      skz: hasSchool ? pick.skz : fb.skz,
      schoolType: hasSchool ? pick.schoolType : fb.schoolType,
      branch: hasSchool ? pick.branch : fb.branch,
      stufe: hasSchool && pick.stufe ? pick.stufe : fb.stufe,
      level: hasSchool && pick.stufe ? pick.level : fb.level,
      year: hasSchool && pick.stufe ? pick.year : fb.year,
      topics: hasSchool ? pick.topics : fb.topics.slice(),
      compulsory: hasSchool && pick.stufe ? pick.compulsory : fb.compulsory,
      degree: hasSchool && pick.stufe ? pick.degree : fb.degree
    };
    applyProfile();
  }
  function applyProfile() {
    var p = state.profile;
    $$('[data-firstname]').forEach(function (el) { el.textContent = p.first; });
    $('#user-fullname').textContent = p.first + ' ' + p.last;
    $('#user-school').textContent = p.school;
    $('#user-avatar').textContent = initials();
  }

  /* Ziel-Karten */
  function syncChoices() {
    $$('.choice').forEach(function (c) { c.classList.toggle('is-checked', c.querySelector('input').checked); });
  }
  $$('.choice input').forEach(function (input) {
    input.addEventListener('change', syncChoices);
    input.addEventListener('focus', function () { if (input.matches(':focus-visible')) input.closest('.choice').classList.add('has-focus'); });
    input.addEventListener('blur', function () { input.closest('.choice').classList.remove('has-focus'); });
  });
  syncChoices();

  /* Kenntnisse auswählen */
  var topicSelect = $('#f-topic');
  topicSelect.addEventListener('change', function () { state.topic = topicSelect.value; renderChips(); });

  // Themengebiete, die zum Zweig der Schule gehören (kommen aus der Schulliste)
  function suggestedTopics() {
    return (state.profile.topics || []).filter(function (k) { return has(TOPICS, k); });
  }
  // Vorgeschlagene Themengebiete stehen zuerst. Ändert sich der Zweig, startet die Auswahl wieder beim ersten Vorschlag.
  function renderTopicSelect() {
    var sug = suggestedTopics(), sig = sug.join(',');
    if (sig !== state.topicSig) { state.topicSig = sig; if (sug.length) state.topic = sug[0]; }
    var rest = Object.keys(TOPICS).filter(function (k) { return sug.indexOf(k) === -1; });
    var opt = function (k) { return '<option value="' + k + '">' + esc(TOPICS[k].label) + '</option>'; };
    topicSelect.innerHTML = sug.length
      ? '<optgroup label="Passend zu deinem Zweig">' + sug.map(opt).join('') + '</optgroup>' +
        (rest.length ? '<optgroup label="Weitere Themengebiete">' + rest.map(opt).join('') + '</optgroup>' : '')
      : rest.map(opt).join('');
    var box = $('#topic-suggest');
    box.hidden = !sug.length;
    if (sug.length) {
      $('#topic-suggest-label').textContent = 'Vorgeschlagen für „' + state.profile.branch + '“';
      $('#topic-suggest-chips').innerHTML = sug.map(function (k) {
        return '<button type="button" class="pill pill-btn" data-topic="' + k + '" aria-pressed="false">' + esc(TOPICS[k].label) + '</button>';
      }).join('');
    }
  }
  $('#topic-suggest-chips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-topic]');
    if (!b) return;
    state.topic = b.dataset.topic;
    renderChips();
  });

  function renderChips() {
    var t = TOPICS[state.topic];
    topicSelect.value = state.topic;
    $$('#topic-suggest-chips [data-topic]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.topic === state.topic)); });
    $('#topic-question').textContent = t.q;
    $('#chips').innerHTML = t.items.map(function (name) {
      var on = skillLevel(name) > 0;
      return '<button type="button" class="chip" aria-pressed="' + on + '" data-skill="' + esc(name) + '">' + icon('i-check') + esc(name) + '</button>';
    }).join('');
  }
  function renderSelection() {
    var box = $('#selection-chips');
    if (!state.skills.length) { box.innerHTML = '<p class="selection-empty">Noch nichts ausgewählt.</p>'; return; }
    box.innerHTML = state.skills.map(function (s) {
      return '<span class="pill pill--mist">' + esc(s.name) + '</span>';
    }).join('');
  }
  $('#chips').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var name = chip.dataset.skill;
    var idx = state.skills.findIndex(function (s) { return s.name === name; });
    if (idx > -1) state.skills.splice(idx, 1);
    else state.skills.push({ name: name, topic: state.topic, level: 5 });
    chip.setAttribute('aria-pressed', String(idx === -1));
    renderSelection();
  });

  /* Kenntnisse bewerten */
  function setFill(range) { range.style.setProperty('--fill', ((range.value - 1) / 9 * 100) + '%'); }
  function renderRatings() {
    var box = $('#ratings');
    if (!state.skills.length) {
      box.style.display = 'block';
      box.innerHTML = '<div class="ratings-empty"><span>Du hast noch keine Kenntnisse ausgewählt. Für jede Auswahl erscheint hier ein Regler.</span>' +
        '<button type="button" class="btn btn-secondary btn-sm" data-go="signup-skills">Kenntnisse auswählen</button></div>';
      return;
    }
    box.style.display = '';
    box.innerHTML = state.skills.map(function (s, i) {
      return '<div class="rating" style="animation-delay:' + (reduceMotion ? 0 : i * 40) + 'ms">' +
        '<div class="rating-head"><label class="rating-name" for="rate-' + i + '">' + esc(s.name) + '</label>' +
        '<span class="rating-topic">' + esc(TOPICS[s.topic].label) + '</span>' +
        '<output class="rating-value" id="rate-out-' + i + '" for="rate-' + i + '">' + s.level + '</output>' +
        '<button type="button" class="icon-btn icon-btn--plain rating-remove" data-remove-skill="' + esc(s.name) + '" aria-label="' + esc(s.name) + ' entfernen">' + icon('i-x') + '</button></div>' +
        '<input class="range" type="range" min="1" max="10" step="1" id="rate-' + i + '" value="' + s.level + '" data-index="' + i + '" aria-describedby="scale-hint">' +
        '<div class="scale" aria-hidden="true"><span>1 · Einsteiger</span><span>10 · Profi</span></div>' +
        '</div>';
    }).join('');
    $$('.range', box).forEach(setFill);
  }
  $('#ratings').addEventListener('input', function (e) {
    if (!e.target.classList.contains('range')) return;
    var i = +e.target.dataset.index;
    state.skills[i].level = +e.target.value;
    $('#rate-out-' + i).textContent = e.target.value;
    setFill(e.target);
  });
  $('#ratings').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-remove-skill]');
    if (!btn) return;
    var name = btn.dataset.removeSkill;
    state.skills = state.skills.filter(function (s) { return s.name !== name; });
    renderRatings();
  });

  /* Interessen */
  var interests = $('#f-interests');
  var updateCount = function () { $('#interests-count').textContent = interests.value.length + '/600'; };
  interests.addEventListener('input', updateCount);

  /* ---------- Matching-Animation ---------- */
  function runMatching() {
    var shell = $('#shell-matching');
    shell.classList.remove('run'); void shell.offsetWidth; shell.classList.add('run');
    var items = $$('#matching-steps li');
    items.forEach(function (li) { li.className = ''; });
    var step = reduceMotion ? 200 : 700;
    items.forEach(function (li, i) {
      matchTimers.push(setTimeout(function () {
        if (i > 0) items[i - 1].className = 'done';
        li.className = 'active';
      }, i * step));
    });
    matchTimers.push(setTimeout(function () { items[items.length - 1].className = 'done'; }, items.length * step));
    matchTimers.push(setTimeout(function () {
      var wasEditing = state.editing;
      state.editing = false;
      state.snapshot = null;
      go('results');
      toast(wasEditing ? 'Deine Matches wurden neu berechnet.' : OFFERS.length + ' passende Vorschläge gefunden.');
    }, items.length * step + 600));
  }

  /* ---------- Ergebnisse ---------- */
  function applyFilters(list, ignore) {
    var f = state.filters;
    var q = f.q.trim().toLowerCase();
    return list.filter(function (o) {
      if (ignore !== 'type' && f.type !== 'Alle' && o.type !== f.type) return false;
      if (ignore !== 'field' && f.fields.length && f.fields.indexOf(o.field) === -1) return false;
      if (ignore !== 'dist' && f.dist !== 'all' && o.km > +f.dist) return false;
      if (q) {
        var hay = [o.title, o.degree, o.provider, o.city, o.field, o.type].concat(o.why).join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  function sortList(list) {
    var s = state.filters.sort;
    return list.sort(function (a, b) {
      if (s === 'dist') return a.km - b.km || b.match - a.match;
      if (s === 'updated') return b.updated.localeCompare(a.updated);
      return b.match - a.match;
    });
  }

  function renderRail(all) {
    var f = state.filters;
    var count = function (list, fn) { return list.filter(fn).length; };
    var baseType = applyFilters(all, 'type');
    $('#type-opts').innerHTML = ['Alle'].concat(TYPES).map(function (t) {
      var n = t === 'Alle' ? baseType.length : count(baseType, function (o) { return o.type === t; });
      return '<button type="button" class="rail-opt" aria-pressed="' + (f.type === t) + '" data-type="' + t + '">' + t + ' <span class="count">' + n + '</span></button>';
    }).join('');
    var baseField = applyFilters(all, 'field');
    $('#field-opts').innerHTML = FIELDS.map(function (fl) {
      var n = count(baseField, function (o) { return o.field === fl; });
      return '<button type="button" class="rail-opt" aria-pressed="' + (f.fields.indexOf(fl) > -1) + '" data-field="' + esc(fl) + '">' + esc(fl) + ' <span class="count">' + n + '</span></button>';
    }).join('');
    $('#dist-opts').innerHTML = DISTANCES.map(function (d) {
      return '<button type="button" class="rail-opt" aria-pressed="' + (f.dist === d[0]) + '" data-dist="' + d[0] + '">' + d[1] + '</button>';
    }).join('');
    $('#fg-type').classList.toggle('is-done', f.type !== 'Alle');
    $('#fg-field').classList.toggle('is-done', f.fields.length > 0);
    $('#fg-dist').classList.toggle('is-done', f.dist !== 'all');
    $('#reset-filters').hidden = f.type === 'Alle' && !f.fields.length && f.dist === 'all' && !f.q;
    var active = (f.type !== 'Alle' ? 1 : 0) + f.fields.length + (f.dist !== 'all' ? 1 : 0);
    var badge = $('#rail-badge');
    badge.textContent = active; badge.hidden = !active;
    badge.setAttribute('aria-label', active + ' Filter aktiv');

    var top = state.skills.slice().sort(function (a, b) { return b.level - a.level; });
    var chips = top.slice(0, 2).map(function (s) { return '<span class="rail-chip">' + esc(s.name) + ' ' + s.level + '/10</span>'; });
    if (top.length > 2) chips.push('<span class="rail-chip">+' + (top.length - 2) + '</span>');
    if (!top.length) chips.push('<span class="rail-chip">Noch keine Kenntnisse</span>');
    if (interests.value.trim()) chips.push('<span class="rail-chip">' + icon('i-spark') + 'Interessen-Text</span>');
    $('#profile-chips').innerHTML = chips.join('');
  }

  function stopHTML(o, i, animate) {
    var side = i % 2 === 0 ? 'stop--left' : 'stop--right';
    return '<li class="stop ' + side + (state.paneOpen.results && o.id === state.selectedId ? ' is-selected' : '') + '" data-id="' + o.id + '">' +
      '<div class="stop-card">' +
        '<button type="button" class="stop-open" data-open="' + o.id + '" aria-haspopup="dialog">' +
          '<span class="tag">' + icon(TYPE_ICON[o.type]) + o.type + '</span>' +
          '<span class="stop-title">' + esc(o.title) + '</span>' +
          '<span class="stop-sub">' + esc(o.provider) + '</span>' +
          '<span class="stop-place">' + icon('i-pin') + esc(o.city) + ' · ' + o.km + '\u00a0km</span>' +
          '<span class="stop-more">Details ansehen' + icon('i-chevron-right') + '</span>' +
        '</button>' +
        '<button type="button" class="icon-btn fav stop-fav" data-fav="' + o.id + '" aria-pressed="' + isFav(o.id) + '" aria-label="' + esc(o.title) + ' als Favorit merken">' +
          icon('i-heart', 'i-heart-off') + icon('i-heart', 'i-fill i-heart-on') + '</button>' +
      '</div>' +
      '<span class="pnode">' + ring(o.match, { empty: animate }) + '</span>' +
    '</li>';
  }

  function renderResults(mode) {
    var all = scored();
    renderRail(all);
    var list = sortList(applyFilters(all));
    var empty = !list.length;
    var prevSel = state.selectedId;
    state.visibleIds = list.map(function (o) { return o.id; });
    if (state.selectedId && state.visibleIds.indexOf(state.selectedId) === -1) state.selectedId = state.paneOpen.results && !empty ? list[0].id : null;
    $('#path').hidden = empty;
    $('#results-empty').hidden = !empty;
    var sortText = { match: 'sortiert nach Übereinstimmung', dist: 'sortiert nach Entfernung', updated: 'die neuesten zuerst' }[state.filters.sort];
    $('#results-sub').textContent = (list.length === all.length
      ? all.length + ' Vorschläge, '
      : list.length + ' von ' + all.length + ' Vorschlägen, ') + sortText + '. Klick auf einen Vorschlag für alle Details.';
    if (empty) { $('#offer-list').innerHTML = ''; renderPane('results', false); return; }

    var animate = !!mode && !reduceMotion;
    var p = state.profile;
    $('#offer-list').innerHTML =
      '<li class="path-start"><span class="pnode pnode--start" aria-hidden="true">' + esc(initials()) + '</span>' +
        '<span class="plabel"><strong>Dein Start</strong>' + esc([p.school, p.branch, p.year].filter(Boolean).join(' · ')) + '</span></li>' +
      list.map(function (o, i) { return stopHTML(o, i, animate); }).join('') +
      '<li class="path-end"><span class="pnode pnode--end" aria-hidden="true"></span>' +
        '<span class="plabel"><strong>Ende deiner Vorschläge</strong>Ändere Filter oder Angaben, um weitere zu finden.</span></li>';
    drawPath(animate ? mode : false);
    renderPane('results', mode === 'full' || prevSel !== state.selectedId);
  }

  /* Pfad zeichnen und entlang des Pfads einblenden */
  var pathTimers = [];
  function layoutPath() {
    var path = $('#path');
    if (path.hidden || !path.offsetParent) return null;
    var svg = $('#path-svg');
    var pr = path.getBoundingClientRect();
    var w = path.offsetWidth, h = path.offsetHeight;
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    $('#path-grad').setAttribute('y2', h);
    var pts = $$('#offer-list .pnode').map(function (n) {
      var r = n.getBoundingClientRect();
      return { x: r.left - pr.left + r.width / 2, y: r.top - pr.top + r.height / 2 };
    });
    if (pts.length < 2) return null;
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], k = (b.y - a.y) * 0.55;
      d += ' C' + a.x.toFixed(1) + ' ' + (a.y + k).toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + (b.y - k).toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    }
    $('#path-trail').setAttribute('d', d);
    $('#path-line').setAttribute('d', d);
    return pts;
  }
  function fillRing(scope) { $$('.ring-bar', scope).forEach(function (c) { c.setAttribute('stroke-dasharray', c.dataset.dash); }); }

  function drawPath(mode) {
    pathTimers.forEach(clearTimeout); pathTimers = [];
    var path = $('#path');
    var line = $('#path-line');
    var pts = layoutPath();
    var stops = $$('#offer-list > li');
    if (!pts || !mode) {
      path.classList.remove('is-animating');
      line.style.transition = 'none'; line.style.strokeDasharray = 'none'; line.style.strokeDashoffset = '0';
      stops.forEach(function (li) { li.classList.add('is-in'); });
      fillRing(path);
      return;
    }
    path.classList.add('is-animating');
    var n = stops.length - 2;
    var D = mode === 'full' ? Math.min(2400, 600 + n * 230) : 700;
    var len = line.getTotalLength();
    line.style.transition = 'none';
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.getBoundingClientRect();
    line.style.transition = 'stroke-dashoffset ' + D + 'ms linear';
    line.style.strokeDashoffset = '0';
    var y0 = pts[0].y, span = Math.max(1, pts[pts.length - 1].y - y0);
    stops.forEach(function (li, i) {
      if (i === 0) { li.classList.add('is-in'); return; }
      var t = D * (pts[i].y - y0) / span;
      pathTimers.push(setTimeout(function () { li.classList.add('is-in'); fillRing(li); }, Math.max(0, t - 140)));
    });
    pathTimers.push(setTimeout(function () {
      path.classList.remove('is-animating');
      line.style.transition = 'none'; line.style.strokeDasharray = 'none';
    }, D + 80));
  }
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (state.screen === 'results') layoutPath();
      if (state.screen === 'start') { buildStomps(); layoutHowPath(); if (window.ScrollTrigger && howReady) ScrollTrigger.refresh(); }
      moveNavInd();
    }, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    if (state.screen === 'results') layoutPath();
    if (state.screen === 'start') { layoutHowPath(); if (window.ScrollTrigger && howReady) ScrollTrigger.refresh(); }
    moveNavInd();
  });

  function resetFilters() {
    state.filters = { type: 'Alle', fields: [], dist: 'all', q: '', sort: state.filters.sort };
    $('#f-search').value = '';
    renderResults('quick');
  }

  $('#type-opts').addEventListener('click', function (e) {
    var t = e.target.closest('[data-type]');
    if (!t) return;
    state.filters.type = t.dataset.type;
    renderResults('quick');
  });
  $('#field-opts').addEventListener('click', function (e) {
    var b = e.target.closest('[data-field]');
    if (!b) return;
    var fl = b.dataset.field, i = state.filters.fields.indexOf(fl);
    if (i > -1) state.filters.fields.splice(i, 1); else state.filters.fields.push(fl);
    renderResults('quick');
  });
  $('#dist-opts').addEventListener('click', function (e) {
    var b = e.target.closest('[data-dist]');
    if (!b) return;
    state.filters.dist = b.dataset.dist;
    renderResults('quick');
  });
  $('#f-sort').addEventListener('change', function (e) { state.filters.sort = e.target.value; renderResults('quick'); });
  var searchTimer = null;
  $('#f-search').addEventListener('input', function (e) {
    state.filters.q = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { renderResults('quick'); }, 180);
  });
  $('#reset-filters').addEventListener('click', resetFilters);
  $('#edit-profile').addEventListener('click', function () {
    state.editing = true;
    state.snapshot = { skills: JSON.parse(JSON.stringify(state.skills)), interests: interests.value };
    go('signup-skills');
  });

  $('#offer-list').addEventListener('click', function (e) {
    var fav = e.target.closest('[data-fav]');
    if (fav) { toggleFav(fav.dataset.fav, fav); return; }
    var opt = e.target.closest('[data-cat-opt]');
    if (opt) {
      var oid = opt.closest('.cat-pop').dataset.for;
      var cat = opt.dataset.catOpt || null;
      state.favs[oid] = cat;
      saveFavs();
      closePop();
      toast(cat ? 'In „' + cat + '“ gespeichert.' : 'Ohne Kategorie gespeichert.');
      return;
    }
    var open = e.target.closest('[data-open]');
    if (open) showDetails('results', open.dataset.open);
  });

  /* Favorit setzen + Kategorie-Auswahl */
  var pop = null;
  function closePop() {
    if (pop) { var li = pop.closest('.stop'); if (li) li.classList.remove('has-pop'); pop.remove(); pop = null; }
  }
  function openPop(id, btn) {
    closePop();
    var card = btn.closest('.stop-card');
    pop = document.createElement('div');
    pop.className = 'cat-pop';
    pop.dataset.for = id;
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Kategorie wählen');
    pop.innerHTML = '<p class="cat-pop-title">' + icon('i-heart', 'i-fill') + 'Zu Favoriten hinzugefügt</p>' +
      '<p class="cat-pop-sub">In welche Kategorie soll das Angebot?</p>' +
      '<div class="cat-opts">' + state.cats.map(function (c) {
        return '<button type="button" class="cat-opt" data-cat-opt="' + esc(c) + '">' + esc(c) + '</button>';
      }).join('') + '<button type="button" class="cat-opt" data-cat-opt="">Ohne Kategorie</button></div>';
    card.appendChild(pop);
    card.closest('.stop').classList.add('has-pop');
    var first = pop.querySelector('.cat-opt');
    if (first) first.focus();
  }
  function syncHearts(id) {
    $$('[data-fav="' + id + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(isFav(id))); });
    updateBadge(true);
    if (state.selectedId === id) renderPane('results', false);
  }
  function toggleFav(id, btn) {
    var title = OFFER_BY_ID[id].title;
    if (isFav(id)) {
      delete state.favs[id];
      saveFavs();
      closePop();
      toast('„' + title + '“ aus Favoriten entfernt.');
    } else {
      state.favs[id] = null;
      saveFavs();
      if (btn) openPop(id, btn);
    }
    syncHearts(id);
  }
  document.addEventListener('mousedown', function (e) {
    if (pop && !pop.contains(e.target) && !e.target.closest('[data-fav]')) closePop();
  });

  function updateBadge(bump) {
    var b = $('#fav-badge');
    b.textContent = Object.keys(state.favs).filter(function (id) { return OFFER_BY_ID[id]; }).length;
    if (bump && !reduceMotion) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }

  /* ---------- Details: einklappbare rechte Spalte (Ergebnisse, Favoriten) oder Panel ---------- */
  function catOptions(selected) {
    return '<option value="">Ohne Kategorie</option>' + state.cats.map(function (c) {
      return '<option' + (selected === c ? ' selected' : '') + '>' + esc(c) + '</option>';
    }).join('');
  }
  function detailHTML(o, scope) {
    var fav = isFav(o.id);
    var why = reasons(o).slice(0, 3).map(function (r) { return '<span class="pill">' + esc(r) + '</span>'; }).join('');
    var reqs = o.ok.slice(0, 2).map(function (x) { return '<li class="ok">' + icon('i-check') + '<span>' + esc(x) + '</span></li>'; }).join('') +
      o.gap.slice(0, 2).map(function (x) { return '<li class="gap">' + icon('i-info') + '<span>' + esc(x) + '</span></li>'; }).join('');
    var facts = o.facts.map(function (f) { return '<div class="d-fact"><span>' + esc(f[0]) + '</span><strong>' + esc(f[1]) + '</strong></div>'; }).join('');
    return '<div class="d-head">' +
        '<div class="offer-meta"><span class="tag">' + icon(TYPE_ICON[o.type]) + o.type + '</span><span>' + esc(o.field) + '</span></div>' +
        '<h2 class="offer-title d-title" id="' + scope + '-title">' + esc(o.title) + '<span class="degree">' + esc(o.degree) + '</span></h2>' +
        '<p class="offer-provider">' + icon('i-pin') + '<span>' + esc(o.provider) + ', ' + esc(o.city) + ' <span class="dist">· ' + o.km + ' km</span></span></p>' +
      '</div>' +
      '<div class="d-match">' + ring(o.match) + '<div><strong>' + o.match + ' %</strong><span>' + matchLabel(o.match) + '</span></div></div>' +
      '<div class="d-fav">' +
        '<button type="button" class="btn btn-sm ' + (fav ? 'btn-secondary' : 'btn-ghost') + '" data-dfav aria-pressed="' + fav + '">' +
          icon('i-heart', fav ? 'i-fill' : '') + (fav ? 'Gemerkt' : 'Merken') + '</button>' +
        (fav ? '<div class="d-cat"><label class="label" for="' + scope + '-cat">Kategorie</label><select class="input select select--sm" id="' + scope + '-cat" data-dcat>' + catOptions(state.favs[o.id]) + '</select></div>' : '') +
      '</div>' +
      '<section class="d-section"><h3>Passt, weil</h3><div class="mini-chips">' + why + '</div></section>' +
      '<section class="d-section"><h3>Erfüllt und offen</h3><ul class="detail-list">' + reqs + '</ul></section>' +
      '<div class="d-facts">' + facts + '</div>' +
      '<div class="d-actions"><button type="button" class="btn btn-primary btn-sm" data-apply>Zur Bewerbung ' + icon('i-external') + '</button>' +
        '<p class="d-updated">Aktualisiert am ' + formatDate(o.updated) + '</p></div>';
  }

  var PANES = {
    results:   { el: '#detail-pane', scope: 'p', label: 'Vorschlag', sel: 'selectedId',    ids: 'visibleIds',    box: '#path',     item: '#offer-list .stop' },
    favorites: { el: '#fav-pane',    scope: 'f', label: 'Favorit',   sel: 'favSelectedId', ids: 'favVisibleIds', box: '#fav-grid', item: '#fav-grid .fav-card' }
  };
  function paneEl(key) { return $(PANES[key].el); }
  function paneVisible(key) { return state.screen === key && getComputedStyle(paneEl(key)).display !== 'none'; }
  function markSelection(key) {
    var P = PANES[key], id = state[P.sel], on = state.paneOpen[key] && !!id;
    $(P.box).classList.toggle('has-selection', on);
    $$(P.item).forEach(function (el) { el.classList.toggle('is-selected', on && el.dataset.id === id); });
  }
  function renderPane(key, animate) {
    var P = PANES[key], el = paneEl(key);
    var body = $('[data-pane-body]', el), pos = $('[data-pane-pos]', el);
    var id = state[P.sel], o = id ? scoredById(id) : null;
    markSelection(key);
    $('[data-pane-empty]', el).hidden = !!o;
    if (!o) { body.innerHTML = ''; body.dataset.id = ''; pos.textContent = 'Details'; return; }
    var ids = state[P.ids], idx = ids.indexOf(o.id);
    pos.textContent = idx > -1 ? P.label + ' ' + (idx + 1) + ' von ' + ids.length : 'Details';
    body.dataset.id = o.id;
    body.classList.toggle('no-anim', !animate || reduceMotion);
    body.innerHTML = detailHTML(o, P.scope);
    if (animate) $('.pane-inner', el).scrollTop = 0;
  }
  function setPaneOpen(key, open, focus) {
    var P = PANES[key], el = paneEl(key);
    if (open && !state[P.sel] && state[P.ids].length) state[P.sel] = state[P.ids][0];
    state.paneOpen[key] = open;
    el.classList.toggle('is-collapsed', !open);
    $('.pane-handle', el).setAttribute('aria-expanded', String(open));
    renderPane(key, open);
    if (key === 'results') followPath();
    if (focus) {
      var target = open ? $('.pane-close', el) : $('.pane-handle', el);
      setTimeout(function () { if (target) target.focus(); }, 80);
    }
  }
  // Während die Spalte auf- oder zuklappt, wird der Pfad in der Mitte mitgezeichnet
  function followPath() {
    var t0 = performance.now();
    (function tick(now) { layoutPath(); if (now - t0 < 650) requestAnimationFrame(tick); })(t0);
  }
  function selectItem(key, id) {
    state[PANES[key].sel] = id;
    if (!state.paneOpen[key]) setPaneOpen(key, true);
    else renderPane(key, true);
  }
  function showDetails(key, id) { if (paneVisible(key)) selectItem(key, id); else openDrawer(id); }
  // Filterleiste links ein- und ausklappen
  function setRailOpen(open, focus) {
    var rail = $('#filter-rail');
    state.railOpen = open;
    rail.classList.toggle('is-collapsed', !open);
    $('.rail-handle').setAttribute('aria-expanded', String(open));
    followPath();
    if (focus) {
      var target = open ? $('.rail-head .panel-toggle') : $('.rail-handle');
      setTimeout(function () { if (target) target.focus(); }, 80);
    }
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-rail-toggle]')) { setRailOpen(!state.railOpen, true); return; }
    var tog = e.target.closest('[data-pane-toggle]');
    if (tog) { var key = tog.dataset.paneToggle; setPaneOpen(key, !state.paneOpen[key], true); }
  });

  function renderDrawer(animate) {
    var o = scoredById(state.drawerId);
    if (!o) return;
    var body = $('#drawer-body');
    body.dataset.id = o.id;
    body.classList.toggle('no-anim', !animate);
    body.innerHTML = detailHTML(o, 'd');
  }
  function openDrawer(id) {
    closePop();
    state.drawerId = id;
    renderDrawer(true);
    openModal('modal-offer');
    $('.drawer-panel').scrollTop = 0;
  }
  function drawerOpenFor(id) { return !$('#modal-offer').hidden && state.drawerId === id; }
  function refreshDetails(id, except) {
    ['results', 'favorites'].forEach(function (k) {
      var b = $('[data-pane-body]', paneEl(k));
      if (b !== except && state[PANES[k].sel] === id) renderPane(k, false);
    });
    if (except !== $('#drawer-body') && drawerOpenFor(id)) renderDrawer(false);
  }
  function bindDetail(body) {
    body.addEventListener('click', function (e) {
      var id = body.dataset.id;
      if (!id) return;
      if (e.target.closest('[data-dfav]')) {
        if (isFav(id)) { delete state.favs[id]; toast('„' + OFFER_BY_ID[id].title + '“ aus Favoriten entfernt.'); }
        else { state.favs[id] = null; toast('Gemerkt. Wähle eine Kategorie, wenn du möchtest.'); }
        saveFavs();
        syncHearts(id);
        if (state.screen === 'favorites') renderFavs();
        refreshDetails(id, null);
        var btn = $('[data-dfav]', body); if (btn) btn.focus();
        return;
      }
      if (e.target.closest('[data-apply]')) toast('Im Prototyp ist die Bewerbungsseite nicht verlinkt.', 'i-info');
    });
    body.addEventListener('change', function (e) {
      if (!e.target.matches('[data-dcat]')) return;
      var id = body.dataset.id;
      state.favs[id] = e.target.value || null;
      saveFavs();
      toast(e.target.value ? 'In „' + e.target.value + '“ gespeichert.' : 'Ohne Kategorie gespeichert.');
      if (state.screen === 'favorites') renderFavs();
      refreshDetails(id, body);
    });
  }
  bindDetail($('#drawer-body'));
  $$('[data-pane-body]').forEach(bindDetail);

  /* ---------- Navigation: gleitende Markierung ---------- */
  function moveNavInd() {
    var ind = $('.nav-ind');
    if (!ind) return;
    var cur = $('.app-nav [aria-current="page"]');
    if (!cur || !cur.offsetWidth) { ind.style.opacity = '0'; return; }
    ind.style.left = cur.offsetLeft + 'px';
    ind.style.width = cur.offsetWidth + 'px';
    ind.style.opacity = '1';
  }

  /* ---------- Startseite: "So funktioniert's" mit GSAP-Scroll-Animationen ---------- */
  var howReady = false;
  function layoutHowPath() {
    var box = $('#how-steps');
    if (!box || !box.offsetParent) return;
    var br = box.getBoundingClientRect();
    var pts = $$('.how-node', box).map(function (n) {
      var r = n.getBoundingClientRect();
      return { x: r.left - br.left + r.width / 2, y: r.top - br.top + r.height / 2 };
    });
    if (pts.length < 2) return;
    pts.unshift({ x: pts[0].x, y: pts[0].y - 90 });
    pts.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y + 90 });
    var sway = box.offsetWidth >= 900 ? 70 : 0;
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], k = (b.y - a.y) / 2;
      var s = (i === 1 || i === pts.length - 1) ? 0 : (i % 2 ? 1 : -1) * sway;
      d += ' C' + (a.x + s).toFixed(1) + ' ' + (a.y + k).toFixed(1) + ' ' + (b.x + s).toFixed(1) + ' ' + (b.y - k).toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    }
    var svg = $('#how-path');
    svg.setAttribute('width', box.offsetWidth); svg.setAttribute('height', box.offsetHeight);
    svg.setAttribute('viewBox', '0 0 ' + box.offsetWidth + ' ' + box.offsetHeight);
    $('#how-trail').setAttribute('d', d);
    $('#how-line').setAttribute('d', d);
  }
  function pictTimeline(row, tl) {
    var q = function (s) { return row.querySelectorAll(s); };
    var n = row.dataset.row;
    if (n === '1') {
      tl.from(q('.p1-card'), { y: 24, opacity: 0, duration: .5 }, '-=.35')
        .from(q('.p1-fill'), { attr: { width: 0 }, duration: .8, stagger: .15, ease: 'power2.out' }, '-=.2')
        .from(q('.p1-cap'), { scale: 0, svgOrigin: '292 58', duration: .5, ease: 'back.out(2.4)' }, '-=.6')
        .from(q('.p1-check'), { scale: 0, svgOrigin: '282 222', duration: .5, ease: 'back.out(2.4)' }, '-=.2');
    } else if (n === '2') {
      tl.from(q('.p2-panel'), { y: 24, opacity: 0, duration: .5 }, '-=.35')
        .from(q('.p2-fill'), { attr: { width: 0 }, duration: .9, stagger: .12, ease: 'power2.out' }, '-=.15')
        .from(q('.p2-knob'), { attr: { cx: 128 }, duration: .9, stagger: .12, ease: 'power2.out' }, '<')
        .from(q('.p2-chip'), { scale: 0, transformOrigin: '50% 50%', duration: .45, stagger: .12, ease: 'back.out(2.2)' }, '-=.6')
        .from(q('.p2-bubble'), { y: 20, opacity: 0, duration: .5 }, '-=.2');
    } else {
      var num = row.querySelector('.p3-num'), c = { v: 0 };
      num.textContent = '0%';
      tl.from(q('.p3-ring'), { scale: .8, opacity: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(1.8)' }, '-=.35')
        .from(q('.p3-bar'), { attr: { 'stroke-dasharray': '0 377' }, duration: 1.2, ease: 'power2.out' }, '-=.1')
        .to(c, { v: 94, duration: 1.2, ease: 'power2.out', onUpdate: function () { num.textContent = Math.round(c.v) + '%'; } }, '<')
        .from(q('.p3-mini-l'), { x: -40, opacity: 0, duration: .6 }, '-=1')
        .from(q('.p3-mini-r'), { x: 40, opacity: 0, duration: .6 }, '<')
        .from(q('.p3-trail'), { opacity: 0, duration: .4 }, '<')
        .from(q('.p3-heart'), { scale: 0, svgOrigin: '252 68', duration: .5, ease: 'back.out(3)' }, '-=.2')
        .to(q('.p3-heart'), { scale: 1.18, svgOrigin: '252 68', duration: .16, yoyo: true, repeat: 1 });
    }
  }
  function initHow() {
    layoutHowPath();
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;
    if (howReady) { requestAnimationFrame(function () { layoutHowPath(); ScrollTrigger.refresh(); }); return; }
    howReady = true;
    gsap.registerPlugin(ScrollTrigger);
    var heroST = { trigger: '.hero-band', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-visual', { y: -60, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero-copy', { y: -24, ease: 'none', scrollTrigger: { trigger: '.hero-band', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.how-head > *', { y: 30, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.how-head', start: 'top 85%' } });
    var line = $('#how-line');
    line.setAttribute('pathLength', '1');
    gsap.fromTo(line, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#how-steps', start: 'top 70%', end: 'bottom 60%', scrub: .6 } });
    $$('.how-row').forEach(function (row) {
      var flip = row.classList.contains('how-row--flip');
      var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.from(row.querySelector('.how-node'), { scale: 0, duration: .5, ease: 'back.out(2.2)' })
        .from(row.querySelector('.how-text').children, { x: flip ? -40 : 40, opacity: 0, duration: .6, stagger: .08 }, '<.1')
        .from(row.querySelector('.how-art'), { y: 40, opacity: 0, scale: .94, duration: .7 }, '<');
      pictTimeline(row, tl);
      ScrollTrigger.create({ trigger: row, start: 'top 75%', onEnter: function () { tl.play(); }, onLeaveBack: function () { tl.reverse(); } });
    });
    gsap.from('.how-cta', { y: 24, opacity: 0, duration: .6, ease: 'power3.out', scrollTrigger: { trigger: '.how-cta', start: 'top 92%' } });
  }

  /* ---------- Startseite: Pfade stapfen Strich für Strich über den Rand ---------- */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function buildStomps() {
    $$('.stomp').forEach(function (svg) {
      var h = svg.getBoundingClientRect().height;
      if (!h || getComputedStyle(svg).display === 'none') return;
      var w = 110, right = svg.classList.contains('stomp--right');
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('width', w); svg.setAttribute('height', h);
      var xs = right ? [78, 30, 84, 34, 76, 40] : [32, 80, 26, 76, 34, 70];
      var n = xs.length - 1, top = -12, span = h + 24;
      var d = 'M' + xs[0] + ' ' + top;
      for (var i = 1; i <= n; i++) {
        var y0 = top + span * (i - 1) / n, y1 = top + span * i / n, k = (y1 - y0) / 2;
        d += ' C' + xs[i - 1] + ' ' + (y0 + k) + ' ' + xs[i] + ' ' + (y1 - k) + ' ' + xs[i] + ' ' + y1;
      }
      svg.innerHTML = '';
      var guide = document.createElementNS(SVG_NS, 'path');
      guide.setAttribute('d', d); guide.setAttribute('fill', 'none');
      svg.appendChild(guide);
      var L = guide.getTotalLength(), step = 22, dash = 9, perStep = 0.12;
      var count = Math.floor((L - dash) / step);
      var T = count * perStep / 0.55;
      var frag = document.createDocumentFragment();
      for (var j = 0; j <= count; j++) {
        var s = right ? L - j * step : j * step;
        var a = guide.getPointAtLength(s), b = guide.getPointAtLength(right ? s - dash : s + dash);
        var dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
        var off = (j % 2 ? 1 : -1) * 4, nx = -dy / len * off, ny = dx / len * off;
        var line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', (a.x + nx).toFixed(1)); line.setAttribute('y1', (a.y + ny).toFixed(1));
        line.setAttribute('x2', (b.x + nx).toFixed(1)); line.setAttribute('y2', (b.y + ny).toFixed(1));
        line.style.animationDuration = T.toFixed(2) + 's';
        line.style.animationDelay = (j * perStep + (right ? 1.4 : 0.4)).toFixed(2) + 's';
        frag.appendChild(line);
      }
      svg.removeChild(guide);
      svg.appendChild(frag);
    });
  }

  /* ---------- Favoriten ---------- */
  function renderFavs() {
    var all = scored();
    var byId = {};
    all.forEach(function (o) { byId[o.id] = o; });
    var ids = Object.keys(state.favs).filter(function (id) { return byId[id]; });
    var hasLoose = ids.some(function (id) { return !state.favs[id]; });
    var tabs = ['Alle'].concat(state.cats);
    if (hasLoose) tabs.push('Ohne Kategorie');
    if (tabs.indexOf(state.favTab) === -1) state.favTab = 'Alle';

    var inTab = function (id, t) {
      if (t === 'Alle') return true;
      if (t === 'Ohne Kategorie') return !state.favs[id];
      return state.favs[id] === t;
    };
    $('#cat-tabs').innerHTML = tabs.map(function (t) {
      var n = ids.filter(function (id) { return inTab(id, t); }).length;
      return '<button type="button" class="tab" aria-pressed="' + (state.favTab === t) + '" data-cat="' + esc(t) + '">' + esc(t) + ' <span class="count">' + n + '</span></button>';
    }).join('');

    var list = ids.filter(function (id) { return inTab(id, state.favTab); })
      .map(function (id) { return byId[id]; })
      .sort(function (a, b) { return b.match - a.match; });
    var prevSel = state.favSelectedId;
    state.favVisibleIds = list.map(function (o) { return o.id; });
    if (state.favVisibleIds.indexOf(state.favSelectedId) === -1) state.favSelectedId = state.paneOpen.favorites && list.length ? list[0].id : null;

    $('#fav-grid').innerHTML = list.map(function (o) {
      return '<article class="fav-card" data-id="' + o.id + '">' +
        '<div class="fav-top">' + ring(o.match, { small: true }) +
          '<span class="tag">' + icon(TYPE_ICON[o.type]) + o.type + '</span>' +
          '<button type="button" class="icon-btn fav" aria-pressed="true" data-unfav="' + o.id + '" aria-label="' + esc(o.title) + ' aus Favoriten entfernen">' + icon('i-heart', 'i-heart-off') + icon('i-heart', 'i-fill i-heart-on') + '</button>' +
        '</div>' +
        '<h3 class="offer-title">' + esc(o.title) + '<span class="degree">' + esc(o.degree) + '</span></h3>' +
        '<p class="offer-provider">' + icon('i-pin') + '<span>' + esc(o.provider) + ', ' + esc(o.city) + '</span></p>' +
        '<div class="fav-foot">' +
          '<div class="field"><label class="label" for="cat-' + o.id + '">Kategorie</label>' +
          '<select class="input select select--sm" id="cat-' + o.id + '" data-assign="' + o.id + '">' + catOptions(state.favs[o.id]) + '</select></div>' +
          '<button type="button" class="btn btn-link" data-show="' + o.id + '">Details ansehen</button>' +
        '</div>' +
      '</article>';
    }).join('');

    var empty = $('#fav-empty');
    empty.hidden = list.length > 0;
    if (!list.length) {
      if (!ids.length) {
        $('#fav-empty-title').textContent = 'Du hast noch keine Favoriten';
        $('#fav-empty-text').textContent = 'Markiere Vorschläge auf der Ergebnisseite mit dem Herz. Sie erscheinen dann hier.';
      } else {
        $('#fav-empty-title').textContent = 'In „' + state.favTab + '“ ist noch nichts';
        $('#fav-empty-text').textContent = 'Ordne Favoriten über das Feld „Kategorie“ auf der Karte zu.';
      }
    }
    renderPane('favorites', prevSel !== state.favSelectedId);
  }

  $('#cat-tabs').addEventListener('click', function (e) {
    var t = e.target.closest('[data-cat]');
    if (!t) return;
    state.favTab = t.dataset.cat;
    renderFavs();
  });
  $('#fav-grid').addEventListener('change', function (e) {
    var sel = e.target.closest('[data-assign]');
    if (!sel) return;
    state.favs[sel.dataset.assign] = sel.value || null;
    saveFavs();
    renderFavs();
    toast(sel.value ? 'In „' + sel.value + '“ verschoben.' : 'Kategorie entfernt.');
  });
  $('#fav-grid').addEventListener('click', function (e) {
    var un = e.target.closest('[data-unfav]');
    if (un) {
      state.pendingRemove = un.dataset.unfav;
      $('#remove-text').textContent = '„' + OFFER_BY_ID[state.pendingRemove].title + '“ verschwindet aus deinen Favoriten. Auf der Ergebnisseite kannst du es jederzeit wieder merken.';
      openModal('modal-remove');
      return;
    }
    if (e.target.closest('select, label, .field')) return;
    var show = e.target.closest('[data-show]');
    var card = e.target.closest('.fav-card');
    var id = show ? show.dataset.show : card ? card.dataset.id : null;
    if (id) showDetails('favorites', id);
  });
  $('#remove-confirm').addEventListener('click', function () {
    var id = state.pendingRemove;
    if (id) {
      delete state.favs[id];
      saveFavs();
      toast('„' + OFFER_BY_ID[id].title + '“ aus Favoriten entfernt.');
    }
    state.pendingRemove = null;
    closeModal($('#modal-remove'));
    renderFavs(); updateBadge(true);
  });

  /* Neue Kategorie */
  $('#new-cat').addEventListener('click', function () {
    $('#c-name').value = '';
    setError($('#c-name'), '');
    openModal('modal-category');
  });
  $('#form-category').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#c-name');
    var name = input.value.trim().replace(/\s+/g, ' ');
    var exists = state.cats.concat(['Alle', 'Ohne Kategorie']).some(function (c) { return c.toLowerCase() === name.toLowerCase(); });
    var msg = !name ? 'Bitte gib einen Namen ein.' : exists ? 'Diese Kategorie gibt es schon.' : '';
    setError(input, msg);
    if (msg) { input.focus(); return; }
    state.cats.push(name);
    state.favTab = name;
    saveFavs();
    closeModal($('#modal-category'));
    renderFavs();
    toast('Kategorie „' + name + '“ erstellt.');
  });
  $('#c-name').addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) setError(e.target, ''); });

  /* ---------- Konto ---------- */
  function dl(rows) {
    return rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
  }
  function renderAccount() {
    var p = state.profile;
    $('#acc-avatar').textContent = initials();
    $('#acc-name').textContent = p.first + ' ' + p.last;
    $('#acc-email').textContent = p.email;
    $('#acc-schoolline').textContent = [p.school, p.branch].filter(Boolean).join(' · ');
    $('#view-personal').innerHTML = dl([['Vorname', p.first], ['Nachname', p.last], ['E-Mail', p.email]]);
    $('#view-school').innerHTML = dl([
      ['Schule', p.school], ['Zweig', p.branch || 'Kein Zweig hinterlegt'],
      ['Schulstufe', p.level + (p.year ? ' (' + p.year + ')' : '')],
      ['Höchster Abschluss', p.compulsory ? p.degree : 'Pflichtschule noch nicht abgeschlossen']
    ]);
    $('#view-goal').innerHTML = dl([['Dein Ziel', GOAL_TEXT[state.goal]]]);
    $('#view-password').innerHTML = dl([['Passwort', '••••••••••'], ['Zuletzt geändert', 'bei der Registrierung']]);
    $$('.acc-section[data-sec]').forEach(function (s) { setEditing(s, false); });
  }
  function setEditing(section, on) {
    var form = $('.acc-form', section);
    var view = $('.acc-view', section);
    var btn = $('[data-edit]', section);
    form.hidden = !on;
    view.hidden = on;
    btn.hidden = on;
    section.classList.toggle('is-editing', on);
    if (!on) $$('[data-required]', form).forEach(function (i) { setError(i, ''); });
  }
  function fillAccountForm(sec) {
    var p = state.profile;
    if (sec === 'personal') { $('#a-first').value = p.first; $('#a-last').value = p.last; $('#a-email').value = p.email; }
    if (sec === 'school') pickers.a.setValue({ skz: p.skz, branch: p.branch, stufe: p.stufe, degree: p.degree });
    if (sec === 'goal') $('#a-goal').value = state.goal;
    if (sec === 'password') { $('#a-pw-old').value = ''; $('#a-pw-new').value = ''; $('#a-pw-repeat').value = ''; }
  }
  $('.account-sections').addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]');
    if (ed) {
      var section = ed.closest('.acc-section');
      $$('.acc-section[data-sec]').forEach(function (s) { if (s !== section) setEditing(s, false); });
      fillAccountForm(ed.dataset.edit);
      setEditing(section, true);
      var first = $('.acc-form input, .acc-form select', section);
      if (first) first.focus();
      return;
    }
    var cancel = e.target.closest('[data-cancel]');
    if (cancel) {
      var sec = cancel.closest('.acc-section');
      setEditing(sec, false);
      $('[data-edit]', sec).focus();
    }
  });
  function finishEdit(form, msg) {
    var sec = form.closest('.acc-section');
    renderAccount();
    applyProfile();
    $('[data-edit]', sec).focus();
    toast(msg);
  }
  $('#form-personal').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll(this)) return;
    var p = state.profile, oldMail = p.email;
    p.first = $('#a-first').value.trim(); p.last = $('#a-last').value.trim(); p.email = $('#a-email').value.trim();
    $('#f-first').value = p.first; $('#f-last').value = p.last; $('#f-email').value = p.email;
    finishEdit(this, p.email !== oldMail ? 'Gespeichert. Wir haben einen Bestätigungslink an ' + p.email + ' geschickt.' : 'Deine persönlichen Daten wurden gespeichert.');
  });
  $('#form-school').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll(this)) return;
    var p = state.profile, v = pickers.a.read();
    ['school', 'skz', 'schoolType', 'branch', 'stufe', 'level', 'year', 'topics', 'compulsory', 'degree'].forEach(function (k) { p[k] = v[k]; });
    pickers.f.setValue(v);   // Registrierung und Konto zeigen dieselben Angaben
    finishEdit(this, 'Schule und Abschluss wurden gespeichert.');
  });
  $('#form-goal').addEventListener('submit', function (e) {
    e.preventDefault();
    state.goal = $('#a-goal').value;
    var radio = $('input[name="goal"][value="' + state.goal + '"]'); if (radio) { radio.checked = true; syncChoices(); }
    finishEdit(this, 'Dein Ziel wurde gespeichert.');
  });
  $('#form-password').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll(this)) return;
    var nw = $('#a-pw-new'), rp = $('#a-pw-repeat');
    if (nw.value !== rp.value) { setError(rp, 'Die beiden Passwörter stimmen nicht überein.'); rp.focus(); return; }
    finishEdit(this, 'Dein Passwort wurde geändert.');
  });
  $('#delete-account').addEventListener('click', function () { openModal('modal-delete'); });
  $('#delete-confirm').addEventListener('click', function () {
    store.clear();
    state.favs = JSON.parse(JSON.stringify(DEFAULT_FAVS));
    state.cats = DEFAULT_CATS.slice();
    go('start');
    toast('Dein Konto wurde gelöscht.');
  });

  /* ---------- Modals ---------- */
  var lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id);
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add('modal-open');
    var target = m.querySelector('input:not([type="hidden"]), .btn-primary, .btn-danger, button');
    if (target) target.focus();
  }
  function closeModal(m) {
    m.hidden = true;
    if (!$$('.modal').some(function (x) { return !x.hidden; })) document.body.classList.remove('modal-open');
    if (lastFocus && document.body.contains(lastFocus) && lastFocus.offsetParent !== null) lastFocus.focus();
  }
  $$('.modal').forEach(function (m) {
    m.addEventListener('mousedown', function (e) { if (e.target === m) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMobileAccount(true); closeMobileFilter(); }
    var open = $$('.modal').filter(function (m) { return !m.hidden; }).pop();
    if (e.key === 'Escape') {
      if (open) { closeModal(open); return; }
      if (pop) { var id = pop.dataset.for; closePop(); var b = $('[data-fav="' + id + '"]'); if (b) b.focus(); return; }
      var key = state.screen;
      if (PANES[key] && state.paneOpen[key] && paneVisible(key)) setPaneOpen(key, false, true);
    }
    if (e.key === 'Tab' && open) {
      var f = $$('button, input, select, textarea, [href]', open).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* Login */
  function showLoginView() {
    $('#login-view').hidden = false;
    $('#reset-view').hidden = true;
    $('#reset-done').hidden = true;
    $('#reset-submit').hidden = false;
  }
  $('#to-reset').addEventListener('click', function () {
    $('#login-view').hidden = true; $('#reset-view').hidden = false; $('#r-email').focus();
  });
  $('#to-login').addEventListener('click', function () { showLoginView(); $('#l-email').focus(); });
  $('#form-reset').addEventListener('submit', function (e) {
    e.preventDefault();
    $('#reset-done').hidden = false;
    $('#reset-submit').hidden = true;
  });
  $('#form-login').addEventListener('submit', function (e) {
    e.preventDefault();
    readProfile();
    go('results');
    toast('Willkommen zurück, ' + state.profile.first + '.');
  });

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(msg, iconId) {
    var t = $('#toast');
    t.querySelector('use').setAttribute('href', '#' + (iconId || 'i-check'));
    $('#toast-text').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3000);
  }

  /* ---------- Start ---------- */
  $$('.hero-visual .ring').forEach(function (r) {
    var v = parseInt(r.getAttribute('aria-label'), 10);
    var bar = r.querySelector('.ring-bar'); if (bar && v) bar.style.stroke = ringColor(v);
  });
  function init() {
    if (schools.ready) pickers.f.setValue(DEFAULT_PICK);
    readProfile();
    var initial = (location.hash || '').replace('#', '');
    go(ALIASES[initial] || initial || 'start', { noFocus: true });
  }
  loadSchools().then(init);
  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    h = ALIASES[h] || h;
    if (h && h !== state.screen && SCREENS.indexOf(h) > -1 && h !== 'matching') go(h);
  });
})();
