import { interpretScale } from "./interpretation.js";
import { renderTacho } from "./tacho.js";


function showResults() {
  document.getElementById("questionText").style.display = "none";
  document.getElementById("scaleButtons").style.display = "none";
  document.getElementById("progress").style.display = "none";

  window.scrollTo({ top: 0 });

  const container = document.getElementById("results");
  container.innerHTML = "<h2>Auswertung</h2>";

  const scores = calculateScaleResults();

  // ===== EBENE 0: BALKEN =====
  for (const k in scores) {
    container.innerHTML += `
      <div class="scale-result">
        <div style="margin-bottom:6px;font-weight:500;">
          ${SCALES[k].label}
        </div>
        <div class="bar">
          <div class="fill" style="width:${scores[k]}%"></div>
        </div>
      </div>
    `;
  }

  // ===== BUTTON GESAMTAUSWERTUNG =====
  container.innerHTML += `
    <button id="toggle-overview" class="toggle-main">
      ▸ Gesamtauswertung anzeigen
    </button>
    <div id="overview-details" class="hidden"></div>
  `;

  const overview = document.getElementById("overview-details");

  // ===== THEMEN (IMMER SICHTBAR) =====
for (const k in scores) {
  overview.innerHTML += `
    <div class="topic">

      <h3>${SCALES[k].label}</h3>

      <p class="topic-intro">
        ${SCALE_INTROS[k] || ""}
      </p>

      <p class="topic-text" id="text-${k}"></p>

      <!-- TACHO DROPDOWN -->
      <button class="toggle-tacho" data-scale="${k}">
        ▸ Tacho anzeigen
      </button>

      <div class="tacho-details hidden" id="tacho-box-${k}">
        <div class="tacho-box">
          <span class="tacho-inline" id="tacho-${k}"></span>
        </div>
      </div>

    </div>
  `;
}


 // ===== TACHOS RENDERN =====
for (const k in scores) {
  const el = document.getElementById(`tacho-${k}`);
  if (!el) continue;
  renderTacho(el, interpretScale(scores[k]));
}

// ===== TEXTE BEFÜLLEN =====
renderDetailedText();

// ===== TOGGLE: GESAMTAUSWERTUNG =====
document.getElementById("toggle-overview").onclick = () => {
  document.getElementById("overview-details").classList.toggle("hidden");
};

// ===== TOGGLE: TACHOS JE THEMA =====
document.querySelectorAll(".toggle-tacho").forEach(btn => {
  btn.onclick = () => {
    const box = document.getElementById("tacho-box-" + btn.dataset.scale);
    box.classList.toggle("hidden");

    btn.textContent = box.classList.contains("hidden")
      ? "▸ Tacho anzeigen"
      : "▾ Tacho ausblenden";
  };
});

}






// =====================
// FRAGEN
// =====================
const questions = [
   "Ich beginne Aufgaben motiviert, verliere aber unterwegs den inneren Halt.",
  "Bestimmte Geräusche empfinde ich als körperlich unangenehm.",
  "Ich wirke belastbarer, als ich mich innerlich fühle.",
  "Es fällt mir schwer, meine Gefühle in Worte zu fassen.",
  "Small Talk kostet mich viel Energie.",
  "Meine Aufmerksamkeit schwankt stark je nach Interesse.",
  "Ich merke oft erst spät, dass mir Reize zu viel werden.",
  "Klare Abläufe geben mir innere Sicherheit.",
  "Körperliche Spannungen erkenne ich früher als Gefühle.",
  "Gruppensituationen sind innerlich anstrengend für mich.",

  "Ich brauche viel innere Energie, um Alltägliches zu erledigen.",
  "Helles Licht oder visuelle Unruhe ermüden mich schnell.",
  "Ich passe meine Ausdrucksweise an mein Gegenüber an.",
  "Ich analysiere Situationen eher sachlich als emotional.",
  "Routinetätigkeiten kosten mich unverhältnismäßig viel Kraft.",
  "Nach sozialen Kontakten brauche ich Erholungszeit.",
  "Ich brauche Rückzug, um mich wieder zu stabilisieren.",
  "Ich habe gelernt, mich sozial „richtig“ zu verhalten.",
  "Zu viele Optionen überfordern mich.",
  "Ich merke oft erst spät, wie es mir emotional geht.",

  "Ich arbeite besser unter Druck als ohne klare äußere Vorgaben.",
  "Mehrere gleichzeitige Eindrücke überfordern mich innerlich.",
  "Ich denke Gespräche oft vor oder nach.",
  "Ich bemerke Reize oft früher als andere.",
  "Ich weiß oft, was zu tun wäre, komme aber schwer ins Tun.",
  "Ironie oder Andeutungen irritieren mich manchmal.",
  "Mein Körper reagiert stark auf Stress oder Überforderung.",
  "Ich übe Reaktionen oder Gespräche innerlich vor.",
  "Planung hilft mir, innerlich ruhig zu bleiben.",
  "Gefühle zeigen sich bei mir eher körperlich als gedanklich.",

  "Meine Gedanken laufen parallel in mehrere Richtungen.",
  "In vollen oder lauten Umgebungen fühle ich mich schnell leer.",
  "Ich beobachte andere, um angemessen zu reagieren.",
  "Kleidung, Materialien oder Berührungen können mich stark irritieren.",
  "Ich verliere Zeitgefühl, wenn mich etwas interessiert.",
  "Spontane soziale Situationen stressen mich.",
  "Ich reguliere mich über Rückzug, Stille oder Wiederholung.",
  "Ich versuche, möglichst unauffällig zu wirken.",
  "Spontane Entscheidungen anderer stressen mich.",
  "Ich brauche Zeit, um zu verstehen, was ich fühle.",

  "Ich bin innerlich oft unruhig, auch wenn ich nach außen ruhig wirke.",
  "Wenn ich überreizt bin, fällt mir Denken oder Sprechen schwerer.",
  "Ich bin unsicher, ob ich andere richtig verstehe.",
  "Ich unterdrücke Bedürfnisse, um dazuzugehören.",
  "Ich muss mich aktiv strukturieren, um nicht den Überblick zu verlieren.",
  "Nach reizintensiven Tagen bin ich emotional erschöpft.",
  "Ich bevorzuge klare, direkte Kommunikation.",
  "Ich merke erst im Nachhinein, wie anstrengend soziale Situationen waren.",
  "Chaos im Außen wirkt sich stark auf mein Inneres aus.",
  "Wenn andere nach meinen Gefühlen fragen, bin ich unsicher, was ich antworten soll.",

  "Pausen fallen mir schwer, selbst wenn ich erschöpft bin.",
  "Ich meide bestimmte Orte wegen Geräuschen, Licht oder Gerüchen.",
  "Ich analysiere soziale Situationen bewusst.",
  "Mein äußeres Auftreten entspricht nicht immer meinem inneren Zustand.",
  "Ich funktioniere in Schüben statt gleichmäßig.",
  "Andere unterschätzen, wie stark mich Sinneseindrücke beeinflussen.",
  "Nach sozialen Kontakten bin ich innerlich erschöpft.",
  "Anpassung kostet mich mehr Kraft, als man sieht.",
  "Ich reagiere sensibel auf Unklarheit oder Unsicherheit.",
  "Mir fällt es leichter, über Gedanken als über Gefühle zu sprechen.",

  "Erholung dauert bei mir länger als bei anderen.",
  "Ich nehme feine Unterschiede in Licht, Farben oder Bewegungen stark wahr.",
  "Ich fühle mich sozial „anders“, auch wenn ich angepasst wirke.",
  "Ich orientiere mich stark an Erwartungen anderer.",
  "Struktur ist für mich entlastend, nicht einengend.",
  "Mein Körper reagiert deutlich auf sensorische Überforderung.",
  "Ohne Anpassung fühle ich mich schnell unsicher.",
  "Ich spüre, dass etwas in mir los ist, kann es aber schwer benennen.",
  "Veränderungen kosten mich mehr Energie als andere vermuten.",
  "Ich brauche Vorhersehbarkeit, um mich wohlzufühlen.",

  "Ich spüre, dass etwas in mir los ist, kann es aber schwer benennen.",
  "Es fällt mir schwer, meine Gefühle in Worte zu fassen.",
  "Ich merke oft erst spät, wie es mir emotional geht.",
  "Körperliche Spannungen erkenne ich früher als Gefühle.",
  "Wenn andere nach meinen Gefühlen fragen, bin ich unsicher, was ich antworten soll.",
  "Ich brauche Zeit, um zu verstehen, was ich fühle.",
  "Gefühle zeigen sich bei mir eher körperlich als gedanklich.",
  "Ich analysiere Situationen eher sachlich als emotional.",
  "Mir fällt es leichter, über Gedanken als über Gefühle zu sprechen.",
  "Andere nehmen meine Gefühlslage oft anders wahr, als ich sie innerlich erlebe."

];

// =====================
// SKALEN
// =====================
const SCALES = {
  attention: { label: "Aufmerksamkeit & Selbstregulation", items:[1,6,11,15,21,25,31,35,41,45,51,55] },
  overload:  { label: "Sensorische & emotionale Überlastung", items:[3,7,12,17,22,27,32,37,46,57,61,71] },
  social:    { label: "Soziale Wahrnehmung", items:[5,10,16,23,26,33,36,43,47,53,63] },
  masking:   { label: "Maskierung & Anpassung", items:[3,13,18,28,38,44,48,54,58,64,67,72] },
  structure: { label: "Struktur & Sicherheit", items:[8,19,29,39,49,59,65,69,70,75,80] },
  sensory:   { label: "Sensorische Empfindlichkeit", items:[2,12,22,24,34,42,52,56,62,66,73,76] },
  alexithymia:{ label:"Emotionswahrnehmung", items:[4,9,14,20,30,40,50,60,68,79] }
};

// =====================
// STATE
// =====================
const TOTAL = questions.length;
const answers = Array(TOTAL).fill(null);
let current = 0;

// =====================
// RENDER
// =====================
function render() {
  document.getElementById("questionText").innerText =
    `${current + 1}. ${questions[current]}`;

  document.getElementById("progress").innerText =
    `Frage ${current + 1} von ${TOTAL}`;

  renderScale();
}

function renderScale() {
  const container = document.getElementById("scaleButtons");
  container.className = "scale";
  container.innerHTML = "";

  const labels = [
    "trifft nicht zu",
    "trifft eher nicht zu",
    "teils / teils",
    "trifft eher zu",
    "trifft vollständig zu"
  ];

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.innerText = labels[i - 1];

    btn.onclick = () => {
      answers[current] = i;

      if (current < TOTAL - 1) {
        current++;
        render();
      } else {
        showResults();
      }
    };

    container.appendChild(btn);
  }
}



// =====================
// AUSWERTUNG
// =====================
function calculateScaleResults() {
  const r = {};
  for (const k in SCALES) {
    let sum = 0, c = 0;
    SCALES[k].items.forEach(i => {
      const v = answers[i - 1];
      if (v !== null) { sum += v; c++; }
    });
    r[k] = Math.round((sum / (c * 5)) * 100);
  }
  return r;
}

// =====================
// SKALEN – EINLEITUNGSTEXTE
// =====================
const SCALE_INTROS = {
  attention: "Diese Skala beschreibt, wie Aufmerksamkeit, Antrieb und innere Steuerung im Alltag erlebt werden. Sie bezieht sich nicht auf Fähigkeit oder Intelligenz, sondern auf den inneren Aufwand, mit dem Aufgaben begonnen, aufrechterhalten und abgeschlossen werden. Viele neurodivergente Menschen erleben hier deutliche Schwankungen, abhängig von Interesse, Kontext und innerer Belastung.",

  sensory: "Diese Skala bezieht sich auf die Wahrnehmung und Verarbeitung von Sinneseindrücken wie Geräuschen, Licht, Berührung oder visueller Unruhe. Unterschiede in diesem Bereich sind bei neurodivergenten Menschen häufig und sagen nichts über Belastbarkeit aus, sondern darüber, wie intensiv Reize innerlich ankommen.",

  social: "Diese Skala beschreibt, wie soziale Situationen innerlich wahrgenommen, eingeordnet und verarbeitet werden. Sie bezieht sich weniger auf soziales Können als auf den inneren Aufwand, der mit Interaktion, Interpretation und Präsenz verbunden sein kann.",

  masking: "Diese Skala bezieht sich auf bewusste oder unbewusste Anpassungsleistungen im sozialen Umfeld. Viele neurodivergente Menschen entwickeln Strategien, um Erwartungen zu erfüllen oder nicht aufzufallen. Diese Anpassung kann hilfreich sein, ist aber oft mit innerem Energieaufwand verbunden.",

  structure: "Diese Skala beschreibt das Bedürfnis nach Vorhersehbarkeit, klaren Abläufen und innerer Ordnung. Struktur kann dabei nicht als Einschränkung, sondern als entlastende Voraussetzung für Stabilität, Orientierung und Wohlbefinden erlebt werden.",

  alexithymia: "Diese Skala bezieht sich auf die Wahrnehmung, Einordnung und sprachliche Benennung innerer Zustände und Gefühle. Unterschiede in diesem Bereich sind keine emotionale Abwesenheit, sondern beschreiben verschiedene Wege, wie Emotionen innerlich erlebt und zugänglich werden."
};
// =====================
// SKALEN – ÜBERSCHRIFTEN (DE)
// =====================
const SCALE_TITLES = {
  attention: "Aufmerksamkeit & Selbstregulation",
  overload: "Sensorische & emotionale Überlastung",
  sensory: "Sensorische Empfindlichkeit",
  social: "Soziale Wahrnehmung",
  masking: "Maskierung & Anpassung",
  structure: "Struktur & Sicherheit",
  alexithymia: "Emotionswahrnehmung"
};


function renderDetailedText() {
  const grouped = {};

  // Antworten sammeln und nach Skala gruppieren
  for (let i = 0; i < answers.length; i++) {
    const a = answers[i];
    if (!a) continue;

    const item = ITEM_TEXTS[i + 1];
    if (!item) continue;

    const scale = item.scale;
    if (!grouped[scale]) grouped[scale] = [];
    grouped[scale].push(item.texts[a]);
  }

  // Texte gezielt in die jeweiligen Themen-Boxen schreiben
  for (const scale in grouped) {
    const target = document.getElementById("text-" + scale);
    if (!target) continue;

    target.textContent = grouped[scale].join(" ");
  }
}



// =====================
render();
