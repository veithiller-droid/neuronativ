// profile_bootstrap.js
// Orchestrierung: load raw/report -> scoringengine -> profile_scoring -> render
// Keine UI-Logik im HTML.

import { calculateReport } from "./scoringengine.js";
import { calculateProfile } from "./profile_scoring.js?t=20260103";
import { renderProfilePage } from "./profile_render.js";
import { PROFILE_TEXTS } from "./profile_texts.js";

function loadJson(key) {
  const s = localStorage.getItem(key);
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}

function saveJson(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
}

function firstExisting(keys) {
  for (const k of keys) {
    const v = loadJson(k);
    if (v) return { key: k, value: v };
  }
  return { key: null, value: null };
}

// answers: bevorzugt Object {id:1..6}. Falls Array -> map über questions[]
function normalizeAnswers(raw) {
  const answers = raw?.answers;
  if (!answers) return null;

  if (typeof answers === "object" && !Array.isArray(answers)) {
    return answers;
  }

  // Array-Fallback (nur wenn questions[] vorhanden)
  if (Array.isArray(answers) && Array.isArray(raw?.questions)) {
    const out = {};
    for (let i = 0; i < raw.questions.length; i++) {
      const q = raw.questions[i];
      if (!q?.id) continue;
      out[q.id] = answers[i] ?? null;
    }
    return out;
  }

  return null;
}

// questions[] muss vorhanden sein, wenn scoringengine laufen soll
function normalizeItemsByScale(raw) {
  const m = raw?.itemsByScale;
  return m && typeof m === "object" && !Array.isArray(m) ? m : null;
}

// Onset-Daten von flacher zu strukturierter Form konvertieren

// scoringengine confidences sind 0..1 -> UI-tauglich 0..100
function confidence01ToPctMap(conf) {
  if (!conf || typeof conf !== "object") return null;
  const out = {};
  for (const [k, v] of Object.entries(conf)) {
    const n = Number(v);
    if (!Number.isFinite(n)) continue;
    out[k] = Math.max(0, Math.min(100, Math.round(n * 100)));
  }
  return out;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Daten laden
  const { value: stored } = firstExisting([
    "neurodivergenz_report",       // bevorzugt (cache)
    "neurodivergenz_raw",          // roh aus test.js
    "neurodivergenz_profile_data"  // legacy
  ]);

  if (!stored) {
    renderProfilePage(null, null, PROFILE_TEXTS);
    return;
  }

  // 2) Falls schon fertiger report: nutzen
  let report =
    stored?.schemaVersion && stored?.scales?.ui?.scores && stored?.clusters?.ui?.scores
      ? stored
      : null;

  // 3) Sonst report aus raw bauen (answers+questions notwendig)
if (!report) {
  const raw = stored;
  const itemsByScale = normalizeItemsByScale(raw);
  const answers = normalizeAnswers(raw);

  if (itemsByScale && answers) {

    
    report = calculateReport({
  answers,
  itemsByScale,
  meta: raw.meta || {},
  onset: raw.onset || {},  // <- DIREKT, flach
    });
  saveJson("neurodivergenz_report", report);
}

  }

  // 4) Falls report immer noch fehlt: Legacy-Fallback (nur scores-basierte Anzeige)
  if (!report) {
    const raw = stored;
    const scores = raw?.scores || null;
    if (!scores || typeof scores !== "object") {
      renderProfilePage(null, null, PROFILE_TEXTS);
      return;
    }

    const profileResult = calculateProfile(
      scores,
      raw?.meta || {},
      raw?.answers || null,
      raw?.onset || null,
      null
    );

    renderProfilePage(profileResult, { scores }, PROFILE_TEXTS);
    return;
  }

  // 5) Finesse/Unterprofile aus report ableiten

const meta = report.input?.meta || {};

  // answers optional für spätere Muster; wenn raw vorhanden, nehmen wir sie:
  const raw2 = loadJson("neurodivergenz_raw") || loadJson("neurodivergenz_profile_data") || {};
  const answersObj = normalizeAnswers(raw2) || null;

const profileResult = calculateProfile(
  report,      // <-- Engine-Report als Single Source
  meta,
  answersObj,
  null,        // <-- onset nicht doppelt einspeisen (kommt aus report)
  null         // <-- extras nicht doppelt (kommt aus report)
);

  saveJson("neurodivergenz_profile_result", profileResult);

  // rawData für Renderer (Top6/Addon-Fallbacks)
const rawDataForRender = { scores: report.scales?.ui?.scores || {} };

  renderProfilePage(profileResult, rawDataForRender, PROFILE_TEXTS);
});