import { questions } from './questions.js';
import { SCALES } from './scales.js';
import { state } from "./state.js";
import { evaluate } from "./interpretation.js";
import { renderTacho } from "./tacho.js";
import { ITEM_TEXTS } from "./item_texts.js";
import { interpretScale } from "./interpretation.js";
import { renderTachoText } from "./tacho_text_render.js";
import { renderProfilePage as renderProfileView } from "./profile.js";
import { renderProfiles } from "./profile_render.js";

function labelFromPercent(p) {
  if (p < 25) return "kaum Ausprägung";
  if (p < 50) return "geringe Ausprägung";
  if (p < 75) return "mittlere Ausprägung";
  return "deutliche Ausprägung";
}

function onAnswer(scale, questionId, value) {
  state.answers[questionId] = value;
  state.scores = calculateScaleResults();
  evaluate();

  const box = document.querySelector(`.tacho-box.${scale}`);
  if (box && state.interp[scale]) {
    renderTacho(box, state.interp[scale], scale);
  }
}

export function showResults() {
  document.getElementById("questionText").style.display = "none";
  document.getElementById("scaleButtons").style.display = "none";
  document.getElementById("progress").style.display = "none";
  document.getElementById("onset-page").style.display = "none";

  window.scrollTo({ top: 0 });

  const container = document.getElementById("results");
  container.innerHTML = "<h2>Auswertung</h2>";

  const scores = calculateScaleResults();

  for (const k in scores) {
    container.innerHTML += `
      <div class="scale-result">
        <div style="margin-bottom:6px;font-weight:500;">
          ${SCALES[k].label}
        </div>

        <div class="bar">
          <div class="fill" style="width:${scores[k]}%">
            <span class="bar-value">${scores[k]}%</span>
          </div>
        </div>

        <div class="bar-label">
          ${labelFromPercent(scores[k])}
        </div>
      </div>
    `;
  }

  container.innerHTML += `
    <button id="toggle-overview" class="toggle-main">
      ▸ Gesamtauswertung anzeigen
    </button>
    <div id="overview-details" class="hidden"></div>
  `;

  const overview = document.getElementById("overview-details");
  
  for (const k in scores) {
    overview.innerHTML += `
      <div class="topic">
        <h3 class="topic-title">${SCALES[k].label}</h3>  
        <div class="topic-intro">${SCALE_INTROS[k] || ""}</div>
        <div class="topic-text" id="text-${k}"></div>

        <button class="toggle-tacho" data-scale="${k}">
          ▸ Tacho anzeigen
        </button>

        <div class="tacho-details hidden" id="tacho-box-${k}">
          <div class="tacho-box">
            <span class="tacho-inline" id="tacho-${k}"></span>
            <div class="tacho-text" id="tacho-text-${k}"></div>
          </div>
        </div>
      </div>
    `;
  }

  for (const k in scores) {
    const el = document.getElementById(`tacho-${k}`);
    if (!el) continue;

    const interp = state.interp[k];
    renderTacho(el, interp, k);

    const textBox = document.getElementById("tacho-text-" + k);
    if (textBox) {
      renderTachoText(textBox, interp, k);
    }
  }

  renderDetailedText();

  const profileBtn = document.createElement("div");
  profileBtn.style.marginTop = "32px";
  profileBtn.innerHTML = `
  <button id="goto-profiles" class="btn-primary">
      Profilübersicht anzeigen
    </button>
  `;
  container.appendChild(profileBtn);

  const toggleOverviewBtn = document.getElementById("toggle-overview");
  const overviewBox = document.getElementById("overview-details");

  if (toggleOverviewBtn && overviewBox) {
    toggleOverviewBtn.addEventListener("click", () => {
      overviewBox.classList.toggle("hidden");
      toggleOverviewBtn.textContent = overviewBox.classList.contains("hidden")
        ? "▸ Gesamtauswertung anzeigen"
        : "▾ Gesamtauswertung ausblenden";
    });
  }

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

const ONSET_QUESTIONS = [
  {
    id: "onset_adhd",
    text: "Seit wann erleben Sie Schwierigkeiten mit Aufmerksamkeit, Impulskontrolle oder Hyperfokus?",
    cluster: "ADHD"
  },
  {
    id: "onset_autism",
    text: "Seit wann erleben Sie sensorische Empfindlichkeit, soziale Besonderheiten oder Bedürfnis nach Struktur?",
    cluster: "Autism"
  },
  {
    id: "onset_emotional",
    text: "Seit wann erleben Sie Schwierigkeiten mit emotionaler Wahrnehmung oder Regulation?",
    cluster: "Emotional Processing"
  },
  {
    id: "onset_overload",
    text: "Seit wann erleben Sie schnelle Überlastung oder das Bedürfnis nach sozialer Anpassung (Maskierung)?",
    cluster: "Overload/Masking"
  }
];

const ONSET_OPTIONS = [
  { value: "early", label: "Seit früher Kindheit (vor 6 Jahren)" },
  { value: "school", label: "Seit Schulalter (6-12 Jahre)" },
  { value: "teen", label: "Seit Jugend (13-18 Jahre)" },
  { value: "adult", label: "Seit Erwachsenenalter (18+ Jahre)" },
  { value: "unknown", label: "Weiß nicht / unklar" }
];

const TOTAL = questions.length;
let current = 0;
let onsetCurrent = 0;
const onsetAnswers = {};

function render() {
  const q = questions[current];
  
  document.getElementById("questionText").innerText = `${current + 1}. ${q.text}`;
  document.getElementById("progress").innerText = `Frage ${current + 1} von ${TOTAL}`;

  renderScale();
}

function renderScale() {
  const container = document.getElementById("scaleButtons");
  container.className = "scale";
  container.innerHTML = "";

  const labels = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5"
  ];

  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement("button");
    btn.innerText = labels[i - 1];

    btn.onclick = () => {
      const q = questions[current];
      state.answers[q.id] = i;  // ← Fix: Direkt in state.answers speichern

      const item = ITEM_TEXTS[q.id];
      const scaleToUse = item ? item.scale : q.scale;  // ← Fallback auf q.scale, falls ITEM_TEXTS fehlt
      onAnswer(scaleToUse, q.id, i);

      if (current < TOTAL - 1) {
        current++;
        render();
      } else {
        showOnsetPage();
      }
    };

    container.appendChild(btn);
  }
}

function showOnsetPage() {
  document.getElementById("questionText").style.display = "none";
  document.getElementById("scaleButtons").style.display = "none";
  document.getElementById("progress").style.display = "none";

  const onsetPage = document.getElementById("onset-page");
  onsetPage.style.display = "block";

  renderOnsetQuestion();
}

function renderOnsetQuestion() {
  const q = ONSET_QUESTIONS[onsetCurrent];
  
  document.getElementById("onset-question-text").innerHTML = `
    <strong>${q.cluster}</strong><br>
    ${q.text}
  `;

  const container = document.getElementById("onset-options");
  container.innerHTML = "";

  ONSET_OPTIONS.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "onset-button";
    btn.innerText = opt.label;

    btn.onclick = () => {
      onsetAnswers[q.id] = opt.value;

      if (onsetCurrent < ONSET_QUESTIONS.length - 1) {
        onsetCurrent++;
        renderOnsetQuestion();
      } else {
        state.onset = onsetAnswers;
        document.getElementById("onset-page").style.display = "none";
        showResults();
      }
    };

    container.appendChild(btn);
  });

  document.getElementById("onset-progress").innerText = 
    `Frage ${onsetCurrent + 1} von ${ONSET_QUESTIONS.length}`;
}

function calculateScaleResults() {
  const r = {};
  for (const k in SCALES) {
    let sum = 0, c = 0;
    SCALES[k].items.forEach(id => {
      const v = state.answers[id];  // ← Fix: state.answers statt answers
      if (v !== null && v !== undefined) { 
        sum += v; 
        c++; 
      }
    });
    r[k] = Math.round((sum / (c * 6)) * 100);
  }
  return r;
}

const SCALE_INTROS = {
  attention: "Diese Skala beschreibt, wie Aufmerksamkeit, Antrieb und innere Steuerung im Alltag erlebt werden. Sie bezieht sich nicht auf Fähigkeit oder Intelligenz, sondern auf den inneren Aufwand, mit dem Aufgaben begonnen, aufrechterhalten und abgeschlossen werden. Viele neurodivergente Menschen erleben hier deutliche Schwankungen, abhängig von Interesse, Kontext und innerer Belastung.",

  sensory: "Diese Skala bezieht sich auf die Wahrnehmung und Verarbeitung von Sinneseindrücken wie Geräuschen, Licht, Berührung oder visueller Unruhe. Unterschiede in diesem Bereich sind bei neurodivergenten Menschen häufig und sagen nichts über Belastbarkeit aus, sondern darüber, wie intensiv Reize innerlich ankommen.",

  social: "Diese Skala beschreibt, wie soziale Situationen innerlich wahrgenommen, eingeordnet und verarbeitet werden. Sie bezieht sich weniger auf soziales Können als auf den inneren Aufwand, der mit Interaktion, Interpretation und Präsenz verbunden sein kann.",

  masking: "Diese Skala bezieht sich auf bewusste oder unbewusste Anpassungsleistungen im sozialen Umfeld. Viele neurodivergente Menschen entwickeln Strategien, um Erwartungen zu erfüllen oder nicht aufzufallen. Diese Anpassung kann hilfreich sein, ist aber oft mit innerem Energieaufwand verbunden.",

  structure: "Diese Skala erfasst das Bedürfnis nach Vorhersehbarkeit, Routinen und klaren Strukturen. Für viele neurodivergente Menschen bietet Struktur wichtige innere Sicherheit und reduziert Überlastung.",

  overload: "Diese Skala beschreibt, wie schnell innere Belastungsgrenzen erreicht werden und wie lange Erholung braucht. Überlastung entsteht oft durch die Summe vieler kleiner Reize oder Anforderungen.",

  alexithymia: "Diese Skala bezieht sich auf die Fähigkeit, eigene Gefühle wahrzunehmen, zu benennen und einzuordnen. Unterschiede in diesem Bereich sind häufig bei neurodivergenten Menschen und sagen nichts über emotionale Tiefe aus.",

  executive: "Diese Skala erfasst exekutive Funktionen wie Arbeitsgedächtnis, Handlungsplanung, Impulskontrolle und kognitive Flexibilität. Diese Funktionen kosten bei neurodivergenten Menschen oft mehr Energie als erwartet.",

  emotreg: "Diese Skala beschreibt, wie Gefühle in ihrer Intensität und Dauer reguliert werden können. Emotionale Dysregulation ist sowohl bei ADHS als auch bei Autismus häufig und keine Willensschwäche.",

  hyperfocus: "Diese Skala erfasst die Fähigkeit zu intensiver Vertiefung bei persönlichem Interesse. Hyperfokus ist charakteristisch für ADHS und zeigt, dass Aufmerksamkeit nicht grundsätzlich gestört ist, sondern interessenbasiert funktioniert."
};

function renderDetailedText() {
  const grouped = {};

  for (const id in state.answers) {  // ← Fix: state.answers statt answers
    const a = state.answers[id];
    if (!a) continue;

    const item = ITEM_TEXTS[id];
    if (!item) continue;

    const scale = item.scale;
    if (!grouped[scale]) grouped[scale] = [];
    grouped[scale].push(item.texts[a]);
  }

  for (const scale in grouped) {
    const target = document.getElementById("text-" + scale);
    if (!target) continue;

    target.innerHTML = `
      <div class="text-box">
        ${grouped[scale].join(" ")}
      </div>
    `;
  }
}

const startBtn = document.getElementById("start-test");
if (startBtn) {
  startBtn.onclick = () => {
    state.meta = {
      age: document.getElementById("meta-age")?.value || null,
      gender: document.getElementById("meta-gender")?.value || null,
      diagnoses: Array.from(
        document.getElementById("meta-diagnosis")?.selectedOptions || []
      ).map(o => o.value),
      onset: document.getElementById("meta-onset")?.value || null,
      stress: document.getElementById("meta-stress")?.value || null,
      context: document.getElementById("meta-context")?.value || null,
      medication: document.getElementById("meta-medication")?.value || null,
      selfview: document.getElementById("meta-selfview")?.value || null
    };

    const modal = document.getElementById("meta-modal");
    if (modal) modal.style.display = "none";

    render();
  };
}

const skipBtn = document.getElementById("skip-meta");
if (skipBtn) {
  skipBtn.onclick = () => {
    const modal = document.getElementById("meta-modal");
    if (modal) modal.style.display = "none";

    render();
  };
}

document.addEventListener("click", e => {
  if (e.target.id !== "goto-profiles") return;

  const profileData = {
    scores: state.scores,
    interp: state.interp,
    meta: state.meta,
    onset: state.onset,
    answers: state.answers,
    timestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem('neurodivergenz_profile_data', JSON.stringify(profileData));
  } catch (e) {
    console.error('Konnte Daten nicht speichern:', e);
  }

  window.open(
    "profile.html",
    "_blank",
    "noopener,width=1000,height=900"
  );
});