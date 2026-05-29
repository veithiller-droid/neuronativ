// state.js
// Zentrale Zustandsverwaltung

export const state = {

  // =====================
  // META-DATEN (VORSCHALTUNG)
  // =====================
  meta: {
    age: null,          // "u18" | "18-24" | "25-34" | ...
    gender: null,       // "female" | "male" | "diverse" | "na"
    diagnosis: [],      // ["adhd","autism",...]
    onset: null,        // "childhood" | "youth" | "adult" | "recent" | "unsure"
    stress: null,       // "low" | "mild" | "medium" | "high" | "very-high"
    context: null,      // "school" | "employed" | "self" | ...
    medication: null,   // "yes" | "no" | "na"
    selfview: null      // "no" | "rather-no" | "unsure" | "rather-yes" | "yes"
  },

  // =====================
  // TEST-ROHDATEN
  // =====================
  answers: {},          // questionIndex → 1–5

  // =====================
  // SKALEN-SCORES
  // =====================
  scores: {},           // scale → Prozent (0–100)

  // =====================
  // INTERPRETATIONEN
  // =====================
  interp: {}            // scale → Interpretationsobjekt
};
