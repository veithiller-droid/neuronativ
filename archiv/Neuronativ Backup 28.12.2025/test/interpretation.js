import { state } from "./state.js";

/* =====================
   1. NORMIERUNG
===================== */
function normalizePercent(percent) {
  const CENTER = 50;
  const RANGE = 30;

  const delta = percent - CENTER;
  const clamped = Math.max(-RANGE, Math.min(RANGE, delta));
  const norm = (clamped + RANGE) / (2 * RANGE);

  return { percent, delta, norm };
}

/* =====================
   2. BASIS-INTERPRETATION
===================== */
function baseInterpretation(norm) {
  if (norm < 0.33) return "low";
  if (norm < 0.66) return "medium";
  return "high";
}

/* =====================
   3. META-ADJUSTIERUNG
===================== */
function applyMetaAdjustments(scale, interp, meta) {

  if (scale === "masking" && interp.level === "high") {

    // spätere Kompensation
    if (
      meta.age &&
      !meta.age.startsWith("u") &&
      (meta.gender === "female" || meta.gender === "diverse")
    ) {
      interp.note =
        "Hinweis: Dieser Wert spricht eher für langfristig erlernte Anpassungsstrategien als für situative soziale Unsicherheit.";
    }

    // frühe Entwicklung
    if (meta.onset === "childhood") {
      interp.note =
        "Die Ausprägung passt zu früh entwickelter Maskierung im neuroentwicklungsbedingten Kontext.";
    }
  }

  return interp;
}

/* =====================
   ÖFFENTLICHE FUNKTION
===================== */
export function interpretScale(scale, percent, meta) {

  const normData = normalizePercent(percent);
  const level = baseInterpretation(normData.norm);

  let interp = {
    ...normData,
    level
  };

  interp = applyMetaAdjustments(scale, interp, meta);

  return interp;
}

/* =====================
   EVALUATION (ZENTRAL)
===================== */
export function evaluate() {
  const result = {};

  for (const scale in state.scores) {
    result[scale] = interpretScale(
      scale,
      state.scores[scale],
      state.meta
    );
  }

  state.interp = result;
}
