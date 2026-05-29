// profile_selectors.js
// Parameter-/Policy-Layer (keine Texte, keine UI)
// Stand: gleichgewichtete Cluster, feste Schwellen, Top6-Regeln, Überlagerer-Flags

export const PROFILE_SELECTORS = {
  // 1) Skalen → Cluster (fix)
  clusters: {
    adhd: ["attention", "executive", "hyperfocus"],
    autism: ["sensory", "social", "structure"],
    emotional: ["alexithymia", "emotreg"],
    compensation: ["masking", "overload"]
  },

  // 2) Gewichte (aktuell: alle gleich)
  weights: {
    cluster: "equal", // Mittelwert der enthaltenen Skalen
    profile: "equal"
  },

  // 3) Schwellenwerte
  thresholds: {
    // Label/Level (für Texte/Badges)
    level: {
      low: 45,
      mid: 60,
      high: 75,
      very_high: 90
    },

    // Kern-Profile (Entscheidung)
    profiles: {
      core_high: 70,
      core_low_guard: 60,   // "andere Richtung muss darunter liegen"
      traits_min: 55,
      traits_max: 69
    },

    // Überlagerer
    overlays: {
      compensation_high: 75,
      masking_very_high: 80,
      emotional_very_high: 80,
      mixed_min: 55
    },

    // Top6 (Anzeige-Policy)
    top6: {
      show_core_always: ["adhd", "autism", "audhd"],
      add_masking_if: 70,
      add_emotional_if: 75,
      add_overload_if: 70,
      add_hyperfocus_if: 70
    },
    nextSteps: {
    max: 10,                 // UI-Limit
    minCluster: 65,         // ab wann by_cluster greift
    minFocusScale: 65,      // ab wann Fokus-Skala greift
    minExtraScale: 70,      // ab wann zusätzliche Skalen greifen
    extraScaleCount: 3,     // wie viele zusätzliche Skalen (je 1 Einzeiler)
    weights: {              // Prioritäten (höher = früher)
      base: 100,
      intervention: 90,
      cluster: 80,
      focus: 70,
      extraScale: 60
    }
  }
  },

  // 4) Onset-Mapping (Test-Optionen → UI-Timing)
  onset: {
    mapValueToTiming(value) {
    if (value === null || value === undefined || value === "") return null;
    const v = String(value).trim();

    // Engine-Werte: 1:1 durchreichen (damit renderOnset direkt sauber mappt)
    if (["early", "school", "teen", "adult", "unknown", "na"].includes(v)) return v;

    // Legacy → Engine
    if (v === "childhood") return "early";
    if (v === "youth")     return "teen";
    if (v === "recent")    return "adult";
    if (v === "unsure")    return "unknown";

    // Fallback: niemals alles auf "unsure" ziehen
    return v;
  },
    // expected keys from test.js: onset_adhd/onset_autism/onset_emotional/onset_overload
    clusterKeyMap: {
      adhd: "onset_adhd",
      autism: "onset_autism",
      emotional: "onset_emotional",
      compensation: "onset_overload"
    }
  },

  // 5) Dominant-Skala Labels (ohne Texte-Overkill)
  dominantScaleLabels: {
    attention: "Aufmerksamkeit & Starten",
    executive: "Exekutive Funktionen",
    hyperfocus: "Hyperfokus",
    sensory: "Sensorik",
    social: "Soziale Verarbeitung",
    structure: "Struktur & Vorhersehbarkeit",
    masking: "Masking",
    overload: "Überlastung/Overload",
    alexithymia: "Emotionswahrnehmung",
    emotreg: "Emotionale Regulation"
  }
};
