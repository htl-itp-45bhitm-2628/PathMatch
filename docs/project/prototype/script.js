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

  /* ---------- Speicher (fällt still auf Arbeitsspeicher zurück) ---------- */
  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem('pathmatch.' + k); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem('pathmatch.' + k, JSON.stringify(v)); } catch (e) { /* ignorieren */ }
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

  var DEFAULT_CATS = ['Erste Wahl', 'Vielleicht', 'Später ansehen'];
  var DEFAULT_FAVS = { 'fhooe-se': 'Erste Wahl', 'jku-ai': 'Erste Wahl', 'nordlicht': 'Vielleicht', 'donaupixel': 'Später ansehen' };
  var GOAL_LABEL = { study: 'Ziel: Studieren', work: 'Ziel: Arbeiten', open: 'Ziel: noch offen' };

  /* ---------- Zustand ---------- */
  var state = {
    screen: 'start',
    goal: 'open',
    topic: 'prog',
    skills: [],           // [{name, topic, level}]
    profile: {},
    favs: store.get('favs', null) || JSON.parse(JSON.stringify(DEFAULT_FAVS)),
    cats: store.get('cats', null) || DEFAULT_CATS.slice(),
    filters: { type: 'Alle', fields: [], dist: 'all', q: '', sort: 'match' },
    open: {},             // aufgeklappte Ergebniskarten
    favTab: 'Alle',
    editing: false,
    pendingRemove: null
  };
  DEFAULT_SKILLS.forEach(function (s) { state.skills.push({ name: s[0], topic: s[1], level: s[2] }); });

  var saveFavs = function () { store.set('favs', state.favs); store.set('cats', state.cats); };
  var skillLevel = function (name) {
    for (var i = 0; i < state.skills.length; i++) if (state.skills[i].name === name) return state.skills[i].level;
    return 0;
  };

  /* ---------- Matching (vereinfachte Demo-Logik) ---------- */
  function scored() {
    return OFFERS.map(function (o) {
      var delta = 0;
      o.skills.forEach(function (s) { delta += skillLevel(s) - (DEFAULT_LEVEL[s] || 0); });
      var match = Math.max(30, Math.min(99, Math.round(o.base + delta)));
      return Object.assign({}, o, { match: match });
    });
  }
  function reasons(o) {
    var list = o.skills
      .filter(function (s) { return skillLevel(s) > 0; })
      .sort(function (a, b) { return skillLevel(b) - skillLevel(a); })
      .slice(0, 2)
      .map(function (s) { return s + ' ' + skillLevel(s) + '/10'; });
    if (state.goal === 'study' && o.type === 'Studium') list.push('Dein Ziel: Studieren');
    if (state.goal === 'work' && o.type !== 'Studium') list.push('Dein Ziel: Arbeiten');
    return list.concat(o.why);
  }
  function matchLabel(m) { return m >= 85 ? 'Sehr gute Übereinstimmung' : m >= 70 ? 'Gute Übereinstimmung' : 'Teilweise passend'; }
  function ring(value, small) {
    var C = 2 * Math.PI * 28;
    return '<div class="ring' + (small ? ' ring--sm' : '') + '" role="img" aria-label="' + value + ' Prozent Übereinstimmung">' +
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="ring-track" cx="32" cy="32" r="28"/>' +
      '<circle class="ring-bar" cx="32" cy="32" r="28" stroke-dasharray="' + (C * value / 100).toFixed(1) + ' ' + C.toFixed(1) + '"/></svg>' +
      '<span class="ring-value" aria-hidden="true">' + value + '<small>%</small></span></div>';
  }
  function formatDate(iso) { var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }

  /* ---------- Navigation ---------- */
  var SCREENS = ['start', 'signup1', 'signup2', 'signup3', 'matching', 'results', 'favorites'];
  var matchTimers = [];

  function go(name, opts) {
    opts = opts || {};
    if (SCREENS.indexOf(name) === -1) name = 'start';
    if (name !== 'matching') { matchTimers.forEach(clearTimeout); matchTimers = []; }
    closePop();
    state.screen = name;

    var isSignup = name.indexOf('signup') === 0;
    var isApp = name === 'results' || name === 'favorites';
    $('#shell-start').hidden = name !== 'start';
    $('#shell-signup').hidden = !isSignup;
    $('#shell-matching').hidden = name !== 'matching';
    $('#shell-app').hidden = !isApp;
    $$('[data-step]').forEach(function (el) { el.hidden = el.dataset.step !== name; });
    $$('[data-view]').forEach(function (el) { el.hidden = el.dataset.view !== name; });
    $$('[data-nav]').forEach(function (el) {
      if (el.dataset.nav === name) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });

    if (isSignup) updateStepper(name);
    if (name === 'signup3') prepareStep3();
    if (name === 'matching') runMatching();
    if (name === 'results') renderResults();
    if (name === 'favorites') renderFavs();
    updateBadge();

    try { history.replaceState(null, '', '#' + name); } catch (e) { /* in manchen Rahmen nicht erlaubt */ }
    if (!opts.keepScroll) window.scrollTo(0, 0);
    if (!opts.noFocus) {
      var root = isSignup ? $('[data-step="' + name + '"]') : isApp ? $('[data-view="' + name + '"]') : $('#shell-' + name);
      var h = root && root.querySelector('h1');
      if (h) { try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
    }
  }

  document.addEventListener('click', function (e) {
    var closer = e.target.closest('[data-close]');
    if (closer) { var m = closer.closest('.modal'); if (m) closeModal(m); }
    var link = e.target.closest('[data-go]');
    if (link) { e.preventDefault(); go(link.dataset.go); return; }
    if (e.target.closest('[data-open-login]')) { showLoginView(); openModal('modal-login'); }
    if (e.target.closest('[data-reset-filters]')) resetFilters();
  });

  /* ---------- Registrierung: Schrittanzeige ---------- */
  function updateStepper(name) {
    var idx = ['signup1', 'signup2', 'signup3'].indexOf(name);
    $$('#stepper li').forEach(function (li, i) {
      li.classList.toggle('is-done', i < idx);
      li.classList.toggle('is-current', i === idx);
      var dot = li.querySelector('.step-dot');
      dot.innerHTML = i < idx ? icon('i-check') : String(i + 1);
      if (i === idx) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }

  /* ---------- Schritt 1 ---------- */
  function setError(input, msg) {
    var field = input.closest('.field');
    var err = document.getElementById(input.id + '-err');
    field.classList.toggle('has-error', !!msg);
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
  function validate1(input) {
    var v = input.value.trim();
    if (!v) return 'Bitte ausfüllen.';
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Bitte gib eine gültige E-Mail-Adresse ein, z. B. name@example.com.';
    if (input.type === 'password' && v.length < 8) return 'Dein Passwort braucht mindestens 8 Zeichen.';
    return '';
  }
  $$('#form-step1 [data-required]').forEach(function (input) {
    input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
      if (input.getAttribute('aria-invalid')) setError(input, validate1(input));
    });
  });
  $('#f-compulsory').addEventListener('change', function (e) { $('#f-degree-wrap').hidden = !e.target.checked; });

  function readProfile() {
    state.profile = {
      first: $('#f-first').value.trim() || 'Lena',
      last: $('#f-last').value.trim() || 'Hofer',
      school: $('#f-school').value || 'HTL Leonding',
      branch: $('#f-branch').value,
      level: $('#f-level').value,
      year: $('#f-year').value
    };
    $$('[data-firstname]').forEach(function (el) { el.textContent = state.profile.first; });
    $('#user-fullname').textContent = state.profile.first + ' ' + state.profile.last;
    $('#user-school').textContent = state.profile.school;
    $('#user-avatar').textContent = (state.profile.first[0] + state.profile.last[0]).toUpperCase();
  }

  $('#form-step1').addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    $$('#form-step1 [data-required]').forEach(function (input) {
      var msg = validate1(input);
      setError(input, msg);
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }
    readProfile();
    go('signup2');
  });

  /* ---------- Schritt 2 ---------- */
  function syncChoices() {
    $$('.choice').forEach(function (c) { c.classList.toggle('is-checked', c.querySelector('input').checked); });
  }
  $$('.choice input').forEach(function (input) {
    input.addEventListener('change', syncChoices);
    input.addEventListener('focus', function () { if (input.matches(':focus-visible')) input.closest('.choice').classList.add('has-focus'); });
    input.addEventListener('blur', function () { input.closest('.choice').classList.remove('has-focus'); });
  });
  syncChoices();
  $('#form-step2').addEventListener('submit', function (e) {
    e.preventDefault();
    var checked = $('#form-step2 input[name="goal"]:checked');
    state.goal = checked ? checked.value : 'open';
    state.filters.type = state.goal === 'study' ? 'Studium' : 'Alle';
    go('signup3');
  });

  /* ---------- Schritt 3 ---------- */
  var topicSelect = $('#f-topic');
  Object.keys(TOPICS).forEach(function (key) {
    var opt = document.createElement('option');
    opt.value = key; opt.textContent = TOPICS[key].label;
    topicSelect.appendChild(opt);
  });
  topicSelect.addEventListener('change', function () { state.topic = topicSelect.value; renderChips(); });

  function renderChips() {
    var t = TOPICS[state.topic];
    topicSelect.value = state.topic;
    $('#topic-question').textContent = t.q;
    $('#chips').innerHTML = t.items.map(function (name) {
      var on = skillLevel(name) > 0;
      return '<button type="button" class="chip" aria-pressed="' + on + '" data-skill="' + esc(name) + '">' + icon('i-check') + esc(name) + '</button>';
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
    renderRatings();
  });

  function setFill(range) { range.style.setProperty('--fill', ((range.value - 1) / 9 * 100) + '%'); }
  function renderRatings() {
    var box = $('#ratings');
    if (!state.skills.length) {
      box.innerHTML = '<p class="ratings-empty">Wähle links aus, womit du schon gearbeitet hast. Für jede Auswahl erscheint hier ein Regler.</p>';
      return;
    }
    box.innerHTML = state.skills.map(function (s, i) {
      return '<div class="rating">' +
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
    renderChips(); renderRatings();
  });

  var interests = $('#f-interests');
  var updateCount = function () { $('#interests-count').textContent = interests.value.length + '/600'; };
  interests.addEventListener('input', updateCount);

  function prepareStep3() {
    renderChips(); renderRatings(); updateCount();
    $('#step3-submit-label').textContent = state.editing ? 'Neu berechnen' : 'Ergebnisse anzeigen';
    var back = $('#step3-back');
    back.dataset.go = state.editing ? 'results' : 'signup2';
    back.textContent = state.editing ? 'Abbrechen' : 'Zurück';
  }
  $('#form-step3').addEventListener('submit', function (e) { e.preventDefault(); go('matching'); });

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
      go('results');
      toast(wasEditing ? 'Deine Empfehlungen wurden neu berechnet.' : OFFERS.length + ' passende Vorschläge gefunden.');
    }, items.length * step + 500));
  }

  /* ---------- Ergebnisse ---------- */
  function applyFilters(list, ignoreType) {
    var f = state.filters;
    var q = f.q.trim().toLowerCase();
    return list.filter(function (o) {
      if (!ignoreType && f.type !== 'Alle' && o.type !== f.type) return false;
      if (f.fields.length && f.fields.indexOf(o.field) === -1) return false;
      if (f.dist !== 'all' && o.km > +f.dist) return false;
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

  function renderProfileChips() {
    var p = state.profile;
    var top = state.skills.slice().sort(function (a, b) { return b.level - a.level; });
    var chips = [p.school, p.branch, p.year, GOAL_LABEL[state.goal]].map(function (t) {
      return '<span class="pill pill--mist">' + esc(t) + '</span>';
    });
    top.slice(0, 4).forEach(function (s) { chips.push('<span class="pill">' + esc(s.name) + ' ' + s.level + '/10</span>'); });
    if (top.length > 4) chips.push('<span class="pill">+' + (top.length - 4) + ' weitere</span>');
    if (interests.value.trim()) chips.push('<span class="pill">' + icon('i-spark') + '&nbsp;Interessen-Text</span>');
    $('#profile-chips').innerHTML = chips.join('');
  }

  function renderFieldFilters() {
    var all = scored();
    $('#field-filters').innerHTML = FIELDS.map(function (f, i) {
      var n = all.filter(function (o) { return o.field === f; }).length;
      var on = state.filters.fields.indexOf(f) > -1;
      return '<label class="check check-sm"><input type="checkbox" id="ff-' + i + '" value="' + esc(f) + '"' + (on ? ' checked' : '') + '> ' + esc(f) + '<span class="count">' + n + '</span></label>';
    }).join('');
  }

  function renderTabs(base) {
    var tabs = ['Alle'].concat(TYPES);
    $('#type-tabs').innerHTML = tabs.map(function (t) {
      var n = t === 'Alle' ? base.length : base.filter(function (o) { return o.type === t; }).length;
      var on = state.filters.type === t;
      return '<button type="button" class="tab" aria-pressed="' + on + '" data-type="' + t + '">' +
        (t === 'Alle' ? '' : icon(TYPE_ICON[t])) + t + ' <span class="count">' + n + '</span></button>';
    }).join('');
  }

  function offerCard(o) {
    var open = !!state.open[o.id];
    var isFav = Object.prototype.hasOwnProperty.call(state.favs, o.id);
    var why = reasons(o).map(function (r) { return '<span class="pill">' + esc(r) + '</span>'; }).join('');
    var ok = o.ok.map(function (t) { return '<li>' + icon('i-check') + '<span>' + esc(t) + '</span></li>'; }).join('');
    var gap = o.gap.map(function (t) { return '<li>' + icon('i-info') + '<span>' + esc(t) + '</span></li>'; }).join('');
    var facts = o.facts.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('');
    return '<li data-id="' + o.id + '"><article class="offer-card' + (open ? ' is-open' : '') + '" aria-labelledby="t-' + o.id + '">' +
      '<div class="score">' + ring(o.match) + '<span class="score-label">' + matchLabel(o.match) + '</span></div>' +
      '<div class="offer-body">' +
        '<div class="offer-meta"><span class="tag">' + icon(TYPE_ICON[o.type]) + o.type + '</span><span>' + esc(o.field) + '</span><span aria-hidden="true">·</span><span>Aktualisiert am ' + formatDate(o.updated) + '</span></div>' +
        '<h3 class="offer-title" id="t-' + o.id + '">' + esc(o.title) + '<span class="degree">' + esc(o.degree) + '</span></h3>' +
        '<p class="offer-provider">' + icon('i-pin') + '<span>' + esc(o.provider) + ', ' + esc(o.city) + '</span><span class="dist">· ' + o.km + ' km</span></p>' +
        '<div class="why"><span class="why-label">Passt, weil</span>' + why + '</div>' +
      '</div>' +
      '<div class="offer-actions">' +
        '<button type="button" class="icon-btn fav" data-fav="' + o.id + '" aria-pressed="' + isFav + '" aria-label="' + esc(o.title) + ' als Favorit merken">' +
          icon('i-heart', 'i-heart-off') + icon('i-heart', 'i-fill i-heart-on') + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm details-btn" data-details="' + o.id + '" aria-expanded="' + open + '" aria-controls="d-' + o.id + '">Details ' + icon('i-chevron') + '</button>' +
      '</div>' +
      '<div class="offer-details" id="d-' + o.id + '"' + (open ? '' : ' hidden') + '>' +
        '<div class="detail-col"><h4>Das erfüllst du bereits</h4><ul class="detail-list ok">' + ok + '</ul></div>' +
        '<div class="detail-col"><h4>Das könnte noch fehlen</h4><ul class="detail-list gap">' + gap + '</ul></div>' +
        '<div class="detail-col"><h4>Bewerbung</h4><dl class="facts">' + facts + '</dl>' +
          '<button type="button" class="btn btn-primary btn-sm" data-apply="' + o.id + '">Zur Bewerbung ' + icon('i-external') + '</button></div>' +
        '<div class="details-foot"><span>' + icon('i-info') + esc(o.apply) + '</span><span>' + icon('i-calendar') + 'Zuletzt aktualisiert am ' + formatDate(o.updated) + '</span></div>' +
      '</div>' +
    '</article></li>';
  }

  function renderResults() {
    var all = scored();
    renderProfileChips();
    renderFieldFilters();
    $('#f-dist').value = state.filters.dist;
    $('#f-sort').value = state.filters.sort;
    $('#f-search').value = state.filters.q;
    var base = applyFilters(all, true);
    renderTabs(base);
    var list = sortList(applyFilters(all, false));
    $('#offer-list').innerHTML = list.map(offerCard).join('');
    $('#results-empty').hidden = list.length > 0;
    $('#results-sub').textContent = list.length === all.length
      ? all.length + ' Vorschläge auf Basis deiner Angaben'
      : list.length + ' von ' + all.length + ' Vorschlägen werden angezeigt';
  }

  function resetFilters() {
    state.filters = { type: 'Alle', fields: [], dist: 'all', q: '', sort: state.filters.sort };
    renderResults();
  }

  $('#type-tabs').addEventListener('click', function (e) {
    var t = e.target.closest('[data-type]');
    if (!t) return;
    state.filters.type = t.dataset.type;
    renderResults();
  });
  $('#field-filters').addEventListener('change', function () {
    state.filters.fields = $$('#field-filters input:checked').map(function (i) { return i.value; });
    renderResults();
  });
  $('#f-dist').addEventListener('change', function (e) { state.filters.dist = e.target.value; renderResults(); });
  $('#f-sort').addEventListener('change', function (e) { state.filters.sort = e.target.value; renderResults(); });
  $('#f-search').addEventListener('input', function (e) {
    state.filters.q = e.target.value;
    var pos = e.target.selectionStart;
    renderResults();
    var s = $('#f-search'); s.focus(); try { s.setSelectionRange(pos, pos); } catch (err) { /* ignorieren */ }
  });
  $('#reset-filters').addEventListener('click', resetFilters);
  $('#edit-profile').addEventListener('click', function () { state.editing = true; go('signup3'); });

  $('#offer-list').addEventListener('click', function (e) {
    var det = e.target.closest('[data-details]');
    if (det) {
      var id = det.dataset.details;
      var open = !state.open[id];
      state.open[id] = open;
      det.setAttribute('aria-expanded', String(open));
      $('#d-' + id).hidden = !open;
      det.closest('.offer-card').classList.toggle('is-open', open);
      return;
    }
    var fav = e.target.closest('[data-fav]');
    if (fav) { toggleFav(fav.dataset.fav, fav); return; }
    var apply = e.target.closest('[data-apply]');
    if (apply) { toast('Im Prototyp ist die Bewerbungsseite nicht verlinkt.', 'i-info'); return; }
    var opt = e.target.closest('[data-cat-opt]');
    if (opt) {
      var oid = opt.closest('.cat-pop').dataset.for;
      var cat = opt.dataset.catOpt || null;
      state.favs[oid] = cat;
      saveFavs();
      closePop();
      toast(cat ? 'In „' + cat + '“ gespeichert.' : 'Ohne Kategorie gespeichert.');
    }
  });

  /* Favorit setzen + Kategorie-Auswahl */
  var pop = null;
  function closePop() {
    if (pop) { pop.remove(); pop = null; }
  }
  function openPop(id, btn) {
    closePop();
    var card = btn.closest('.offer-card');
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
    var first = pop.querySelector('.cat-opt');
    if (first) first.focus();
  }
  function toggleFav(id, btn) {
    var title = OFFER_BY_ID[id].title;
    if (Object.prototype.hasOwnProperty.call(state.favs, id)) {
      delete state.favs[id];
      saveFavs();
      btn.setAttribute('aria-pressed', 'false');
      closePop();
      toast('„' + title + '“ aus Favoriten entfernt.');
    } else {
      state.favs[id] = null;
      saveFavs();
      btn.setAttribute('aria-pressed', 'true');
      openPop(id, btn);
    }
    updateBadge();
  }
  document.addEventListener('mousedown', function (e) {
    if (pop && !pop.contains(e.target) && !e.target.closest('[data-fav]')) closePop();
  });

  function updateBadge() {
    $('#fav-badge').textContent = Object.keys(state.favs).filter(function (id) { return OFFER_BY_ID[id]; }).length;
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

    $('#fav-grid').innerHTML = list.map(function (o) {
      var opts = '<option value="">Ohne Kategorie</option>' + state.cats.map(function (c) {
        return '<option' + (state.favs[o.id] === c ? ' selected' : '') + '>' + esc(c) + '</option>';
      }).join('');
      return '<article class="fav-card" data-id="' + o.id + '">' +
        '<div class="fav-top">' + ring(o.match, true) +
          '<span class="tag">' + icon(TYPE_ICON[o.type]) + o.type + '</span>' +
          '<button type="button" class="icon-btn fav" aria-pressed="true" data-unfav="' + o.id + '" aria-label="' + esc(o.title) + ' aus Favoriten entfernen">' + icon('i-heart', 'i-heart-off') + icon('i-heart', 'i-fill i-heart-on') + '</button>' +
        '</div>' +
        '<h3 class="offer-title">' + esc(o.title) + '<span class="degree">' + esc(o.degree) + '</span></h3>' +
        '<p class="offer-provider">' + icon('i-pin') + '<span>' + esc(o.provider) + ', ' + esc(o.city) + '</span></p>' +
        '<div class="fav-foot">' +
          '<div class="field"><label class="label" for="cat-' + o.id + '">Kategorie</label>' +
          '<select class="input select select--sm" id="cat-' + o.id + '" data-assign="' + o.id + '">' + opts + '</select></div>' +
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
    var show = e.target.closest('[data-show]');
    if (show) {
      var id = show.dataset.show;
      state.filters = { type: 'Alle', fields: [], dist: 'all', q: '', sort: state.filters.sort };
      state.open[id] = true;
      go('results', { noFocus: true });
      var card = $('#offer-list [data-id="' + id + '"] .offer-card');
      if (card) {
        card.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        card.classList.add('is-flash');
        setTimeout(function () { card.classList.remove('is-flash'); }, 1600);
        var btn = card.querySelector('[data-details]');
        if (btn) btn.focus({ preventScroll: true });
      }
    }
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
    renderFavs(); updateBadge();
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
    var open = $$('.modal').filter(function (m) { return !m.hidden; }).pop();
    if (e.key === 'Escape') {
      if (open) { closeModal(open); return; }
      if (pop) { var id = pop.dataset.for; closePop(); var b = $('[data-fav="' + id + '"]'); if (b) b.focus(); }
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
    closeModal($('#modal-login'));
    go('results');
    toast('Willkommen zurück, ' + state.profile.first + '.');
  });

  $('#logout').addEventListener('click', function () {
    go('start');
    toast('Du hast dich abgemeldet.');
  });

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(msg, iconId) {
    var t = $('#toast');
    t.querySelector('use').setAttribute('href', '#' + (iconId || 'i-check'));
    $('#toast-text').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  /* ---------- Start ---------- */
  readProfile();
  var initial = (location.hash || '').replace('#', '');
  if (initial === 'matching') initial = 'results';
  go(SCREENS.indexOf(initial) > -1 ? initial : 'start', { noFocus: true });
  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    if (h && h !== state.screen && SCREENS.indexOf(h) > -1 && h !== 'matching') go(h);
  });
})();
