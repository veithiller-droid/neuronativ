import { questions } from './questions.js';
import { SCALES } from './scales.js';
import { state } from "./state.js";
import { evaluate } from "./interpretation.js";
import { renderTacho } from "./tacho.js";
import { ITEM_TEXTS } from "./item_texts.js";
import { interpretScale } from "./interpretation.js";
import { renderTachoText } from "./tacho_text_render.js";
import { renderProfilePage as renderProfileView } from "./profile.js";


function labelFromPercent(p) {
  if (p < 25) return "kaum Ausprägung";
  if (p < 50) return "geringe Ausprägung";
  if (p < 75) return "mittlere Ausprägung";
  return "deutliche Ausprägung";
}

function onAnswer(scale, questionId, value) {
  state.answers[questionId] = value;
  state.scores = calculateScaleResults();
  evaluate();

  const box = document.querySelector(`.tacho-box.${scale}`);
  if (box && state.interp[scale]) {
    renderTacho(box, state.interp[scale], scale);
  }
}

export function showResults() {
  document.getElementById("questionText").style.display = "none";
  document.getElementById("scaleButtons").style.display = "none";
  document.getElementById("progress").style.display = "none";
  document.getElementById("onset-page").style.display = "none";

  window.scrollTo({ top: 0 });

  const container = document.getElementById("results");
  container.innerHTML = "<h2>Auswertung</h2>";

  const scores = calculateScaleResults();

  for (const k in scores) {
    container.innerHTML += `
      <div class="scale-result">
        <div style="margin-bottom:6px;font-weight:500;">
          ${SCALES[k].label}
        </div>

        <div class="bar">
          <div class="fill" style="width:${scores[k]}%">
            <span class="bar-value">${scores[k]}%</span>
          </div>
        </div>

        <div class="bar-label">
          ${labelFromPercent(scores[k])}
        </div>
      </div>
    `;
  }

  container.innerHTML += `
    <button id="toggle-overview" class="toggle-main">
      ▸ Gesamtauswertung anzeigen
    </button>
    <div id="overview-details" class="hidden"></div>
  `;

  const overview = document.getElementById("overview-details");
  
  for (const k in scores) {
    overview.innerHTML += `
      <div class="topic">
        <h3 class="topic-title">${SCALES[k].label}</h3>  
        <div class="topic-intro">${SCALE_INTROS[k] || ""}</div>
        <div class="topic-text" id="text-${k}"></div>

        <button class="toggle-tacho" data-scale="${k}">
          ▸ Tacho anzeigen
        </button>

        <div class="tacho-details hidden" id="tacho-box-${k}">
          <div class="tacho-box">
            <span class="tacho-inline" id="tacho-${k}"></span>
            <div class="tacho-text" id="tacho-text-${k}"></div>
          </div>
        </div>
      </div>
    `;
  }

  for (const k in scores) {
    const el = document.getElementById(`tacho-${k}`);
    if (!el) continue;

    const interp = state.interp[k];
    renderTacho(el, interp, k);

    const textBox = document.getElementById("tacho-text-" + k);
    if (textBox) {
      renderTachoText(textBox, interp, k);
    }
  }

  renderDetailedText();

  const profileBtn = document.createElement("div");
  profileBtn.style.marginTop = "32px";
  profileBtn.innerHTML = `
  <button id="goto-profiles" class="btn-primary">
      Profilübersicht anzeigen
    </button>
  `;
  container.appendChild(profileBtn);
  
  setupResultButton(); // ← hier


  const toggleOverviewBtn = document.getElementById("toggle-overview");
  const overviewBox = document.getElementById("overview-details");

  if (toggleOverviewBtn && overviewBox) {
    toggleOverviewBtn.addEventListener("click", () => {
      overviewBox.classList.toggle("hidden");
      toggleOverviewBtn.textContent = overviewBox.classList.contains("hidden")
        ? "▸ Gesamtauswertung anzeigen"
        : "▾ Gesamtauswertung ausblenden";
    });
  }

  document.querySelectorAll(".toggle-tacho").forEach(btn => {
    btn.onclick = () => {
      const box = document.getElementById("tacho-box-" + btn.dataset.scale);
      box.classList.toggle("hidden");
      btn.textContent = box.classList.contains("hidden")
        ? "▸ Tacho anzeigen"
        : "▾ Tacho ausblenden";
    };
  });
}
// -------------------------
// ONSET 2 (nach dem Test) – neutral, ohne Diagnosewörter
// Ziel:
// - Timing pro relevanter Skala (onset_<scale>) inkl. "na" (= kommt nicht vor) + "unknown"
// - Zusatz-Abfragepunkte für strukturelle Einordnung (ohne Diagnosewörter):
//   A) Soziale Kommunikation (3 Bereiche, timing)
//   B) Wiederholungen/Routinen/Interessen/Sensorik (4 Bereiche, timing)
// - Kontext (Settings/Impairment/Verlauf/Persistenz/Primary) conditional:
//   nur wenn mind. 1x timing != "na"
// - Hyperfokus-Extras conditional:
//   nur wenn onset_hyperfocus != "na"
// -------------------------

// 1) Timing-Optionen (für alle onset_* Fragen)
const ONSET_OPTIONS = [
  { value: "na",      label: "Trifft nicht zu / kommt nicht vor" },
  { value: "early",   label: "Seit früher Kindheit (vor 6 Jahren)" },
  { value: "school",  label: "Seit Schulalter (6–12 Jahre)" },
  { value: "teen",    label: "Seit Jugend (13–18 Jahre)" },
  { value: "adult",   label: "Seit Erwachsenenalter (18+ Jahre)" },
  { value: "unknown", label: "Weiß nicht / unklar" }
];

// 2) Kontext-Optionen (separat, NICHT onset_*)
const ONSET_CTX_SETTINGS_OPTIONS = [
  { value: "1",       label: "Nur in einem Bereich" },
  { value: "2plus",   label: "In mindestens zwei Bereichen" },
  { value: "3plus",   label: "In vielen Bereichen (3+)" },
  { value: "unknown", label: "Weiß nicht / unklar" }
];

const ONSET_CTX_IMPAIRMENT_OPTIONS = [
  { value: "none",     label: "Kaum / nicht beeinträchtigend" },
  { value: "mild",     label: "Leicht beeinträchtigend" },
  { value: "moderate", label: "Deutlich beeinträchtigend" },
  { value: "severe",   label: "Stark beeinträchtigend" },
  { value: "unknown",  label: "Weiß nicht / unklar" }
];

const ONSET_CTX_PERSISTENCE_OPTIONS = [
  { value: "months",          label: "Seit Monaten" },
  { value: "years",           label: "Seit Jahren" },
  { value: "since_childhood", label: "Schon sehr lange / seit Kindheit" },
  { value: "unknown",         label: "Weiß nicht / unklar" }
];

const ONSET_CTX_COURSE_OPTIONS = [
  { value: "stable",  label: "Ziemlich stabil über die Zeit" },
  { value: "phases",  label: "Phasenweise (kommt und geht)" },
  { value: "stress",  label: "Deutlich stress-/belastungsabhängig" },
  { value: "worse",   label: "Eher zunehmend/stärker geworden" },
  { value: "better",  label: "Eher rückläufig/abgemildert" },
  { value: "unknown", label: "Weiß nicht / unklar" }
];

const ONSET_CTX_PRIMARY_SETTING_OPTIONS = [
  { value: "work",    label: "Vor allem bei Arbeit/Leistungssituationen" },
  { value: "home",    label: "Vor allem Zuhause/Alltag" },
  { value: "social",  label: "Vor allem in sozialen Situationen" },
  { value: "school",  label: "Vor allem in Schule/Studium (oder früher dort)" },
  { value: "mixed",   label: "Kein klares Hauptsetting / gemischt" },
  { value: "unknown", label: "Weiß nicht / unklar" }
];

// 3) Skalen-Timing (1 Frage pro Skala)
const ONSET2_DOMAINS = [
  { key: "attention",   text: "Fällt es Ihnen schwer, die Aufmerksamkeit zu halten oder Ablenkungen auszublenden? Seit wann ist das so?" },
  { key: "executive",   text: "Fällt es Ihnen schwer, Aufgaben zu beginnen, zu planen, zu priorisieren oder dranzubleiben? Seit wann ist das so?" },
  { key: "hyperfocus",  text: "Vertiefen Sie sich so stark, dass Aufhören schwerfällt oder Bedürfnisse/Zeit vergessen werden? Seit wann ist das so?" },
  { key: "sensory",     text: "Sind Reize (Licht, Geräusche, Berührung, Gerüche) für Sie oft deutlich intensiver oder anstrengender? Seit wann ist das so?" },
  { key: "social",      text: "Sind soziale Situationen für Sie oft anstrengend oder schwer einschätzbar (z.B. Smalltalk, Gruppen, Missverständnisse)? Seit wann ist das so?" },
  { key: "structure",   text: "Belasten Sie Änderungen/Unvorhergesehenes stark oder brauchen Sie viel Struktur/Vorhersehbarkeit? Seit wann ist das so?" },
  { key: "masking",     text: "Passen Sie sich in sozialen Situationen stark an oder haben das Gefühl, eine Rolle zu spielen? Seit wann ist das so?" },
  { key: "overload",    text: "Geraten Sie schnell in Überreizung/Überforderung oder brauchen Rückzug/Erholung (z.B. Shutdown)? Seit wann ist das so?" },
  { key: "emotreg",     text: "Kippen Emotionen bei Ihnen manchmal sehr schnell oder sehr stark (0→100)? Seit wann ist das so?" },
  { key: "alexithymia", text: "Fällt es Ihnen schwer, eigene Gefühle früh zu erkennen oder in Worte zu fassen? Seit wann ist das so?" }
];

// 4) Zusatz-Timing: soziale Kommunikation (3 Bereiche, neutral)
const ONSET2_ASD_A_DOMAINS = [
  {
    key: "asdA_reciprocity",
    text: "Ist es für Sie oft schwer, in Gesprächen/Beziehungen spontan hin- und herzuwechseln (z.B. Interesse zeigen, 'mitgehen', passend reagieren)? Seit wann ist das so?"
  },
  {
    key: "asdA_nonverbal",
    text: "Ist es für Sie oft schwer, nonverbale Signale sicher zu nutzen/zu lesen (Blick, Mimik, Gestik, Tonfall) - oder kostet es Sie bewusstes Nachdenken? Seit wann ist das so?"
  },
  {
    key: "asdA_relationships",
    text: "Ist es für Sie oft schwer, Beziehungen aufzubauen/zu halten oder unterschiedliche Nähe-/Regel-Erwartungen zu verstehen? Seit wann ist das so?"
  }
];

// 5) Zusatz-Timing: Routinen/Wiederholungen/Interessen/Sensorik (4 Bereiche, neutral)
const ONSET2_RRB_DOMAINS = [
  {
    key: "rrb_b1",
    text: "Gibt es bei Ihnen wiederholte Handlungen/Bewegungen oder wiederkehrende Phrasen/Sprachmuster (auch subtil), die sich 'automatisch' einstellen? Seit wann ist das so?"
  },
  {
    key: "rrb_b2",
    text: "Gibt es bei Ihnen starkes Festhalten an Routinen/Ritualen oder deutlichen Stress bei Änderungen/Unterbrechungen? Seit wann ist das so?"
  },
  {
    key: "rrb_b3",
    text: "Gibt es bei Ihnen sehr intensive, eng umrissene Interessen, die über längere Zeit viel Raum einnehmen? Seit wann ist das so?"
  },
  {
    key: "rrb_b4",
    text: "Gibt es bei Ihnen ungewöhnlich starke oder ungewöhnlich geringe Reaktionen auf Sinnesreize (oder starkes 'Anziehen' durch bestimmte Reize/Details)? Seit wann ist das so?"
  }
];

// 6) Kontext-Fragen (conditional)
// -> nur wenn mind. 1x timing != "na"
const ONSET2_CTX_QUESTIONS = [
  {
    id: "ctx_settings",
    text: "Betrachten Sie alle vorherigen zutreffenden Punkte zusammen: In wie vielen verschiedenen Lebensbereichen zeigt sich das? (z.B. nur bei der Arbeit, oder Arbeit + Zuhause + soziale Situationen)",
    options: ONSET_CTX_SETTINGS_OPTIONS
  },
  {
    id: "ctx_impairment",
    text: "Betrachten Sie alle vorherigen zutreffenden Punkte zusammen: Wie stark beeinträchtigt Sie das insgesamt im Alltag?",
    options: ONSET_CTX_IMPAIRMENT_OPTIONS
  },
  {
    id: "ctx_course",
    text: "Betrachten Sie alle vorherigen zutreffenden Punkte zusammen: Wie ist der Verlauf über die Zeit?",
    options: ONSET_CTX_COURSE_OPTIONS
  },
  {
    id: "ctx_persistence",
    text: "Betrachten Sie alle vorherigen zutreffenden Punkte zusammen: Wie lange besteht das in dieser Form ungefähr?",
    options: ONSET_CTX_PERSISTENCE_OPTIONS
  },
  {
    id: "ctx_primary_setting",
    text: "Wo fällt es insgesamt am deutlichsten auf (Hauptsetting)?",
    options: ONSET_CTX_PRIMARY_SETTING_OPTIONS
  }
];

// 7) Hyperfokus-Extras (conditional)
// -> nur wenn onset_hyperfocus != "na"
// IDs sind bewusst NICHT onset_*
const ONSET2_HYPERFOCUS_EXTRA = [
  {
    id: "hf_topic_stability",
    text: "Wenn Vertiefung auftritt: Bleiben die Themen eher langfristig (Monate/Jahre) oder wechseln sie häufig (Wochen/Monate)?",
    options: [
      { value: "stable_long",  label: "Eher langfristig stabil (Monate/Jahre)" },
      { value: "mixed",        label: "Gemischt (manches stabil, manches wechselt)" },
      { value: "switch_often", label: "Eher häufig wechselnd (Wochen/Monate)" },
      { value: "unknown",      label: "Weiß nicht / unklar" }
    ]
  },
  {
    id: "hf_switch_pain",
    text: "Ist bei Vertiefung vor allem das Aufhören/Wechseln schwer, auch wenn Sie es wollen?",
    options: [
      { value: "yes_strong", label: "Ja, deutlich" },
      { value: "yes_some",   label: "Ja, etwas" },
      { value: "no",         label: "Nein / eher nicht" },
      { value: "unknown",    label: "Weiß nicht / unklar" }
    ]
  },
  {
    id: "hf_structure_coupling",
    text: "Ist die Vertiefung oft verbunden mit Ordnen/Regeln/Präzision/Systematik (Details, Kategorien, Muster)?",
    options: [
      { value: "often",     label: "Oft" },
      { value: "sometimes", label: "Manchmal" },
      { value: "rare",      label: "Selten" },
      { value: "unknown",   label: "Weiß nicht / unklar" }
    ]
  }
];

// -------------------------
// State & Funktionen (wie bei dir, aber erweitert)
// -------------------------

// dynamische Fragenliste (nur relevante Bereiche)
let ONSET_QUESTIONS = [];
let ctxQuestionsSkipped = false;

function pickOnset2Domains(scoresRounded, elevated = 65, cap = 7) {
  const adhdCore = ["attention", "executive", "hyperfocus"];
  const score = (k) => (Number(scoresRounded?.[k]) || 0);

  const hasAdhdCore = adhdCore.some(k => score(k) >= elevated);

  const keys = ONSET2_DOMAINS.map(d => d.key);

  let picked = keys
    .filter(k => score(k) >= elevated)
    .sort((a,b) => score(b) - score(a))
    .slice(0, cap);

  if (hasAdhdCore) {
    for (const k of adhdCore) {
      if (!picked.includes(k)) picked.push(k);
    }
  }

  picked.sort((a,b) => score(b) - score(a));

  const coreBonus = hasAdhdCore ? adhdCore.length : 0;
  return picked.slice(0, cap + coreBonus);
}

function buildOnset2Questions(domainKeys) {
  // Skalen-Fragen (nur die picked/elevated)
  const scaleQs = ONSET2_DOMAINS
    .filter(d => domainKeys.includes(d.key))
    .map(d => ({
      id: `onset_${d.key}`,
      text: d.text,
      options: ONSET_OPTIONS,
      kind: "timing",
      domain: d.key
    }));

  // ASD-A Fragen (immer alle 3)
  const asdAQs = ONSET2_ASD_A_DOMAINS.map(d => ({
    id: `onset_${d.key}`,
    text: d.text,
    options: ONSET_OPTIONS,
    kind: "timing",
    domain: d.key
  }));

  // ASD-B (RRB) Fragen (immer alle 4)
  const rrbQs = ONSET2_RRB_DOMAINS.map(d => ({
    id: `onset_${d.key}`,
    text: d.text,
    options: ONSET_OPTIONS,
    kind: "timing",
    domain: d.key
  }));

  // Kontext-Fragen (conditional: ggf. überspringen)
  const ctxQs = ONSET2_CTX_QUESTIONS.map(q => ({
    ...q,
    kind: "ctx"
  }));

  // Hyperfokus-Extras (conditional: später dynamisch eingeschoben)
  const hfExtras = ONSET2_HYPERFOCUS_EXTRA.map(q => ({
    ...q,
    kind: "extra"
  }));

  // Reihenfolge:
  // Skalen → ASD-A → RRB → (HF-Extras werden NACH onset_hyperfocus eingefügt) → Kontext
  // (Kontext bleibt am Ende, damit shouldSkipCtxQuestions sauber bleibt.)
  const out = [...scaleQs, ...asdAQs, ...rrbQs];

  // Insert HF extras right after onset_hyperfocus, but only if that timing question exists.
  const hfIndex = out.findIndex(q => q.id === "onset_hyperfocus");
  if (hfIndex !== -1) {
    out.splice(hfIndex + 1, 0, ...hfExtras);
  } else {
    // Falls hyperfocus nicht in domainKeys ist, gibt es keine hf Extras (keine Fragebasis).
    // Du erzwingst hyperfocus im pickOnset2Domains bei ADHS-Core sowieso, daher meist nicht relevant.
  }

  out.push(...ctxQs);
  return out;
}

// Hilfsfunktion: Prüfe ob ctx-Fragen übersprungen werden sollen
// Wichtig: nur timing-Fragen zählen (onset_*) und NICHT ctx/extra
function shouldSkipCtxQuestions() {
  const timingKeys = Object.keys(onsetAnswers).filter(k => k.startsWith("onset_"));
  if (timingKeys.length === 0) return false;

  const hasAnyRelevant = timingKeys.some(k => onsetAnswers[k] !== "na");
  return !hasAnyRelevant;
}

// Zusatz: Hyperfokus-Extras überspringen, wenn onset_hyperfocus === "na"
function shouldSkipHyperfocusExtras() {
  const v = onsetAnswers?.["onset_hyperfocus"];
  // noch nicht beantwortet -> nicht skippen (weil wir noch auf die Antwort warten)
  if (!v) return false;
  return v === "na";
}

// Erweiterte Answer-Funktion (optional, wenn du standalone nutzt)
function answerOnset2(value) {
  const q = ONSET_QUESTIONS[onsetCurrent];
  if (!q) return { done: true, onsetAnswers };

  const v = String(value);

  onsetAnswers[q.id] = v;
  onsetCurrent++;

  // Wenn wir gleich in HF-Extras gehen würden, aber hyperfocus ist "na" -> HF-Extras überspringen
  let nextQ = ONSET_QUESTIONS[onsetCurrent];
  if (nextQ && nextQ.kind === "extra" && shouldSkipHyperfocusExtras()) {
    while (ONSET_QUESTIONS[onsetCurrent] && ONSET_QUESTIONS[onsetCurrent].kind === "extra") {
      onsetCurrent++;
    }
    nextQ = ONSET_QUESTIONS[onsetCurrent];
  }

  // Wenn ctx startet und alle timing = "na" -> ctx überspringen
  if (nextQ && nextQ.kind === "ctx" && shouldSkipCtxQuestions()) {
    ctxQuestionsSkipped = true;
    return {
      done: true,
      onsetAnswers,
      skippedCtx: true,
      reason: "Alle timing-Fragen mit 'trifft nicht zu' beantwortet"
    };
  }

  const done = onsetCurrent >= ONSET_QUESTIONS.length;
  return {
    done,
    onsetAnswers,
    index: onsetCurrent,
    total: ONSET_QUESTIONS.length,
    skippedCtx: false
  };
}

// Reset-Funktion
function resetOnset2() {
  ONSET_QUESTIONS = [];
  onsetCurrent = 0;
  Object.keys(onsetAnswers).forEach(k => delete onsetAnswers[k]);
  ctxQuestionsSkipped = false;
}

const TOTAL = questions.length;
let current = 0;
let onsetCurrent = 0;
const onsetAnswers = {};

function render() {
  const q = questions[current];
  
  document.getElementById("questionText").innerText = `${current + 1}. ${q.text}`;
  document.getElementById("progress").innerText = `Frage ${current + 1} von ${TOTAL}`;

  renderScale();
}

function renderScale() {
  const container = document.getElementById("scaleButtons");
  container.className = "scale";
  container.innerHTML = "";

  const labels = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5"
  ];

  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement("button");
    btn.innerText = labels[i - 1];

    btn.onclick = () => {
      const q = questions[current];
      state.answers[q.id] = i;  // ← Fix: Direkt in state.answers speichern

      const item = ITEM_TEXTS[q.id];
      const scaleToUse = item ? item.scale : q.scale;  // ← Fallback auf q.scale, falls ITEM_TEXTS fehlt
      onAnswer(scaleToUse, q.id, i);

      if (current < TOTAL - 1) {
        current++;
        render();
      } else {
        showOnsetPage();
      }
    };

    container.appendChild(btn);
  }
}

function showOnsetPage() {
  document.getElementById("questionText").style.display = "none";
  document.getElementById("scaleButtons").style.display = "none";
  document.getElementById("progress").style.display = "none";

  const onsetPage = document.getElementById("onset-page");
  onsetPage.style.display = "block";

  // ✅ Onset2 dynamisch aus auffälligen Skalen zusammenstellen
  // state.scores ist bereits das letzte Rounded-Ergebnis (0..100)
  const domainKeys = pickOnset2Domains(state.scores, 65, 7);
  ONSET_QUESTIONS = buildOnset2Questions(domainKeys);

  // Fallback: falls nichts ≥65 ist, frage die Top-3 (damit Onset2 nicht leer ist)
  if (ONSET_QUESTIONS.length === 0) {
    const keys = Object.keys(SCALES).map(k => [k, state.scores?.[k] ?? 0]).sort((a,b)=>b[1]-a[1]);
    const top = keys.slice(0, 3).map(x => x[0]);
    ONSET_QUESTIONS = buildOnset2Questions(top);
  }

  // ✅ Reset pro Durchlauf
  onsetCurrent = 0;
  for (const k in onsetAnswers) delete onsetAnswers[k];

  renderOnsetQuestion();
}


function renderOnsetQuestion() {
  // NEU: Verstecke Header beim ersten Onset-Durchlauf
  if (onsetCurrent === 0) {
    const header = document.querySelector('.header-banner');
    if (header) header.style.display = 'none';
    
    const legend = document.querySelector('.scale-legend');
    if (legend) legend.style.display = 'none';
  }
  
  const q = ONSET_QUESTIONS[onsetCurrent];
  if (!q) {
    // Fertig mit Onset-Fragen
    state.onset = {
      ...onsetAnswers,
      _ctx_skipped: ctxQuestionsSkipped
    };
    document.getElementById("onset-page").style.display = "none";
    showResults();
    return;
  }
  

  document.getElementById("onset-question-text").innerHTML = q.text;

  const container = document.getElementById("onset-options");
  container.innerHTML = "";

  // Welche Options? timing vs. ctx
  const opts = q.options || ONSET_OPTIONS;

  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "onset-button";
    btn.innerText = opt.label;

    btn.onclick = () => {
      // Speichere Antwort
      onsetAnswers[q.id] = opt.value;

      // NEU: Hyperfocus-Extras überspringen, wenn onset_hyperfocus === "na"
const n = ONSET_QUESTIONS[onsetCurrent + 1];
if (n && n.kind === "extra" && onsetAnswers["onset_hyperfocus"] === "na") {
  while (ONSET_QUESTIONS[onsetCurrent + 1] && ONSET_QUESTIONS[onsetCurrent + 1].kind === "extra") {
    onsetCurrent++;
  }
}


      // Prüfe ob ctx übersprungen werden soll
      const nextQ = ONSET_QUESTIONS[onsetCurrent + 1];
      if (nextQ && nextQ.kind === "ctx" && shouldSkipCtxQuestions()) {
        // Alle timing = "na" → ctx überspringen
        ctxQuestionsSkipped = true;
        state.onset = {
          ...onsetAnswers,
          _ctx_skipped: true
        };
        document.getElementById("onset-page").style.display = "none";
        showResults();
        return;
      }

      // Nächste Frage oder fertig
      if (onsetCurrent < ONSET_QUESTIONS.length - 1) {
        onsetCurrent++;
        renderOnsetQuestion();
      } else {
        state.onset = {
          ...onsetAnswers,
          _ctx_skipped: ctxQuestionsSkipped
        };
        document.getElementById("onset-page").style.display = "none";
        showResults();
      }
    };

    container.appendChild(btn);
  });

  const prog = document.getElementById("onset-progress");
  if (prog) {
    prog.innerText = `Frage ${onsetCurrent + 1} von ${ONSET_QUESTIONS.length}`;
  }
}

function calculateScaleResults() {
  const raw = {};      // Float 0..100
  const rounded = {};  // Integer 0..100 (wie bisher)

  for (const k in SCALES) {
    let sum = 0, c = 0;

    SCALES[k].items.forEach(id => {
      const v = state.answers[id];
      if (v !== null && v !== undefined) { sum += v; c++; }
    });

    if (!c) {
      raw[k] = 0;
      rounded[k] = 0;
      continue;
    }

    // Likert 1..6 -> 0..100
    const avg = sum / c;                 // 1..6
    let pct = ((avg - 1) / 5) * 100;     // 0..100

    // clamp
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    raw[k] = pct;
    rounded[k] = Math.round(pct);
  }

  // NEU: Rohwerte dauerhaft im State halten
  state.scoresRaw = raw;

  // Rückgabe bleibt wie bisher: Integer für UI + evaluate()
  return rounded;
}


const SCALE_INTROS = {
  attention: "Diese Skala beschreibt, wie Aufmerksamkeit, Antrieb und innere Steuerung im Alltag erlebt werden. Sie bezieht sich nicht auf Fähigkeit oder Intelligenz, sondern auf den inneren Aufwand, mit dem Aufgaben begonnen, aufrechterhalten und abgeschlossen werden. Viele neurodivergente Menschen erleben hier deutliche Schwankungen, abhängig von Interesse, Kontext und innerer Belastung.",

  sensory: "Diese Skala bezieht sich auf die Wahrnehmung und Verarbeitung von Sinneseindrücken wie Geräuschen, Licht, Berührung oder visueller Unruhe. Unterschiede in diesem Bereich sind bei neurodivergenten Menschen häufig und sagen nichts über Belastbarkeit aus, sondern darüber, wie intensiv Reize innerlich ankommen.",

  social: "Diese Skala beschreibt, wie soziale Situationen innerlich wahrgenommen, eingeordnet und verarbeitet werden. Sie bezieht sich weniger auf soziales Können als auf den inneren Aufwand, der mit Interaktion, Interpretation und Präsenz verbunden sein kann.",

  masking: "Diese Skala bezieht sich auf bewusste oder unbewusste Anpassungsleistungen im sozialen Umfeld. Viele neurodivergente Menschen entwickeln Strategien, um Erwartungen zu erfüllen oder nicht aufzufallen. Diese Anpassung kann hilfreich sein, ist aber oft mit innerem Energieaufwand verbunden.",

  structure: "Diese Skala erfasst das Bedürfnis nach Vorhersehbarkeit, Routinen und klaren Strukturen. Für viele neurodivergente Menschen bietet Struktur wichtige innere Sicherheit und reduziert Überlastung.",

  overload: "Diese Skala beschreibt, wie schnell innere Belastungsgrenzen erreicht werden und wie lange Erholung braucht. Überlastung entsteht oft durch die Summe vieler kleiner Reize oder Anforderungen.",

  alexithymia: "Diese Skala bezieht sich auf die Fähigkeit, eigene Gefühle wahrzunehmen, zu benennen und einzuordnen. Unterschiede in diesem Bereich sind häufig bei neurodivergenten Menschen und sagen nichts über emotionale Tiefe aus.",

  executive: "Diese Skala erfasst exekutive Funktionen wie Arbeitsgedächtnis, Handlungsplanung, Impulskontrolle und kognitive Flexibilität. Diese Funktionen kosten bei neurodivergenten Menschen oft mehr Energie als erwartet.",

  emotreg: "Diese Skala beschreibt, wie Gefühle in ihrer Intensität und Dauer reguliert werden können. Emotionale Dysregulation ist sowohl bei ADHS als auch bei Autismus häufig und keine Willensschwäche.",

  hyperfocus: "Diese Skala erfasst die Fähigkeit zu intensiver Vertiefung bei persönlichem Interesse. Hyperfokus ist charakteristisch für ADHS und zeigt, dass Aufmerksamkeit nicht grundsätzlich gestört ist, sondern interessenbasiert funktioniert."
};

function renderDetailedText() {
  const grouped = {};

  for (const id in state.answers) {  // ← Fix: state.answers statt answers
    const a = state.answers[id];
    if (!a) continue;

    const item = ITEM_TEXTS[id];
    if (!item) continue;

    const scale = item.scale;
    if (!grouped[scale]) grouped[scale] = [];
    grouped[scale].push(item.texts[a]);
  }

  for (const scale in grouped) {
    const target = document.getElementById("text-" + scale);
    if (!target) continue;

    target.innerHTML = `
      <div class="text-box">
        ${grouped[scale].join(" ")}
      </div>
    `;
  }
}

const startBtn = document.getElementById("start-test");
if (startBtn) {
  startBtn.onclick = () => {
    state.meta = {
      age: document.getElementById("meta-age")?.value || null,
      gender: document.getElementById("meta-gender")?.value || null,
      diagnoses: Array.from(
        document.getElementById("meta-diagnosis")?.selectedOptions || []
      ).map(o => o.value),
      onset: document.getElementById("meta-onset")?.value || null,
      stress: document.getElementById("meta-stress")?.value || null,
      context: document.getElementById("meta-context")?.value || null,
      medication: document.getElementById("meta-medication")?.value || null,
      selfview: document.getElementById("meta-selfview")?.value || null
    };

    const modal = document.getElementById("meta-modal");
    if (modal) modal.style.display = "none";

    render();
  };
}

const skipBtn = document.getElementById("skip-meta");
if (skipBtn) {
  skipBtn.onclick = () => {
    const modal = document.getElementById("meta-modal");
    if (modal) modal.style.display = "none";

    render();
  };
}

// -------------------------
// ABSCHLUSS-FLOW (ersetzt den alten "goto-profiles" Event-Listener)
// Einfügen am Ende von test.js — alten Event-Listener entfernen
// -------------------------

const BACKEND_URL = "https://neuronativ-production.up.railway.app";

// Wird aufgerufen wenn showResults() fertig ist
// Ersetzt den alten "goto-profiles" Button-Handler
function setupResultButton() {
  const btn = document.getElementById("goto-profiles");
  if (!btn) return;

  btn.textContent = "Zur Auswertung";
  btn.onclick = () => showConsentModal();
}

// -------------------------
// CONSENT MODAL
// -------------------------
function showConsentModal() {
  // Modal falls noch nicht im DOM
  let modal = document.getElementById("consent-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "consent-modal";
    modal.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    `;
    modal.innerHTML = `
      <div style="
        background: var(--bg-box);
        padding: 36px;
        max-width: 520px;
        width: 90%;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      ">
        <h2 style="font-size:1.3rem;font-weight:400;margin-bottom:16px;color:var(--text-main);">
          Ihre Auswertung speichern
        </h2>
        <p style="color:var(--text-secondary);line-height:1.7;margin-bottom:20px;font-size:0.95rem;">
          Für die Auswertung werden Ihre Antworten anonymisiert an unseren Server übertragen 
          und dort gespeichert. Es werden keine persönlichen Daten wie Name oder E-Mail erhoben.
        </p>
        <ul style="color:var(--text-secondary);font-size:0.9rem;line-height:1.8;margin-bottom:24px;padding-left:20px;">
          <li>Antworten werden anonymisiert gespeichert</li>
          <li>Kein Name, keine E-Mail erforderlich</li>
          <li>Daten werden nach 90 Tagen gelöscht</li>
          <li>Keine Weitergabe an Dritte</li>
        </ul>
        <div style="display:flex;gap:12px;flex-direction:column;">
          <button id="consent-accept" style="
            background: var(--accent-main);
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          ">Einverstanden & Auswertung starten</button>
          <button id="consent-decline" style="
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-light);
            padding: 12px 28px;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
          ">Ablehnen (nur lokale Ansicht)</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.style.display = "flex";

  document.getElementById("consent-accept").onclick = async () => {
    modal.style.display = "none";
    await submitToBackend();
  };

  document.getElementById("consent-decline").onclick = () => {
    modal.style.display = "none";
    // Lokale Ansicht — direkt zur alten Profil-Seite
    window.open("profile.html", "_blank", "noopener,width=1000,height=900");
  };
}

// -------------------------
// BACKEND SUBMIT
// -------------------------
async function submitToBackend() {
  const btn = document.getElementById("goto-profiles");
  if (btn) {
    btn.textContent = "Wird übertragen…";
    btn.disabled = true;
  }

  try {
    const profileData = {
      answers: state.answers,
      meta: state.meta,
      onset: state.onset,
      itemsByScale: Object.fromEntries(
        Object.entries(SCALES).map(([k, v]) => [k, v.items])
      ),
    };

    const res = await fetch(`${BACKEND_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    const code = data.code;

    // Session-Code in localStorage für Fallback
    localStorage.setItem("neuronativ_session_code", code);

    // Zur Result-Seite
    window.location.href = `result.html?code=${code}`;

  } catch (err) {
    console.error("submit error:", err);

    if (btn) {
      btn.textContent = "Zur Auswertung";
      btn.disabled = false;
    }

    // Fallback: lokale Ansicht
    const fallback = confirm(
      "Verbindung zum Server fehlgeschlagen. " +
      "Möchten Sie die lokale Ansicht öffnen?"
    );
    if (fallback) {
      window.open("profile.html", "_blank", "noopener,width=1000,height=900");
    }
  }
}