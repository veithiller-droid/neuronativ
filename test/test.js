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


function onAnswer(scale, questionIndex, value) {
  state.answers[questionIndex] = value;
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
        <h3 class="topic-title">${SCALE_TITLES[k]}</h3>
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


const questions = [
  { id: "att_01", scale: "attention", text: "Ich beginne Aufgaben motiviert, verliere aber unterwegs den inneren Halt." },
  { id: "sen_01", scale: "sensory", text: "Bestimmte Geräusche empfinde ich als körperlich unangenehm." },
  { id: "alx_01", scale: "alexithymia", text: "Es fällt mir schwer, meine Gefühle in Worte zu fassen." },
  { id: "soc_01", scale: "social", text: "Small Talk kostet mich viel Energie." },
  { id: "att_02", scale: "attention", text: "Meine Aufmerksamkeit schwankt stark je nach Interesse." },
  
  { id: "ovl_01", scale: "overload", text: "Ich merke oft erst spät, dass mir Reize zu viel werden." },
  { id: "str_01", scale: "structure", text: "Klare Abläufe geben mir innere Sicherheit." },
  { id: "alx_02", scale: "alexithymia", text: "Körperliche Spannungen erkenne ich früher als Gefühle." },
  { id: "soc_02", scale: "social", text: "Gruppensituationen sind innerlich anstrengend für mich." },
  { id: "att_03", scale: "attention", text: "Ich brauche viel innere Energie, um Alltägliches zu erledigen." },
  
  { id: "sen_02", scale: "sensory", text: "Helles Licht oder visuelle Unruhe ermüden mich schnell." },
  { id: "mas_01", scale: "masking", text: "Ich passe meine Ausdrucksweise an mein Gegenüber an." },
  { id: "alx_03", scale: "alexithymia", text: "Ich analysiere Situationen eher sachlich als emotional." },
  { id: "att_04", scale: "attention", text: "Routinetätigkeiten kosten mich unverhältnismäßig viel Kraft." },
  { id: "soc_03", scale: "social", text: "Nach sozialen Kontakten brauche ich Erholungszeit." },
  
  { id: "ovl_02", scale: "overload", text: "Ich brauche Rückzug, um mich wieder zu stabilisieren." },
  { id: "mas_02", scale: "masking", text: "Ich habe gelernt, mich sozial richtig zu verhalten." },
  { id: "str_02", scale: "structure", text: "Zu viele Optionen überfordern mich." },
  { id: "alx_04", scale: "alexithymia", text: "Ich merke oft erst spät, wie es mir emotional geht." },
  { id: "att_05", scale: "attention", text: "Ich arbeite besser unter Druck als ohne klare äußere Vorgaben." },
  
  { id: "sen_03", scale: "sensory", text: "Mehrere gleichzeitige Eindrücke überfordern mich innerlich." },
  { id: "soc_04", scale: "social", text: "Ich denke Gespräche oft vor oder nach." },
  { id: "sen_04", scale: "sensory", text: "Ich bemerke Reize oft früher als andere." },
  { id: "att_06", scale: "attention", text: "Ich weiß oft, was zu tun wäre, komme aber schwer ins Tun." },
  { id: "soc_05", scale: "social", text: "Ironie oder Andeutungen irritieren mich manchmal." },
  
  { id: "ovl_03", scale: "overload", text: "Mein Körper reagiert stark auf Stress oder Überforderung." },
  { id: "mas_03", scale: "masking", text: "Ich übe Reaktionen oder Gespräche innerlich vor." },
  { id: "str_03", scale: "structure", text: "Planung hilft mir, innerlich ruhig zu bleiben." },
  { id: "alx_05", scale: "alexithymia", text: "Gefühle zeigen sich bei mir eher körperlich als gedanklich." },
  { id: "att_07", scale: "attention", text: "Meine Gedanken laufen parallel in mehrere Richtungen." },
  
  { id: "ovl_04", scale: "overload", text: "In vollen oder lauten Umgebungen fühle ich mich schnell leer." },
  { id: "soc_06", scale: "social", text: "Ich beobachte andere, um angemessen zu reagieren." },
  { id: "sen_05", scale: "sensory", text: "Kleidung, Materialien oder Berührungen können mich stark irritieren." },
  { id: "att_08", scale: "attention", text: "Ich verliere Zeitgefühl, wenn mich etwas interessiert." },
  { id: "soc_07", scale: "social", text: "Spontane soziale Situationen stressen mich." },
  
  { id: "ovl_05", scale: "overload", text: "Ich reguliere mich über Rückzug, Stille oder Wiederholung." },
  { id: "mas_04", scale: "masking", text: "Ich versuche, möglichst unauffällig zu wirken." },
  { id: "str_04", scale: "structure", text: "Spontane Entscheidungen anderer stressen mich." },
  { id: "alx_06", scale: "alexithymia", text: "Ich brauche Zeit, um zu verstehen, was ich fühle." },
  { id: "att_09", scale: "attention", text: "Ich bin innerlich oft unruhig, auch wenn ich nach außen ruhig wirke." },
  
  { id: "ovl_06", scale: "overload", text: "Wenn ich überreizt bin, fällt mir Denken oder Sprechen schwerer." },
  { id: "mas_05", scale: "masking", text: "Ich unterdrücke Bedürfnisse, um dazuzugehören." },
  { id: "att_10", scale: "attention", text: "Ich muss mich aktiv strukturieren, um nicht den Überblick zu verlieren." },
  { id: "ovl_07", scale: "overload", text: "Nach reizintensiven Tagen bin ich emotional erschöpft." },
  { id: "soc_08", scale: "social", text: "Ich bevorzuge klare, direkte Kommunikation." },
  
  { id: "mas_06", scale: "masking", text: "Ich merke erst im Nachhinein, wie anstrengend soziale Situationen waren." },
  { id: "str_05", scale: "structure", text: "Chaos im Außen wirkt sich stark auf mein Inneres aus." },
  { id: "alx_07", scale: "alexithymia", text: "Wenn andere nach meinen Gefühlen fragen, bin ich unsicher, was ich antworten soll." },
  { id: "sen_06", scale: "sensory", text: "Ich meide bestimmte Orte wegen Geräuschen, Licht oder Gerüchen." },
  { id: "soc_09", scale: "social", text: "Ich analysiere soziale Situationen bewusst." },
  
  { id: "mas_07", scale: "masking", text: "Mein äußeres Auftreten entspricht nicht immer meinem inneren Zustand." },
  { id: "ovl_08", scale: "overload", text: "Andere unterschätzen, wie stark mich Sinneseindrücke beeinflussen." },
  { id: "soc_10", scale: "social", text: "Nach sozialen Kontakten bin ich innerlich erschöpft." },
  { id: "mas_08", scale: "masking", text: "Anpassung kostet mich mehr Kraft, als man sieht." },
  { id: "str_06", scale: "structure", text: "Ich reagiere sensibel auf Unklarheit oder Unsicherheit." },
  
  { id: "alx_08", scale: "alexithymia", text: "Mir fällt es leichter, über Gedanken als über Gefühle zu sprechen." },
  { id: "ovl_09", scale: "overload", text: "Erholung dauert bei mir länger als bei anderen." },
  { id: "sen_07", scale: "sensory", text: "Ich nehme feine Unterschiede in Licht, Farben oder Bewegungen stark wahr." },
  { id: "str_07", scale: "structure", text: "Struktur ist für mich entlastend, nicht einengend." },
  { id: "sen_08", scale: "sensory", text: "Mein Körper reagiert deutlich auf sensorische Überforderung." },
  
  { id: "alx_09", scale: "alexithymia", text: "Ich spüre, dass etwas in mir los ist, kann es aber schwer benennen." },
  { id: "str_08", scale: "structure", text: "Veränderungen kosten mich mehr Energie als andere vermuten." },
  { id: "str_09", scale: "structure", text: "Ich brauche Vorhersehbarkeit, um mich wohlzufühlen." },
  
  { id: "exe_01", scale: "executive", text: "Ich vergesse, was ich gerade tun wollte." },
  { id: "exe_02", scale: "executive", text: "Beim Einkaufen vergesse ich Dinge, selbst mit Liste." },
  { id: "exe_03", scale: "executive", text: "Ich unterbreche andere, bevor sie fertig sind." },
  { id: "exe_04", scale: "executive", text: "Ich sage Dinge, bevor ich sie zu Ende gedacht habe." },
  { id: "exe_05", scale: "executive", text: "Zwischen Aufgaben zu wechseln kostet mich viel Energie." },
  
  { id: "exe_06", scale: "executive", text: "Wenn ich unterbrochen werde, fällt es schwer, wieder reinzukommen." },
  { id: "exe_07", scale: "executive", text: "Ich muss mich bewegen, um zu denken." },
  { id: "exe_08", scale: "executive", text: "Stillsitzen fällt mir körperlich schwer." },
  { id: "exe_09", scale: "executive", text: "Wichtige Dinge verlege ich regelmäßig." },
  { id: "exe_10", scale: "executive", text: "Zeitabschätzung fällt mir schwer." },
  
  { id: "emo_01", scale: "emotreg", text: "Meine Emotionen fühlen sich oft zu viel an." },
  { id: "emo_02", scale: "emotreg", text: "Von 0 auf 100 in Sekunden – meine Gefühle wechseln abrupt." },
  { id: "emo_03", scale: "emotreg", text: "Wenn ich wütend oder traurig bin, kann ich kaum klar denken." },
  { id: "emo_04", scale: "emotreg", text: "Emotionen klingen bei mir lange nach." },
  { id: "emo_05", scale: "emotreg", text: "Ich kann meine Gefühle schlecht dosieren." },
  
  { id: "emo_06", scale: "emotreg", text: "Kleine Anlässe lösen bei mir große emotionale Reaktionen aus." },
  { id: "emo_07", scale: "emotreg", text: "Nach emotionalen Situationen brauche ich lange, um runterzukommen." },
  { id: "emo_08", scale: "emotreg", text: "Ich fühle mich von meinen Emotionen überrollt." },
  { id: "emo_09", scale: "emotreg", text: "Freude kann sich genauso überwältigend anfühlen wie Traurigkeit." },
  { id: "emo_10", scale: "emotreg", text: "Ich vermeide Situationen, die starke Gefühle auslösen könnten." },
  
  { id: "hyp_01", scale: "hyperfocus", text: "Wenn mich etwas fasziniert, vergesse ich alles andere." },
  { id: "hyp_02", scale: "hyperfocus", text: "Ich recherchiere Themen bis zur Erschöpfung." },
  { id: "hyp_03", scale: "hyperfocus", text: "Meine Interessen sind sehr intensiv." },
  { id: "hyp_04", scale: "hyperfocus", text: "Ich kann stundenlang an einer Sache arbeiten, ohne Pause." },
  { id: "hyp_05", scale: "hyperfocus", text: "Wenn ich in etwas vertieft bin, höre ich nicht, wenn man mich anspricht." },
  
  { id: "hyp_06", scale: "hyperfocus", text: "Ich verliere mich in Details." },
  { id: "hyp_07", scale: "hyperfocus", text: "Neue Interessen packen mich vollständig." },
  { id: "hyp_08", scale: "hyperfocus", text: "Ich kann nicht aufhören, auch wenn ich erschöpft bin." },
  { id: "sen_09", scale: "sensory", text: "Nach sensorischer Belastung brauche ich bewusst Ruhe zur Regulation." },
  { id: "hyp_09", scale: "hyperfocus", text: "Bewährte Abläufe geben mir Halt, Veränderungen kosten Energie." },
  
  { id: "hyp_10", scale: "hyperfocus", text: "Intensive Beschäftigung führt zum Vergessen von Zeit und Bedürfnissen." }
];


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
const answers = {};
let current = 0;
let onsetCurrent = 0;
const onsetAnswers = {};
const SCALES = {
  attention: { 
    label: "Aufmerksamkeit & Selbstregulation", 
    items: ["att_01", "att_02", "att_03", "att_04", "att_05", "att_06", "att_07", "att_08", "att_09", "att_10"]
  },
  
  sensory: { 
    label: "Sensorische Empfindlichkeit", 
    items: ["sen_01", "sen_02", "sen_03", "sen_04", "sen_05", "sen_06", "sen_07", "sen_08", "sen_09"]
  },
  
  social: { 
    label: "Soziale Wahrnehmung", 
    items: ["soc_01", "soc_02", "soc_03", "soc_04", "soc_05", "soc_06", "soc_07", "soc_08", "soc_09", "soc_10"]
  },
  
  masking: { 
    label: "Maskierung & Anpassung", 
    items: ["mas_01", "mas_02", "mas_03", "mas_04", "mas_05", "mas_06", "mas_07", "mas_08"]
  },
  
  structure: { 
    label: "Struktur & Sicherheit", 
    items: ["str_01", "str_02", "str_03", "str_04", "str_05", "str_06", "str_07", "str_08", "str_09"]
  },
  
  overload: { 
    label: "Sensorische & emotionale Überlastung", 
    items: ["ovl_01", "ovl_02", "ovl_03", "ovl_04", "ovl_05", "ovl_06", "ovl_07", "ovl_08", "ovl_09"]
  },
  
  alexithymia: { 
    label: "Emotionswahrnehmung", 
    items: ["alx_01", "alx_02", "alx_03", "alx_04", "alx_05", "alx_06", "alx_07", "alx_08", "alx_09"]
  },
  
  executive: { 
    label: "Exekutivfunktionen", 
    items: ["exe_01", "exe_02", "exe_03", "exe_04", "exe_05", "exe_06", "exe_07", "exe_08", "exe_09", "exe_10"]
  },
  
  emotreg: { 
    label: "Emotionale Regulation", 
    items: ["emo_01", "emo_02", "emo_03", "emo_04", "emo_05", "emo_06", "emo_07", "emo_08", "emo_09", "emo_10"]
  },
  
  hyperfocus: { 
    label: "Hyperfokus & Spezialinteressen", 
    items: ["hyp_01", "hyp_02", "hyp_03", "hyp_04", "hyp_05", "hyp_06", "hyp_07", "hyp_08", "hyp_09", "hyp_10"]
  }
};


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
      answers[q.id] = i;

      const item = ITEM_TEXTS[q.id];
      if (item) {
        onAnswer(item.scale, q.id, i);
      }

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
        showResults();  // ← NEU! Direkt zur Auswertung
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
      const v = answers[id];
      if (v !== null && v !== undefined) { 
        sum += v; 
        c++; 
      }
    });
    r[k] = Math.round((sum / (c * 6)) * 100);
  }
  return r;
}

const SCALE_TITLES = {
  attention: "Aufmerksamkeit",
  sensory: "Sensorische Empfindlichkeit",
  social: "Soziale Wahrnehmung",
  masking: "Maskierung",
  structure: "Struktur & Sicherheit",
  overload: "Überlastung",
  alexithymia: "Emotionswahrnehmung",
  executive: "Exekutivfunktionen",
  emotreg: "Emotionale Regulation",
  hyperfocus: "Hyperfokus"
};

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

  for (const id in answers) {
    const a = answers[id];
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