// tacho_text_render.js
import { TACHO_TEXTS } from "./tacho_text.js";

const LEVELS = [
  "strong_negative",
  "negative",
  "slight_negative",
  "balanced",
  "slight_positive",
  "positive",
  "strong_positive"
];

function normToLevel(norm) {
  const d = norm - 0.5;
 if (d <= -0.35) return "strong_positive";    // niedrig → Text Level 7
if (d <= -0.20) return "positive";
if (d <  -0.08) return "slight_positive";
if (d <=  0.08) return "balanced";           // bleibt
if (d <   0.20) return "slight_negative";
if (d <   0.35) return "negative";
return "strong_negative";                    // hoch → Text Level 1
}

export function renderTachoText(container, interp, scale) {
  if (!container || !interp || typeof interp.norm !== "number") return;

  const level = normToLevel(interp.norm);
  const data = TACHO_TEXTS?.[scale]?.[level];
  if (!data) return;

  container.innerHTML = `
    <div class="tacho-text-box">
      <strong>${data.strengths_title}</strong>
      <p>${data.strengths}</p>

      <strong>${data.weaknesses_title}</strong>
      <p>${data.weaknesses}</p>

      <p><em>${data.conclusion}</em></p>
    </div>
  `;
}
