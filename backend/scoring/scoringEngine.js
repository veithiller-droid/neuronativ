// scoringEngine.js
// Single Source of Truth (Core): nimmt Rohdaten (answers + meta + onset + questions) und liefert einen Report.
// ESM-Modul. Keine UI-Logik. UI rendert nur den Report.
//
// Likert intern: 1..6
// Prozent: (mean-1)/(6-1)*100
//
// Designziele:
// - deterministisch (kein Date.now() ohne Option)
// - questions[] ist die kanonische Quelle für id->scale
// - Missing bleibt Missing (null) in "raw"; UI kann daraus 0 machen, wenn sie will
// - vorbereitbar für Normierung/Perzentile (calibration slot)
//
// Version: 1.1.0

export const SCORING_ENGINE_VERSION = "1.1.0";
export const REPORT_SCHEMA_VERSION = "1.0.0";

// -------------------------
// Grundparameter
// -------------------------
const LIKERT_MIN = 1;
const LIKERT_MAX = 6;
const LIKERT_RANGE = LIKERT_MAX - LIKERT_MIN;

// Schwellen (einheitlich, überall)
export const THRESHOLDS = {
  subclinical: 55,
  elevated: 65,
  high: 75,
  very_high: 85,
};

// Skalenlabels (für Reports/UI)
export const SCALE_LABELS = {
  attention: "Aufmerksamkeit",
  sensory: "Sensorik",
  social: "Soziales",
  masking: "Masking",
  structure: "Struktur",
  overload: "Überlastung",
  alexithymia: "Emotionswahrnehmung",
  executive: "Exekutive Funktionen",
  emotreg: "Emotionsregulation",
  hyperfocus: "Hyperfokus",
};

// Cluster-Definition (Skalen + Gewichte)
export const CLUSTERS = {
  adhd: {
    label: "ADHS-Cluster",
    primary: ["attention", "executive"],
    secondary: ["hyperfocus"],
    weight: { attention: 1.2, executive: 1.4, hyperfocus: 0.6 },
  },
  autism: {
    label: "Autismus-Cluster",
    primary: ["sensory", "social"],
    secondary: ["structure"],
    weight: { sensory: 1.4, social: 1.2, structure: 0.8 },
  },
  emotional: {
    label: "Emotionale Verarbeitung",
    primary: ["alexithymia", "emotreg"],
    secondary: [],
    weight: { alexithymia: 1.1, emotreg: 1.0 },
  },
  compensation: {
    label: "Kompensation & Belastung",
    primary: ["masking", "overload"],
    secondary: [],
    weight: { masking: 1.2, overload: 1.0 },
  },
};

// Subscores: Item-ID-Listen (arbeiten auf Item-Ebene)
// Hinweis: mas_12 wird bewusst doppelt genutzt (Scripts/Burnout) – kann als “Signal” + “Subscore” parallel existieren.
export const SUBSCORES = [
  // Executive
  { key: "executive_initiation", label: "Task Initiation", items: ["exe_15", "exe_16"], method: "mean" },
  { key: "executive_impulse", label: "Impulsivität", items: ["exe_11", "exe_03", "exe_04"], method: "mean" },
  { key: "executive_workingmemory", label: "Arbeitsgedächtnis", items: ["exe_01", "exe_02", "exe_09"], method: "mean" },
  { key: "executive_priority", label: "Priorisierung", items: ["exe_17"], method: "single" },

  // Sensory
  {
    key: "sensory_hyper",
    label: "Überempfindlichkeit",
    items: ["sen_01","sen_02","sen_03","sen_04","sen_05","sen_06","sen_07","sen_08","sen_09","sen_11","sen_12"],
    method: "mean",
  },
  { key: "sensory_hypo", label: "Reize suchen", items: ["sen_10"], method: "single" },
  { key: "sensory_intero", label: "Interozeption", items: ["sen_13"], method: "single" },
  { key: "sensory_motor", label: "Feinmotorik", items: ["sen_14"], method: "single" },

  // Masking
  { key: "masking_eyecontact", label: "Augenkontakt", items: ["mas_11"], method: "single" },
  { key: "masking_scripts", label: "Skripte/Vorbereitung", items: ["mas_03", "mas_12"], method: "mean" },
  { key: "masking_burnout", label: "Erschöpfung durch Masking", items: ["mas_12"], method: "single" },

  // Alexithymia
  { key: "alexithymia_self", label: "Eigene Gefühle", items: ["alx_01","alx_02","alx_03","alx_04","alx_05","alx_06","alx_07","alx_08","alx_09"], method: "mean" },
  { key: "alexithymia_other", label: "Gefühle anderer", items: ["alx_10"], method: "single" },
  { key: "alexithymia_affective", label: "Affektive Empathie", items: ["alx_11"], method: "single" },
];

// Item-Signale (einzelne Antwortbedeutungen / High-yield Trigger)
// Keine Diagnosen. Nur “dieses Item ist sehr hoch” -> Marker in Report.
// Erweiterbar ohne Änderung der Kernmathe.
const ITEM_SIGNALS = [
  { key: "masking_exhaustion", id: "mas_12", label: "Masking führt zu Erschöpfung/Verlustgefühl", triggerMinLikert: 5 },
  { key: "hyperfocus_cant_stop", id: "hyp_08", label: "Hyperfokus: schwer aufzuhören trotz Erschöpfung", triggerMinLikert: 5 },
  { key: "hyperfocus_needs_ignored", id: "hyp_10", label: "Hyperfokus: Zeit/Bedürfnisse werden vergessen", triggerMinLikert: 5 },
  { key: "shutdown_cognitive", id: "ovl_06", label: "Überreizt: Denken/Sprechen schwerer", triggerMinLikert: 5 },
  { key: "interoception_delayed", id: "sen_13", label: "Interozeption: Hunger/Durst/Harndrang spät", triggerMinLikert: 5 },
  { key: "task_initiation_wall", id: "exe_15", label: "Aufgabenbeginn: fühlt sich an wie 'gegen eine Wand'", triggerMinLikert: 5 },
  { key: "emotion_switch_rapid", id: "emo_02", label: "Emotionen: abruptes Wechseln (0→100)", triggerMinLikert: 5 },
  { key: "alexithymia_words_hard", id: "alx_01", label: "Gefühle in Worte fassen schwer", triggerMinLikert: 5 },
];

// Onset-Standardwerte (für Normalisierung)
const ONSET_VALUES = new Set(["early","school","teen","adult","unknown","na"]);

// -------------------------
// Öffentliche API
// -------------------------
/**
 * calculateReport()
 * @param {Object} input
 * @param {Object<string, number|null|undefined>} input.answers  - Rohantworten: {att_01: 3, exe_15: 6, ...} (1..6)
 * @param {Array<{id:string, scale:string, text?:string, reverse?:boolean}>} input.questions - Fragenkatalog (id + scale)
 * @param {Object} [input.meta]   - Pre-Test Meta (frei erweiterbar; Engine nutzt nur Whitelist)
 * @param {Object} [input.onset]  - Post-Test Onset (z.B. {onset_adhd:"school", ...})
 * @param {Object} [input.options]
 * @returns {Object} report
 */
export function calculateReport({ answers, itemsByScale, meta = {}, onset = {}, options = {} }) {
  if (!itemsByScale || typeof itemsByScale !== "object") {
    throw new Error("scoringEngine: itemsByScale{} ist erforderlich.");
  }

  if (!answers || typeof answers !== "object") {
    throw new Error("scoringEngine: answers{} ist erforderlich.");
  }

  const cfg = {
    // Für “Truth”: null bleibt null. Für UI kann man später 0 verwenden.
    roundScore: options.roundScore ?? 0,             // Score-Rundung in Prozent
    roundPctText: options.roundPctText ?? 1,         // optional, nur für Anzeige-Schicht
    nowIso: options.nowIso ?? null,                  // deterministisch: timestamp nur wenn gegeben
    questionsVersion: options.questionsVersion ?? null,
    // Reverse: entweder question.reverse nutzen oder Set/Array in options.reverseItems
    reverseItems: toIdSet(options.reverseItems),
    // Validation
    strictIds: options.strictIds ?? false,           // true -> wirft Fehler, wenn SUBSCORES/Signals IDs fehlen
  };

  // Index bauen (questions ist kanonisch)
const index = buildIndexFromItemsByScale(itemsByScale, cfg.reverseItems);

  // Item-Ebene normalisieren (nur 1..6 akzeptieren), Reverse anwenden
  const item = normalizeItems(answers, index.allIds, index.reverseById);

  // Skalen-Scores berechnen
  const scales = computeScaleScores(item.values, index.idsByScale, cfg.roundScore);

  // Cluster-Scores (ignorieren Missing statt 0-Bias)
  const clusters = computeClusterScores(scales.rawScores);

  // Subscores (Item-Ebene)
  const subScores = computeSubScores(item.values, cfg.roundScore);

  // Item-Signale (einzelne Antwortbedeutungen)
  const itemSignals = computeItemSignals(item.values);

  // Qualitäts-/Response-Checks (nur Marker)
  const quality = computeQuality(item.values, index.allIds, index.idsByScale, scales.rawMeans);

  // Patterns / Subtypes / Discrepancies
  const patterns = detectPatterns({
    scales: scales.uiScores,          // UI-kompatibel (0 statt null)
    scalesRaw: scales.rawScores,      // nullfähig
    clusters: clusters.uiScores,
    clustersRaw: clusters.rawScores,
    meta,
    quality,
    itemSignals,
    subScores: subScores.uiScores,
  });

  const subtypes = detectSubtypes({
    scales: scales.uiScores,
    clusters: clusters.uiScores,
    meta,
    patterns,
    subScores: subScores.uiScores,
    itemSignals,
  });

  const discrepancies = analyzeDiscrepancies({
    scales: scales.uiScores,
    clusters: clusters.uiScores,
  });

  // Onset (pre + post) normalisieren
// Onset (pre + post) normalisieren
const onsetBlock = analyzeOnset({ meta, onset });

// Onset-Validierungen (DSM-5 Compliance)
const onsetValidation = {
  adhd: validateADHDOnset(onsetBlock),
  asdCriteriaA: checkASDCriteriaA(onsetBlock),
  asdCriteriaB: checkASDCriteriaB(onsetBlock),
  context: analyzeOnsetContext(onsetBlock)
};
  // Konfidenzen (technische Stabilitätsmarker)
  const confidences = computeConfidences({
    scalesUi: scales.uiScores,
    clustersUi: clusters.uiScores,
    patterns,
    quality,
    answeredRatio: item.answeredCount / Math.max(1, index.allIds.length),
  });

  // Profile-Objekt (für spätere Ausgaben / Ranking)
  const profiles = buildProfiles({
    scales: scales.uiScores,
    clusters: clusters.uiScores,
    confidences,
    patterns,
  });

  // MainProfile bestimmen + Kandidatenranking (Hero-Struktur vorbereitet)
  const mainProfile = determineMainProfile({
    scales: scales.uiScores,
    clusters: clusters.uiScores,
    profiles,
    patterns,
    subtypes,
    discrepancies,
    confidences,
  });

  // Optional: einfache Validierung von definitorischen IDs (SUBSCORES + ITEM_SIGNALS)
  if (cfg.strictIds) {
    validateDefinitionsOrThrow(index.allIds);
  }

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    engineVersion: SCORING_ENGINE_VERSION,
    questionsVersion: cfg.questionsVersion,
    timestamp: cfg.nowIso, // null wenn nicht gesetzt (deterministisch)

    input: {
      total: index.allIds.length,
      answered: item.answeredCount,
      answeredRatio: roundN(item.answeredCount / Math.max(1, index.allIds.length), 4),
      missingCount: item.missingIds.length,
      missingIds: item.missingIds,
      meta: sanitizeMeta(meta),
      onset: onsetBlock.input, // normalisiert
    },

    scales: {
      labels: SCALE_LABELS,
      // Wahrheit (nullfähig):
      raw: {
        scores: scales.rawScores,   // float/null 0..100
        means: scales.rawMeans,     // mean/null 1..6
      },
      // UI/legacy (0 statt null, integer):
      ui: {
        scores: scales.uiScores,    // int 0..100
      },
      answered: scales.answered,
      totals: scales.totals,
      confidence: confidences.scales, // 0..1
    },

    clusters: {
      defs: CLUSTERS,
      raw: { scores: clusters.rawScores }, // float/null
      ui: { scores: clusters.uiScores },   // int (0..100; null->0)
      confidence: confidences.clusters,
    },

    subScores: {
      defs: SUBSCORES,
      raw: {
        scores: subScores.rawScores, // float/null
        means: subScores.rawMeans,   // mean/null
      },
      ui: {
        scores: subScores.uiScores,  // int (null->0)
      },
      answered: subScores.answered,
      totals: subScores.totals,
    },

    itemSignals,     // Trigger-Liste + Werte
    quality,         // Antwortstilmarker
    patterns,
    subtypes,
    discrepancies,
onset: {
  ...onsetBlock.report,
  validation: onsetValidation
},
    profiles,
    mainProfile,

    // Slot für spätere Normierung/Kalibrierung (extern befüllbar)
    calibration: {
      normsSource: null,
      normsVersion: null,
      percentiles: null, // z.B. {attention: 72, ...} sobald Normen existieren
      cutoffs: null,     // datenbasiert/extern
    },
  };
}

// -------------------------
// Index / Normalisierung
// -------------------------
function buildIndexFromItemsByScale(itemsByScale, reverseItemsSet) {
  const idsByScale = {};
  const allIds = [];
  const reverseById = {};
  const seen = new Set();

  for (const [scale, ids] of Object.entries(itemsByScale)) {
    if (!Array.isArray(ids)) continue;

    for (const id of ids) {
      if (!id || seen.has(id)) continue;
      seen.add(id);

      (idsByScale[scale] ??= []).push(id);
      allIds.push(id);
      reverseById[id] = reverseItemsSet?.has(id) ?? false;
    }
  }

  return { idsByScale, allIds, reverseById };
}


function normalizeItems(answers, allIds, reverseById) {
  const values = {};
  const missingIds = [];
  let answeredCount = 0;

  for (const id of allIds) {
    const v = answers[id];
    if (v === null || v === undefined || v === "") {
      values[id] = null;
      missingIds.push(id);
      continue;
    }
    const n = Number(v);
    if (!Number.isFinite(n) || n < LIKERT_MIN || n > LIKERT_MAX) {
      values[id] = null;
      missingIds.push(id);
      continue;
    }
    values[id] = reverseById?.[id] ? applyReverse(n) : n;
    answeredCount++;
  }

  return { values, missingIds, answeredCount };
}

// -------------------------
// Mathe-Helfer
// -------------------------
function applyReverse(v) {
  // 1<->6, 2<->5, 3<->4
  return (LIKERT_MIN + LIKERT_MAX) - v;
}

function likertMeanToPct(mean) {
  if (!Number.isFinite(mean)) return null;
  return ((mean - LIKERT_MIN) / LIKERT_RANGE) * 100;
}

function roundN(x, decimals = 0) {
  if (x === null || x === undefined || !Number.isFinite(x)) return null;
  const f = 10 ** decimals;
  return Math.round(x * f) / f;
}

function safeMean(nums) {
  const arr = nums.filter(n => Number.isFinite(n));
  if (arr.length === 0) return null;
  return arr.reduce((a,b)=>a+b,0) / arr.length;
}

function clamp01(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

function toIdSet(x) {
  if (!x) return new Set();
  if (x instanceof Set) return x;
  if (Array.isArray(x)) return new Set(x.filter(Boolean));
  return new Set();
}

// -------------------------
// Skalen
// -------------------------
function computeScaleScores(itemValues, idsByScale, roundScoreDecimals) {
  const rawScores = {};
  const rawMeans = {};
  const answered = {};
  const totals = {};
  const uiScores = {};

  for (const scale of Object.keys(idsByScale)) {
    const ids = idsByScale[scale];
    totals[scale] = ids.length;

    const vals = ids.map(id => itemValues[id]).filter(v => v !== null);
    answered[scale] = vals.length;

    const mean = safeMean(vals);          // 1..6 oder null
    rawMeans[scale] = mean;

    const pct = mean === null ? null : likertMeanToPct(mean);  // 0..100 oder null
    rawScores[scale] = pct;

    // UI/legacy: null -> 0, int
    uiScores[scale] = pct === null ? 0 : Math.round(roundN(pct, roundScoreDecimals));
  }

  return { rawScores, rawMeans, uiScores, answered, totals };
}

// -------------------------
// Cluster
// -------------------------
function computeClusterScores(scaleScoresRaw) {
  const rawScores = {};
  const uiScores = {};

  for (const [key, cluster] of Object.entries(CLUSTERS)) {
    const all = [...cluster.primary, ...cluster.secondary];
    let wSum = 0;
    let wTot = 0;

    for (const s of all) {
      const w = cluster.weight?.[s] ?? 1.0;
      const vRaw = scaleScoresRaw?.[s];
      if (Number.isFinite(vRaw)) {
        wSum += vRaw * w;
        wTot += w;
      }
    }

    const raw = wTot > 0 ? (wSum / wTot) : null;
    rawScores[key] = raw;
    uiScores[key] = raw === null ? 0 : Math.round(raw);
  }

  return { rawScores, uiScores };
}

// -------------------------
// Subscores (Item-Ebene)
// -------------------------
function computeSubScores(itemValues, roundScoreDecimals) {
  const rawScores = {};
  const rawMeans = {};
  const answered = {};
  const totals = {};
  const uiScores = {};

  for (const def of SUBSCORES) {
    totals[def.key] = def.items.length;

    const vals = def.items.map(id => itemValues[id]).filter(v => v !== null);
    answered[def.key] = vals.length;

    let meanLikert = null;
    if (def.method === "single") {
      meanLikert = vals.length ? vals[0] : null;
    } else {
      meanLikert = safeMean(vals);
    }

    rawMeans[def.key] = meanLikert;

    const pct = meanLikert === null ? null : likertMeanToPct(meanLikert);
    rawScores[def.key] = pct;

    uiScores[def.key] = pct === null ? 0 : Math.round(roundN(pct, roundScoreDecimals));
  }

  return { rawScores, rawMeans, uiScores, answered, totals };
}

// -------------------------
// Item Signals
// -------------------------
function computeItemSignals(itemValues) {
  const hits = [];

  for (const s of ITEM_SIGNALS) {
    const v = itemValues[s.id];
    if (!Number.isFinite(v)) continue;
    if (v >= s.triggerMinLikert) {
      hits.push({
        key: s.key,
        id: s.id,
        label: s.label,
        valueLikert: v,
        valuePct: Math.round(likertMeanToPct(v)),
        triggerMinLikert: s.triggerMinLikert,
      });
    }
  }

  // Sort: höchste Intensität zuerst
  hits.sort((a,b) => (b.valueLikert - a.valueLikert) || (b.valuePct - a.valuePct));
  return hits;
}

// -------------------------
// Quality / Response Style
// -------------------------
function computeQuality(itemValues, allIdsInOrder, idsByScale, scaleMeansLikert) {
  const all = allIdsInOrder.map(id => itemValues[id]).filter(v => v !== null);
  const n = all.length;

  const mean = safeMean(all);
  const variance = mean === null ? null : safeMean(all.map(v => (v - mean) ** 2));

  // Extreme-Response-Rate (Anteil 1 oder 6)
  const extremeCount = all.filter(v => v === LIKERT_MIN || v === LIKERT_MAX).length;
  const extremeRate = n ? (extremeCount / n) : 0;

  // Straightlining-Approx: sehr geringe Varianz
  const lowVar = variance !== null && variance < 0.25;

  // längste Sequenz gleicher Antworten entlang der Frage-Reihenfolge (nur beantwortete, aber mit Breaks)
  const longestRun = computeLongestEqualRun(allIdsInOrder, itemValues);

  // Skalen-Streuung: mittlere Varianz je Skala (Marker)
  const scaleVars = [];
  for (const ids of Object.values(idsByScale)) {
    const vals = ids.map(id => itemValues[id]).filter(v => v !== null);
    const m = safeMean(vals);
    if (m === null) continue;
    const v = safeMean(vals.map(x => (x - m) ** 2));
    if (v !== null) scaleVars.push(v);
  }
  const avgScaleVar = safeMean(scaleVars) ?? 0;

  // Simple Consistency Marker (kein Alpha-Ersatz)
  const consistency = clamp01(1 - (avgScaleVar / 2.0)); // 0..1 grob

  return {
    answeredCount: n,
    globalMeanLikert: mean ?? null,
    globalVarianceLikert: variance ?? null,
    extremeRate: roundN(extremeRate, 4),
    lowVariance: !!lowVar,
    avgScaleVariance: roundN(avgScaleVar, 4),
    consistency: roundN(consistency, 4),
    longestEqualRun: longestRun, // {len, value, startIndex}
    scaleMeansLikert: scaleMeansLikert ?? {},
  };
}

function computeLongestEqualRun(allIdsInOrder, itemValues) {
  let best = { len: 0, value: null, startIndex: null };
  let curLen = 0, curVal = null, curStart = null;

  for (let i = 0; i < allIdsInOrder.length; i++) {
    const id = allIdsInOrder[i];
    const v = itemValues[id];
    if (!Number.isFinite(v)) {
      curLen = 0; curVal = null; curStart = null;
      continue;
    }
    if (curVal === v) {
      curLen++;
    } else {
      curVal = v;
      curLen = 1;
      curStart = i;
    }
    if (curLen > best.len) best = { len: curLen, value: curVal, startIndex: curStart };
  }
  return best;
}

// -------------------------
// Patterns
// -------------------------
function detectPatterns({ scales, clusters, meta, quality, itemSignals }) {
  const out = [];

  // Masking + ASD-Marker
  if (
    (scales.masking ?? 0) >= THRESHOLDS.elevated &&
    ((scales.social ?? 0) >= THRESHOLDS.elevated || (scales.sensory ?? 0) >= THRESHOLDS.elevated)
  ) {
    out.push({
      type: "high_masking",
      label: "Deutliche Kompensation (Masking)",
      confidence: maskingConfidence({ scales, meta }),
    });
  }

  // Stress overlay (wenn meta.stress hoch)
  if ((scales.overload ?? 0) >= 80 && meta?.stress && meta.stress !== "low") {
    out.push({
      type: "stress_overlay",
      label: "Aktuelle Belastung kann Traits überlagern",
      confidence: 0.8,
    });
  }

  // Traits-only Marker
  const avg10 = avgOfCore10(scales);
  const max10 = maxOfCore10(scales);
  if (avg10 >= THRESHOLDS.subclinical && avg10 < THRESHOLDS.elevated && max10 < 78) {
    out.push({
      type: "traits_only",
      label: "Traits erkennbar, ohne klar dominantes Profil",
      confidence: 0.6,
    });
  }

  // AuDHD-spezifisch
  if ((clusters.adhd ?? 0) >= THRESHOLDS.elevated && (clusters.autism ?? 0) >= THRESHOLDS.elevated) {
    if ((scales.hyperfocus ?? 0) >= THRESHOLDS.elevated && (scales.structure ?? 0) >= THRESHOLDS.elevated && (scales.overload ?? 0) >= THRESHOLDS.elevated) {
      out.push({
        type: "audhd_specific",
        label: "AuDHD-Interaktionsmuster (nicht nur Summe)",
        confidence: 0.85,
      });
    }
  }

  // Antwortstil-Marker
  if ((quality?.extremeRate ?? 0) >= 0.65) {
    out.push({ type: "response_extreme_style", label: "Viele Extremantworten", confidence: 0.55 });
  }
  if (quality?.lowVariance) {
    out.push({ type: "response_low_variance", label: "Sehr geringe Antwortstreuung", confidence: 0.55 });
  }
  if ((quality?.longestEqualRun?.len ?? 0) >= 25) {
    out.push({ type: "response_long_run", label: "Lange Sequenz gleicher Antworten", confidence: 0.55 });
  }

  // Item-Signal: Masking Exhaustion
  if (itemSignals?.some(s => s.key === "masking_exhaustion")) {
    out.push({ type: "masking_cost_marker", label: "Marker: Masking-Kosten/Erschöpfung", confidence: 0.7 });
  }

  return out;
}

function maskingConfidence({ scales, meta }) {
  let c = 0.5;
  const gender = meta?.gender;
  if (gender === "female" || gender === "diverse") c += 0.15;

  if ((scales.social ?? 0) >= THRESHOLDS.high && (scales.overload ?? 0) >= THRESHOLDS.high) c += 0.1;

  const innerDistress = ((scales.overload ?? 0) + (scales.alexithymia ?? 0)) / 2;
  const outerAdaptation = (scales.masking ?? 0);
  if ((outerAdaptation - innerDistress) >= 20) c += 0.15;

  return Math.min(c, 0.95);
}

function avgOfCore10(scales) {
  const keys = Object.keys(SCALE_LABELS);
  const vals = keys.map(k => scales[k] ?? 0);
  return vals.reduce((a,b)=>a+b,0) / vals.length;
}
function maxOfCore10(scales) {
  const keys = Object.keys(SCALE_LABELS);
  return Math.max(...keys.map(k => scales[k] ?? 0));
}
function minOfCore10(scales) {
  const keys = Object.keys(SCALE_LABELS);
  return Math.min(...keys.map(k => scales[k] ?? 0));
}

// -------------------------
// Subtypes
// -------------------------
function detectSubtypes({ scales, clusters, meta, patterns }) {
  const subtypes = [];

  // ADHD subtype logic
  if ((clusters.adhd ?? 0) >= THRESHOLDS.elevated) {
    if ((scales.attention ?? 0) >= THRESHOLDS.high && (scales.executive ?? 0) < THRESHOLDS.high && (scales.hyperfocus ?? 0) < THRESHOLDS.high) {
      subtypes.push({ type: "adhd_inattentive", confidence: 0.75, label: "ADHS-I Muster" });
    } else if ((scales.executive ?? 0) >= THRESHOLDS.high && (scales.emotreg ?? 0) >= THRESHOLDS.high && (scales.attention ?? 0) < THRESHOLDS.high) {
      subtypes.push({ type: "adhd_hyperactive_impulsive", confidence: 0.75, label: "ADHS-HI Muster" });
    } else if ((scales.attention ?? 0) >= THRESHOLDS.elevated && (scales.executive ?? 0) >= THRESHOLDS.elevated) {
      subtypes.push({ type: "adhd_combined", confidence: 0.8, label: "ADHS-C Muster" });
    }

    if ((scales.emotreg ?? 0) >= THRESHOLDS.very_high) {
      subtypes.push({ type: "adhd_emotional_dysregulation", confidence: 0.85, label: "ADHS mit starker Emotionsdysregulation" });
    }
  }

  // Autism presentations
  if ((clusters.autism ?? 0) >= THRESHOLDS.elevated) {
    if ((scales.sensory ?? 0) >= THRESHOLDS.elevated && (scales.social ?? 0) >= THRESHOLDS.elevated && (scales.structure ?? 0) >= THRESHOLDS.elevated) {
      subtypes.push({ type: "autism_classic", confidence: 0.8, label: "Klassisches ASD-Muster" });
    }

    if ((scales.social ?? 0) >= THRESHOLDS.high && (scales.masking ?? 0) >= THRESHOLDS.high && (scales.sensory ?? 0) >= THRESHOLDS.subclinical) {
      subtypes.push({ type: "autism_masked", confidence: 0.85, label: "Hoch maskiertes ASD-Muster" });
    }

    const gender = meta?.gender;
    if ((gender === "female" || gender === "diverse") && (scales.social ?? 0) >= THRESHOLDS.high && (scales.masking ?? 0) >= THRESHOLDS.elevated) {
      subtypes.push({ type: "autism_female_diverse_presentation", confidence: 0.8, label: "ASD-Präsentation (female/diverse Muster)" });
    }

    if ((scales.hyperfocus ?? 0) >= THRESHOLDS.high) {
      subtypes.push({ type: "autism_special_interest_intense", confidence: 0.75, label: "Intensive Spezialinteressen/Vertiefung" });
    }
  }

  // AuDHD conflict axes
  if ((clusters.adhd ?? 0) >= THRESHOLDS.elevated && (clusters.autism ?? 0) >= THRESHOLDS.elevated) {
    if ((scales.attention ?? 0) >= THRESHOLDS.high && (scales.structure ?? 0) >= THRESHOLDS.high) {
      subtypes.push({ type: "audhd_conflict_axes", confidence: 0.75, label: "AuDHD-Konfliktachsen (Struktur ↔ Wechsel/Impuls)" });
    }

    if (patterns.some(p => p.type === "audhd_specific")) {
      subtypes.push({ type: "audhd_specific", confidence: 0.85, label: "AuDHD-Interaktionsprofil" });
    }
  }

  return subtypes;
}

// -------------------------
// Discrepancies / Differential-Marker
// -------------------------
function analyzeDiscrepancies({ scales, clusters }) {
  const d = [];

  // Attention hoch, executive niedrig
  if ((scales.attention ?? 0) >= THRESHOLDS.high && (scales.executive ?? 0) < THRESHOLDS.elevated) {
    d.push({ type: "attention_executive_split", severity: "moderate", label: "Aufmerksamkeit hoch, Executive niedriger" });
  }

  // Executive hoch, attention niedriger
  if ((scales.executive ?? 0) >= THRESHOLDS.high && (scales.attention ?? 0) < THRESHOLDS.elevated) {
    d.push({ type: "executive_attention_split", severity: "moderate", label: "Executive hoch, Aufmerksamkeit niedriger" });
  }

  // Social hoch, sensory niedriger
  if ((scales.social ?? 0) >= THRESHOLDS.high && (scales.sensory ?? 0) < THRESHOLDS.elevated) {
    d.push({ type: "social_sensory_split", severity: "low", label: "Sozial hoch, Sensorik niedriger" });
  }

  // Masking sehr hoch, overload niedriger
  if ((scales.masking ?? 0) >= THRESHOLDS.very_high && (scales.overload ?? 0) < THRESHOLDS.elevated) {
    d.push({ type: "masking_without_overload", severity: "moderate", label: "Masking sehr hoch bei (noch) niedrigerer Überlastung" });
  }

  // Overload sehr hoch, andere moderat
  if ((scales.overload ?? 0) >= THRESHOLDS.very_high) {
    const others = Object.keys(SCALE_LABELS).filter(k => k !== "overload").map(k => scales[k] ?? 0);
    const avgOther = others.reduce((a,b)=>a+b,0) / others.length;
    if (avgOther < THRESHOLDS.elevated) {
      d.push({ type: "overload_overlay", severity: "high", label: "Sehr hohe Überlastung mit sonst moderateren Werten" });
    }
  }

  // Alexithymia hoch, emotreg niedriger
  if ((scales.alexithymia ?? 0) >= THRESHOLDS.very_high && (scales.emotreg ?? 0) < THRESHOLDS.elevated) {
    d.push({ type: "alexithymia_without_dysregulation", severity: "low", label: "Alexithymie hoch ohne starke Dysregulation" });
  }

  // Dysregulation hoch, alexithymia niedriger
  if ((scales.emotreg ?? 0) >= THRESHOLDS.very_high && (scales.alexithymia ?? 0) < THRESHOLDS.elevated) {
    d.push({ type: "dysregulation_without_alexithymia", severity: "moderate", label: "Dysregulation hoch ohne starke Alexithymie" });
  }

  // Flat moderate profile
  const avg10 = avgOfCore10(scales);
  const max10 = maxOfCore10(scales);
  const min10 = minOfCore10(scales);
  if (avg10 >= THRESHOLDS.subclinical && avg10 < THRESHOLDS.elevated && max10 < 73 && (max10 - min10) < 20) {
    d.push({ type: "flat_moderate_profile", severity: "low", label: "Relativ gleichmäßiges, moderates Profil" });
  }

  // Hohe Kompensation + hohe Überlastung + hohe Executive-Last
  if ((scales.masking ?? 0) >= THRESHOLDS.high && (scales.overload ?? 0) >= THRESHOLDS.high && (scales.executive ?? 0) >= THRESHOLDS.elevated) {
    d.push({ type: "high_compensation_load_combo", severity: "high", label: "Hohe Kompensation + hohe Überlastung + hohe Executive-Last" });
  }

  // Triple pattern (AuDHD + Alexithymie) – korrekt auf Clusterwerten basieren
  if ((clusters.adhd ?? 0) >= THRESHOLDS.elevated && (clusters.autism ?? 0) >= THRESHOLDS.elevated && (scales.alexithymia ?? 0) >= THRESHOLDS.high) {
    d.push({ type: "audhd_alexithymia_combined", severity: "high", label: "AuDHD-Cluster hoch + Alexithymie hoch" });
  }

  // Systemische Extremwerte
  const veryHighCount = Object.keys(SCALE_LABELS).filter(k => (scales[k] ?? 0) >= 80).length;
  if (veryHighCount >= 7) {
    d.push({ type: "systemic_extreme_presentation", severity: "high", label: "Viele Bereiche sehr hoch" });
  }

  return d;
}

function analyzeOnset({ meta, onset }) {
  // pre (global timing)
  const pre = normalizeOnsetValue(meta?.onset);

  // post timing (domain-specific): onset_*
  const post = {};

  // ctx (settings/impairment/...) – separat
  const ctx = {};

  // hf extras – separat (hf_*)
  const hf = {};

  let ctxSkipped = false;

  if (onset && typeof onset === "object") {
    for (const [k, v] of Object.entries(onset)) {
      if (k === "_ctx_skipped") {
        ctxSkipped = !!v;
        continue;
      }

      // ctx_*: nicht über ONSET_VALUES filtern
      if (k.startsWith("ctx_")) {
        if (v === null || v === undefined || v === "") continue;
        ctx[k] = String(v).trim();
        continue;
      }

      // hf_*: nicht über ONSET_VALUES filtern (eigene Optionsets)
      if (k.startsWith("hf_")) {
        if (v === null || v === undefined || v === "") continue;
        hf[k] = String(v).trim();
        continue;
      }

      // timing keys: NUR onset_* und nur erlaubte ONSET_VALUES
      if (k.startsWith("onset_")) {
        const nv = normalizeOnsetValue(v);
        if (nv) post[k] = nv;
        continue;
      }

      // alles andere ignorieren (keine "fremden" Keys in post)
    }
  }

  const hfPresent = Object.keys(hf).length > 0;

  return {
    input: {
      preOnset: pre ?? "unknown",
      postOnset: post,
      ctx,
      hf: hfPresent ? hf : null,          // ✅ neu: im input sichtbar
      ctxSkipped,
    },
    report: {
      pre: { value: pre ?? "unknown", present: pre !== null },
      post: { values: post, present: Object.keys(post).length > 0 },
      ctx: { values: ctx, present: Object.keys(ctx).length > 0, ctxSkipped },
      hf:  hfPresent ? { values: hf, present: true } : null, // ✅ neu: im report sichtbar
    },
  };
}

function normalizeOnsetValue(v) {
  if (v === null || v === undefined || v === "") return null;
  const s = String(v).trim();
  return ONSET_VALUES.has(s) ? s : null;
}

// -------------------------
// Onset Validation (DSM-5 Compliance)
// -------------------------

/**
 * Validiert ADHS-Onset: DSM-5 verlangt Symptombeginn vor Alter 12
 * @param {Object} onsetBlock - { postOnset: { onset_attention: "school", ... } }
 * @returns {Object} { valid: boolean, compromised: boolean, details: {} }
 */


// -------------------------
// Onset helpers (bridge report/input shapes)
// -------------------------
function getPostOnsetValues(onsetBlock) {
  return (
    onsetBlock?.report?.post?.values ??
    onsetBlock?.input?.postOnset ??
    onsetBlock?.post?.values ??
    {}
  );
}

function getCtxValues(onsetBlock) {
  return (
    onsetBlock?.report?.ctx?.values ??
    onsetBlock?.input?.ctx ??
    {}
  );
}

function getCtxSkipped(onsetBlock) {
  return (
    onsetBlock?.report?.ctx?.ctxSkipped ??
    onsetBlock?.input?.ctxSkipped ??
    false
  );
}

// -------------------------
// Onset Validation (DSM-5 Compliance)
// -------------------------


function validateADHDOnset(onsetBlock) {
  const adhdDomains = ["attention", "executive", "hyperfocus"];
  const postOnset = getPostOnsetValues(onsetBlock);

  const results = {};
  let hasEarly = false;   // early/school (<=12)
  let hasLate = false;    // teen/adult (>=13)
  let hasAnyInfo = false; // irgendeine verwertbare Angabe (nicht missing)

  for (const domain of adhdDomains) {
    const key = `onset_${domain}`;
    const timing = postOnset[key];

    // fehlend / unknown / na => unklar für Onset-Kriterium (tri-state)
    if (!timing || timing === "unknown" || timing === "na") {
      results[domain] = {
        valid: null,
        timing: timing || "missing",
        issue: !timing ? "missing" : (timing === "na" ? "not_applicable" : "uncertain"),
      };
      if (timing) hasAnyInfo = true;
      continue;
    }

    hasAnyInfo = true;

    // DSM-5: Beginn vor 12 -> early/school
    if (timing === "early" || timing === "school") {
      results[domain] = { valid: true, timing };
      hasEarly = true;
      continue;
    }

    // Alles ab 13 -> zu spät fürs Kriterium
    if (timing === "teen" || timing === "adult") {
      results[domain] = { valid: false, timing, issue: "onset_too_late" };
      hasLate = true;
      continue;
    }

    // Fallback (sollte durch Normalisierung kaum passieren)
    results[domain] = { valid: null, timing, issue: "uncertain" };
  }

  // Overall (tri-state):
  // - true, wenn irgendein ADHD-Bereich <=12
  // - false, wenn kein <=12, aber mind. ein Bereich >=13
  // - null, wenn nur unklare/fehlende Angaben
  const overallValid = hasEarly ? true : (hasLate ? false : null);

  return {
    valid: overallValid,
    compromised: overallValid === false,
    details: results,
  };
}




/**
 * Prüft ASD Kriterium A: ALLE 3 Bereiche müssen zutreffen (nicht "na")
 * @param {Object} onsetBlock
 * @returns {Object} { met: boolean, count: number, required: 3, details: {} }
 */
function checkASDCriteriaA(onsetBlock) {
  const domains = ["asdA_reciprocity", "asdA_nonverbal", "asdA_relationships"];
  const postOnset = getPostOnsetValues(onsetBlock);

  const results = {};
  for (const domain of domains) {
    const key = `onset_${domain}`;
    const timing = postOnset[key];
    results[domain] = {
      present: !!timing && timing !== "na",
      timing: timing || "missing",
    };
  }

  const count = Object.values(results).filter(r => r.present).length;

  return {
    met: count === 3,
    count,
    required: 3,
    details: results,
  };
}

/**
 * Prüft ASD Kriterium B: Mind. 2 von 4 RRB-Bereichen müssen zutreffen
 * @param {Object} onsetBlock
 * @returns {Object} { met: boolean, count: number, required: 2, details: {} }
 */
function checkASDCriteriaB(onsetBlock) {
  const domains = ["rrb_b1", "rrb_b2", "rrb_b3", "rrb_b4"];
  const postOnset = getPostOnsetValues(onsetBlock);

  const results = {};
  for (const domain of domains) {
    const key = `onset_${domain}`;
    const timing = postOnset[key];
    results[domain] = {
      present: !!timing && timing !== "na",
      timing: timing || "missing",
    };
  }

  const count = Object.values(results).filter(r => r.present).length;

  return {
    met: count >= 2,
    count,
    required: 2,
    details: results,
  };
}


/**
 * Analysiert Kontext-Faktoren (Settings, Impairment)
 * @param {Object} onsetBlock
 * @returns {Object}
 */
function analyzeOnsetContext(onsetBlock) {
  const ctx = getCtxValues(onsetBlock);
  const ctxSkipped = getCtxSkipped(onsetBlock);

  return {
    settings: {
      value: ctx.ctx_settings || "unknown",
      meetsADHDCriteria: ctx.ctx_settings === "2plus" || ctx.ctx_settings === "3plus",
      note: "DSM-5 ADHS verlangt Symptome in ≥2 Settings",
    },
    impairment: {
      value: ctx.ctx_impairment || "unknown",
      clinicallySignificant: ctx.ctx_impairment === "moderate" || ctx.ctx_impairment === "severe",
      note: "DSM-5 verlangt klinisch signifikante Beeinträchtigung",
    },
    ctxSkipped: !!ctxSkipped,
  };
}


// -------------------------
// Confidences (einheitlich, technisch)
// -------------------------
function computeConfidences({ scalesUi, clustersUi, patterns, quality, answeredRatio }) {
  const scaleConf = {};
  const clusterConf = {};

  const scaleKeys = Object.keys(SCALE_LABELS);
  for (const k of scaleKeys) {
    const primary = scalesUi[k] ?? 0;
    const secondary = Math.max(...scaleKeys.filter(x => x !== k).map(x => scalesUi[x] ?? 0));
    scaleConf[k] = calcConfidence01({
      primaryScore: primary,
      secondaryScore: secondary,
      patterns,
      quality,
      answeredRatio,
    });
  }

  for (const ck of Object.keys(CLUSTERS)) {
    const primary = clustersUi[ck] ?? 0;
    const secondary = Math.max(...Object.keys(CLUSTERS).filter(x => x !== ck).map(x => clustersUi[x] ?? 0));
    clusterConf[ck] = calcConfidence01({
      primaryScore: primary,
      secondaryScore: secondary,
      patterns,
      quality,
      answeredRatio,
    });
  }

  return { scales: scaleConf, clusters: clusterConf };
}

function calcConfidence01({ primaryScore, secondaryScore, patterns, quality, answeredRatio }) {
  let c;

  if (primaryScore >= THRESHOLDS.very_high) c = 0.85;
  else if (primaryScore >= THRESHOLDS.high) c = 0.75;
  else if (primaryScore >= THRESHOLDS.elevated) c = 0.65;
  else if (primaryScore >= THRESHOLDS.subclinical) c = 0.45;
  else c = 0.25;

  // Overlap-Reduktion
  if (Number.isFinite(secondaryScore) && Math.min(primaryScore, secondaryScore) >= THRESHOLDS.elevated) {
    c *= 0.85;
  }

  // Pattern-Modifikatoren
  const pats = patterns ?? [];
  if (pats.some(p => p.type === "stress_overlay")) c *= 0.9;
  if (pats.some(p => p.type === "high_masking")) c *= 0.85;

  // Konsistenz-Bonus (Marker)
  const consistency = quality?.consistency;
  if (Number.isFinite(consistency) && consistency >= 0.8) c *= 1.05;

  // Dominanz-Bonus
  if (Number.isFinite(secondaryScore) && (primaryScore - secondaryScore) >= 20) c *= 1.1;

  // Datenvollständigkeit (sehr grob)
  if (Number.isFinite(answeredRatio)) {
    if (answeredRatio < 0.8) c *= 0.9;
    if (answeredRatio < 0.6) c *= 0.8;
  }

  return clamp01(Math.min(c, 0.95));
}

// -------------------------
// Profiles (strukturierte Kandidaten)
// -------------------------
function buildProfiles({ scales, clusters, confidences, patterns }) {
  const avg10 = avgOfCore10(scales);
  const max10 = maxOfCore10(scales);

  return {
    adhd: {
      type: "adhd",
      score: clusters.adhd ?? 0,
      confidence: confidences.clusters?.adhd ?? 0,
      primary: (clusters.adhd ?? 0) >= THRESHOLDS.elevated,
    },
    autism: {
      type: "autism",
      score: clusters.autism ?? 0,
      confidence: confidences.clusters?.autism ?? 0,
      primary: (clusters.autism ?? 0) >= THRESHOLDS.elevated,
    },
    audhd: {
      type: "audhd",
      score: Math.round(((clusters.adhd ?? 0) + (clusters.autism ?? 0)) / 2),
      confidence: audhdConfidence01({ clusters, patterns }),
      primary: (clusters.adhd ?? 0) >= THRESHOLDS.elevated && (clusters.autism ?? 0) >= THRESHOLDS.elevated,
    },
    compensation: {
      type: "compensation",
      score: clusters.compensation ?? 0,
      confidence: confidences.clusters?.compensation ?? 0,
      present: patterns.some(p => p.type === "high_masking"),
      overlay: true,
    },
    emotional: {
      type: "emotional",
      score: clusters.emotional ?? 0,
      confidence: confidences.clusters?.emotional ?? 0,
      primary: (clusters.emotional ?? 0) >= THRESHOLDS.elevated,
    },
    stress: {
      type: "stress",
      score: scales.overload ?? 0,
      confidence: confidences.scales?.overload ?? 0,
      overlay: true,
    },
    traits: {
      type: "traits",
      score: Math.round(avg10),
      confidence: avg10 >= THRESHOLDS.subclinical ? 0.6 : 0.45,
      note: { avg10, max10 },
    },
  };
}

function audhdConfidence01({ clusters, patterns }) {
  const ad = clusters.adhd ?? 0;
  const au = clusters.autism ?? 0;

  if (ad < THRESHOLDS.elevated || au < THRESHOLDS.elevated) {
    return clamp01(((ad + au) / 200) * 0.9);
  }

  let c = 0.6;
  if (ad >= THRESHOLDS.high && au >= THRESHOLDS.high) c += 0.2;
  if (patterns.some(p => p.type === "audhd_specific")) c += 0.15;

  const diff = Math.abs(ad - au);
  if (diff < 10) c += 0.1;

  return clamp01(Math.min(c, 0.95));
}

// -------------------------
// MainProfile (Kernprofil + Schwerpunkt + Zusatzprofil vorbereitet)
// -------------------------
function determineMainProfile({ scales, profiles, patterns, subtypes, discrepancies, confidences }) {
  const candidates = rankCandidates({ profiles });

  // Dominanteste Skala (Schwerpunkt-Kandidat)
  const scaleEntries = Object.keys(SCALE_LABELS).map(k => [k, scales[k] ?? 0]);
  scaleEntries.sort((a,b)=>b[1]-a[1]);
  const [topScale, topScaleScore] = scaleEntries[0] ?? ["attention", 0];
  const [, secondScaleScore] = scaleEntries[1] ?? ["executive", 0];

  // Kernprofil: Kandidatenranking (Cluster) gewinnt, außer es ist nur Overlay
  const core = pickCoreProfile(candidates);

  // Schwerpunkt: dominanteste Skala, wenn deutlich
  const hasScaleFocus =
    topScaleScore >= THRESHOLDS.very_high ||
    (topScaleScore >= THRESHOLDS.high && (topScaleScore - secondScaleScore) >= 15);

  const focus = hasScaleFocus ? {
    kind: "scale",
    key: topScale,
    label: SCALE_LABELS[topScale] ?? topScale,
    score: topScaleScore,
    confidence: confidences.scales?.[topScale] ?? 0,
  } : null;

  // Zusatzprofil: Overlays (Masking/Stress) als “Add-on”, nicht als Gewinner
  const addon = candidates
    .filter(c => c.overlay)
    .slice(0, 2);

  return {
    kind: core ? "profile" : (hasScaleFocus ? "single_dominant_scale" : "mixed"),
    coreProfile: core,     // {type, score, confidence}
    focus,                 // null oder Skala
    addOn: addon,          // overlays
    patterns,
    subtypes,
    discrepancies,
    candidates,
  };
}

function pickCoreProfile(candidates) {
  // Overlays nicht als Kernprofil
  const nonOverlay = candidates.filter(c => !c.overlay);
  const winner = nonOverlay[0] ?? null;
  if (!winner) return null;
  return { type: winner.type, score: winner.score, confidence: winner.confidence };
}

function rankCandidates({ profiles }) {
  const arr = Object.values(profiles)
    .filter(p => p && Number.isFinite(p.score) && Number.isFinite(p.confidence))
    .map(p => ({
      type: p.type,
      score: p.score,
      confidence: p.confidence,
      overlay: !!p.overlay,
      present: p.present ?? p.primary ?? true,
    }))
    .filter(p => p.present);

  // Sortierung: Confidence primär, Overlay leicht abwerten
  arr.sort((a,b) => (b.confidence - (b.overlay ? 0.03 : 0)) - (a.confidence - (a.overlay ? 0.03 : 0)));
  return arr;
}

// -------------------------
// Meta (Whitelist, aber erweiterbar ohne Engine-Bruch)
// -------------------------
function sanitizeMeta(meta) {
  const out = {};
  if (!meta || typeof meta !== "object") return out;

  // Kernfelder
  if (meta.gender) out.gender = meta.gender;
  if (meta.age !== undefined && meta.age !== null && meta.age !== "") out.age = meta.age;
  if (meta.stress) out.stress = meta.stress;

  // Diagnose/Medikation/Kontext/Selbstbild
  if (meta.diagnosis) out.diagnosis = meta.diagnosis;
  if (meta.diagnoses) out.diagnoses = meta.diagnoses; // plural (wie in deinem test.js)
  if (meta.medication) out.medication = meta.medication;
  if (meta.context) out.context = meta.context;
  if (meta.selfview) out.selfview = meta.selfview;

  // Global onset (pre-test)
  if (meta.onset) out.onset = meta.onset;

  return out;
}

// -------------------------
// Definition Validation
// -------------------------
function validateDefinitionsOrThrow(allIds) {
  const idSet = new Set(allIds);

  for (const s of ITEM_SIGNALS) {
    if (!idSet.has(s.id)) throw new Error(`scoringEngine: ITEM_SIGNAL id fehlt im questions-Katalog: ${s.id}`);
  }
  for (const def of SUBSCORES) {
    for (const id of def.items) {
      if (!idSet.has(id)) throw new Error(`scoringEngine: SUBSCORE id fehlt im questions-Katalog: ${id} (subscore=${def.key})`);
    }
  }
}
