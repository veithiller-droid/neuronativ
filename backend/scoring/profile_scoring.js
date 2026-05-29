// profile_scoring.js
// Policy-/Finesse-Layer (canonical für Befund/Policy):
// Baut aus Skalen-Scores (0..100) + optionalen Engine-Diagnostik-Signalen:
// - Cluster, Profile, Hauptbefund (inkl. single-dominant), Fokus (Begleitmerkmal), Overlays
// - Discrepancies/Patterns/Reasoning/NextSteps/Onset
//
// KOMPATIBILITÄT
// - Altes Call-Signature bleibt nutzbar:
//     calculateProfile(scoresUi, meta, answers, onsetPost, scaleConfPct)
// - Zusätzlich akzeptiert calculateProfile als 5. Argument einen Engine-Report oder ein Extras-Objekt,
//   um quality/itemSignals/patterns/subtypes/discrepancies/confidences zu nutzen.
//
// Output (für profile_render.js):
//   { clusterScores, profiles, mainProfile, discrepancies, patterns, reasoning, nextSteps, onsetAnalysis,
//     scaleConfidences, engineDiagnostics }

import { PROFILE_SELECTORS } from "./profile_selectors.js";
import { PROFILE_TEXTS } from "./profile_texts.js";


const DEFAULT_SCALE_KEYS = [
  "attention", "executive", "hyperfocus",
  "sensory", "social", "structure",
  "masking", "overload",
  "alexithymia", "emotreg"
];

// Mappe Engine-Discrepancies nur auf UI-Flags, die in PROFILE_TEXTS bereits Labels haben.
const ENGINE_DISCREPANCY_FLAG_MAP = {
  masking_without_overload: "monitor_delayed_burnout",
  overload_overlay: "monitor_burnout_risk",
  high_compensation_load_combo: "monitor_burnout_risk",
  audhd_alexithymia_combined: "complex_emotional_pattern",
  systemic_extreme_presentation: "urgent_professional_assessment",
};

function n(x, fallback = null) {
  const v = Number(x);
  return Number.isFinite(v) ? v : fallback;
}

function clampPct(x) {
  const v = n(x, 0);
  return Math.max(0, Math.min(100, Math.round(v)));
}

function meanDefined(values) {
  const xs = (values || []).map(v => n(v, null)).filter(v => v !== null);
  if (!xs.length) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return clampPct(m);
}

function isEngineReport(x) {
  return !!(x && typeof x === "object" && x.scales?.ui?.scores && x.input);
}

function toPctMap01or100(map) {
  const out = {};
  if (!map || typeof map !== "object") return out;
  for (const [k, v] of Object.entries(map)) {
    const num = n(v, null);
    if (num === null) continue;
    // akzeptiert 0..1 oder 0..100
    const pct = num <= 1 ? Math.round(num * 100) : Math.round(num);
    out[k] = clampPct(pct);
  }
  return out;
}

function normalizeExtras(extraOrConf) {
  const out = {
    scaleConfidences: {},
    quality: null,
    itemSignals: [],
    patterns: [],
    subtypes: [],
    discrepancies: [],
    onset: null,
    confidences: null,
    mainProfileHint: null,
  };

  if (!extraOrConf) return out;

  // 1) Voller Engine-Report
  if (isEngineReport(extraOrConf)) {
    const report = extraOrConf;
    out.scaleConfidences = toPctMap01or100(report.scales?.confidence);
    out.quality = report.quality ?? null;
    out.itemSignals = Array.isArray(report.itemSignals) ? report.itemSignals : [];
    out.patterns = Array.isArray(report.patterns) ? report.patterns : [];
    out.subtypes = Array.isArray(report.subtypes) ? report.subtypes : [];
    out.discrepancies = Array.isArray(report.discrepancies) ? report.discrepancies : [];
    out.onset = report.onset ?? null;
    out.confidences = report.confidences ?? null;
    out.mainProfileHint = report.mainProfile ?? null;
    return out;
  }

  // 2) Extras-Objekt (aus bootstrap übergeben)
  const isExtrasObj = typeof extraOrConf === "object" && (
    "quality" in extraOrConf ||
    "itemSignals" in extraOrConf ||
    "patterns" in extraOrConf ||
    "subtypes" in extraOrConf ||
    "discrepancies" in extraOrConf ||
    "scaleConfidences" in extraOrConf
  );
  if (isExtrasObj) {
    out.scaleConfidences = toPctMap01or100(extraOrConf.scaleConfidences || {});
    out.quality = extraOrConf.quality ?? null;
    out.itemSignals = Array.isArray(extraOrConf.itemSignals) ? extraOrConf.itemSignals : [];
    out.patterns = Array.isArray(extraOrConf.patterns) ? extraOrConf.patterns : [];
    out.subtypes = Array.isArray(extraOrConf.subtypes) ? extraOrConf.subtypes : [];
    out.discrepancies = Array.isArray(extraOrConf.discrepancies) ? extraOrConf.discrepancies : [];
    out.onset = extraOrConf.onset ?? null;
    out.confidences = extraOrConf.confidences ?? null;
    out.mainProfileHint = extraOrConf.mainProfileHint ?? null;
    return out;
  }

  // 3) Legacy: scaleConfPct map
  if (typeof extraOrConf === "object") {
    out.scaleConfidences = toPctMap01or100(extraOrConf);
  }
  return out;
}

function calcClusterScores(scores, clusterMap) {
  const out = {};
  for (const clusterKey of Object.keys(clusterMap || {})) {
    const scaleKeys = clusterMap[clusterKey] || [];
    const vals = scaleKeys.map(k => scores?.[k]);
    out[clusterKey] = meanDefined(vals);
  }
  return out;
}

function pickDominantScale(scores, labels = {}) {
  const entries = DEFAULT_SCALE_KEYS
    .map(k => ({ key: k, score: clampPct(scores?.[k]), label: labels[k] || k }))
    .sort((a, b) => b.score - a.score);

  const top = entries[0] || { key: null, score: 0, label: "" };
  const second = entries[1] || { key: null, score: 0, label: "" };
  return { top, second, all: entries };
}

function itemSignalSummary(itemSignals) {
  const s = {
    masking_exhaustion: 0,
    hyperfocus_cant_stop: 0,
    hyperfocus_needs_ignored: 0,
    shutdown_cognitive: 0,
    interoception_delayed: 0,
    task_initiation_wall: 0,
    emotion_switch_rapid: 0,
    alexithymia_words_hard: 0,
  };

  const arr = Array.isArray(itemSignals) ? itemSignals : [];
  for (const hit of arr) {
    const key = hit?.key;
    if (!key || !(key in s)) continue;
    const pct = clampPct(hit?.valuePct);
    if (pct > s[key]) s[key] = pct;
  }

  return {
    ...s,
    anyMaskingSignal: s.masking_exhaustion >= 80,
    anyHyperfocusSignal: Math.max(s.hyperfocus_cant_stop, s.hyperfocus_needs_ignored) >= 80,
    anyOverloadSignal: s.shutdown_cognitive >= 80,
    anyExecutiveSignal: s.task_initiation_wall >= 80,
    anyEmotionalSignal: Math.max(s.emotion_switch_rapid, s.alexithymia_words_hard) >= 80,
  };
}
// -------------------------
// Hyperfokus-Extras -> "Vertiefungs-Signatur" (Tendenz)
// Ziel: nicht "Diagnose", sondern Form der Vertiefung
// -------------------------
function computeHyperfocusTendency(hfValues, scores = {}, clusterScores = {}) {
  if (!hfValues || typeof hfValues !== "object") {
    return { present: false, tendency: "unknown", score: 0, reasons: [], raw: null };
  }

  const topic = String(hfValues.hf_topic_stability || "").trim();        // stable_long | mixed | switch_often | unknown
  const switchPain = String(hfValues.hf_switch_pain || "").trim();       // yes_strong | yes_some | no | unknown
  const coupling = String(hfValues.hf_structure_coupling || "").trim();  // often | sometimes | rare | unknown

  let adhdPts = 0;
  let autismPts = 0;
  const reasons = [];

  // (1) Themenstabilität
  if (topic === "stable_long") {
    autismPts += 2;
    reasons.push("Interessen eher langfristig stabil");
  } else if (topic === "switch_often") {
    adhdPts += 2;
    reasons.push("Themen wechseln eher häufig");
  } else if (topic === "mixed") {
    adhdPts += 1;
    autismPts += 1;
    reasons.push("Themenstabilität gemischt");
  }

  // (2) Switch-Cost / Exit-Kosten
  if (switchPain === "yes_strong") {
    adhdPts += 2;
    reasons.push("Aufhören/Wechseln deutlich schwer");
  } else if (switchPain === "yes_some") {
    adhdPts += 1;
    reasons.push("Aufhören/Wechseln etwas schwer");
  } else if (switchPain === "no") {
    autismPts += 1; // schwach, aber informativ: weniger Exit-Cost
    reasons.push("Aufhören/Wechseln eher nicht schwer");
  }

  // (3) Struktur-Kopplung (systematischer Detailfokus)
  if (coupling === "often") {
    autismPts += 2;
    reasons.push("Vertiefung häufig mit Ordnen/Regeln/Systematik gekoppelt");
  } else if (coupling === "sometimes") {
    autismPts += 1;
    reasons.push("Vertiefung manchmal struktur-/systematisch gekoppelt");
  } else if (coupling === "rare") {
    adhdPts += 1; // schwach
    reasons.push("Vertiefung selten struktur-/systematisch gekoppelt");
  }

  // Optional: leichte Kontext-Modulation über Scores (nur wenn Hyperfokus überhaupt hoch ist)
  const hyper = clampPct(scores?.hyperfocus);
  const struct = clampPct(scores?.structure);
  const U = clampPct(clusterScores?.autism);

  if (hyper >= 70) {
    if (struct >= 70 || U >= 70) {
      autismPts += 1;
      reasons.push("Kontext: hohe Struktur/Autismus-Nähe verstärkt systematische Vertiefung");
    }
  }

  const score = autismPts - adhdPts; // >0 autism-näher, <0 adhs-näher
  let tendency = "mixed";

  if (score >= 2) tendency = "autism_like";
  else if (score <= -2) tendency = "adhd_like";
  else tendency = "mixed";

  return {
    present: true,
    tendency,
    score,                 // integer
    points: { adhd: adhdPts, autism: autismPts },
    reasons,
    raw: { topic, switchPain, coupling }
  };
}


function decideMainProfile(clusterScores, scores, thresholds, dominant, profiles = null, hfTendency = null) {
  const A = clampPct(clusterScores?.adhd);
  const U = clampPct(clusterScores?.autism);
  const E = clampPct(clusterScores?.emotional);
  const C = clampPct(clusterScores?.compensation);

    // --- HF Tie-Breaker (ADHS vs Autismus) -----------------------
  // Wir greifen nur ein, wenn beide Seiten "nah" sind und beide NICHT disqualifiziert sind.
  const hfCfg = thresholds?.hf || {};
  const hfTieDelta = Number.isFinite(hfCfg.tieDelta) ? hfCfg.tieDelta : 10;   // Punkte Abstand, ab dem HF NICHT mehr eingreift
  const hfMinCore  = Number.isFinite(hfCfg.minCore)  ? hfCfg.minCore  : 55;   // Mindestnähe, damit HF überhaupt relevant wird

  const hf = hfTendency && hfTendency.present ? hfTendency : null;
  const hfType = hf?.tendency || null; // "adhd_like" | "autism_like" | "mixed" | ...

  const adhdOk   = !profiles?.adhd?.disqualified;
  const autismOk = !profiles?.autism?.disqualified;

  const closeEnough = Math.abs(A - U) <= hfTieDelta && Math.max(A, U) >= hfMinCore;

  // Falls wir sehr nah sind und HF eindeutig ist: Hauptprofil in Richtung HF kippen.
  // Wichtig: nur wenn beide Seiten "ok" sind (nicht disqualifiziert).
  if (closeEnough && adhdOk && autismOk) {
    if (hfType === "autism_like" && U >= (A - hfTieDelta)) {
      return { type: "autism", score: U, hfTieBreak: hf };
    }
    if (hfType === "adhd_like" && A >= (U - hfTieDelta)) {
      return { type: "adhd", score: A, hfTieBreak: hf };
    }
    // mixed => kein Eingriff
  }
  // --------------------------------------------------------------


  const core_high = thresholds?.profiles?.core_high ?? 70;
  const core_low_guard = thresholds?.profiles?.core_low_guard ?? 60;
  const compensation_high = thresholds?.overlays?.compensation_high ?? 75;
  const mixed_min = thresholds?.overlays?.mixed_min ?? 55;

  const masking = clampPct(scores?.masking);
  const overload = clampPct(scores?.overload);

   // 1) AuDHD – nur wenn BEIDE valide
  if (A >= core_high && U >= core_high && !profiles?.audhd?.disqualified) {
    return { type: "audhd", score: clampPct((A + U) / 2) };
  }

  // 2) Autismus valide → Kernprofil (ADHS egal)
  if (U >= core_high && !profiles?.autism?.disqualified) {
    return { type: "autism", score: U };
  }

  // 3) ADHS valide → Kernprofil (Autismus egal)
  if (A >= core_high && !profiles?.adhd?.disqualified) {
    return { type: "adhd", score: A };
  }

  // 4) Fallback nur wenn Kernscore hoch, aber (wegen Disqualifikation) kein Kernprofil gewählt wurde
  if (A >= core_high || U >= core_high) {
    return buildFallbackProfile(clusterScores, scores, profiles, thresholds);
  }

  // --- Ab hier unverändert (Original-Logik) ---
  const singleMin = thresholds?.level?.high ?? 75;
  const singleDelta = 12;

  if (
    dominant?.top?.key &&
    dominant.top.score >= singleMin &&
    (dominant.top.score - (dominant.second?.score ?? 0)) >= singleDelta &&
    Math.max(A, U) < core_high &&
    Math.max(C, overload) < (compensation_high + 5)
  ) {
    return {
      type: "single_dominant",
      score: dominant.top.score,
      dominant_scale: dominant.top.key,
      dominant_label: dominant.top.label
    };
  }

  const traits_min = thresholds?.profiles?.traits_min ?? 55;
  const traits_max = thresholds?.profiles?.traits_max ?? 69;
  const maxCore = Math.max(A, U);
  if (maxCore >= traits_min && maxCore <= traits_max) {
    return { type: "traits", score: maxCore };
  }

  if (C >= compensation_high || overload >= compensation_high) {
    return { type: "stress", score: Math.max(C, overload, masking) };
  }

  if (Math.max(A, U, E, C) >= mixed_min) {
    return { type: "mixed", score: Math.max(A, U, E, C) };
  }

  return { type: "unremarkable", score: Math.max(A, U, E, C) };
}

function buildProfiles(clusterScores, scores, thresholds, onsetValidation = null) {
  const A = clampPct(clusterScores?.adhd);
  const U = clampPct(clusterScores?.autism);

  const profiles = {};
  

  // ADHD mit Disqualifikation
profiles.adhd = { 
  score: A,
  disqualified: onsetValidation?.adhd?.compromised || false,
  disqualificationReason: onsetValidation?.adhd?.compromised
    ? "Symptombeginn wurde (für ADHS-relevante Bereiche) nach dem 12. Lebensjahr (13+) angegeben. DSM-5 verlangt Beginn vor dem 12. Lebensjahr."
    : null
};


  
  // Autism mit Disqualifikation
  const asdAMet = onsetValidation?.asdCriteriaA?.met ?? true;
  const asdBMet = onsetValidation?.asdCriteriaB?.met ?? true;
  
  profiles.autism = { 
    score: U,
    disqualified: !asdAMet || !asdBMet,
    disqualificationReason: !asdAMet
      ? `ASD Kriterium A nicht erfüllt (${onsetValidation?.asdCriteriaA?.count || 0}/3 Bereiche)`
      : !asdBMet
      ? `ASD Kriterium B nicht erfüllt (${onsetValidation?.asdCriteriaB?.count || 0}/4 RRB-Bereiche)`
      : null
  };
  
  // AuDHD - disqualifiziert wenn einer der beiden disqualifiziert
  profiles.audhd = { 
    score: clampPct((A + U) / 2),
    disqualified: profiles.adhd.disqualified || profiles.autism.disqualified,
    disqualificationReason: profiles.adhd.disqualified
      ? profiles.adhd.disqualificationReason
      : profiles.autism.disqualificationReason
  };

  // Overlays (keine Disqualifikation)
  profiles.high_masking = { score: clampPct(scores?.masking) };
  profiles.overload = { score: clampPct(scores?.overload) };
  profiles.emotional = { score: clampPct(clusterScores?.emotional) };
  profiles.stress = { 
    score: clampPct(Math.max(scores?.overload ?? 0, clusterScores?.compensation ?? 0)) 
  };

  const traits_min = thresholds?.profiles?.traits_min ?? 55;
  const traits_max = thresholds?.profiles?.traits_max ?? 69;
  const maxCore = Math.max(A, U);
  profiles.traits = { 
    score: (maxCore >= traits_min && maxCore <= traits_max) ? maxCore : 0 
  };

  return profiles;
}
function buildFallbackProfile(clusterScores, scores, profiles, thresholds) {
  // Wenn Kernprofile disqualifiziert sind, suche nächstes valides Profil
  const E = clampPct(clusterScores?.emotional);
  const C = clampPct(clusterScores?.compensation);
  const overload = clampPct(scores?.overload);
  
  const compensation_high = thresholds?.overlays?.compensation_high ?? 75;
  const emotional_high = thresholds?.overlays?.emotional_very_high ?? 80;
  
  // Reihenfolge: Emotional → Stress → Traits
  if (E >= emotional_high) {
    return { 
      type: "emotional", 
      score: E,
      disqualifiedProfile: findDisqualifiedTopProfile(profiles)
    };
  }
  
  if (C >= compensation_high || overload >= compensation_high) {
    return { 
      type: "stress", 
      score: Math.max(C, overload),
      disqualifiedProfile: findDisqualifiedTopProfile(profiles)
    };
  }
  
  const maxCore = Math.max(clusterScores?.adhd ?? 0, clusterScores?.autism ?? 0);
  return { 
    type: "traits", 
    score: maxCore,
    disqualifiedProfile: findDisqualifiedTopProfile(profiles)
  };
}

function findDisqualifiedTopProfile(profiles, minScore = 65) {
  if (!profiles || typeof profiles !== "object") return null;

  // Tie-break: abgeleitete Profile (audhd) sollen nicht vor Ursachen-Profilen stehen
  const priority = {
    adhd: 1,
    autism: 1,
    audhd: 2,
  };

  const candidates = Object.entries(profiles)
    .map(([key, p]) => ({ key, ...(p || {}) }))
    .filter((p) => p?.disqualified === true && clampPct(p?.score) >= minScore)
    .sort((a, b) =>
      (clampPct(b.score) - clampPct(a.score)) ||
      ((priority[a.key] ?? 9) - (priority[b.key] ?? 9))
    );

  return candidates[0] || null;
}


function buildDiscrepancies(clusterScores, scores, thresholds, extras, signalSum, onsetSignals) {
  const list = [];
  const masking = clampPct(scores?.masking);
  const overload = clampPct(scores?.overload);
  const emotional = clampPct(clusterScores?.emotional);
  const compensation = clampPct(clusterScores?.compensation);

  const masking_very_high = thresholds?.overlays?.masking_very_high ?? 80;
  const emotional_very_high = thresholds?.overlays?.emotional_very_high ?? 80;
  const compensation_high = thresholds?.overlays?.compensation_high ?? 75;

  if (masking >= masking_very_high) {
    list.push({ flag: "monitor_delayed_burnout", severity: "moderate", user_description: "" });
  }
  if (masking >= 70 && overload >= 70) {
    list.push({ flag: "monitor_burnout_risk", severity: "moderate", user_description: "" });
  }
  if (compensation >= compensation_high && overload >= 70) {
    list.push({ flag: "monitor_burnout_risk", severity: "high", user_description: "" });
    list.push({ flag: "reassess_after_recovery", severity: "low", user_description: "" });
  }
  if (emotional >= emotional_very_high) {
    list.push({ flag: "complex_emotional_pattern", severity: "moderate", user_description: "" });
  }

  const A = clampPct(clusterScores?.adhd);
  const U = clampPct(clusterScores?.autism);
  const traits_min = thresholds?.profiles?.traits_min ?? 55;
  const traits_max = thresholds?.profiles?.traits_max ?? 69;
  const maxCore = Math.max(A, U);
  if (maxCore >= traits_min && maxCore <= traits_max) {
    list.push({ flag: "subclinical_traits", severity: "low", user_description: "" });
  }

  if (signalSum?.anyMaskingSignal) {
    list.push({ flag: "monitor_delayed_burnout", severity: "moderate", user_description: "" });
  }
  if (signalSum?.anyHyperfocusSignal) {
    list.push({ flag: "check_historical_hyperfocus", severity: "low", user_description: "" });
  }
  if (signalSum?.anyOverloadSignal) {
    list.push({ flag: "monitor_burnout_risk", severity: "moderate", user_description: "" });
  }
  if (signalSum?.anyEmotionalSignal) {
    list.push({ flag: "complex_emotional_pattern", severity: "moderate", user_description: "" });
  }

  const eng = Array.isArray(extras?.discrepancies) ? extras.discrepancies : [];
  for (const d of eng) {
    const mapped = ENGINE_DISCREPANCY_FLAG_MAP[d?.type];
    if (!mapped) continue;
    list.push({
      flag: mapped,
      severity: d?.severity || "low",
      user_description: d?.label || ""
    });
  }

   // Onset-basierte Overlays (müssen VOR dedup/return rein)
// Onset-basierte Pattern-TYPES (Text kommt aus PROFILE_TEXTS.patterns.templates)
// Onset-basierte Overlays (müssen VOR dedup/return rein)
if (onsetSignals?.lateOnsetFlags?.overload) {
  list.push({ flag: "late_onset_overload_overlay", severity: "moderate", user_description: "" });
}
if (onsetSignals?.lateOnsetFlags?.masking) {
  list.push({ flag: "late_onset_masking_overlay", severity: "low", user_description: "" });
}
if (onsetSignals?.lateOnsetFlags?.emotreg) {
  list.push({ flag: "late_onset_emotional_overlay", severity: "moderate", user_description: "" });
}



  const seen = new Set();
  return list.filter(d => {
    const k = d?.flag || d?.type;
    if (!k) return false;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });


}

// profile_scoring.js
// REPLACE: buildPatterns(...) komplett
// Ziel: Patterns sind TYP-basiert, Text kommt nur aus texts.patterns.templates (Single Source of Truth).
// Optional: engineTextFallback=true, wenn du notfalls Engine-Labels als Fallback zulassen willst.

function buildPatterns(
  clusterScores,
  scores,
  thresholds,
  extras,
  signalSum,
  onsetSignals,
  texts,
  engineTextFallback = false
) {
  const out = [];

  const masking  = clampPct(scores?.masking);
  const overload = clampPct(scores?.overload);
  const social   = clampPct(scores?.social);
  const emotreg  = clampPct(scores?.emotreg);
  const alex     = clampPct(scores?.alexithymia);
  const emotionalCluster = clampPct(clusterScores?.emotional);

  const top6 = thresholds?.top6 || {};
  const add_masking_if  = top6.add_masking_if  ?? 70;
  const add_overload_if = top6.add_overload_if ?? 70;
  const add_emotional_if= top6.add_emotional_if?? 75;

  const templates = texts?.patterns?.templates || {};

  // --- helpers -------------------------------------------------
  const byType = new Map(); // type -> {type, confidencePct?, note?}

  function pushType(type, confidencePct = null, noteFallback = null) {
    if (!type) return;

    // Single Source of Truth: Template muss existieren (oder wir erlauben Fallback explizit)
    const hasTemplate = typeof templates[type] === "string" && templates[type].trim();
    const canUseFallback = engineTextFallback && typeof noteFallback === "string" && noteFallback.trim();

    if (!hasTemplate && !canUseFallback) return;

    const prev = byType.get(type);
    const next = {
      type,
      confidencePct: Number.isFinite(confidencePct) ? clampPct(confidencePct) : null,
      note: hasTemplate ? templates[type].trim() : noteFallback.trim(),
    };

    // wenn schon vorhanden: höhere confidence behalten (oder Template gewinnt implizit, da note identisch aus templates)
    if (!prev) {
      byType.set(type, next);
      return;
    }

    const a = Number.isFinite(prev.confidencePct) ? prev.confidencePct : -1;
    const b = Number.isFinite(next.confidencePct) ? next.confidencePct : -1;
    if (b > a) byType.set(type, next);
  }

// --- 1) rule-based combos (TYPs) -----------------------------

// (A0) high masking (solo)
if (masking >= add_masking_if) {
  pushType("high_masking"); // Template existiert bei dir
}

// (A1) social + masking (kombiniert)
if (masking >= add_masking_if && social >= 60) {
  pushType("social_plus_masking"); // Template existiert bei dir
}

// (B) sensory + overload
const sensory = clampPct(scores?.sensory);
if (sensory >= 70 && overload >= add_overload_if) {
  pushType("sensory_plus_overload");
}


  // (C) hyperfocus + overload (template vorhanden)
  const hyper = clampPct(scores?.hyperfocus);
  if (hyper >= 70 && overload >= add_overload_if) {
    pushType("hyperfocus_plus_overload");
    // optional spezialisierter Exit-Cost
    pushType("hyperfocus_exit_cost");
  }

  // (D) emotional “Kern” + (emotreg/alex) (template optional)
  // du hast dafür bereits discrepanciesUI = complex_emotional_pattern -> wir pushen das unten sicherer.

  // --- 2) item-signal based (TYPs) -----------------------------
  // signalSum-Werte sind Prozent (0..100)
  if ((signalSum?.masking_exhaustion ?? 0) >= 80) pushType("masking_exhaustion");
  if ((signalSum?.shutdown_cognitive ?? 0) >= 80) pushType("shutdown_cognitive");
  if ((signalSum?.task_initiation_wall ?? 0) >= 80) pushType("task_initiation_wall");
  if ((signalSum?.emotion_switch_rapid ?? 0) >= 80) pushType("emotion_switch_rapid");
  if ((signalSum?.alexithymia_words_hard ?? 0) >= 80) pushType("alexithymia_words_hard");

  // --- 3) discrepancies -> patterns (TYPs) ----------------------
  // Ziel: Dinge wie complex_emotional_pattern werden als “Erkannte Muster” sichtbar.
  const discs =
    (Array.isArray(extras?.discrepanciesUI) && extras.discrepanciesUI) ||
    (Array.isArray(extras?.discrepancies) && extras.discrepancies) ||
    [];

  for (const d of discs) {
    const flag = d?.flag || d?.type;
    if (!flag) continue;

    // Hier nur mappen, was du wirklich als Muster zeigen willst:
    // - complex_emotional_pattern => Template-Key muss existieren
    if (flag === "complex_emotional_pattern") {
      pushType("complex_emotional_pattern");
    }

    // Optional später:
    // if (flag === "audhd_alexithymia_combined") pushType("audhd_alexithymia_combined");
    // if (flag === "high_compensation_load_combo") pushType("high_compensation_load_combo");
  }

  // --- 4) onset-based patterns (TYPs) ---------------------------
  if (onsetSignals?.lateOnsetFlags?.overload) pushType("late_onset_overload_overlay");
  if (onsetSignals?.lateOnsetFlags?.masking)  pushType("late_onset_masking_overlay");
  if (onsetSignals?.lateOnsetFlags?.emotreg)  pushType("late_onset_emotional_overlay");

  if (Number.isFinite(onsetSignals?.spread) && onsetSignals.spread >= 2) {
    pushType("mixed_onset_timing");
  }

  // --- 5) engine patterns (TYPs, optional) ----------------------
  // Engine-Patterns sind in extras.patterns (nicht response_* in Erkannte Muster)
  const eng = Array.isArray(extras?.patterns) ? extras.patterns : [];
  const RESPONSE_TYPES = new Set(["response_extreme_style", "response_low_variance", "response_long_run"]);

  for (const p of eng) {
    const t = p?.type;
    if (!t || RESPONSE_TYPES.has(t)) continue;

    // Template-Key = Engine type (z.B. "stress_overlay", "high_masking", "audhd_specific", ...)
    const confPct = Number.isFinite(p?.confidence) ? p.confidence * 100 : null;
    const noteFallback = p?.note || p?.label || null;

    pushType(t, confPct, noteFallback);
  }

  // --- 6) ensure emotional-specific enrichment (rein datenbasiert) ----
  // Falls emotional sehr hoch ist und Discrepancy fehlt, trotzdem Muster anbieten (Template muss existieren)
  if (emotionalCluster >= add_emotional_if && (emotreg >= 80 || alex >= 80)) {
    pushType("complex_emotional_pattern");
  }

  // --- finalize: stable order + max 10 --------------------------
  // Sort: confidence desc, dann type asc
  const list = Array.from(byType.values())
    .sort((a, b) => {
      const ca = Number.isFinite(a.confidencePct) ? a.confidencePct : -1;
      const cb = Number.isFinite(b.confidencePct) ? b.confidencePct : -1;
      if (cb !== ca) return cb - ca;
      return String(a.type).localeCompare(String(b.type));
    })
    .slice(0, 10)
    .map(x => (x.confidencePct !== null ? { note: x.note, type: x.type, confidencePct: x.confidencePct } : { note: x.note, type: x.type }));

  return list;
}


function buildReasoning(clusterScores, dominant, extras) {
  const r = [];
  const A = clampPct(clusterScores?.adhd);
  const U = clampPct(clusterScores?.autism);
  const E = clampPct(clusterScores?.emotional);
  const C = clampPct(clusterScores?.compensation);

  r.push(`Cluster: ADHS ${A}%, Autismus ${U}%, Emotional ${E}%, Kompensation ${C}%.`);

  if (dominant?.top?.key) {
    r.push(`Dominant: ${dominant.top.label} (${dominant.top.score}%).`);
  }

  const top = (dominant?.all || []).slice(0, 3);
  if (top.length) {
    r.push(`Top-Skalen: ${top.map(x => `${x.label} ${x.score}%`).join(", ")}.`);
  }

  const answeredRatio = n(extras?.quality?.answeredRatio, null);
  if (answeredRatio !== null) {
    r.push(`Antwortabdeckung: ${Math.round(answeredRatio * 100)}%.`);
  }

  // --- Hyperfokus-Basis (aus reasoning.hyperfocus_basis) --------------------
  // Quelle: profileResult.onsetAnalysis.hfTendency (wird von calculateProfile erzeugt)
  const hfT = extras?.hfTendency || null; // optional: kann von calculateProfile in extras durchgereicht werden
  const hfT2 = extras?.onsetAnalysis?.hfTendency || null; // fallback, falls du es so reingibst
  const hf = hfT || hfT2 || null;

  const texts = extras?.texts || PROFILE_TEXTS;
  const hb = texts?.reasoning?.hyperfocus_basis || null;

  if (hb && hf && hf.present) {
    r.push(`${hb.title}. ${hb.include_note}`);

    const t = hf.tendency || "unknown";
    if (t === "adhd_like") r.push(hb.line_adhd_like);
    else if (t === "autism_like") r.push(hb.line_autism_like);
    else if (t === "mixed") r.push(hb.line_mixed);
    else r.push(hb.line_unknown);
  }
  // -------------------------------------------------------------------------

  return r;
}





function topKScales(scores, k = 3, min = 70, exclude = new Set()) {
  return DEFAULT_SCALE_KEYS
    .filter(s => !exclude.has(s))
    .map(s => ({ key: s, v: clampPct(scores?.[s]) }))
    .filter(x => x.v >= min)
    .sort((a,b)=>b.v-a.v)
    .slice(0, k)
    .map(x => x.key);
}
// =========================
// NextSteps (weighted, config-driven, deduped)
// Uses: PROFILE_TEXTS.next_steps + PROFILE_SELECTORS.thresholds.nextSteps
// =========================

// Weighted dedup: keep highest weight, stable tie-break by first insertion
function pushUniqueWeighted(store, items, weight, group, limits = {}) {
  const arr = Array.isArray(items) ? items : [];
  const take = Number.isFinite(limits.take) ? limits.take : arr.length;

  for (const raw of arr.slice(0, take)) {
    if (typeof raw !== "string") continue;
    const text = raw.trim();
    if (!text) continue;

    const prev = store.map.get(text);
    if (!prev) {
      const entry = { text, weight, group, seq: store.seq++ };
      store.map.set(text, entry);
      continue;
    }

    // If same text appears again: keep higher weight; if tie keep earlier seq
    if (weight > prev.weight) {
      store.map.set(text, { ...prev, weight, group });
    }
  }
}

function finalizeWeightedSteps(store, max) {
  const out = Array.from(store.map.values());
  const groupRank = (g) => {
    if (g === "base") return 1;
    if (g === "intervention") return 2;
    if (String(g).startsWith("cluster:")) return 3;
    if (String(g).startsWith("focus:")) return 4;
    if (String(g).startsWith("extra:")) return 5;
    return 9;
  };

  out.sort((a, b) =>
    (b.weight - a.weight) ||
    (groupRank(a.group) - groupRank(b.group)) ||
    (a.seq - b.seq)
  );

  return out.slice(0, max).map(x => x.text);
}

function getNextStepsCfg(thresholds) {
  const cfg = thresholds?.nextSteps || {};
  const weights = cfg.weights || {};
  return {
    max: Number.isFinite(cfg.max) ? cfg.max : 8,
    minCluster: Number.isFinite(cfg.minCluster) ? cfg.minCluster : 65,
    minFocusScale: Number.isFinite(cfg.minFocusScale) ? cfg.minFocusScale : 65,
    minExtraScale: Number.isFinite(cfg.minExtraScale) ? cfg.minExtraScale : 70,
    extraScaleCount: Number.isFinite(cfg.extraScaleCount) ? cfg.extraScaleCount : 3,

    // Intervention thresholds (optional; fallback 70)
    minOverloadForIntervention: Number.isFinite(cfg.minOverloadForIntervention) ? cfg.minOverloadForIntervention : 70,
    minExecutiveForIntervention: Number.isFinite(cfg.minExecutiveForIntervention) ? cfg.minExecutiveForIntervention : 70,
    minEmotionalForIntervention: Number.isFinite(cfg.minEmotionalForIntervention) ? cfg.minEmotionalForIntervention : 70,

    weights: {
      base: Number.isFinite(weights.base) ? weights.base : 100,
      intervention: Number.isFinite(weights.intervention) ? weights.intervention : 90,
      cluster: Number.isFinite(weights.cluster) ? weights.cluster : 80,
      focus: Number.isFinite(weights.focus) ? weights.focus : 70,
      extraScale: Number.isFinite(weights.extraScale) ? weights.extraScale : 60,
    },
  };
}

// drop-in replacement (keep your existing topKScales())
function buildNextSteps(mainType, scores, thresholds, clusterScores, focusKey) {
  const lib = PROFILE_TEXTS?.next_steps;
  if (!lib) return [];

  const cfg = getNextStepsCfg(thresholds);

  const store = { map: new Map(), seq: 0 };

  const overload = clampPct(scores?.overload);
  const executive = clampPct(scores?.executive);
  const emotreg = clampPct(scores?.emotreg);
  const emotionalCluster = clampPct(clusterScores?.emotional);

  // 0) Base (keep 2, but weighted)
  pushUniqueWeighted(store, (lib.base || []).slice(0, 2), cfg.weights.base, "base");

  // 1) Intervention (1–2)
  // Thresholds now configurable via cfg.*
  if (overload >= cfg.minOverloadForIntervention || mainType === "stress") {
    pushUniqueWeighted(store, lib.interventions?.combined_hypnosis_then_coaching, cfg.weights.intervention, "intervention", { take: 2 });
  } else if ((mainType === "adhd" || mainType === "audhd") && executive >= cfg.minExecutiveForIntervention) {
    pushUniqueWeighted(store, lib.interventions?.coaching_primary, cfg.weights.intervention, "intervention", { take: 2 });
  } else if (mainType === "autism") {
    pushUniqueWeighted(store, lib.interventions?.coaching_autism_primary, cfg.weights.intervention, "intervention", { take: 2 });
  } else if (Math.max(emotionalCluster, emotreg) >= cfg.minEmotionalForIntervention) {
    pushUniqueWeighted(store, lib.interventions?.hypnosis_primary, cfg.weights.intervention, "intervention", { take: 2 });
  }

  // 2) Cluster (max 2 clusters, each up to 2)
  const clusterPairs = [
    ["adhd", clampPct(clusterScores?.adhd)],
    ["autism", clampPct(clusterScores?.autism)],
    ["emotional", clampPct(clusterScores?.emotional)],
    ["compensation", clampPct(clusterScores?.compensation)],
  ].sort((a, b) => b[1] - a[1]);

  for (const [ck, cv] of clusterPairs.slice(0, 2)) {
    if (cv >= cfg.minCluster) {
      pushUniqueWeighted(store, (lib.by_cluster?.[ck] || []).slice(0, 2), cfg.weights.cluster, `cluster:${ck}`);
    }
  }

  // 3) Focus scale (up to 2) — only if relevant
  if (focusKey) {
    const focusScore = clampPct(scores?.[focusKey]);
    if (focusScore >= cfg.minFocusScale) {
      pushUniqueWeighted(store, (lib.by_scale?.[focusKey] || []).slice(0, 2), cfg.weights.focus, `focus:${focusKey}`);
    }
  }

  // 4) Extra high scales (each 1 line), excluding focusKey
  const extraKeys = topKScales(
    scores,
    cfg.extraScaleCount,
    cfg.minExtraScale,
    new Set([focusKey].filter(Boolean))
  );

  for (const sk of extraKeys) {
    pushUniqueWeighted(store, (lib.by_scale?.[sk] || []).slice(0, 1), cfg.weights.extraScale, `extra:${sk}`, { take: 1 });
  }

  // Final: sort by weight desc, stable, cut to cfg.max
  return finalizeWeightedSteps(store, cfg.max);
}



function onsetTimingFromMainType(mainType, onsetObj, onsetPolicy, dominantScaleKey = null) {
  if (!onsetObj) return null;

  // Unterstütze: report.onset (verschachtelt), report.input.onset (verschachtelt), postOnset (flach)
  let preOnset = null;
  let post = null;

  // 1) Falls onsetObj ein kompletter onset-Block ist
  if (onsetObj?.post?.values && typeof onsetObj.post.values === "object") {
    post = onsetObj.post.values;            // report.onset.post.values
    preOnset = onsetObj?.pre?.value ?? null;
  } else if (onsetObj?.postOnset && typeof onsetObj.postOnset === "object") {
    post = onsetObj.postOnset;              // report.input.onset.postOnset (wenn onsetObj = input.onset)
    preOnset = onsetObj?.preOnset ?? null;
  } else if (onsetObj?.input?.postOnset && typeof onsetObj.input.postOnset === "object") {
    post = onsetObj.input.postOnset;        // onsetObj = onsetBlock.input
    preOnset = onsetObj?.input?.preOnset ?? null;
  } else {
    // 2) onsetObj ist schon flach (dein onsetBlock aus bootstrap)
    post = onsetObj;
  }

  // Mapping: falls policy eine Abbildung will, nutzen – sonst Identität
  const map = onsetPolicy?.mapValueToTiming;
  const mapOne = (val) => {
    if (val === null || val === undefined || val === "") return null;
    const v = String(val).trim();
    return (typeof map === "function" ? map(v) : v) || null;
  };

  // Ranking: kompatibel mit alten + neuen Values
  const rank = {
    // neu (engine)
    early: 1, school: 2, teen: 3, adult: 4, unknown: 9,
    // alt (legacy)
    childhood: 1, youth: 3, recent: 4, unsure: 9,
  };

  const pickEarliest = (vals) => {
    const timings = (vals || []).map(mapOne).filter(Boolean);
    if (!timings.length) return null;
    timings.sort((a, b) => (rank[a] ?? 9) - (rank[b] ?? 9));
    return timings[0] || null;
  };

  // Skalen-Gruppen → “Onset pro Cluster” (ohne dass der Nutzer Cluster kennen muss)
  const KEYS = {
    adhd: ["onset_attention", "onset_executive", "onset_hyperfocus"],
    autism: ["onset_sensory", "onset_social", "onset_structure"],
    emotional: ["onset_alexithymia", "onset_emotreg"],
    compensation: ["onset_masking", "onset_overload"],
  };

  const fromKeys = (arr) => pickEarliest(arr.map(k => post?.[k]).filter(v => v !== undefined));

  // 1) Single-dominant: nimm onset der dominanten Skala, wenn vorhanden
  if (mainType === "single_dominant" && dominantScaleKey) {
    const k = `onset_${dominantScaleKey}`;
    const v = post?.[k];
    const one = mapOne(v);
    if (one) return one;
    // fallback: earliest aus allen Bereichen
    return pickEarliest([
      ...KEYS.adhd.map(k => post?.[k]),
      ...KEYS.autism.map(k => post?.[k]),
      ...KEYS.emotional.map(k => post?.[k]),
      ...KEYS.compensation.map(k => post?.[k]),
    ]);
  }

  // 2) Kernprofile
  if (mainType === "adhd") return fromKeys(KEYS.adhd) || mapOne(preOnset);
  if (mainType === "autism") return fromKeys(KEYS.autism) || mapOne(preOnset);
  if (mainType === "audhd") return pickEarliest([fromKeys(KEYS.adhd), fromKeys(KEYS.autism)]) || mapOne(preOnset);

  // 3) Overlays / Mixed
  if (mainType === "stress") return fromKeys(KEYS.compensation) || mapOne(preOnset);
  if (mainType === "traits") return pickEarliest([fromKeys(KEYS.adhd), fromKeys(KEYS.autism)]) || mapOne(preOnset);
  if (mainType === "mixed") {
    return pickEarliest([fromKeys(KEYS.adhd), fromKeys(KEYS.autism), fromKeys(KEYS.emotional), fromKeys(KEYS.compensation)]) || mapOne(preOnset);
  }

  // fallback
  return pickEarliest([fromKeys(KEYS.adhd), fromKeys(KEYS.autism), fromKeys(KEYS.emotional), fromKeys(KEYS.compensation)]) || mapOne(preOnset);
}
function onsetRank(val) {
  if (!val) return 9;
  const v = String(val).trim();

  // Engine-Werte
  if (v === "early") return 1;
  if (v === "school") return 2;
  if (v === "teen") return 3;
  if (v === "adult") return 4;
  if (v === "na") return 9;
  if (v === "unknown") return 9;

  // Legacy-Werte (falls noch irgendwo vorhanden)
  if (v === "childhood") return 1;
  if (v === "youth") return 3;
  if (v === "recent") return 4;
  if (v === "unsure") return 9;

  return 9;
}

function pickEarliestOnset(vals) {
  const arr = (vals || []).filter(v => v !== undefined && v !== null && v !== "");
  if (!arr.length) return null;
  arr.sort((a,b) => onsetRank(a) - onsetRank(b));
  return arr[0] ?? null;
}

function pickLatestOnset(vals) {
  const arr = (vals || []).filter(v => v !== undefined && v !== null && v !== "");
  if (!arr.length) return null;
  arr.sort((a,b) => onsetRank(b) - onsetRank(a));
  return arr[0] ?? null;
}

// onsetObj kann flach (postOnset) oder verschachtelt (report.onset / input.onset) sein
function normalizePostOnset(onsetObj) {
  if (!onsetObj) return null;

  if (onsetObj?.post?.values && typeof onsetObj.post.values === "object") return onsetObj.post.values;
  if (onsetObj?.postOnset && typeof onsetObj.postOnset === "object") return onsetObj.postOnset;
  if (onsetObj?.input?.postOnset && typeof onsetObj.input.postOnset === "object") return onsetObj.input.postOnset;

  // flach
  if (typeof onsetObj === "object") return onsetObj;
  return null;
}

function computeOnsetSignals(onsetObj, scores) {
  const post = normalizePostOnset(onsetObj) || {};

  // Skalen-Gruppen
  const G = {
    adhd: ["onset_attention", "onset_executive", "onset_hyperfocus"],
    autism: ["onset_sensory", "onset_social", "onset_structure"],
    emotional: ["onset_alexithymia", "onset_emotreg"],
    compensation: ["onset_masking", "onset_overload"],
  };

  const group = {};
  for (const [k, keys] of Object.entries(G)) {
    const vals = keys.map(x => post[x]).filter(v => v !== undefined);
    group[k] = {
      earliest: pickEarliestOnset(vals),
      latest: pickLatestOnset(vals),
    };
  }

  // Spread: frühester vs spätester (über alle vorhandenen postOnset)
  const allVals = Object.values(post).filter(v => {
    const r = onsetRank(v);
    return r !== 9; // unknown/unsure raus
  });
  const earliestAll = pickEarliestOnset(allVals);
  const latestAll = pickLatestOnset(allVals);
  const spread = Math.max(0, (onsetRank(latestAll) - onsetRank(earliestAll)));

  // “Late-onset-high” Trigger (Overlay-Kandidaten)
  const high = (k, min=75) => clampPct(scores?.[k]) >= min;
  const late = (v) => {
    const r = onsetRank(v);
    return r === 4; // nur adult/recent, NICHT unknown/unsure (9)
  };

  const lateOnsetFlags = {
    overload: late(post.onset_overload) && high("overload", 75),
    masking: late(post.onset_masking) && high("masking", 75),
    emotreg: late(post.onset_emotreg) && high("emotreg", 75),
    alexithymia: late(post.onset_alexithymia) && high("alexithymia", 75),
    attention: late(post.onset_attention) && high("attention", 75),
    executive: late(post.onset_executive) && high("executive", 75),
    sensory: late(post.onset_sensory) && high("sensory", 75),
    social: late(post.onset_social) && high("social", 75),
    structure: late(post.onset_structure) && high("structure", 75),
    hyperfocus: late(post.onset_hyperfocus) && high("hyperfocus", 75),
  };

  // “Neurodevelopmental-consistency” (früher Start in Kernbereichen)
  const ndLike = {
    adhd: onsetRank(group.adhd.earliest) <= 3,     // early/school/teen
    autism: onsetRank(group.autism.earliest) <= 3,
  };

  return {
    post,
    group,
    earliestAll,
    latestAll,
    spread,                 // 0..8 (typisch 0..3)
    lateOnsetFlags,         // bool pro Skala
    ndLike,                 // bool pro Kerncluster
  };
}
function applyOnsetToScaleConfidences(scaleConfPct = {}, onsetSignals = null) {
  if (!onsetSignals) return scaleConfPct || {};
  const out = { ...(scaleConfPct || {}) };

  // einfache, deterministische Policy:
  // Wenn Skala hoch + onset adult → confidence runter (Overlay-Verdacht)
  const penalty = 15; // Prozentpunkte
  for (const [scale, isLateHigh] of Object.entries(onsetSignals.lateOnsetFlags || {})) {
    if (!isLateHigh) continue;
    const prev = n(out[scale], null);
    if (prev === null) continue;
    out[scale] = clampPct(prev - penalty);
  }

  return out;
}


export function calculateProfile(scoresIn = {}, meta = {}, answers = null, onset = null, extrasOrScaleConf = null) {
  let scores = scoresIn;
  let onsetObj = onset || null;

  if (isEngineReport(scoresIn)) {
    const report = scoresIn;
    scores = report.scales?.ui?.scores || {};
    onsetObj = report.input?.onset || report.onset || onset || null;
    extrasOrScaleConf = report;
  }

  const thresholds = PROFILE_SELECTORS?.thresholds || {};
  const clusterMap = PROFILE_SELECTORS?.clusters || {};
  const labels = PROFILE_SELECTORS?.dominantScaleLabels || {};

  const extras = normalizeExtras(extrasOrScaleConf);
  const signalSum = itemSignalSummary(extras.itemSignals);

    // ✅ FIX: texts im Scope definieren (Single Source of Truth)
  const texts = extras?.texts || PROFILE_TEXTS;

  const clusterScores = calcClusterScores(scores, clusterMap);
  const dom = pickDominantScale(scores, labels);

  const onsetSignals = computeOnsetSignals(onsetObj, scores);

    // --- HF-Extras aus Engine-Onset (falls vorhanden) ---
  const hfValues =
    (extras?.onset?.hf?.values && typeof extras.onset.hf.values === "object")
      ? extras.onset.hf.values
      : null;

  const hfPresent = !!extras?.onset?.hf?.present;

  // --- Hyperfokus-Signatur (Tendenz) ---
  const hfTendency = computeHyperfocusTendency(hfValues, scores, clusterScores);

  // === NEU: DSM-5-Validierung aus der Scoring-Engine übernehmen ===
const engineOnsetValidation = extras.onset?.validation || null;

const profiles = buildProfiles(clusterScores, scores, thresholds, engineOnsetValidation);

const mainBase = decideMainProfile(clusterScores, scores, thresholds, dom, profiles, hfTendency);

const disqTop = findDisqualifiedTopProfile(profiles);


const focusKey = mainBase.dominant_scale || dom.top.key;
const focusLabel = mainBase.dominant_label || (focusKey ? (labels[focusKey] || focusKey) : null);

const discrepancies = buildDiscrepancies(clusterScores, scores, thresholds, extras, signalSum, onsetSignals);

const patterns = buildPatterns(clusterScores, scores, thresholds, extras, signalSum, onsetSignals, texts);

  // Bestehende Onset-basierte Patterns (bleiben unverändert)


const reasoning = buildReasoning(clusterScores, dom, { ...extras, hfTendency, texts });
  const nextSteps = buildNextSteps(mainBase.type, scores, thresholds, clusterScores, focusKey);

// ... in calculateProfile(), nachdem onsetSignals + engineOnsetValidation existieren:

const onsetPolicy = PROFILE_SELECTORS?.onset || {};
let timing = onsetTimingFromMainType(mainBase.type, onsetObj, onsetPolicy, focusKey);

// PATCH: disqualified ADHD -> timing an invalid/late onset koppeln (nicht earliest)
if (engineOnsetValidation?.adhd?.compromised) {
  // 1) nimm die Skalen, die invalid sind (valid === false), sonst fallback auf adhd.latest
  const details = engineOnsetValidation?.adhd?.details || {};
  const invalidTimings = Object.values(details)
    .filter(d => d?.valid === false && d?.timing)
    .map(d => d.timing);

  timing =
    pickLatestOnset(invalidTimings) ||
    onsetSignals?.group?.adhd?.latest ||
    timing;
}

   return {
    clusterScores,
    profiles,
    disqualifiedTop: disqTop || null,

    mainProfile: {
      type: mainBase.type,
      score: clampPct(mainBase.score),
      dominant_scale: focusKey || null,
      dominant_label: focusLabel || null,
      disqualifiedProfile: mainBase.disqualifiedProfile || null
    },

    discrepancies,
    patterns,
    reasoning,
    nextSteps,

       onsetAnalysis: {
      timing: timing || null,
      earliestAll: onsetSignals?.earliestAll || null,
      latestAll: onsetSignals?.latestAll || null,
      spread: Number.isFinite(onsetSignals?.spread) ? onsetSignals.spread : null,
      group: onsetSignals?.group || null,
      lateOnsetFlags: onsetSignals?.lateOnsetFlags || null,

      // ✅ Alias: direkter Zugriff
      context: engineOnsetValidation?.context || null,

      // ✅ Vollständige Validierung
      validation: engineOnsetValidation ? {
        adhd: engineOnsetValidation.adhd,
        asdCriteriaA: engineOnsetValidation.asdCriteriaA,
        asdCriteriaB: engineOnsetValidation.asdCriteriaB,
        context: engineOnsetValidation.context
      } : null,

      // ✅ Hyperfokus-Extras aus Engine (roh)
      hf: hfValues,
      hfPresent: hfPresent,

      // ✅ Hyperfokus-Tendenz (aus hfValues + Scores/Cluster abgeleitet)
      hfTendency: hfTendency || null,
    },

    scaleConfidences: applyOnsetToScaleConfidences(extras.scaleConfidences || {}, onsetSignals),

    engineDiagnostics: {
      quality: extras.quality,
      itemSignals: extras.itemSignals,
      subtypes: extras.subtypes,
      patterns: extras.patterns,
      discrepancies: extras.discrepancies,
      onset: extras.onset,
      confidences: extras.confidences
    }

   };
}
