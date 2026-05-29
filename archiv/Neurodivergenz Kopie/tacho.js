// tacho.js
// SVG-Halbkreis-Tacho (Abweichung von Balance)
// interp.norm ∈ [0,1], 0.5 = balanced

/* =========================================================
   KANONISCHE STUFEN
========================================================= */

const TACHO_LEVELS = [
  "strong_negative",
  "negative",
  "slight_negative",
  "balanced",
  "slight_positive",
  "positive",
  "strong_positive"
];

/* =========================================================
   NORM → STUFE
========================================================= */

function normToTachoLevel(norm) {
  const d = norm - 0.5;

  if (d <= -0.30) return "strong_negative";
  if (d <= -0.15) return "negative";
  if (d <  -0.05) return "slight_negative";
  if (d <=  0.05) return "balanced";
  if (d <   0.15) return "slight_positive";
  if (d <   0.30) return "positive";
  return "strong_positive";
}

/* =========================================================
   TEXT LOOKUP (ROBUST)
========================================================= */

function getTachoText(scale, level) {
  const s = TACHO_TEXTS?.[scale];
  if (!s) return null;

  return s[level] ?? s.balanced ?? null;
}

/* =========================================================
   TEXTBOX UPDATE
========================================================= */

function updateTachoTextbox(scale, level) {
  const t = getTachoText(scale, level);
  if (!t) return;

  document.querySelector(".tacho-strengths-title").textContent =
    t.strengths_title;

  document.querySelector(".tacho-strengths").textContent =
    t.strengths;

  document.querySelector(".tacho-weaknesses-title").textContent =
    t.weaknesses_title;

  document.querySelector(".tacho-weaknesses").textContent =
    t.weaknesses;

  document.querySelector(".tacho-conclusion").textContent =
    t.conclusion;
}

/* =========================================================
   SVG TACHO RENDER
========================================================= */

export function renderTacho(container, interp, scale) {
  if (!container || !interp || typeof interp.norm !== "number") return;

  const level = normToTachoLevel(interp.norm);

  // 👉 Textbox synchronisieren
  updateTachoTextbox(scale, level);

  const size = 180;
  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;

  // links → oben → rechts
  const rad = Math.PI * (1 - interp.norm);

  const nx = cx + radius * Math.cos(rad);
  const ny = cy - radius * Math.sin(rad);

  const gid = "grad-" + Math.random().toString(36).slice(2);

  container.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6b7280"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#16a34a"/>
        </linearGradient>
      </defs>

      <!-- oberer Halbkreis -->
      <path
        d="M ${cx - radius} ${cy}
           A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}"
        fill="none"
        stroke="url(#${gid})"
        stroke-width="12"
        stroke-linecap="round"
      />

      <!-- Zeiger -->
      <line
        x1="${cx}"
        y1="${cy}"
        x2="${nx}"
        y2="${ny}"
        stroke="#111"
        stroke-width="3"
      />

      <circle cx="${cx}" cy="${cy}" r="4" fill="#111"/>
    </svg>
  `;
}
