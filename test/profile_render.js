// profile_render.js
// Rendert calculateProfile()-Output in profile.html (nur Anzeige, keine Berechnung).
//
// Erwartete IDs (minimal):
// Hero: profile-type-main, profile-description, profile-focusline, profile-addonline, onset-badge
// Cluster: adhd-*, autism-*, emotional-*, compensation-* (score/fill/tooltip)
// Listen/Grids: reasoning-list, patterns-list, discrepancy-list, steps-list, top6-grid
//
// Optionale IDs (wenn in profile.html vorhanden):
// data-quality: quality-coverage, quality-coverage-note, quality-scale-confidence, quality-scale-confidence-note,
//               quality-cluster-confidence, quality-cluster-confidence-note
// core/overlays: core-profiles + core3-grid, overlays + overlays-grid
// impacts: impacts-section + impacts-list
// disclaimer: disclaimer-section (oder .disclaimer)
//
// Signatur (kompatibel):
//   renderProfilePage(profileResult, rawDataForRender?, textsOverride?)
//   rawDataForRender typischerweise: { scores, report?, answers?, totalItems? }

import { PROFILE_SELECTORS } from "./profile_selectors.js";
import { PROFILE_TEXTS as DEFAULT_TEXTS, PROFILE_DESCRIPTIONS } from "./profile_texts.js";

function $(id) { return document.getElementById(id); }

function clampPct(x) {
  const v = Number(x);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function clamp01(x) {
  const v = Number(x);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function safeText(x) {
  if (x === null || x === undefined) return "";
  return String(x);
}

function escapeHtml(s) {
  return safeText(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function show(el, on) {
  if (!el) return;
  el.style.display = on ? "" : "none";
}

function setText(id, text) {
  const el = $(id);
  if (!el) return;
  el.textContent = safeText(text);
}

function setLine(id, text) {
  const el = $(id);
  if (!el) return;
  const t = safeText(text).trim();
  if (!t) {
    el.textContent = "";
    el.style.display = "none";
    return;
  }
  el.textContent = t;
  el.style.display = "";
}

function setFill(fillId, pct) {
  const el = $(fillId);
  if (!el) return;
  el.style.width = `${clampPct(pct)}%`;
}

function levelFromScore(score, thresholds) {
  const s = clampPct(score);
  const th = thresholds?.level || {};
  if (s >= (th.very_high ?? 90)) return "very_high";
  if (s >= (th.high ?? 75)) return "high";
  if (s >= (th.mid ?? 60)) return "medium";
  if (s >= (th.low ?? 45)) return "low";
  return "very_low";
}

function normalizeDescription(desc) {
  // Schutz gegen [object Object]
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && typeof desc.description === "string") return desc.description;
  return safeText(desc);
}

function getTexts(textsOverride) {
  return textsOverride && typeof textsOverride === "object" ? textsOverride : DEFAULT_TEXTS;
}

function hideDisclaimer() {
  const byId = $("disclaimer-section");
  if (byId) byId.style.display = "none";

  const byClass = document.querySelector(".disclaimer");
  if (byClass) byClass.style.display = "none";
}
/* =========================
   PROFILE MECHANIK v2 HELPERS
========================= */

function levelKeyForUi(score, thresholds) {
  // nutzt dein levelFromScore(), mappt nur auf ui.levels-Keys
  const k = levelFromScore(score, thresholds);
  if (k === "medium") return "mid";
  if (k === "very_low") return "minimal";
  return k; // very_high, high, low
}

function levelLabelForUi(score, texts, thresholds) {
  const k = levelKeyForUi(score, thresholds);
  return texts?.ui?.levels?.[k] || k;
}

function normalizeProfiles(profileResult) {
  const out = [];

  // 1) array-shapes (falls vorhanden)
  const arr = Array.isArray(profileResult?.profileCards)
    ? profileResult.profileCards
    : (Array.isArray(profileResult?.profilesList) ? profileResult.profilesList : null);

  if (arr) {
    for (const p of arr) {
      const key = p?.key || p?.type;
      const score = p?.score ?? p?.value ?? p?.percent;
      if (!key || score == null) continue;
      out.push({ key, score: Number(score) });
    }
    return out;
  }

  // 2) object-shape: profileResult.profiles
  const obj = profileResult?.profiles;
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (v == null) continue;
      const score = (typeof v === "number") ? v : (v?.score ?? v?.value ?? v?.percent);
      if (score == null) continue;
      out.push({ key: k, score: Number(score) });
    }
  }

  return out;
}
function focusProfileKey(profileResult) {
  const fk =
    profileResult?.focusKey ||
    profileResult?.focus?.key ||
    profileResult?.mainProfile?.dominant_scale ||
    profileResult?.mainProfile?.dominantScale ||
    null;

  // Skalen -> Profilkarten
  if (fk === "alexithymia" || fk === "emotreg") return "emotional";
  if (fk === "attention" || fk === "executive" || fk === "hyperfocus") return "adhd";
  if (fk === "sensory" || fk === "social" || fk === "structure") return "autism";
  if (fk === "masking") return "high_masking";
  if (fk === "overload") return "overload";

  // falls fk ausnahmsweise schon ein Profil-Key ist
  if (fk === "adhd" || fk === "autism" || fk === "emotional" || fk === "high_masking" || fk === "overload") return fk;

  return null;
}

function focusKeyToProfileKey(focusKey) {
  const k = String(focusKey || "").trim();
  if (!k) return null;

  // falls schon Profil-Key kommt
  if (k === "stress") return "overload";
  if (k === "masking") return "high_masking";
  if (["adhd","autism","audhd","overload","high_masking","emotional","hyperfocus","traits"].includes(k)) return k;

  // Skalen -> Profil
  if (["attention","executive","hyperfocus"].includes(k)) return "adhd";
  if (["sensory","social","structure"].includes(k)) return "autism";
  if (["alexithymia","emotreg"].includes(k)) return "emotional";
  if (k === "overload") return "overload";

  return null;
}

function computeRoleForProfile(key, profileResult, texts, profilesArr) {
  const status = texts?.ui?.status || {};
  const mainType = profileResult?.mainProfile?.type || null;

  // Fokus-Skala -> Fokus-Profilkarte mappen (damit "Schwerpunkt" auch bei Profilkarten greift)
  const focusProfile = focusProfileKey(profileResult);

  const hasAudhd = (profilesArr || []).some(p => p.key === "audhd");
  const acuteLoad = (mainType === "stress" || mainType === "overload");


// 1) Schwerpunkt nur, wenn NICHT akut (sonst würde ein Basisprofil fälschlich "Schwerpunkt" werden)
if (!acuteLoad && key && focusProfile && key === focusProfile) {
  return status.focus || "Schwerpunkt";
}


  // 2) Zustand (akut) für die Lastkarte
  if (acuteLoad && (key === "stress" || key === "overload")) return status.state_acute || "Zustand (akut)";

  // 3) Kernprofil nur wenn NICHT akut
  if (key && mainType && key === mainType && !acuteLoad) return status.core || "Kernprofil";

  // 4) akut: Baseline als Basisprofil (unter Last), AuDHD bevorzugt
  if (acuteLoad && (key === "audhd" || key === "adhd" || key === "autism" || key === "traits")) {
    if (key === "audhd") return status.base_under_load || "Basisprofil (unter Last)";
    if (hasAudhd && (key === "adhd" || key === "autism")) return status.part || "Teilprofil";
    return status.base_under_load || "Basisprofil (unter Last)";
  }

  // 5) AuDHD: Komponenten
  if (hasAudhd && (key === "adhd" || key === "autism")) return status.part || "Teilprofil";

  // 6) default
  return status.add_on || "Zusatzprofil";
}

function roleClass(roleText) {
  const r = String(roleText || "").toLowerCase();
  if (r.includes("kern")) return "role-core";
  if (r.includes("schwer")) return "role-focus";
  if (r.includes("teil")) return "role-part";
  if (r.includes("zustand") || r.includes("akut")) return "role-state";
  if (r.includes("basis")) return "role-base";
  return "role-addon";
}

function titleForProfileKey(key, texts) {
  // Falls du schon eine Mapping-Funktion hast, nimm die.
  // Sonst: einfache Default-Titel
  const map = {
    adhd: "ADHS-Profil",
    autism: "Autismus-Profil",
    audhd: "AuDHD-Profil",
    overload: "Überlastung & Erholung",
    stress: "Überlastung & Erholung",
    emotional: "Emotionale Verarbeitung",
    high_masking: "Hochmaskierung",
    hyperfocus: "Hyperfokus & Vertiefung",
    traits: "Traits"
  };
  return map[key] || key;
}

function descForProfileKey(key, texts) {
  const cards = texts?.profiles?.cards || {};
  if (key === "stress") return cards.overload || cards.stress || "";
  return cards[key] || "";
}
function pushHyperfocusFoundationLine(lines, profileResult, texts) {
  if (!Array.isArray(lines)) return lines;

  const t = profileResult?.onsetAnalysis?.hfTendency || null;
  const lib = texts?.reasoning?.foundation_hyperfocus_lines || {};

  let key = "unknown";
  if (t?.present && typeof t.tendency === "string") key = t.tendency; // adhd_like | autism_like | mixed

  const line = lib[key] || lib.unknown || "";
  if (line && !lines.includes(line)) lines.push(line);

  return lines;
}



/* =========================
   HERO
========================= */

function heroTitleFromType(type, texts) {
  const t = texts?.ui?.hero?.main_title_fallback || "Individuelles Neurodivergenz-Profil";
  if (!type) return t;
  if (PROFILE_DESCRIPTIONS?.[type]?.title) return safeText(PROFILE_DESCRIPTIONS[type].title);
  if (type === "single_dominant") return texts?.ui?.hero?.description?.single_dominant || t;
  return t;
}

function heroDescription(profileResult, texts, rawData) {
  const type = profileResult?.mainProfile?.type || "mixed";
  const thresholds = PROFILE_SELECTORS?.thresholds;
  const lvl = levelFromScore(profileResult?.mainProfile?.score ?? 0, thresholds);

  // 1) CORE (Hauptprofil)
  let core = "";
  if (type === "single_dominant") {
    const key =
      profileResult?.mainProfile?.dominant_scale ||
      profileResult?.mainProfile?.dominantScale ||
      null;

    const pct = key
      ? clampPct(rawData?.scores?.[key])
      : clampPct(profileResult?.mainProfile?.dominant_score);

    const entry = PROFILE_DESCRIPTIONS?.single_dominant?.[lvl];
    core = entry?.description
      ? normalizeDescription(entry.description(key, pct))
      : normalizeDescription(texts?.ui?.hero?.description?.single_dominant);
  } else {
    const entry = PROFILE_DESCRIPTIONS?.[type]?.[lvl];
    if (entry?.description) core = normalizeDescription(entry.description);
    else {
      const d = texts?.ui?.hero?.description || {};
      if (d[type]) core = normalizeDescription(d[type]);
      else if (type === "mixed") core = normalizeDescription(d.mixed || d.default);
      else if (type === "unremarkable") core = normalizeDescription(d.unremarkable || d.default);
      else core = normalizeDescription(d.default || "");
    }
  }

  // 2) FOKUS (dominante Skala, nur wenn NICHT single_dominant)
  let focus = "";
  const domKey = profileResult?.mainProfile?.dominant_scale || null;
  if (type !== "single_dominant" && domKey && texts?.dominant_scale?.descriptions?.[domKey]) {
    focus = normalizeDescription(texts.dominant_scale.descriptions[domKey]);
  }

  // 3) ADDON (Overlay)
  let addon = "";
  const overlayKey = pickOverlayKey(profileResult, rawData); // muss in deiner render existieren
  if (overlayKey && texts?.ui?.hero?.overlay_blurbs?.[overlayKey]) {
    addon = normalizeDescription(texts.ui.hero.overlay_blurbs[overlayKey]);
  }

  return [core, focus, addon].filter(Boolean).join(" ");
}


function focusLine(profileResult, texts, rawData) {
  const label = texts?.ui?.hero?.labels?.focus || "Schwerpunkt";
  const domLabel = profileResult?.mainProfile?.dominant_label || null;
  const domKey = profileResult?.mainProfile?.dominant_scale || null;
  if (!domLabel) return "";

  const score = domKey ? clampPct(rawData?.scores?.[domKey]) : null;
  return score === null ? `${label}: ${domLabel}` : `${label}: ${domLabel} (${score}%)`;
}
// ✅ overlay guards (verhindert ReferenceError + falsche Overlays)
function okOverlay(key, profileResult, rawData) {
  const scores = rawData?.scores || {};
  if (key === "masking")    return Number.isFinite(Number(scores.masking));
  if (key === "overload")   return Number.isFinite(Number(scores.overload));
  if (key === "hyperfocus") return Number.isFinite(Number(scores.hyperfocus));
  if (key === "emotional")  return Number.isFinite(Number(profileResult?.clusterScores?.emotional));
  return false;
}

// ✅ verhindert Doppel-Overlay, wenn Fokus schon dasselbe Thema ist
function okFocus(overlayKey, focusProfileKey) {
  if (!overlayKey) return true;
  if (!focusProfileKey) return true;
  // mapping: overlay "masking" gehört zur Karte "high_masking"
  const ovToProfile = (k) => (k === "masking" ? "high_masking" : k);
  return ovToProfile(overlayKey) !== focusProfileKey;
}

function pickOverlayKey(profileResult, rawData) {
  const scores = rawData?.scores || {};
  const masking   = clampPct(scores.masking);
  const overload  = clampPct(scores.overload);
  const hyperfocus = clampPct(scores.hyperfocus);

  const emotional = clampPct(profileResult?.clusterScores?.emotional);
  const comp      = clampPct(profileResult?.clusterScores?.compensation);

  const th = PROFILE_SELECTORS?.thresholds || {};
  const top6 = th.top6 || {};
  const overlays = th.overlays || {};

  // Fokus bestimmen (Skala + Profil-Key)
  const focusKeyRaw =
    profileResult?.focusKey ||
    profileResult?.focus?.key ||
    profileResult?.mainProfile?.dominant_scale ||
    profileResult?.mainProfile?.dominantScale ||
    null;

  const focusProfileKey = focusKeyToProfileKey(focusKeyRaw); // z.B. executive -> adhd, masking -> high_masking
  const focusScaleKey = String(focusKeyRaw || "").trim();    // z.B. "hyperfocus"

  // Overlay nur, wenn es NICHT dem Fokus entspricht
  const okOverlay = (overlayKey) => {
    if (!overlayKey) return false;

    if (overlayKey === "masking")   return focusProfileKey !== "high_masking";
    if (overlayKey === "overload")  return focusProfileKey !== "overload";
    if (overlayKey === "emotional") return focusProfileKey !== "emotional";
    if (overlayKey === "hyperfocus") return focusScaleKey !== "hyperfocus"; // nur blocken, wenn Fokus wirklich Hyperfokus-Skala ist

    return true;
  };

  if (
    okOverlay("masking") &&
    (masking >= (overlays.masking_very_high ?? 80) || masking >= (top6.add_masking_if ?? 70))
  ) return "masking";

  if (
    okOverlay("overload") &&
    (overload >= (top6.add_overload_if ?? 70) || comp >= (overlays.compensation_high ?? 75))
  ) return "overload";

  if (
    okOverlay("emotional") &&
    (emotional >= (top6.add_emotional_if ?? 75) || emotional >= (overlays.emotional_very_high ?? 80))
  ) return "emotional";

  if (
    okOverlay("hyperfocus") &&
    (hyperfocus >= (top6.add_hyperfocus_if ?? 70))
  ) return "hyperfocus";

  return null;
}





function addOnLine(profileResult, texts, rawData) {
  const label = texts?.ui?.hero?.labels?.add_on || "Zusatzprofil";

// 1) Disqualification/Derivation-Hinweise haben Vorrang (kurz, neutral)
const tmpl = texts?.ui?.hero?.addonline_templates || {};
const mainType = profileResult?.mainProfile?.type || null;

const disq = profileResult?.disqualifiedByKey || {};
const p = profileResult?.profiles || {};

const autismDisq = !!(p.autism?.disqualified || disq.autism?.disqualified);
const adhdDisq   = !!(p.adhd?.disqualified   || disq.adhd?.disqualified);

if (mainType === "adhd" && autismDisq) {
  const t = tmpl.autism_traits_disqualified || "";
  return t ? `${label}: ${t}` : "";
}

if (mainType === "autism" && adhdDisq) {
  const t = tmpl.adhd_traits_disqualified || "";
  return t ? `${label}: ${t}` : "";
}

if (mainType === "audhd" && (adhdDisq || autismDisq)) {
  const t = tmpl.audhd_not_derivable || "";
  return t ? `${label}: ${t}` : "";
}


  // 2) Sonst: Overlay-Logik wie bisher
  const overlayKey = pickOverlayKey(profileResult, rawData);
  if (!overlayKey) return "";

  if (overlayKey === "masking") return `${label}: Hochmaskierung`;
  if (overlayKey === "overload") return `${label}: starke Überlastung`;
  if (overlayKey === "emotional") return `${label}: emotionale Dynamik`;
  if (overlayKey === "hyperfocus") return `${label}: intensiver Hyperfokus`;

  return "";
}


function renderOnset(profileResult, texts) {
  const el = $("onset-badge");
  if (!el) return;

  const oa = profileResult?.onsetAnalysis;
  const timing = oa?.timing || null;
  if (!timing) {
    el.style.display = "none";
    el.textContent = "";
    return;
  }

const m = texts?.ui?.onset || {};
const map = {
  // engine values
  early:   m.early   || "Seit früher Kindheit",
  school:  m.school  || "Seit Schulalter",
  teen:    m.teen    || "Seit Jugend",
  adult:   m.adult   || "Seit Erwachsenenalter",
  unknown: m.unknown || "Zeitpunkt unklar",

  // legacy fallback (falls noch irgendwo)
  childhood: m.childhood || "Seit Kindheit",
  youth:     m.youth     || "Seit Jugend",
  recent:    m.recent    || "Kürzlich aufgetreten",
  unsure:    m.unsure    || "Zeitpunkt unklar",
};

  const label = m.label || "Zeitlicher Beginn (Selbstauskunft):";
  el.textContent = `${label} ${map[timing] || timing}`;
el.style.display = "inline-flex";
}

function renderHyperfocusBadge(profileResult, texts) {
  const el = document.getElementById("hyperfocus-badge");
  if (!el) return;

  const t = profileResult?.onsetAnalysis?.hfTendency || null;
  const present = !!t?.present;
  const kind = typeof t?.tendency === "string" ? t.tendency : "unknown"; // adhd_like | autism_like | mixed | unknown

  if (!present) {
    el.style.display = "none";
    el.textContent = "";
    return;
  }

  const lib = texts?.reasoning?.hyperfocus_badge || {};
  const title = lib.title || "Hyperfokus-Signal";

  const labelMap = {
    adhd_like:   lib.badge_adhd_like   || "Hyperfokus eher ADHS-nah",
    autism_like: lib.badge_autism_like || "Hyperfokus eher autismus-nah",
    mixed:       lib.badge_mixed       || "Hyperfokus gemischt",
    unknown:     lib.badge_unknown     || "Hyperfokus unklar",
  };

  const clsMap = {
    adhd_like: "badge--ok",
    autism_like: "badge--info",
    mixed: "badge--subtle",
    unknown: "badge--warn",
  };

  const text = labelMap[kind] || labelMap.unknown;
  const cls = clsMap[kind] || "badge--subtle";

  // Host IST das Badge (keine nested badge-row, kein nested .badge)
  el.className = `hyperfocus-badge badge ${cls}`;
  el.style.display = "inline-flex";
  el.innerHTML = `
    <span class="badge-title">${escapeHtml(title)}:</span>
    <span>${escapeHtml(text)}</span>
  `;
}





function renderOnsetValidation(profileResult, texts) {
  const el = document.getElementById("onset-validation");
  if (!el) return; // optionales UI-Element

  const v =
    profileResult?.onsetAnalysis?.validation ||
    profileResult?.engineDiagnostics?.onset?.validation ||
    null;

  if (!v) {
    el.style.display = "none";
    el.textContent = "";
    return;
  }

  const yn = (x) => (x === true ? "erfüllt" : (x === false ? "nicht erfüllt" : "unklar"));
  const lines = [];

  if (v?.adhd) lines.push(`ADHS: Beginn vor 12 → ${yn(v.adhd.valid)}`);
  if (v?.asdCriteriaA) lines.push(`ASD Kriterium A (3/3) → ${yn(v.asdCriteriaA.met)}`);
  if (v?.asdCriteriaB) lines.push(`ASD Kriterium B (≥2/4) → ${yn(v.asdCriteriaB.met)}`);

  const ctx = v?.context;
  if (ctx?.settings) lines.push(`Kontext: ≥2 Settings → ${yn(ctx.settings.meetsADHDCriteria)}`);
  if (ctx?.impairment) lines.push(`Kontext: Beeinträchtigung → ${yn(ctx.impairment.clinicallySignificant)}`);

  const title = (texts?.ui?.onset_validation?.label) || "Onset-Checks (Selbstauskunft):";
  el.textContent = `${title} ${lines.join(" · ")}`;
  el.style.display = "";
}

// === NEU: Disqualifikations-Warnung ===
function renderDisqualificationWarning(profileResult, texts) {
  const container = document.getElementById("disqualification-warning");
  if (!container) return;

const disq =
  profileResult?.disqualifiedTop ||
  profileResult?.mainProfile?.disqualifiedProfile ||
  null;
  if (!disq) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  const score = clampPct(disq.score);
  const reason = disq.disqualificationReason || "";

  const dqTexts = texts?.ui?.disqualification || {};
  const labels = dqTexts.labels || {};

  let config = null;

  if (reason.includes("ADHS")) {
    config = dqTexts.adhd || null;

  } else if (reason.includes("Kriterium A")) {
    const count = reason.match(/\((\d+)\/3/)?.[1] || "0";
    const base = dqTexts.autism_criteria_a || null;
    const tpl = base?.criteria_template || "{count}/3";
    config = base ? { ...base, criteria: tpl.replace("{count}", count) } : null;

  } else if (reason.includes("Kriterium B")) {
    const count = reason.match(/\((\d+)\/4/)?.[1] || "0";
    const base = dqTexts.autism_criteria_b || null;
    const tpl = base?.criteria_template || "{count}/4";
    config = base ? { ...base, criteria: tpl.replace("{count}", count) } : null;

  } else if (reason.includes("AuDHD")) {
    const base = dqTexts.audhd || null;
    const tpl = base?.criteria_template || "{reason}";
    config = base ? { ...base, criteria: tpl.replace("{reason}", reason) } : null;
  }

  if (!config) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  const scoreLabel = score >= 75 ? "stark ausgeprägt" : "ausgeprägt";

  container.style.display = "block";
  container.innerHTML = `
    <div class="warning-box warning-diagnostic">
      <div class="warning-icon">⚠️</div>
      <div class="warning-content">
        <h3>${escapeHtml(dqTexts.section_title || "Wichtiger Hinweis")}</h3>

        <div class="warning-profile">
          <strong>${escapeHtml(config.title || "")}</strong><br>
          ${escapeHtml(labels.score || "Cluster-Score:")} ${score}% (${scoreLabel})
        </div>

        <div class="warning-criteria">
          <strong>${escapeHtml(labels.criteria || "Begründung:")}</strong><br>
          ${escapeHtml(config.criteria || "")}
        </div>

        <div class="warning-meaning">
          <strong>${escapeHtml(labels.meaning || "Was bedeutet das?")}</strong><br>
          ${escapeHtml(config.meaning || "")}
        </div>

        <div class="warning-action">
          <strong>${escapeHtml(labels.next_steps || "Nächster Schritt:")}</strong>
          ${escapeHtml(config.next_steps || "")}
        </div>
      </div>
    </div>
  `;
}


function renderHero(profileResult, rawData, texts) {
  if (!profileResult) {
    setText(
      "profile-type-main",
      texts?.ui?.hero?.main_title_fallback || "Individuelles Neurodivergenz-Profil"
    );
    setText("profile-description", "");
    setLine("profile-focusline", "");
    setLine("profile-addonline", "");
    renderOnset(null, texts);
    renderOnsetValidation(null, texts);
    return;
  }

  // === Hero-Title darf NUR aus mainProfile kommen ===
  const type =
    profileResult?.mainProfile?.type ||
    profileResult?.mainProfile?.key ||
    "mixed";

  const lvl =
    profileResult?.mainProfile?.level ??
    profileResult?.mainProfile?.lvl ??
    profileResult?.mainProfile?.severity ??
    "high";

  // --- Disq-Map (engine + fallback) ---
  const disqMap =
    profileResult?.disqualifiedByKey ||
    Object.fromEntries(
      Object.entries(profileResult?.profiles || {}).map(([k, v]) => [
        k,
        {
          disqualified: !!v?.disqualified,
          reason: v?.disqualificationReason || "",
          score: v?.score
        }
      ])
    );

  const cluster = profileResult?.clusterScores || {};
  const isHigh = (x, th = 70) => clampPct(x) >= th;
  const isTraitLike = (t) => t === "traits" || t === "mixed" || t === "unremarkable";

  // --- Disq-Override nur wenn mainType "traits/mixed", aber eigentlich ein starkes, disqualifiziertes Kernmuster vorliegt ---
  // (damit nicht mehr "Merkmale erkennbar", wenn ADHS-Cluster 90% aber Onset-Kriterium failt)
  let disqOverrideKey = null;

  if (isTraitLike(type)) {
    // ADHS: stark + disqualifiziert => disqualified.adhd
    if (isHigh(cluster.adhd) && disqMap?.adhd?.disqualified) {
      disqOverrideKey = "adhd";
    }

    // Optional: Autismus analog (falls du willst)
    // if (isHigh(cluster.autism) && (disqMap?.autism_criteria_a?.disqualified || disqMap?.autism_criteria_b?.disqualified || disqMap?.autism?.disqualified)) {
    //   disqOverrideKey = disqMap?.autism_criteria_a?.disqualified ? "autism_criteria_a"
    //                  : disqMap?.autism_criteria_b?.disqualified ? "autism_criteria_b"
    //                  : "autism_criteria_a";
    // }
  }

  if (disqOverrideKey) {
    const e = PROFILE_DESCRIPTIONS?.disqualified?.[disqOverrideKey];
    if (e) {
      setText("profile-type-main", safeText(e.title || ""));
      setText("profile-description", safeText(e.description || ""));

      // Dedup: bei single_dominant wird der Schwerpunkt schon im Titel abgedeckt
      const isSingleDominant = (type === "single_dominant");
      setLine("profile-focusline", isSingleDominant ? "" : focusLine(profileResult, texts, rawData));

      setLine("profile-addonline", addOnLine(profileResult, texts, rawData));
   renderOnset(profileResult, texts);
renderHyperfocusBadge(profileResult, texts); // <-- NEU
renderOnsetValidation(profileResult, texts);

      return;
    }
  }

  // --- Standard-Titel aus PROFILE_DESCRIPTIONS[type][lvl].title ---
  let title =
    texts?.ui?.hero?.main_title_fallback || "Individuelles Neurodivergenz-Profil";

  const tNode = PROFILE_DESCRIPTIONS?.[type]?.[lvl]?.title;
  if (typeof tNode === "string") title = safeText(tNode);

  // Single-dominant: dynamischer Titel je Skala
  if (type === "single_dominant") {
    const key = profileResult?.mainProfile?.dominant_scale || null;
    const pct = key
      ? clampPct(rawData?.scores?.[key])
      : clampPct(profileResult?.mainProfile?.dominant_score);

    const dyn = PROFILE_DESCRIPTIONS?.single_dominant?.[lvl];
    if (dyn?.title && typeof dyn.title === "function") {
      title = safeText(dyn.title(key, pct));
    }
  }

  setText("profile-type-main", title);
  setText("profile-description", heroDescription(profileResult, texts, rawData));

  // Dedup: bei single_dominant wird der Schwerpunkt schon im Titel abgedeckt
  const isSingleDominant = (type === "single_dominant");
  setLine("profile-focusline", isSingleDominant ? "" : focusLine(profileResult, texts, rawData));

  setLine("profile-addonline", addOnLine(profileResult, texts, rawData));
 renderOnset(profileResult, texts);
renderHyperfocusBadge(profileResult, texts); // <-- NEU
renderOnsetValidation(profileResult, texts);

}

  

/* =========================
   DATA QUALITY / CONFIDENCE
========================= */

function meanPctFromMap(mapObj) {
  const vals = Object.values(mapObj || {}).map(v => Number(v)).filter(v => Number.isFinite(v));
  if (!vals.length) return null;
  const sum = vals.reduce((a,b) => a+b, 0);
  const min = Math.min(...vals);
  return { mean: Math.round(sum/vals.length), min: Math.round(min), n: vals.length };
}

function inferTotalItems(rawData, quality) {
  if (Number.isFinite(rawData?.totalItems)) return rawData.totalItems;

  const totals = rawData?.report?.scales?.totals;
  if (totals && typeof totals === "object") {
    const nums = Object.values(totals).map(v => Number(v)).filter(v => Number.isFinite(v));
    if (nums.length) return nums.reduce((a,b)=>a+b, 0);
  }

  const a = rawData?.answers;
  if (a && typeof a === "object") {
    const vals = Object.values(a);
    const n = vals.filter(v => v !== null && v !== undefined).length;
    if (n) return vals.length || n;
  }

  return null;
}

function renderDataQuality(profileResult, rawData, texts) {
  const sec = $("data-quality");
  if (!sec) return;

  const quality = profileResult?.engineDiagnostics?.quality || null;
  const scaleConf = profileResult?.scaleConfidences || {};
  const hasAnything = !!quality || (scaleConf && Object.keys(scaleConf).length > 0);

  if (!hasAnything) {
    show(sec, false);
    return;
  }
  show(sec, true);

  const answered = Number.isFinite(quality?.answeredCount) ? quality.answeredCount : null;
  const total = inferTotalItems(rawData, quality);
  if (answered !== null && total !== null) setText("quality-coverage", `Beantwortet: ${answered}/${total}`);
  else if (answered !== null) setText("quality-coverage", `Beantwortet: ${answered}`);
  else setText("quality-coverage", "Beantwortet: —");

  const parts = [];
  if (Number.isFinite(quality?.consistency)) parts.push(`Konsistenz: ${Math.round(clamp01(quality.consistency) * 100)}%`);
  if (Number.isFinite(quality?.extremeRate)) parts.push(`Extremantworten: ${Math.round(clamp01(quality.extremeRate) * 100)}%`);
  if (quality?.longestEqualRun && Number.isFinite(quality.longestEqualRun.len)) parts.push(`Längste Serie: ${quality.longestEqualRun.len}×`);
  setText("quality-coverage-note", parts.join(" · ") || "—");

  const sc = meanPctFromMap(scaleConf);
  if (sc) setText("quality-scale-confidence", `Skalen-Konfidenz: Ø ${sc.mean}% (min ${sc.min}%)`);
  else setText("quality-scale-confidence", "Skalen-Konfidenz: —");

  const scNote = [];
  if (quality?.lowVariance) scNote.push("Sehr geringe Antwort-Varianz (Straightlining-Marker).");
  if (quality?.longestEqualRun && Number.isFinite(quality.longestEqualRun.len) && quality.longestEqualRun.len >= 12) {
    scNote.push("Lange Sequenz identischer Antworten.");
  }
  setText("quality-scale-confidence-note", scNote.join(" ") || "");

  const clusters = PROFILE_SELECTORS?.clusters || {};
  const cVals = {};
  for (const [ckey, scaleKeys] of Object.entries(clusters)) {
    const vals = (scaleKeys || []).map(k => Number(scaleConf?.[k])).filter(v => Number.isFinite(v));
    if (!vals.length) continue;
    cVals[ckey] = Math.round(vals.reduce((a,b)=>a+b,0) / vals.length);
  }
  const cc = meanPctFromMap(cVals);
  if (cc) setText("quality-cluster-confidence", `Cluster-Konfidenz (abgeleitet): Ø ${cc.mean}%`);
  else setText("quality-cluster-confidence", "Cluster-Konfidenz: —");

  const ccDetail = [];
  const order = ["adhd","autism","emotional","compensation"];
  for (const k of order) {
    if (Number.isFinite(cVals[k])) {
      const name = texts?.clusters?.[k]?.name || k;
      ccDetail.push(`${name}: ${cVals[k]}%`);
    }
  }
  setText("quality-cluster-confidence-note", ccDetail.join(" · "));
}

/* =========================
   CLUSTERS
========================= */

function clusterExplain(clusterKey, pct, texts) {
  const c = texts?.clusters?.[clusterKey];
  if (!c) return "";
  const s = clampPct(pct);
  if (s >= 70) return safeText(c.what_high_means || "");
  if (s <= 40) return safeText(c.what_low_means || "");
  return "Mittlere Ausprägung: Merkmale sind spürbar, aber nicht dominant.";
}

function renderClusters(profileResult, texts) {
  const c = profileResult?.clusterScores || {};

  setText("adhd-score", `${clampPct(c.adhd)}%`);
  setFill("adhd-fill", c.adhd);
  setText("adhd-tooltip", clusterExplain("adhd", c.adhd, texts));

  setText("autism-score", `${clampPct(c.autism)}%`);
  setFill("autism-fill", c.autism);
  setText("autism-tooltip", clusterExplain("autism", c.autism, texts));

  setText("emotional-score", `${clampPct(c.emotional)}%`);
  setFill("emotional-fill", c.emotional);
  setText("emotional-tooltip", clusterExplain("emotional", c.emotional, texts));

  setText("compensation-score", `${clampPct(c.compensation)}%`);
  setFill("compensation-fill", c.compensation);
  setText("compensation-tooltip", clusterExplain("compensation", c.compensation, texts));
}

/* =========================
   CARDS
========================= */

function cardTitle(key) {
  const map = {
    adhd: "ADHS-Profil",
    autism: "Autismus-Profil",
    audhd: "AuDHD-Profil",
    high_masking: "Hochmaskierung",
    overload: "Überlastung & Erholung",
    emotional: "Emotionale Verarbeitung",
    hyperfocus: "Hyperfokus & Vertiefung",
    stress: "Belastung/Überlastung",
    traits: "Traits"
  };
  return map[key] || key;
}

function cardText(key, profileResult, rawData, texts) {
  const cards = texts?.profiles?.cards || {};
  if (typeof cards?.[key] === "string") return cards[key];

  if (key === "overload") return cards.stress || clusterExplain("compensation", clampPct(profileResult?.clusterScores?.compensation), texts);
  if (key === "emotional") return clusterExplain("emotional", clampPct(profileResult?.clusterScores?.emotional), texts);
  if (key === "hyperfocus") return "Vertiefung bei Interesse wurde häufig stark bestätigt; der „Ausstieg“ kann schwer fallen.";
  return "";
}

function statusBadge(label, kind) {
  const text = safeText(label || "");
  const cls = kind === "core" ? "status-primary" : (kind === "low" ? "status-low" : "status-secondary");
  return `<div class="profile-card-status ${cls}">${escapeHtml(text)}</div>`;
}

function renderCardGrid(gridEl, items) {
  if (!gridEl) return;
  gridEl.innerHTML = "";

  for (const it of items) {
    const title = it.title || cardTitle(it.key);
    const score = clampPct(it.score);
    const note = it.note || "";
    const status = it.statusText || "";
    const kind = it.statusKind || "addon";

    const el = document.createElement("div");
    el.className = "profile-card";
    el.innerHTML = `
      <h3>${escapeHtml(title)}</h3>
      <div class="profile-card-score">${score}%</div>
      ${status ? statusBadge(status, kind) : ""}
      ${note ? `<div class="profile-card-note">${escapeHtml(note)}</div>` : ""}
    `;
    gridEl.appendChild(el);
  }
}

/* =========================
   TOP 6 (oder Split)
========================= */

function pickTop6(profileResult, rawData, texts) {
  const scores = rawData?.scores || {};
  const profiles = profileResult?.profiles || {};
  const clusters = profileResult?.clusterScores || {};
  const th = PROFILE_SELECTORS?.thresholds?.top6 || {};

  const coreKeys = th.show_core_always || ["adhd", "autism", "audhd"];
  const core = coreKeys.map(k => {
    let s = 0;
    if (k === "adhd") s = profiles.adhd?.score ?? clusters.adhd;
    if (k === "autism") s = profiles.autism?.score ?? clusters.autism;
    if (k === "audhd") s = profiles.audhd?.score ?? clampPct((clampPct(clusters.adhd) + clampPct(clusters.autism)) / 2);
    return {
      key: k,
      score: s,
      statusText: texts?.ui?.status?.core || "Kernprofil",
      statusKind: "core",
      note: cardText(k, profileResult, rawData, texts)
    };
  });

  const candidates = [
    { key: "high_masking", score: profiles.high_masking?.score ?? scores.masking },
    { key: "overload", score: profiles.overload?.score ?? scores.overload },
    { key: "emotional", score: profiles.emotional?.score ?? clusters.emotional },
    { key: "hyperfocus", score: scores.hyperfocus }
  ].map(x => ({
    ...x,
    score: clampPct(x.score),
    note: cardText(x.key, profileResult, rawData, texts)
  }));

  const minStrong = 70;
  const minSoft = 60;

  candidates.sort((a,b) => b.score - a.score);

  const add = [];
  for (const c of candidates) {
    if (add.length >= 3) break;
    if (c.score >= minStrong) add.push(c);
  }
  if (add.length < 3) {
    for (const c of candidates) {
      if (add.length >= 3) break;
      if (add.some(x => x.key === c.key)) continue;
      if (c.score >= minSoft) add.push(c);
    }
  }

  const addLabel = texts?.ui?.status?.add_on || "Zusatzprofil";
  const addons = add.slice(0, 3).map(x => ({
    key: x.key,
    score: x.score,
    statusText: addLabel,
    statusKind: "addon",
    note: x.note
  }));

  return { core, addons };
}

function renderTop6OrSplit(profileResult, rawData, texts) {
  const top6Grid = $("top6-grid");
  const coreGrid = $("core3-grid");
  const overlaysGrid = $("overlays-grid");
  const coreSec = $("core-profiles");
  const overlaysSec = $("overlays");

  const { core, addons } = pickTop6(profileResult, rawData, texts);

  const hasSplit = !!coreGrid || !!overlaysGrid;
  if (hasSplit) {
    if (coreGrid && coreSec) {
      renderCardGrid(coreGrid, core);
      show(coreSec, true);
    }
    if (overlaysGrid && overlaysSec) {
      renderCardGrid(overlaysGrid, addons);
      show(overlaysSec, true);
    }
    if (top6Grid) {
      const sec = top6Grid.closest("section");
      if (sec) sec.style.display = "none";
      top6Grid.innerHTML = "";
    }
    return;
  }

  if (!top6Grid) return;
  const items = [...core, ...addons].map(x => ({ ...x, title: cardTitle(x.key) }));
  renderCardGrid(top6Grid, items);
}

/* =========================
   REASONING / PATTERNS / IMPACTS
========================= */

function replaceScaleKeysWithLabels(line, texts) {
  const names = texts?.dominant_scale?.names || {};
  return safeText(line).replace(/\b(attention|executive|hyperfocus|sensory|social|structure|alexithymia|emotreg|masking|overload)\b/g,
    (m) => names[m] || m
  );
}

const TOP_SCALE_KEYS = [
  "overload","masking","emotreg","alexithymia","executive","attention","hyperfocus","sensory","social","structure"
];

function pctListLine(label, items) {
  const parts = items.map(x => `${x.name} ${clampPct(x.pct)}%`);
  return `${label}: ${parts.join(", ")}.`;
}

function levelLabelForPct(pct, texts, thresholds) {
  const lk = levelKeyForUi(pct, thresholds);
  return texts?.ui?.levels?.[lk] || lk;
}

function clusterLevelsLine(clusterScores, texts, thresholds) {
  const order = ["adhd","autism","emotional","compensation"];
  const names = { adhd:"ADHS", autism:"Autismus", emotional:"Emotional", compensation:"Kompensation" };

  const parts = order
    .filter(k => Number.isFinite(Number(clusterScores?.[k])))
    .map(k => `${names[k]} ${levelLabelForPct(clusterScores[k], texts, thresholds)}`);

  if (!parts.length) return null;
  return `→ Einordnung nach Schwellen: ${parts.join("; ")}.`;
}

function dominantLine(profileResult, rawData, texts) {
  const mainType = profileResult?.mainProfile?.type || null;
  const domKey = profileResult?.mainProfile?.dominant_scale || profileResult?.mainProfile?.dominantScale || null;

  const domLabel =
    profileResult?.mainProfile?.dominant_label ||
    (domKey ? (texts?.dominant_scale?.names?.[domKey] || domKey) : null);

  if (!domLabel) return null;

  const domPct = domKey ? clampPct(rawData?.scores?.[domKey]) : clampPct(profileResult?.mainProfile?.dominant_score);
  const acuteLoad = (mainType === "stress" || mainType === "overload");

  const line1 = `Dominant: ${domLabel} (${domPct}%).`;
  const line2 = acuteLoad
    ? `→ Akute Last: Karte wird als „Zustand (akut)“ markiert; Basisprofile gelten als „unter Last“.`
    : `→ Schwerpunkt steuert die Kartenrolle (Schwerpunkt/Kernprofil/Zusatzprofil).`;

  return [line1, line2];
}

function topScalesLines(rawData, texts) {
  const scores = rawData?.scores || {};
  const names = texts?.dominant_scale?.names || {};

  const top = TOP_SCALE_KEYS
    .map(k => ({ k, pct: Number(scores?.[k]) }))
    .filter(x => Number.isFinite(x.pct))
    .sort((a,b) => clampPct(b.pct) - clampPct(a.pct))
    .slice(0, 3)
    .map(x => ({ name: names[x.k] || x.k, pct: x.pct, key: x.k }));

  if (!top.length) return null;

  const drivers = [];
  const keys = new Set(top.map(x => x.key));
  if (keys.has("overload")) drivers.push("Systemlast");
  if (keys.has("masking")) drivers.push("Anpassungsaufwand");
  if (keys.has("emotreg") || keys.has("alexithymia")) drivers.push("emotionale Dynamik");
  if (keys.has("executive") || keys.has("attention")) drivers.push("Exekutiv-/Aufmerksamkeitslast");
  if (keys.has("sensory")) drivers.push("Reizverarbeitung");
  if (keys.has("social")) drivers.push("soziale Verarbeitung");
  if (keys.has("structure")) drivers.push("Strukturbedarf");
  if (keys.has("hyperfocus")) drivers.push("Vertiefung/Hyperfokus");

  const line1 = pctListLine("Top-Skalen", top);
  const line2 = drivers.length ? `→ Haupttreiber: ${drivers.join(" + ")}.` : null;

  return [line1, line2].filter(Boolean);
}

function buildFoundationReasoning(profileResult, rawData, texts) {
  const thresholds = PROFILE_SELECTORS?.thresholds;
  const clusters = profileResult?.clusterScores || {};

  const lines = [];

  const clusterItems = [
    { name: "ADHS", pct: clusters.adhd },
    { name: "Autismus", pct: clusters.autism },
    { name: "Emotional", pct: clusters.emotional },
    { name: "Kompensation", pct: clusters.compensation }
  ].filter(x => Number.isFinite(Number(x.pct)));

  if (clusterItems.length) {
    lines.push(pctListLine("Cluster", clusterItems));
    const lvlLine = clusterLevelsLine(clusters, texts, thresholds);
    if (lvlLine) lines.push(lvlLine);
  }

  const dom = dominantLine(profileResult, rawData, texts);
  if (dom) lines.push(...dom);

  const top = topScalesLines(rawData, texts);
  if (top) lines.push(...top);

  return lines;
}


// =========================
// REASONING (Human readable)
// =========================
function buildReasoningLines(profileResult, rawData, texts) {
  const r = texts?.reasoning;
  if (!r) return [];

  const high = Number.isFinite(r.thresholds?.high) ? r.thresholds.high : 70;
  const low  = Number.isFinite(r.thresholds?.low)  ? r.thresholds.low  : 40;

  const c = profileResult?.clusterScores || {};
  const pct = (v) => clampPct(v);

  const pickBand = (v) => {
    const x = pct(v);
    if (x >= high) return "high";
    if (x <= low)  return "low";
    return "mid";
  };

  const fmt = (tpl, vars) =>
    String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));

  // --- 1) Cluster-Sätze (4 kurze Zeilen) ---
  const cs = r.cluster_sentences || {};
  const clustersOut = [
    fmt(cs?.[pickBand(c.adhd)]?.adhd,               { adhd: pct(c.adhd) }),
    fmt(cs?.[pickBand(c.autism)]?.autism,           { autism: pct(c.autism) }),
    fmt(cs?.[pickBand(c.emotional)]?.emotional,     { emotional: pct(c.emotional) }),
    fmt(cs?.[pickBand(c.compensation)]?.compensation,{ compensation: pct(c.compensation) }),
  ].filter(Boolean);

  // --- 2) Dominant (Skala + %) ---
  const SCALE_KEYS = [
    "attention","executive","hyperfocus","sensory","social","structure",
    "masking","overload","alexithymia","emotreg"
  ];

  let domKey = profileResult?.mainProfile?.dominant_scale || null;
  let domPct = profileResult?.mainProfile?.dominant_score;

  const scores = rawData?.scores || {};
  if (!domKey || !Number.isFinite(domPct)) {
    const sorted = SCALE_KEYS
      .map(k => [k, Number(scores?.[k])])
      .filter(([,v]) => Number.isFinite(v))
      .sort((a,b) => b[1]-a[1]);
    if (sorted.length) {
      domKey = domKey || sorted[0][0];
      domPct = Number.isFinite(domPct) ? domPct : sorted[0][1];
    }
  }

  const domName = texts?.dominant_scale?.names?.[domKey] || domKey || "—";
  const domLine = (domKey != null)
    ? fmt(r.dominant_sentence, { dom_name: domName, dom_pct: pct(domPct) })
    : "";

  // --- 3) Top-3 Skalen ---
  const top3 = SCALE_KEYS
    .map(k => [k, Number(scores?.[k])])
    .filter(([,v]) => Number.isFinite(v))
    .sort((a,b) => b[1]-a[1])
    .slice(0, 3);

  const topVars = {};
  if (top3[0]) { topVars.top1_name = texts?.dominant_scale?.names?.[top3[0][0]] || top3[0][0]; topVars.top1_pct = pct(top3[0][1]); }
  if (top3[1]) { topVars.top2_name = texts?.dominant_scale?.names?.[top3[1][0]] || top3[1][0]; topVars.top2_pct = pct(top3[1][1]); }
  if (top3[2]) { topVars.top3_name = texts?.dominant_scale?.names?.[top3[2][0]] || top3[2][0]; topVars.top3_pct = pct(top3[2][1]); }

  const topLine = (top3.length === 3)
    ? fmt(r.top_scales_sentence, topVars)
    : "";

  return [...clustersOut, domLine, topLine].filter(Boolean);
}

function renderReasoning(profileResult, rawData, texts) {
  const list = $("reasoning-list");
  if (!list) return;

  const manualRaw = Array.isArray(profileResult?.reasoning) ? profileResult.reasoning : [];
  const manual = manualRaw.map(x => String(x || "").trim()).filter(Boolean);

  const lower = (s) => String(s || "").trim().toLowerCase();
  const hasPrefix = (p) => manual.some(x => lower(x).startsWith(p));

  const killCluster  = hasPrefix("cluster:");
  const killDominant = hasPrefix("dominant:");
  const killTop      = hasPrefix("top-skalen:");

  // Manual behalten – aber die 3 "alten" Foundation-Zeilen ggf. rauswerfen
  const cleanedManual = manual.filter(x => {
    const t = lower(x);
    if (killCluster  && t.startsWith("cluster:")) return false;
    if (killDominant && t.startsWith("dominant:")) return false;
    if (killTop      && t.startsWith("top-skalen:")) return false;
    return true;
  });

  // Neue Menschensprache (dein Auto-Fallback)
  const auto = (buildReasoningLines(profileResult, rawData, texts) || [])
    .map(x => String(x || "").trim())
    .filter(Boolean);
      // ✅ NEU: Hyperfokus-Zusatzsignal (falls vorhanden)
  pushHyperfocusFoundationLine(auto, profileResult, texts);

  // Merge + dedupe
  const seen = new Set();
  const arr = [...cleanedManual, ...auto]
    .filter(x => x && !seen.has(x) && (seen.add(x), true))
    .slice(0, 10);

  list.innerHTML = arr
    .map(x => `<li>${escapeHtml(replaceScaleKeysWithLabels(x, texts))}</li>`)
    .join("");
}




function pctOrNull(x) {
  const v = Number(x);
  return Number.isFinite(v) ? clampPct(v) : null;
}

function renderPatterns(profileResult) {
  const sec = $("patterns-section");
  const list = $("patterns-list");
  if (!sec || !list) return;

  const arr = Array.isArray(profileResult?.patterns) ? profileResult.patterns : [];
  if (!arr.length) {
    show(sec, false);
    list.innerHTML = "";
    return;
  }

  show(sec, true);

  const scaleConf = profileResult?.scaleConfidences || {};

list.innerHTML = arr.slice(0, 10).map(p => {
  const txt = p?.note || p?.label || safeText(p);

  const evidencePctRaw = pctOrNull(p?.evidencePct ?? p?.valuePct ?? p?.strengthPct ?? p?.score);
  const confPctRaw = pctOrNull(
    p?.confidencePct ??
    p?.confPct ??
    (p?.key ? scaleConf[p.key] : null)
  );

  const evidencePct = (evidencePctRaw != null && evidencePctRaw > 0) ? evidencePctRaw : null;
  const confPct     = (confPctRaw     != null && confPctRaw     > 0) ? confPctRaw     : null;

  const metricsHtml = (evidencePct || confPct) ? `
    <div class="pattern-metrics">
      ${evidencePct ? `<div class="pattern-confidence">${evidencePct}%</div>` : ``}
      ${confPct ? `<div class="pattern-confidence pattern-confidence-soft">${confPct}%</div>` : ``}
    </div>
  ` : ``;

  return `
    <li class="pattern-item">
      ${metricsHtml}
      <div class="pattern-text">${escapeHtml(txt)}</div>
    </li>
  `;
}).join("");
}

function impactsFromTopScales(rawData, texts) {
  const scores = rawData?.scores || {};
  const names = texts?.dominant_scale?.names || {};
  const phrases = {
    attention: "Aufmerksamkeitssteuerung unter Alltagsdruck wurde häufig stark bestätigt.",
    executive: "Starten, Wechseln, Priorisieren oder Arbeitsgedächtnis wurden häufig stark bestätigt.",
    hyperfocus: "Sehr intensive Vertiefung bei Interesse wurde häufig stark bestätigt.",
    sensory: "Reizintensität oder Reiz-Selektivität wurde häufig stark bestätigt.",
    social: "Soziale Situationen als energieaufwendig/analytisch wurde häufig stark bestätigt.",
    structure: "Strukturbedarf und Vorhersehbarkeit wurden häufig stark bestätigt.",
    alexithymia: "Gefühle benennen/einordnen wurde häufig stark bestätigt.",
    emotreg: "Emotionsintensität, Wechsel oder Nachklang wurde häufig stark bestätigt.",
    masking: "Anpassungsaufwand (Maskierung) wurde häufig stark bestätigt.",
    overload: "Schnelle Überforderung und längere Erholung wurde häufig stark bestätigt."
  };

  return Object.entries(scores)
    .map(([k,v]) => ({ k, v: clampPct(v) }))
    .filter(x => x.v >= 60 && phrases[x.k])
    .sort((a,b) => b.v - a.v)
    .slice(0, 5)
    .map(x => `${names[x.k] || x.k}: ${phrases[x.k]}`);
}

function impactsFromItemSignals(profileResult) {
  const sig = profileResult?.engineDiagnostics?.itemSignals;
  if (!Array.isArray(sig) || !sig.length) return [];
  return sig
    .slice()
    .sort((a,b) => clampPct(b.valuePct) - clampPct(a.valuePct))
    .slice(0, 4)
    .map(s => `${safeText(s.label || s.key)} (${clampPct(s.valuePct)}%)`);
}

function renderImpacts(profileResult, rawData, texts) {
  const sec = $("impacts-section");
  const list = $("impacts-list");
  if (!sec || !list) return;

  const bullets = [];
  for (const x of impactsFromTopScales(rawData, texts)) bullets.push(x);

  for (const x of impactsFromItemSignals(profileResult)) {
    if (bullets.length >= 8) break;
    if (!bullets.some(y => y.includes(x.split(" (")[0]))) bullets.push(`Signal: ${x}`);
  }

  if (!bullets.length) {
    show(sec, false);
    list.innerHTML = "";
    return;
  }

  show(sec, true);
  list.innerHTML = bullets.slice(0, 8).map(x => `<li>${escapeHtml(x)}</li>`).join("");
}

/* =========================
   DISCREPANCIES
========================= */

function renderDiscrepancies(profileResult, texts) {
  const sec = $("discrepancy-section");
  const list = $("discrepancy-list");
  if (!sec || !list) return;

  const h2 = sec.querySelector("h2");
  const title = texts?.ui?.discrepancy?.section_title || "Besondere Muster";
  if (h2) h2.textContent = title;

  const arr = Array.isArray(profileResult?.discrepancies) ? profileResult.discrepancies : [];
  if (!arr.length) {
    show(sec, false);
    list.innerHTML = "";
    return;
  }

  const labels = texts?.ui?.discrepancy?.flag_labels || {};
  const longTexts = texts?.discrepancy_flags || {}; // <-- NEU
  show(sec, true);

  list.innerHTML = arr.slice(0, 12).map(d => {
    const key = d?.flag || d?.type || "flag";
    const label = labels[key] || key;

    // bevorzugt: explizit vom Scoring geliefertes user_description
    // dann: Textbibliothek (discrepancy_flags)
    // dann: d.label als letzter Fallback
    const desc =
      d?.user_description ||
      longTexts[key] ||
      d?.label ||
      "";

    return `
      <li class="discrepancy-item">
        <div class="discrepancy-flag">${escapeHtml(label)}</div>
        <div class="discrepancy-text">${escapeHtml(desc)}</div>
      </li>
    `;
  }).join("");
}

/* =========================
   ADDITIONAL FACTORS
========================= */

function renderAdditionalFactors(profileResult, rawData, texts) {
  const sec = $("additional-factors");
  const content = $("additional-content");
  if (!sec || !content) return;

  const blocks = [];
  const p = profileResult?.profiles || {};
  const c = profileResult?.clusterScores || {};
  const scores = rawData?.scores || {};

  if (clampPct(p?.traits?.score) >= 55) {
    const label = cardTitle("traits");
    const txt = cardText("traits", profileResult, rawData, texts) || "Merkmale sind erkennbar, aber ohne klare Dominanz.";
    blocks.push(`<strong>${escapeHtml(label)} (${clampPct(p.traits.score)}%)</strong><br>${escapeHtml(txt)}`);
  }

  const overloadScore = clampPct(scores.overload);
  if (overloadScore >= 60 && overloadScore < 70) {
    blocks.push(`<strong>Belastung/Überlastung (${overloadScore}%)</strong><br>${escapeHtml(cardText("overload", profileResult, rawData, texts) || "")}`);
  }

  const emo = clampPct(c.emotional);
  if (emo >= 60 && emo < 70) {
    blocks.push(`<strong>Emotionale Verarbeitung (${emo}%)</strong><br>${escapeHtml(cardText("emotional", profileResult, rawData, texts) || "")}`);
  }

  if (!blocks.length) {
    show(sec, false);
    content.innerHTML = "";
    return;
  }

  show(sec, true);
  content.innerHTML = blocks.join("<br><br>");
}

/* =========================
   NEXT STEPS
========================= */

function renderNextSteps(profileResult) {
  const list = $("steps-list");
  if (!list) return;
  const arr = Array.isArray(profileResult?.nextSteps) ? profileResult.nextSteps : [];
  list.innerHTML = arr.slice(0, 10).map(x => `<li>${escapeHtml(x)}</li>`).join("");
}

/* =========================
   PROFILE CARDS (Kernprofil + Schwerpunkt + Zusatzprofile)  — v2
   Rendert in #core3-grid, fallback: #top6-grid
========================= */
function meanFinite(nums) {
  const v = (nums || []).map(Number).filter(Number.isFinite);
  if (!v.length) return null;
  return v.reduce((a,b)=>a+b,0) / v.length;
}



// Konfidenz je Profil aus Skalen-Konfidenzen ableiten
function profileConfidencePct(profileKey, scaleConf = {}) {
  // scaleConf: { attention: 78, executive: 70, ... } in %
  const c = (k) => pctOrNull(scaleConf?.[k]);

  const confADHD   = meanFinite([c("attention"), c("executive"), c("hyperfocus")]);
  const confAUT    = meanFinite([c("sensory"), c("social"), c("structure")]);
  const confEMO    = meanFinite([c("emotreg"), c("alexithymia")]);
  const confMASK   = c("masking");
  const confOVER   = c("overload");

  if (profileKey === "adhd") return confADHD;
  if (profileKey === "autism") return confAUT;
  if (profileKey === "emotional") return confEMO;
  if (profileKey === "high_masking" || profileKey === "masking") return confMASK;
  if (profileKey === "overload" || profileKey === "stress") return confOVER;

  if (profileKey === "audhd") {
    // konservativ: nur hoch, wenn beide robust sind
    const a = confADHD, b = confAUT;
    if (a == null || b == null) return null;
    return Math.round(Math.min(a, b));
  }

  // fallback: nichts anzeigen
  return null;
}

function renderProfileCards(profileResult, rawData, texts) {
  const sec = $("core-profiles");
  const grid = $("core3-grid");
  if (!sec || !grid) return;

  const thresholds = PROFILE_SELECTORS?.thresholds || {};
  const th = thresholds.cards || {};
  
// --- Disqualification/Block logic (local helper) ---
// Disq-Quelle: bevorzugt disqualifiedByKey, fallback: profiles.*.disqualified
const disqMap =
  profileResult?.disqualifiedByKey ||
  Object.fromEntries(
    Object.entries(profileResult?.profiles || {}).map(([k, v]) => [
      k,
      {
        disqualified: !!v?.disqualified,
        reason: v?.disqualificationReason || "",
        disqualificationReason: v?.disqualificationReason || "", // kompatibel
        score: v?.score
      }
    ])
  );

// Canonicalize keys (Renderer-Keys)
const canonKey = (k) =>
  (k === "stress" ? "overload" : (k === "masking" ? "high_masking" : k));

function gateInfo(cardKey) {
  const k = canonKey(cardKey);

  // 1) AuDHD ist abgeleitet → wenn ADHS oder Autismus disq, dann "blocked" (nicht "disqualified")
  if (k === "audhd") {
    const a = !!disqMap?.adhd?.disqualified;
    const u = !!disqMap?.autism?.disqualified;
    if (a || u) {
      const r =
        disqMap?.adhd?.reason || disqMap?.adhd?.disqualificationReason ||
        disqMap?.autism?.reason || disqMap?.autism?.disqualificationReason ||
        "";
      return { disqualified: false, blocked: true, reason: r };
    }
  }

  // 2) Generisch: Profil selbst disqualifiziert
  const d = disqMap?.[k];
  if (d?.disqualified) {
    return { disqualified: true, blocked: false, reason: d.reason || d.disqualificationReason || "" };
  }

  return { disqualified: false, blocked: false, reason: "" };
}

const MIN_STRONG = th.minStrong ?? 60; // derzeit nicht genutzt, kann später genutzt werden
const MIN_SOFT   = th.minSoft ?? 50;
const AUDHD_MIN  = th.audhdMin ?? 65;
const AUDHD_DIFF = th.audhdDiff ?? 20;

const raw = normalizeProfiles(profileResult);
if (!raw.length) {
  show(sec, false);
  grid.innerHTML = "";
  return;
}

  // --- AuDHD nur anzeigen, wenn beide Komponenten hoch + ähnlich ---
  // (hier absichtlich auf raw, nicht auf injected, damit AuDHD nicht künstlich entsteht)
  const scoreOf = (k) => clampPct(raw.find(x => x.key === k)?.score ?? 0);

  const adhdS  = scoreOf("adhd");
  const autS   = scoreOf("autism");
  const audhdS = scoreOf("audhd");

  const allowAudhd =
    Math.min(adhdS, autS) >= AUDHD_MIN &&
    Math.abs(adhdS - autS) <= AUDHD_DIFF;

  // --- Alle "profilbeeinflussenden" Karten aus Scores/Clustern ergänzen, falls Engine sie nicht liefert ---
  const rawAug = raw.slice();
  const scores = rawData?.scores || {};
  const clusters = profileResult?.clusterScores || {};
  const profilesObj = profileResult?.profiles || {};

  const ensure = (key, value) => {
    const v = Number(value);
    if (!Number.isFinite(v)) return;
    if (!rawAug.some(x => x.key === key)) rawAug.push({ key, score: v });
  };

  // Kernprofile (falls Engine kein Profilobjekt liefert, aber Cluster existieren)
  ensure("adhd", profilesObj.adhd?.score ?? clusters.adhd);
  ensure("autism", profilesObj.autism?.score ?? clusters.autism);

  // Overlays / Zusatzprofile aus Skalen
  ensure("hyperfocus", profilesObj.hyperfocus?.score ?? scores.hyperfocus);
  ensure("high_masking", profilesObj.high_masking?.score ?? scores.masking);
  ensure("overload", profilesObj.overload?.score ?? scores.overload);

  // Emotional als Karte aus Cluster (oder Profil, falls vorhanden)
  ensure("emotional", profilesObj.emotional?.score ?? clusters.emotional);

  // Traits, falls vorhanden
  ensure("traits", profilesObj.traits?.score);

  // AuDHD nur erlauben, wenn Gate erfüllt (und nur wenn Engine es wirklich liefert)
  if (!allowAudhd) {
    // falls es irgendwo schon drin war, wieder entfernen
    for (let i = rawAug.length - 1; i >= 0; i--) {
      if (rawAug[i]?.key === "audhd") rawAug.splice(i, 1);
    }
  }

 const canon = (k) => {
    if (k === "stress") return "overload";
    if (k === "masking") return "high_masking";
    return k;
  };

  const mergedMap = new Map();
  for (const x of rawAug) {
    const k = canon(x.key);
    const s = clampPct(x.score);
    const prev = mergedMap.get(k);
    if (prev == null || s > prev) mergedMap.set(k, s);
  }

  const rawAugMerged = Array.from(mergedMap.entries()).map(([key, score]) => ({ key, score }));

  // Alle verfügbaren Karten mit Score >= 50% sammeln
  let cards = rawAugMerged
    .map(x => ({ key: x.key, score: clampPct(x.score) }))
    .filter(x => x.score >= 50)
    .filter(x => x.key !== "audhd" || allowAudhd);


  // Wichtige Karten auch bei niedrigerem Score erzwingen (ab 40%)
  const importantKeys = ["adhd", "autism", "overload", "high_masking", "hyperfocus", "emotional", "traits"];
  if (allowAudhd && audhdS >= MIN_SOFT) importantKeys.unshift("audhd");

  for (const key of importantKeys) {
    const existing = cards.find(c => c.key === key);
const score = rawAugMerged.find(x => x.key === key)?.score || 0;
    if (score >= 40 && !existing) {
      cards.push({ key, score: clampPct(score) });
    }
  }

  // Nach Score sortieren und max. 6 auswählen
  cards.sort((a, b) => b.score - a.score);
  let selected = cards.slice(0, 6);

  // Kernprofil (Hero) immer ganz oben (Mapping stress -> overload)
  const mainTypeRaw = profileResult?.mainProfile?.type || null;
  const mainType = (mainTypeRaw === "stress") ? "overload" : mainTypeRaw;

  if (mainType) {
    selected.sort((a, b) => {
      if (a.key === mainType) return -1;
      if (b.key === mainType) return 1;
      return 0;
    });
  }

  // Logische Reihenfolge für den Rest
  const displayOrder = mainType === "audhd"
    ? ["audhd", "adhd", "autism", "overload", "high_masking", "hyperfocus", "emotional", "traits"]
    : ["adhd", "autism", "audhd", "overload", "high_masking", "hyperfocus", "emotional", "traits"];

  selected.sort((a, b) => {
    const ia = displayOrder.indexOf(a.key);
    const ib = displayOrder.indexOf(b.key);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return b.score - a.score;
  });

  // Konfidenz-Quelle
  const scaleConf = profileResult?.scaleConfidences || {};
  show(sec, true);

  grid.innerHTML = selected.map(c => {
    const score = clampPct(c.score);

    const info = gateInfo(c.key, score);

    const role = computeRoleForProfile(c.key, profileResult, texts, selected);
    const rCls = roleClass(role);

    const lk = levelKeyForUi(score, thresholds);
    const lvl = levelLabelForUi(score, texts, thresholds);
    const lCls = `lvl-${lk}`;

    const title = titleForProfileKey(c.key, texts);

    const desc =
      descForProfileKey(c.key, texts) ||
      cardText(c.key, profileResult, rawData, texts) ||
      "";

    const conf = profileConfidencePct(c.key, scaleConf);
    const confInt = (conf == null) ? null : Math.round(conf);
    const confChip = (confInt == null) ? "" : `<span class="chip chip-conf">Konfidenz ${confInt}%</span>`;
const disqChip = info.blocked
  ? `<span class="chip chip-disq">nicht ableitbar</span>`
  : (info.disqualified ? `<span class="chip chip-disq">Kriterien nicht erfüllt</span>` : "");

    return `
<div class="profile-card ${rCls} ${lCls} ${(info.disqualified || info.blocked) ? "is-disq" : ""}">
        <div class="profile-card-title">${escapeHtml(title)}</div>
        <div class="profile-card-score">${score}%</div>
        <div class="profile-card-meta">
          <span class="chip chip-role">${escapeHtml(role)}</span>
          <span class="chip chip-level">${escapeHtml(lvl)}</span>
          ${disqChip}
          ${confChip}
        </div>
        <div class="profile-card-desc">${escapeHtml(desc)}</div>
      </div>
    `;
  }).join("");
}




/* =========================
   MAIN
========================= */

export function renderProfilePage(profileResult, rawDataForRender = null, textsOverride = null) {
  
  window.profileResult = profileResult;
  
  const texts = getTexts(textsOverride);
  const rawData = rawDataForRender || {};

  hideDisclaimer();
  renderHero(profileResult, rawData, texts);
  renderDataQuality(profileResult, rawData, texts);
  renderClusters(profileResult, texts);

renderProfileCards(profileResult, rawData, texts);

renderReasoning(profileResult, rawData, texts);
renderPatterns(profileResult);
  renderImpacts(profileResult, rawData, texts);
  renderDiscrepancies(profileResult, texts);
  renderAdditionalFactors(profileResult, rawData, texts);
  renderNextSteps(profileResult);
  renderDisqualificationWarning(profileResult, texts); 
}
