export function interpretScale(percent) {
  const CENTER = 50;
  const RANGE = 30; // max. sichtbare Abweichung

  const delta = percent - CENTER;

  // Begrenzen
  const clamped = Math.max(-RANGE, Math.min(RANGE, delta));

  // Normierung für SVG (0–1)
  const norm = (clamped + RANGE) / (2 * RANGE);

  return {
    percent,
    delta,        // z.B. +15 oder -12
    norm,         // 0..1, Mitte = 0.5
    direction:
      delta > 3 ? "right" :
      delta < -3 ? "left" :
      "center",
    magnitude: Math.abs(delta)
  };
}
