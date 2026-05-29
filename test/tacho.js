// tacho.js
// Reines SVG-Halbkreis-Tacho
// interp.norm ∈ [0,1], 0.5 = balanced

export function renderTacho(container, interp) {
  if (!container || !interp || typeof interp.norm !== "number") return;

  const size = 180;
  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;

  // links → oben → rechts
  const rad = Math.PI * (1 - interp.norm);
  const nx = cx + radius * Math.cos(rad);
  const ny = cy - radius * Math.sin(rad);

  const gid = "grad-" + Math.random().toString(36).slice(2);

  const target =
    container.classList.contains("tacho-inline")
      ? container
      : container.querySelector(".tacho-inline");

  if (!target) return;

  target.innerHTML = `
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
