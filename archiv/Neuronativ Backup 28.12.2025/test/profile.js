// profile.js
// profile.js

export function renderProfilePage(container){
  container.innerHTML = `
<section class="profile-page">

<header class="profile-header">
    <button id="back-to-results" class="secondary">
      ← Zur Auswertung
    </button>

  <header class="profile-header">
    <h1>Profile</h1>
    <p class="profile-intro">
      Diese Übersicht fasst deine Ergebnisse auf Muster-Ebene zusammen
      und zeigt, in welche Richtungen dein Profil insgesamt tendiert.
    </p>
  </header>

  <!-- Profilrichtungen -->
  <div class="profile-grid">

    <div class="profile-card" data-profile="adhs">
      <h2>ADHS-nahe Muster</h2>
      <div class="profile-weight">
        <div class="profile-bar">
          <div class="profile-bar-fill" style="width: 0%"></div>
        </div>
        <span class="profile-percent">–</span>
      </div>
      <p class="profile-desc">
        –
      </p>
    </div>

    <div class="profile-card" data-profile="autism">
      <h2>Autismus-nahe Muster</h2>
      <div class="profile-weight">
        <div class="profile-bar">
          <div class="profile-bar-fill" style="width: 0%"></div>
        </div>
        <span class="profile-percent">–</span>
      </div>
      <p class="profile-desc">–</p>
    </div>

    <div class="profile-card" data-profile="audhd">
      <h2>Mischprofil</h2>
      <div class="profile-weight">
        <div class="profile-bar">
          <div class="profile-bar-fill" style="width: 0%"></div>
        </div>
        <span class="profile-percent">–</span>
      </div>
      <p class="profile-desc">–</p>
    </div>

    <div class="profile-card" data-profile="stress">
      <h2>Belastungs-/Kontextprofil</h2>
      <div class="profile-weight">
        <div class="profile-bar">
          <div class="profile-bar-fill" style="width: 0%"></div>
        </div>
        <span class="profile-percent">–</span>
      </div>
      <p class="profile-desc">–</p>
    </div>

  </div>

  <!-- Begründung -->
  <div class="profile-box">
    <h3>Grundlage der Einordnung</h3>
    <ul class="profile-reasons">
      <!-- dynamisch -->
    </ul>
  </div>

  <!-- Nächste Schritte -->
  <div class="profile-box profile-next">
    <h3>Nächste Schritte</h3>
    <p class="profile-next-text">
      –
    </p>
  </div>

</section>
  `;
}
