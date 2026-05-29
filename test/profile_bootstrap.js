// profile_bootstrap.js
// Lädt Report vom Backend und rendert die Profil-Seite
// Kein Scoring im Frontend — alles kommt vom Backend

import { renderProfilePage } from "./profile_render.js";
import { PROFILE_TEXTS } from "./profile_texts.js";

const BACKEND_URL = "https://neuronativ-production.up.railway.app";

// Session-Code aus URL-Parameter
const params = new URLSearchParams(location.search);
const code = params.get("code");
const justPaid = params.get("paid") === "true";

document.addEventListener("DOMContentLoaded", async () => {

  // Kein Code → Fehlerseite
  if (!code) {
    showError("Kein Auswertungs-Code gefunden. Bitte den Test neu starten.");
    return;
  }

  // Ladeindikator
  showLoading();

  try {
    const res = await fetch(`${BACKEND_URL}/api/report/${code}`);

    if (!res.ok) {
      if (res.status === 404) {
        showError("Auswertung nicht gefunden. Der Link ist möglicherweise abgelaufen.");
      } else {
        showError("Fehler beim Laden der Auswertung. Bitte später erneut versuchen.");
      }
      return;
    }

    const data = await res.json();

    if (data.paid) {
      // Vollständige Auswertung
      renderFullProfile(data);
    } else {
      // Nur Free-Report → zur result.html weiterleiten
      // (profile.html ist nur für paid)
      window.location.href = `result.html?code=${code}`;
    }

  } catch (err) {
    console.error("bootstrap error:", err);
    showError("Verbindungsfehler. Bitte Internetverbindung prüfen.");
  }
});

function renderFullProfile(data) {
  const { profileResult, report } = data;

  if (!profileResult || !report) {
    showError("Auswertungsdaten unvollständig.");
    return;
  }

  const rawDataForRender = {
    scores: report.scales?.ui?.scores || {},
    report,
  };

  // Disclaimer ausblenden (paid = vollständig)
  const disclaimer = document.getElementById("disclaimer-section");
  if (disclaimer) disclaimer.style.display = "none";

  // PDF-Download Button aktivieren
  const pdfBtn = document.getElementById("pdf-download");
  if (pdfBtn) {
    pdfBtn.style.display = "inline-block";
    pdfBtn.addEventListener("click", () => {
      window.open(`${BACKEND_URL}/api/pdf/${code}`, "_blank");
    });
  }

  // Renderer aufrufen
  renderProfilePage(profileResult, rawDataForRender, PROFILE_TEXTS);
}

function showLoading() {
  const el = document.getElementById("loading-state");
  if (el) el.style.display = "block";

  const profile = document.getElementById("profile-content");
  if (profile) profile.style.display = "none";
}

function showError(msg) {
  const loading = document.getElementById("loading-state");
  if (loading) loading.style.display = "none";

  const el = document.getElementById("error-state");
  if (el) {
    el.style.display = "block";
    el.textContent = msg;
  } else {
    // Fallback
    document.body.innerHTML = `
      <div style="padding:40px;text-align:center;font-family:system-ui;">
        <p style="color:#666;">${msg}</p>
        <a href="/test/index.html" style="color:#EAB308;">Zum Test</a>
      </div>
    `;
  }
}
