// profile_texts.js
// Single Source of Truth: Copy & Erklärtexte für Profiling-UI + Hero-Beschreibungen
// Version: 3.0 (konsolidiert: vorher profile_texts.js + profile_descriptions.js)
// Sprache: DE
// Hinweis: 50% ist der Skalen-Mittelpunkt (Tool-Referenz), keine Bevölkerungsnorm.

const PROFILE_TEXTS = {

  /* =====================================================
     0) META / REFERENZ
  ===================================================== */

  meta: {
    scoring: {
      likert_range: "1–6 (Buttons sind UI-Labels; intern 1..6)",
      mapping: "1 → 0%, 6 → 100% (linear); 50% ≙ Skalen-Mittelpunkt (≈ 3.5/6).",
      reference_note:
        "50% ist der mathematische Mittelpunkt dieser Skala und dient als interne Referenz des Tools. " +
        "Es handelt sich nicht um eine Bevölkerungsnorm und nicht um eine klinische Normierung."
    }
  },

  /* =====================================================
     1) ALLGEMEINE EINLEITUNG (Methodik-Text / About)
  ===================================================== */

  introduction: {
    title: "Wie funktioniert dieses Profiling?",

    methodology:
      "Dieses Profil basiert auf einer strukturierten Selbsteinschätzung in 10 Dimensionen. " +
      "Ihre Antworten werden pro Dimension zu einem Skalenwert (0–100%) verdichtet. " +
      "50% ist der Skalen-Mittelpunkt des Tools und dient als Referenz innerhalb dieser Auswertung. " +
      "Anschließend werden thematisch zusammenhängende Skalen zu vier Clustern zusammengeführt " +
      "(ADHS, Autismus, Emotionale Verarbeitung, Kompensation & Belastung). " +
      "Ein Muster-Modul erkennt Kombinationen (z.B. AuDHD, Hochmaskierung, Überlastung) und erzeugt " +
      "eine zusammenfassende Darstellung (Kernprofil + Schwerpunkt + Zusatzprofil).",

    interpretation:
      "Hohe Werte bedeuten: Sie haben die jeweiligen Aussagen häufig und stark bestätigt. " +
      "Niedrige Werte bedeuten: Sie haben die jeweiligen Aussagen selten oder schwach bestätigt. " +
      "Das Tool beschreibt Muster Ihrer Selbstaussagen in diesen Dimensionen – nicht Fähigkeit, Wert oder Intelligenz.",

    limitations:
      "Dieses Screening ist eine Orientierungshilfe. Es ist keine klinische Diagnostik und ersetzt keine fachliche Abklärung."
  },

  /* =====================================================
     2) UI & RENDER-TEXTE
  ===================================================== */

  ui: {
    hero: {
      main_title_fallback: "Individuelles Neurodivergenz-Profil",

      // Empfehlung: Konfidenz im Hero optional ausblendbar.
      confidence_label: "Modell-Sicherheit (intern): {confidence}%",

      labels: {
        core: "Kernprofil",
        focus: "Schwerpunkt",
        add_on: "Zusatzprofil"
      },

      // generische Einleitung (wenn kein spezifischer Text greift)
      description: {
        default:
          "Ihre Antworten ergeben ein erkennbares Muster. Unten sehen Sie, welche Bereiche am stärksten ausgeprägt sind und wie sie zusammenhängen.",

        mixed:
          "Ihre Werte verteilen sich über mehrere Bereiche ohne klare Dominanz. Das ist häufig: viele Menschen zeigen ein individuelles Muster statt eines Lehrbuch-Profils.",

        unremarkable:
          "Ihre Antworten liegen überwiegend im mittleren Bereich dieser Skalen. Es zeigt sich kein dominantes Muster in den abgefragten Dimensionen.",

        single_dominant:
          "Ein Bereich ragt im Verhältnis zu den anderen deutlich heraus. Unten sehen Sie, wie sich dieses Schwerpunktmuster in den Details zeigt.",
        
          overload:
        "Überlastung ist deutlich erhöht. Die Belastungsdynamik kann andere Muster verstärken oder überlagern."

      },

      // feste Kernprofil-Sätze (kurz, stabil)
      core_profile_blurbs: {
        adhd:
          "Ihr Muster zeigt interessengeleitete Aufmerksamkeit und erhöhten inneren Aufwand für Start, Wechsel oder Organisation von Aufgaben. Bei persönlichem Interesse kann Vertiefung sehr stark werden.",

        autism:
          "Ihr Muster zeigt eine intensive oder selektive Reizverarbeitung, ein Bedürfnis nach Klarheit und Vorhersehbarkeit sowie eine eher analytische soziale Verarbeitung.",

        audhd:
          "Ihr Muster zeigt gleichzeitig ADHS-nahe und Autismus-nahe Bereiche. Das kann sich wie ein Wechselspiel aus Strukturbedürfnis und schwankender Umsetzung anfühlen – oft mit starker Vertiefung bei Interesse.",

        emotional:
          "Ihr Muster zeigt, dass Emotionswahrnehmung und/oder Emotionsregulation deutlich Energie kosten oder schwer steuerbar sind.",

        compensation:
          "Ihr Muster zeigt hohen inneren Aufwand durch Anpassung (Maskierung) und/oder schnelle Überlastung. Das ist oft nach außen wenig sichtbar.",

        mixed:
          "Mehrere Bereiche sind erhöht, ohne dass eine Richtung klar dominiert. Die Details sind hier wichtiger als ein Etikett.",

        unremarkable:
          "In den abgefragten Bereichen zeigt sich kein klar dominierendes Muster. Einzelne Themen können trotzdem relevant sein."
      },

addonline_templates: {
  autism_traits_disqualified: "Autismus-Cluster hoch; Kriterien nicht erfüllt",
  adhd_traits_disqualified: "ADHS-Cluster hoch; Kriterien nicht erfüllt",
  audhd_not_derivable: "AuDHD nicht ableitbar"
},


      overlay_blurbs: {
  masking:
    "Zusätzlich ist der Anpassungsaufwand erhöht: Nach außen kann vieles stabil wirken, innerlich kostet es spürbar Energie. Das erklärt oft eine Diskrepanz zwischen Funktion und Erschöpfung.",

  overload:
    "Zusätzlich ist die Systemlast hoch: Reize und Anforderungen kippen schneller in Überforderung, und Erholung dauert länger. Priorität ist meist Reiz- und Anforderungsmanagement, bevor Feinprofile sicher beurteilt werden.",

  emotional:
    "Zusätzlich ist emotionale Verarbeitung stark beansprucht: Intensität, Nachklang oder Wechsel können den Alltag deutlich mitsteuern. Hilfreich ist oft, Frühmarker zu erkennen und Regulation kurz und wiederholbar zu entlasten.",

  hyperfocus:
    "Zusätzlich zeigt sich intensiver Hyperfokus: Bei Interesse entsteht starke Vertiefung, aber Zeitgefühl und Grundbedürfnisse geraten leichter aus dem Blick. Ein sauberer Ausstieg (Stopp-Regel + Reminder) reduziert Folgekosten."
}
    },

 onset: {
  label: "Zeitlicher Beginn (Selbstauskunft):",
  helper_text:
    "Zeitlicher Verlauf hilft bei der Einordnung: früh beginnende Muster sprechen eher für ein Entwicklungsprofil; späterer Beginn spricht eher für starken Kontext- oder Belastungseinfluss.",

  // NEU (Engine)
  early: "Frühe Kindheit",
  school: "Seit Schulalter",
  teen: "Seit Jugend",
  adult: "Seit Erwachsenenalter",
 unknown: "Zeitpunkt unklar",


  // Legacy (falls noch irgendwo genutzt)
  unsure: "Zeitpunkt unklar",
  childhood: "Seit Kindheit",
  youth: "Seit Jugend",
  recent: "Kürzlich aufgetreten"
},
disqualification: {
  section_title: "⚠️ Wichtiger Hinweis zur diagnostischen Einordnung",
  
  adhd: {
    title: "ADHS-Profil erfüllt nicht die diagnostischen Kriterien",
    criteria: "Symptombeginn wurde für Aufmerksamkeit/Executive nach dem 12. Lebensjahr (12+) angegeben. DSM-5 verlangt für ADHS einen Symptombeginn vor dem 12. Lebensjahr.",
    meaning: "Die hohen Werte im ADHS-Cluster zeigen ADHS-ähnliche Symptome. Diese können jedoch andere Ursachen haben: chronischer Stress, Burnout, Depression, Trauma, hormonelle Faktoren (z.B. Schilddrüse), Medikamentennebenwirkungen, oder Schlafstörungen.",
    next_steps: "Medizinische/therapeutische Abklärung zur Differentialdiagnose empfohlen."
  },
  
  autism_criteria_a: {
    title: "Autismus-Profil erfüllt nicht die diagnostischen Kriterien",
    criteria_template: "DSM-5 Kriterium A nicht erfüllt: Nicht alle 3 Bereiche der sozialen Kommunikation wurden bestätigt ({count}/3 Bereiche).",
    meaning: "Die Werte im Autismus-Cluster zeigen autismus-ähnliche Züge. Kriterium A verlangt jedoch, dass alle 3 Bereiche (soziale Reziprozität, nonverbale Kommunikation, Beziehungsgestaltung) zutreffen. Mögliche alternative Erklärungen: soziale Angststörung, ADHS mit sozialen Schwierigkeiten, Trauma-Folgen, oder einzelne autistische Traits ohne Vollbild.",
    next_steps: "Fachliche Abklärung kann helfen, die Ursachen zu differenzieren und passende Unterstützung zu finden."
  },
  
  autism_criteria_b: {
    title: "Autismus-Profil erfüllt nicht die diagnostischen Kriterien",
    criteria_template: "DSM-5 Kriterium B nicht erfüllt: Weniger als 2 der 4 RRB-Bereiche (repetitive Verhaltensweisen, Interessen, sensorische Besonderheiten) wurden bestätigt ({count}/4 Bereiche).",
    meaning: "Die Werte im Autismus-Cluster zeigen autismus-ähnliche Züge. Kriterium B verlangt jedoch mindestens 2 von 4 RRB-Bereichen. Mögliche alternative Erklärungen: ADHS mit Hyperfokus, Zwangsstörung, spezifische sensorische Verarbeitungsstörung, oder einzelne autistische Traits ohne Vollbild.",
    next_steps: "Fachliche Abklärung kann helfen, die Ursachen zu differenzieren und passende Unterstützung zu finden."
  },
  
  audhd: {
    title: "AuDHD-Profil erfüllt nicht die diagnostischen Kriterien",
    criteria_template: "Kombiniertes Profil erfüllt nicht beide Diagnosekriterien. {reason}",
    meaning: "Die Werte zeigen eine Überlappung von ADHS- und Autismus-ähnlichen Zügen. Für eine AuDHD-Konstellation müssen jedoch beide Diagnosen unabhängig die jeweiligen Kriterien erfüllen.",
    next_steps: "Fachliche Abklärung kann helfen zu klären, welche Dynamik hier dominiert und welche Unterstützung am besten passt."
  },
  
  labels: {
    score: "Cluster-Score:",
    criteria: "Begründung:",
    meaning: "Was bedeutet das?",
    next_steps: "Nächster Schritt:"
  }
},

    discrepancy: {
      section_title: "Kontext-Hinweise zur Einordnung (Belastung, Maskierung, Dynamik). Sie erklären, welche Faktoren die Ausprägungen im Alltag aktuell prägen.",
      icon: "⚠️",
      flag_labels: {
        consider_differential: "Differential prüfen",
        social_anxiety_likely: "Soziale Komponente beachten",
        monitor_burnout_risk: "Burnout-Risiko beobachten",
        reassess_after_recovery: "Nach Entlastung neu einordnen",
        autism_marker: "Autismus-nahes Muster",
        adhd_trauma_likely: "ADHS-nahes Muster (Kontext prüfen)",
        subclinical_traits: "Traits / subklinisch",
        complex_emotional_pattern: "Komplexe emotionale Dynamik",
        monitor_delayed_burnout: "Verzögertes Erschöpfungsrisiko",
        check_historical_hyperfocus: "Hyperfokus-Verlauf prüfen",
        autism_specific_structure_need: "Ausgeprägtes Strukturbedürfnis",
        autism_sensory_emotional_pattern: "Sensorisch-emotionales Muster",
        urgent_professional_assessment: "Abklärung priorisieren",
        late_onset_overload_overlay: "Später Beginn: Überlastung (Overlay)",
late_onset_masking_overlay: "Später Beginn: Maskierung (Overlay)",
late_onset_emotional_overlay: "Später Beginn: Emotion (Overlay)",

      }
    },

    sections: {
      cluster_title: "Cluster-Auswertung",
      detail_title: "Kern- und wichtige Profile",
      reasoning_title: "Grundlage der Einordnung",
      patterns_title: "Erkannte Muster",
      next_steps_title: "Nächste Schritte"
    },

   status: {
  core: "Kernprofil",
  focus: "Schwerpunkt",
  add_on: "Zusatzprofil",
  important: "Wichtig",
  strength: "Stärke",

  // NEU (Mechanik v2):
  part: "Teilprofil",
  base_under_load: "Basisprofil (unter Last)",
  state_acute: "Zustand (akut)"
},
levels: {
  very_high: "sehr stark ausgeprägt",
  high: "stark ausgeprägt",
  mid: "mittel ausgeprägt",
  low: "gering ausgeprägt",
  minimal: "kaum ausgeprägt"
},


    buttons: {
      pdf: "Als PDF speichern",
      close: "Fenster schließen",
      methodology: "Zur Methodik"
    },

    // Du kannst das in der UI nutzen oder weglassen.
    disclaimer:
      "Hinweis: Dieses Profil basiert auf einem Selbsteinschätzungs-Screening. Es ist keine Diagnostik und keine medizinische Bewertung."
  },

  /* =====================================================
     3) CLUSTER-ERKLÄRUNGEN (Tooltips: high/mid/low)
  ===================================================== */

  clusters: {

    adhd: {
      name: "ADHS-Cluster",
      description:
        "Dieses Cluster fasst drei Bereiche zusammen: Aufmerksamkeit/Selbststeuerung, Exekutivfunktionen und Hyperfokus. " +
        "Es beschreibt interessengeleitete Regulation, nicht „zu wenig Aufmerksamkeit“.",
      scales_included: [
        "Aufmerksamkeit & Selbstregulation",
        "Exekutivfunktionen",
        "Hyperfokus & Vertiefung"
      ],
      what_high_means:
        "Sie haben Aussagen zu interessengeleiteter Aufmerksamkeit, exekutivem Aufwand und Vertiefung häufig stark bestätigt. " +
        "Das spricht für ein ADHS-nahes Muster in diesen Dimensionen.",
      what_low_means:
        "Diese Aussagen wurden eher selten bestätigt. ADHS-nahe Muster stehen in Ihrem Antwortprofil nicht im Vordergrund."
    },

    autism: {
      name: "Autismus-Cluster",
      description:
        "Dieses Cluster bündelt sensorische Verarbeitung, soziale Verarbeitung und Strukturbedarf. " +
        "Es beschreibt eine andere Art, Reize und soziale Information zu verarbeiten – häufig analytischer und vorhersage-orientiert.",
      scales_included: [
        "Sensorische Verarbeitung",
        "Soziale Verarbeitung",
        "Struktur & Vorhersehbarkeit"
      ],
      what_high_means:
        "Sie haben Aussagen zu Reizintensität/Selektivität, Strukturbedarf und sozial-analytischer Verarbeitung häufig stark bestätigt. " +
        "Das spricht für ein autismus-nahes Muster in diesen Dimensionen.",
      what_low_means:
        "Diese Muster wurden eher selten bestätigt. Autismus-nahe Dimensionen stehen in Ihrem Antwortprofil nicht im Vordergrund."
    },

    emotional: {
      name: "Emotionale Verarbeitung",
      description:
        "Dieses Cluster verbindet Emotionswahrnehmung (Benennen/Einordnen) und Emotionsregulation (Intensität/Dauer/Wechsel). " +
        "Es beschreibt Aufwand und Steuerbarkeit im emotionalen System.",
      scales_included: [
        "Emotionswahrnehmung (Alexithymie-Spektrum)",
        "Emotionsregulation"
      ],
      what_high_means:
        "Sie haben Aussagen zu schwer benennbaren Gefühlen und/oder intensiver, schwer steuerbarer Emotionsdynamik häufig stark bestätigt. " +
        "Das deutet auf hohen Aufwand in der emotionalen Verarbeitung hin.",
      what_low_means:
        "Diese Aussagen wurden eher selten bestätigt. Emotionswahrnehmung und -regulation wirken in Ihrem Antwortprofil eher stabil."
    },

    compensation: {
      name: "Kompensation & Belastung",
      description:
        "Dieses Cluster erfasst Anpassungsaufwand (Maskierung) und Überlastung/Erholung. " +
        "Es beschreibt vor allem Energieverbrauch und Belastungsdynamik – oft unabhängig davon, wie „funktional“ es nach außen wirkt.",
      scales_included: [
        "Maskierung & Anpassung",
        "Überlastung & Erholung"
      ],
      what_high_means:
        "Sie haben Aussagen zu hohem Anpassungsaufwand und/oder schneller Überlastung häufig stark bestätigt. " +
        "Das weist auf hohen inneren Aufwand hin, auch wenn das äußerlich nicht sichtbar ist.",
      what_low_means:
        "Maskierung/Überlastung wurden eher selten bestätigt. Kompensation spielt in Ihrem Antwortprofil keine zentrale Rolle."
    }
  },

  /* =====================================================
     4) DETAIL-PROFILE & SUBTYP-LABELS (UI-Karten)
  ===================================================== */

  profiles: {

    cards: {
      adhd:
        "Dieses Profil bündelt ein ADHS-nahes Muster: interessengeleitete Aufmerksamkeit, exekutiver Aufwand und starke Vertiefung bei Interesse.",
      autism:
        "Dieses Profil bündelt ein autismus-nahes Muster: Reizverarbeitung, Strukturbedarf und analytische soziale Verarbeitung.",
      audhd:
        "Dieses Profil bündelt eine Überlappung von ADHS-nahen und autismus-nahen Bereichen (AuDHD).",
      high_masking:
        "Dieses Profil beschreibt hohen Anpassungsaufwand in sozialen Situationen. Nach außen kann das kompetent wirken, innerlich kostet es Energie.",
      stress:
        "Dieses Profil beschreibt schnelle Überlastung und längere Erholungszeit. Interpretation der Kernprofile wird verlässlicher, wenn Belastung sinkt.",
      traits:
        "Dieses Profil beschreibt erkennbare Merkmale ohne klare Dominanz. Details und Kontext sind hier wichtiger als ein Etikett.",
        overload:
  "Dieses Profil beschreibt schnelle Überlastung und längere Erholungszeit. Reiz- und Anforderungsmanagement werden hier zum zentralen Hebel.",

emotional:
  "Dieses Profil beschreibt erhöhte Last in Emotionswahrnehmung und/oder Emotionsregulation. Intensität, Nachklang oder Benennen können den Alltag spürbar mitsteuern.",

hyperfocus:
  "Dieses Profil beschreibt sehr intensive Vertiefung bei Interesse. Das kann leistungsstark sein, aber Zeitgefühl und Grundbedürfnisse (Pause, Essen, Schlaf) geraten leichter aus dem Blick."
    },

    subtype_labels: {
      adhd: {
        inattentive: "Vorwiegend Unaufmerksamkeit",
        hyperactive: "Vorwiegend impulsiv-hyperaktiv",
        combined: "Kombinierter Typ",
        emotional: "Mit starker Emotionsdynamik"
      },
      autism: {
        classic: "Klassische Ausprägung",
        masked: "Stark kompensiert (Maskierung im Vordergrund)",
        female: "Hochmaskierte Präsentation",
        hyperfocus: "Mit intensivem Spezialinteresse"
      },
      audhd: {
        specific: "Eigenständige AuDHD-Dynamik",
        conflict: "AuDHD mit inneren Spannungen"
      }
    }
  },

  /* =====================================================
     5) DOMINANTE EINZELSKALA (Schwerpunkt-Zeile + Kurztext)
  ===================================================== */

  dominant_scale: {
    names: {
      emotreg: "Emotionale Dysregulation",
      overload: "Überlastung & Erholung",
      executive: "Exekutivfunktionen",
      sensory: "Sensorische Verarbeitung",
      masking: "Maskierung & Anpassung",
      social: "Soziale Verarbeitung",
      alexithymia: "Emotionswahrnehmung",
      attention: "Aufmerksamkeit & Selbststeuerung",
      structure: "Struktur & Vorhersehbarkeit",
      hyperfocus: "Hyperfokus & Vertiefung"
    },

    focus_line: "Schwerpunkt: {name}",

    descriptions: {
      emotreg:
        "Emotionsintensität, Wechsel oder Nachklang wurden häufig stark bestätigt. Priorität ist oft: frühe Marker erkennen und Regulation entlasten.",
      overload:
        "Schnelle Überforderung und längere Erholung wurden häufig stark bestätigt. Das spricht für hohe Systemlast und Bedarf an Reiz- und Anforderungsreduktion.",
      executive:
        "Starten, Wechseln, Priorisieren oder Arbeitsgedächtnis wurden häufig stark bestätigt. Das spricht für hohen exekutiven Aufwand im Alltag.",
      sensory:
        "Reizintensität/Selektivität wurde häufig stark bestätigt. Das spricht für eine empfindliche oder sehr differenzierte sensorische Verarbeitung.",
      masking:
        "Anpassungsaufwand wurde häufig stark bestätigt. Das spricht für hohe soziale Energieinvestition und mögliche Diskrepanz zwischen außen/innen.",
      social:
        "Soziale Situationen wurden als energieaufwendig/analytisch bestätigt. Das spricht für hohen Aufwand in Interaktion und Deutung.",
      alexithymia:
        "Gefühle benennen/einordnen wurde als schwierig bestätigt. Das spricht für verzögerte oder indirekte Hilfe beim inneren „Lesen“.",
      attention:
        "Aufmerksamkeitssteuerung und Alltagshandlungsdruck wurden häufig stark bestätigt. Das spricht für stark kontextabhängige Aufmerksamkeit.",
      structure:
        "Vorhersehbarkeit und stabile Abläufe wurden stark bestätigt. Das spricht für Struktur als zentrale Regulation.",
      hyperfocus:
        "Sehr intensive Vertiefung bei Interesse wurde stark bestätigt. Das spricht für hohe Fokusfähigkeit bei Bedeutung – mit Risiko, Bedürfnisse zu übergehen."
    }
  },

/* =====================================================
   6) GRUNDLAGE DER EINORDNUNG (Copy für Reasoning-Block)
===================================================== */

reasoning: {
  thresholds: {
    high: 70,
    low: 40
  },

  cluster_sentences: {
    high: {
      adhd: "ADHS-Cluster {adhd}%: Viele Hinweise auf erhöhten Aufwand bei Aufmerksamkeit, Starten/Organisieren und Vertiefung bei Interesse.",
      autism: "Autismus-Cluster {autism}%: Viele Hinweise auf starke Reizverarbeitung, Strukturbedarf und eher analytische soziale Verarbeitung.",
      emotional: "Emotionale Verarbeitung {emotional}%: Emotionale Dynamik steht in Ihren Antworten deutlich im Vordergrund.",
      compensation: "Kompensation & Belastung {compensation}%: Maskierung/Überlastung spielen in Ihren Antworten deutlich eine Rolle."
    },
    mid: {
      adhd: "ADHS-Cluster {adhd}%: Einige ADHS-nahe Aspekte sind erkennbar, aber nicht durchgängig dominant.",
      autism: "Autismus-Cluster {autism}%: Einige autismus-nahe Aspekte sind erkennbar, aber nicht durchgängig dominant.",
      emotional: "Emotionale Verarbeitung {emotional}%: Emotionale Aspekte sind spürbar, aber nicht zentral.",
      compensation: "Kompensation & Belastung {compensation}%: Anpassung/Belastung sind spürbar, aber nicht zentral."
    },
    low: {
      adhd: "ADHS-Cluster {adhd}%: ADHS-nahe Muster stehen in Ihren Antworten nicht im Vordergrund.",
      autism: "Autismus-Cluster {autism}%: Autismus-nahe Muster stehen in Ihren Antworten nicht im Vordergrund.",
      emotional: "Emotionale Verarbeitung {emotional}%: Emotionale Dynamik steht in Ihren Antworten nicht im Vordergrund.",
      compensation: "Kompensation & Belastung {compensation}%: Maskierungs-/Überlastungsfaktoren stehen in Ihren Antworten nicht im Vordergrund."
    }
  },

  dominant_sentence:
    "Dominant ({dom_name} {dom_pct}%): Dieser Bereich ist in Ihren Antworten am stärksten ausgeprägt und prägt das Gesamtbild.",

  top_scales_sentence:
    "Top-Skalen: {top1_name} {top1_pct}%, {top2_name} {top2_pct}%, {top3_name} {top3_pct}% – das sind die stärksten Treiber Ihres Profils."
},


  /* =====================================================
     7) DISCREPANCY FLAGS (Kurzlabel + 1–2 Sätze)
  ===================================================== */

  discrepancy_flags: {
    consider_differential:
      "Das Muster ist nicht eindeutig und könnte durch Kontext, Belastung oder Kompensation mitgeprägt sein. Die Details unten sind hier wichtiger als eine Schublade.",

    social_anxiety_likely:
      "Soziale Belastung ist erhöht. Entscheidend ist, ob der Kern eher Angst/Anspannung oder eher Deutung/Regeln/Ermüdung ist – beides kann ähnlich aussehen.",

    monitor_burnout_risk:
      "Maskierung/Überlastung sind hoch. Das spricht für erhöhtes Erschöpfungsrisiko, auch wenn Funktionsfähigkeit nach außen stabil wirkt.",

    reassess_after_recovery:
      "Belastung wirkt stark. Eine Einordnung der Kernprofile wird meist klarer, wenn Systemlast sinkt.",

    autism_marker:
      "Mehrere autismus-nahe Skalen sind gleichzeitig erhöht (Reize/Struktur/sozial-analytisch). Das Muster ist konsistent.",

    adhd_trauma_likely:
      "ADHS-nahe Skalen sind hoch. Kontextfaktoren können ähnliche Signale verstärken; zeitlicher Verlauf hilft bei der Einordnung.",

    subclinical_traits:
      "Merkmale sind erkennbar, aber ohne klare Dominanz. Das kann ein stabiles individuelles Profil sein oder stark kontextabhängig.",

    complex_emotional_pattern:
      "Emotionswahrnehmung und Emotionsregulation zeigen gemeinsam ein starkes Muster. Das kann sich subjektiv widersprüchlich anfühlen (viel fühlen, schwer benennen).",

    monitor_delayed_burnout:
      "Hohe Anpassung kann zu verzögertem Erschöpfungseinbruch führen. Die Reaktionszeit des Systems ist hier oft zeitversetzt.",

    check_historical_hyperfocus:
      "Hyperfokus ist auffällig. Relevant ist, ob dieses Muster seit früher Zeit besteht oder erst unter bestimmten Bedingungen stark wurde.",

    autism_specific_structure_need:
      "Strukturbedarf ist außergewöhnlich hoch und wirkt als zentrale Stabilisierung. Brüche/Änderungen können überproportional Energie kosten.",

    autism_sensory_emotional_pattern:
      "Sensorik und emotionale Verarbeitung sind gemeinsam hoch. Reize können direkt in emotionale Intensität kippen; Reizmanagement wird zentral.",

    urgent_professional_assessment:
      "Das Muster zeigt hohe Systemlast oder starke Beeinträchtigung in mehreren Bereichen. Eine fachliche Abklärung kann helfen, Ursachen zu ordnen und gezielt zu entlasten.",
      late_onset_overload_overlay:
  "Überlastung ist hoch und wurde als später Beginn angegeben. Das spricht eher für ein aktuelles Overlay (Lebensphase/Stress/Umwelt) als für ein durchgängig frühes Muster.",

late_onset_masking_overlay:
  "Maskierung ist hoch und wurde als später Beginn angegeben. Das spricht eher für eine später stark gewordene Anpassungsstrategie als für ein frühes Grundmuster.",

late_onset_emotional_overlay:
  "Emotionsregulation ist hoch und wurde als später Beginn angegeben. Das spricht eher für ein kontextabhängiges Overlay (Belastung/Trigger-Ketten) als für ein frühes Grundmuster.",

  },
  

// profile_texts.js
// Single Source of Truth: Alle UI-Texte (inkl. Patterns).
// Nur Text. Keine Logik.

export const PROFILE_TEXTS = {
  ui: {
    onset: {
      label: "Zeitlicher Beginn (Selbstauskunft):",
      early: "Seit früher Kindheit",
      school: "Seit Schulalter",
      teen: "Seit Jugend",
      adult: "Seit Erwachsenenalter",
      unknown: "Zeitpunkt unklar",

      // legacy fallbacks (falls irgendwo noch benutzt)
      childhood: "Seit Kindheit",
      youth: "Seit Jugend",
      recent: "Kuerzlich aufgetreten",
      unsure: "Zeitpunkt unklar",
    },
  },

  // =====================================================
  // 8) PATTERNS (Kurznotizen – staerkend, loesungsorientiert)
  // =====================================================
  patterns: {
    templates: {
      structure_vs_executive:
        "Sie profitieren spuerbar von Struktur – gleichzeitig kosten Start, Wechsel und Dranbleiben unverhaeltnismaessig viel Energie. Das ist kein Widerspruch, sondern ein Muster: Mit kleinen, festen Einstiegsschritten wird Umsetzung deutlich leichter.",

      social_plus_masking:
        "Soziale Situationen gelingen Ihnen oft – aber mit hohem inneren Aufwand (Masking). Das spricht fuer starke Anpassungsfaehigkeit; nachhaltiger wird es, wenn Erholung und 'Ich darf so sein'-Momente bewusst eingeplant sind.",

      sensory_plus_overload:
        "Reize werden intensiv verarbeitet und die Erholung ist begrenzt. Das ist haeufig eine feine Wahrnehmung mit hoher Bandbreite – Reizmanagement (Licht, Laerm, Tempo) wirkt hier direkt wie ein Energie-Booster.",

      adhd_plus_emotional:
        "Aufmerksamkeit/Handlungsdruck und emotionale Dynamik haengen bei Ihnen eng zusammen. Das kann Intensitaet und Kreativitaet staerken – und wird stabiler, wenn Sie frueh kleine Regler nutzen (Pause, Koerpercheck, klare naechste Schritte).",

      audhd_conflict:
        "Strukturbedarf und Wechsel/Impuls wirken gleichzeitig stark. Das kann sich innen 'gegensaetzlich' anfuehlen, ist aber ein konsistentes Mischmuster: Wenn Regeln flexibel genug sind, entsteht daraus oft echte Selbstwirksamkeit.",

      hyperfocus_plus_overload:
        "Vertiefung ist eine Ihrer Superkraefte – und kann Ressourcen schnell aufbrauchen, wenn Erholung zu spaet kommt. Mit klaren Stopps und geplanten Pausen bleibt die Staerke nutzbar, ohne dass der Preis zu hoch wird.",

      hyperfocus_exit_cost:
        "Wenn Interesse da ist, entsteht starke Vertiefung – der Ausstieg (Stopp/Wechsel/Grundbeduerfnisse) ist dann oft der schwerste Teil. Eine einfache Stopp-Regel + Reminder schuetzt Ihre Energie, ohne den Flow zu zerstoeren.",

      mixed_onset_timing:
        "Die Startzeitpunkte unterscheiden sich je Bereich. Das passt gut zu einem Bild aus Basis-Traits plus spaeteren Overlays – beides darf gleichzeitig wahr sein, ohne dass Ihre Erfahrungen 'weniger echt' werden.",

      late_onset_overload_overlay:
        "Ein Teil der Ueberlastungsdynamik wirkt eher spaeter entstanden. Das passt zu einem 'Overlay' durch Lebensphase/Anforderungen: Entlastung und Rhythmus machen hier oft schnell einen spuerbaren Unterschied.",

      late_onset_masking_overlay:
        "Masking/Anpassungsaufwand wirkt eher spaeter staerker geworden. Das spricht haeufig fuer erlernte Strategien unter Druck – hilfreich ist, bewusst zwischen 'funktionieren' und 'auftanken' zu unterscheiden.",

      late_onset_emotional_overlay:
        "Die emotionale Dynamik wirkt eher spaeter staerker geworden. Das passt zu einem Overlay durch Stress/Last: Stabilitaet wird oft leichter, wenn Sie Fruehmarker frueher abfangen und Regeneration planbarer machen.",

      masking_exhaustion:
        "Anpassung kostet Sie spuerbar Kraft. Das zeigt nicht 'Schwaeche', sondern wie viel Sie leisten – Entlastung entsteht oft durch kleine Erlaubnisse: weniger erklaeren, weniger perfekt, mehr Erholung nach Kontakt.",

      task_initiation_wall:
        "Der Einstieg fuehlt sich manchmal wie eine 'Wand' an, obwohl Sie wissen, was zu tun waere. Das ist ein typisches Energie-/Startproblem: 2-Minuten-Start + sichtbarer erster Schritt bringt Ihr System oft ins Rollen.",

      shutdown_cognitive:
        "Unter Ueberreizung kann Denken/Sprechen kurzfristig schwerer werden. Ihr System schuetzt sich dann – am besten helfen klare Reduktion (Reize raus) und ein einfacher Rueckweg (Wasser, Ruhe, kurzer Reset).",

      emotion_switch_rapid:
        "Emotionen koennen schnell kippen, besonders unter Druck. Das ist oft hohe Sensitivitaet – stabiler wird es, wenn Sie frueh Signale erkennen und mit kurzen Unterbrechungen arbeiten, statt erst im Maximum zu reagieren.",

      alexithymia_words_hard:
        "Gefuehle sind nicht immer leicht in Worte zu fassen. Das ist haeufig eine andere Art von Innenwahrnehmung – mit Zeit, Abstand und Koerperankern (Ort, Spannung, Waerme) wird es meist deutlich leichter.",

      complex_emotional_pattern:
        "Emotionswahrnehmung und Emotionsregulation zeigen gemeinsam ein starkes Muster. Das kann sich subjektiv widerspruechlich anfuehlen (viel fuehlen, schwer benennen) – mit einfachen Koerpermarkern und kurzen Regler-Routinen wird es oft deutlich klarer.",

      stress_overlay:
        "Aktuelle Belastung kann Traits ueberlagern. Wenn Systemlast sinkt, wird die Einordnung oft klarer und Strategien greifen leichter.",

      high_masking:
        "Deutliche Kompensation (Masking) ist erkennbar. Das kann Stabilitaet ermoeglichen – und braucht bewusst eingeplante Erholung, damit es nachhaltig bleibt.",

      audhd_specific:
        "Ein Interaktionsmuster aus Strukturbedarf, Interesse-Vertiefung und Wechsel-Kosten ist erkennbar. Wenn Regeln flexibel sind und Uebergaenge geplant werden, wird daraus oft ein sehr tragfaehiger Alltag.",

      traits_only:
        "Es zeigen sich einzelne Traits, ohne dass ein Bereich klar dominiert. Das ist ein haeufiges Bild – gezielte kleine Anpassungen koennen trotzdem spuerbar entlasten.",
    }
  },
};




  /* =====================================================
     9) NEXT STEPS (3–6 Punkte, abhängig von Schwerpunkt)
  ===================================================== */

 // next_steps_neu.js
// Überarbeitete Next Steps - empathisch, max 2 Zeilen, erklärend
// Ersetzt den "next_steps" Block in PROFILE_TEXTS

next_steps: {

  interventions: {
    coaching_primary: [
      "Coaching kann hier schnell wirken: Jemand hilft Ihnen von außen beim Starten, Wechseln, Priorisieren – das entlastet das, was innerlich schwerfällt. Viele spüren schon nach 2–3 Sessions Unterschied im Alltag.",
      "Fokus liegt auf externer Struktur: klare Einstiegsschritte, Übergangsrituale, rückfall-sichere Routinen. Das Ziel ist nicht Perfektion, sondern weniger Reibungsverlust.",
      "Aufgaben anfangen ohne inneren Kampf: Body-Doubling (jemand ist einfach anwesend), 2-Minuten-Einstieg (nur anfangen, nicht fertig werden), sichtbare Zwischenschritte statt Endziel.",
      "Priorisieren vereinfachen: Nicht 'alles wichtig', sondern 3 Dinge pro Tag. Klare Defaults reduzieren Entscheidungslast und damit Energieverbrauch."
    ],

    coaching_autism_primary: [
      "Coaching hilft hier vor allem bei Struktur-, Kommunikations- und Reiz-Planung: Wissen was kommt, Absprachen explizit machen, Umwelt passend gestalten. Das reduziert Alltagskosten oft direkt.",
      "Fokus: Explizite Absprachen (keine impliziten Erwartungen), stabile Routinen mit Plan-B für Änderungen, passende Umweltgestaltung statt sich selbst anpassen.",
      "Sensorik praktisch lösen: Konkrete Trigger-Checks (Licht/Geräusch/Material/Temperatur) + 1–2 große Hebel (z.B. Noise-Cancelling, Raumwechsel) können mehr bringen als viele kleine Anpassungen.",
      "Soziale Energie dosieren: Dauer, Anzahl, Pausen planen – nicht als Luxus, sondern als fester Bestandteil. Erholung ist Teil des Termins, nicht nachträgliches 'Sich-Zusammenreißen'."
    ],

    hypnosis_primary: [
      "Hypnose setzt tiefer an: Systemberuhigung, schnellere Erholung, Entkopplung von Automatismen. Besonders hilfreich wenn Überlastung oder Emotionsdynamik den Alltag dominieren.",
      "Fokus: Frühmarker nutzen (bevor es kippt), Regenerationsanker setzen, Schlaf/Reset-Fenster verbessern, Stress-Loops unterbrechen statt nur aushalten.",
      "Bei hoher emotionaler Dynamik: Kurze, wiederholbare Regulation ist wirksamer als 'alles verstehen wollen'. Stabilität zuerst, Erklärung später.",
      "Bei langer Maskierung: Sichere Entlastungsfenster etablieren – weniger Kontrolle, mehr Rückmeldung aus dem Körper. Nicht 'loslassen lernen', sondern Kontrolle reduzieren wo sie kostet."
    ],

    combined_hypnosis_then_coaching: [
      "Kombination Hypnose + Coaching: Erst Stabilisierung/Erholung (Systemlast senken), dann Alltagsstruktur effizient aufbauen. In dieser Reihenfolge verstärken sich beide Ansätze.",
      "Fokus: Erst Reset/Regulation, dann Start/Wechsel/Organisation mit kleinen, stabilen Schritten. Profile und Strategien werden zuverlässiger, wenn das System nicht unter Dauerlast steht.",
      "Timing-Regel: Erst wenn Erholung wieder greift, werden neue Strukturen alltagstauglich. Sonst bauen Sie auf wackligem Fundament."
    ],

    combined_coaching_then_hypnosis: [
      "Kombination Coaching + Hypnose: Erst Struktur/Handlungsfähigkeit erhöhen, dann Stressreaktivität und Nachklang gezielt reduzieren. Außen stabilisieren, dann innen entlasten.",
      "Fokus: Erst klare Regeln/Defaults (was/wann/wie), dann Trigger-Entkopplung und Regenerationsanker. Wenn Leistung 'geht', aber teuer ist – Coaching stabilisiert außen, Hypnose reduziert innen die Kosten.",
      "Für Menschen, die funktionieren aber erschöpft sind: Erst Alltag vereinfachen, dann System beruhigen. Beides getrennt bringt was, kombiniert potenziert es sich."
    ]
  },

  base: [
    "Schauen Sie weniger auf Labels, mehr auf Energiekosten: Welche Situationen erschöpfen Sie überproportional? Das zeigt, wo Entlastung am meisten bringt.",
    "Protokollieren Sie 2–3 konkrete Momente: Was lief ab, welche Reize/Anforderungen waren da, wie hat sich Ihr Körper angefühlt? Muster werden in Details sichtbar.",
    "Erholung beobachten: Wie lange dauert es, bis Sie nach Belastung wieder 'normal' sind? Ein Tag, drei Tage, eine Woche? Das zeigt, wie hoch die tatsächliche Last war.",
    "Bei starker und anhaltender Erschöpfung: Körperliche Faktoren strukturiert abklären lassen (Schilddrüse, B12, Ferritin/Eisen, Vitamin D). Neurodivergenz erklärt vieles, aber nicht alles.",
    "Nach Entlastung/Stabilisierung kann eine Wiederholung des Tests ein klareres Bild geben – manchmal verdeckt akute Belastung das Basismuster."
  ],

  by_cluster: {
    adhd: [
      "Externalisieren: Was im Kopf bleibt, kostet ständig Energie. Liste, Timer, sichtbare Notiz – dann ist der Kopf frei und die Aufgabe trotzdem präsent.",
      "Anfangen ist schwerer als Weitermachen: Versprechen Sie sich nur 2 Minuten. Oft läuft es dann von selbst, und wenn nicht – 2 Minuten zählen trotzdem.",
      "Wechsel erleichtern: Feste Übergänge (kurze Pause, klare nächste Aktion) statt abruptes Stoppen. Das Gehirn braucht einen Moment zum Umschalten.",
      "Interessen gezielt nutzen: Planen Sie Aufgaben um Fokusfenster herum; koppeln Sie Motivation über Sinn oder kleine Belohnungen. Interesse ist Ihr stärkster Motor.",
      "Hyperfokus führen: Einstieg bewusst setzen UND Ausstieg genauso bewusst planen (Stopp-Regel + nächster Schritt notiert). Sonst zahlen Sie später die Rechnung (Erschöpfung, vergessene Bedürfnisse)."
    ],

    autism: [
      "Vorhersehbarkeit erhöhen: Klare Abläufe, Ankündigungen bei Änderungen, ruhige Routinen. Nicht weil Sie unflexibel sind, sondern weil Ihr System Struktur als Stabilisierung braucht.",
      "Sensorische Trigger identifizieren (Licht, Geräusch, Berührung, Gerüche) und gezielt reduzieren. Ein großer Hebel (z.B. Noise-Cancelling) kann mehr bringen als zehn kleine Anpassungen.",
      "Kommunikation explizit machen: Klare Absprachen statt impliziter Erwartungen. Sie sind nicht 'zu direkt' – andere sind zu indirekt.",
      "Struktur als Schutz nutzen: Routinen stabilisieren, aber mit Plan-B absichern. Starre Struktur bricht bei Störung, flexible Struktur federt ab.",
      "Soziale Dichte dosieren: Weniger gleichzeitige Anforderungen, mehr Pausen, mehr Recovery-Zeit. Interaktion ist möglich, aber nicht kostenlos – planen Sie die Rechnung ein."
    ],

    emotional: [
      "Frühmarker definieren (Körper, Gedanken, Verhalten), bevor Intensität kippt. Wenn Sie erst merken dass es zu viel ist wenn's schon vorbei ist, kommen Sie zu spät.",
      "Regulation priorisieren: Kurze, wiederholbare Strategien (60–120 Sekunden) sind wirksamer als 'alles verstehen wollen'. Stabilität zuerst, Erklärung später.",
      "Wenn Benennen schwer ist: Nutzen Sie Skalen (0–10), Körperzustände, einfache Kategorien ('angespannt/ruhig'). Worte sind nur ein Zugang – nicht der einzige.",
      "Bei Kombination hoher Intensität + schwerer Benennbarkeit: Externe Unterstützung (Therapie, Coaching, Hypnose) beschleunigt Stabilisierung oft deutlich. Sie müssen das nicht allein knacken."
    ],

    compensation: [
      "Energiehaushalt nach sozialen Kontakten tracken: Dauer des Termins, wie lange Erholung, wie stark der Nachklang. Das macht unsichtbare Kosten sichtbar.",
      "Sichere Räume definieren, in denen weniger Anpassung nötig ist. Nicht als Rückzug, sondern als Regenerationszone – Sie laden dort auf, nicht ab.",
      "Reiz- und Anforderungsreduktion als aktive Strategie planen, nicht erst 'wenn es kippt'. Wenn Sie warten bis Overload da ist, ist es meistens schon zu spät.",
      "Wenn Maskierung hoch ist: Die Diskrepanz 'außen ok / innen teuer' sichtbar machen (Protokoll, Gespräch mit Vertrauensperson) und aktiv entlasten. Durchhalten funktioniert – bis es nicht mehr funktioniert.",
      "Wenn Überlastung hoch ist: Stabilisierung VOR Feinprofilierung. Erst Systemlast senken, dann optimieren. Sonst bauen Sie Strategien auf wackligem Fundament."
    ]
  },

  by_scale: {
    masking: [
      "Funktionieren ≠ keine Kosten. Tracken Sie, wie erschöpft Sie NACH sozialen Situationen sind – auch wenn Sie währenddessen 'okay' wirkten. Das macht unsichtbare Last sichtbar.",
      "Kurze Entmaskierungsfenster in sicheren Kontexten testen: 10 Minuten zu Hause ohne 'Performance'. Kein Augenkontakt halten, keine Scripts, keine Kontrolle. Wie fühlt sich das an?",
      "Soziale Standards reduzieren: Augenkontakt muss nicht durchgängig sein, Gesprächs-Scripts sind erlaubt, Pausen sind kein Versagen. Viele Standards sind für andere wichtig, nicht für Sie.",
      "Verzögerte Erschöpfung beachten: Auch bei 'noch ok' früh entlasten und Puffer planen. Masking-Rechnung kommt oft erst Stunden oder Tage später – dann ist die Ursache nicht mehr sichtbar."
    ],

    overload: [
      "Reizlast aktiv senken (Licht, Geräusch, Menschen, Multitasking). Nicht erst reagieren wenn es zu viel ist, sondern präventiv reduzieren. Weniger Reiz = mehr Kapazität für anderes.",
      "Erholung planbar machen: Kurze Pausen (5–10 Min alle 90 Min) + längere Reset-Zeiten (halber Tag pro Woche). Nicht als Bonus, sondern als Wartung.",
      "Frühe Warnsignale ernst nehmen (Reizbarkeit, Rückzugswunsch, 'alles zu viel') und sofort entlasten – nicht durchpowern. Overload baut sich schneller auf als er abgebaut wird.",
      "Bei sehr hoher Überlastung: Erst Stabilität herstellen (weniger Input, mehr Ruhe), danach Strategien/Profile bewerten. Unter Dauerlast ist keine zuverlässige Einschätzung möglich."
    ],

    executive: [
      "Entscheidungen vereinfachen: Weniger Optionen, klare Defaults. Jede Entscheidung kostet, auch kleine – reduzieren Sie die Anzahl, nicht die Wichtigkeit.",
      "Arbeitsgedächtnis entlasten: Notizen, Checklisten, feste Ablageorte. Was Sie im Kopf halten müssen, läuft ständig im Hintergrund und frisst Energie.",
      "Aufgaben anfangen: Body-Doubling (jemand ist anwesend), 2-Minuten-Regel (nur starten, nicht abschließen), ersten Schritt definieren ('Dokument öffnen', nicht 'Text schreiben').",
      "Impuls/Wechsel: Kurze Stopp-Pause vor Reaktion (3 Sekunden atmen), dann nächste Aktion klar benennen. Nicht Impuls unterdrücken, sondern bewusst lenken."
    ],

    sensory: [
      "Trigger-Liste erstellen und 1–2 'große Hebel' reduzieren. Nicht alles auf einmal ändern – ein starker Reiz reduziert kann mehr bringen als zehn kleine Anpassungen.",
      "Sensorische Regulation aktiv nutzen: Was beruhigt Sie (Druck, Bewegung, Stille, Gewicht)? Das ist kein Luxus, sondern Werkzeug.",
      "Duft-/Reizmanagement pragmatisch: Duftfreie Produkte, ruhige Räume, Schutz in Belastungssituationen (Kopfhörer, Sonnenbrille). Ihr Komfort ist kein 'Empfindlichkeit', sondern Grundbedürfnis.",
      "Interozeption unterstützen: Timer/Check-ins für Essen/Trinken/Pausen – Körpersignale (Hunger, Durst, Harndrang) kommen bei vielen verspätet. Nicht warten bis es dringend wird."
    ],

    emotreg: [
      "Intensität früh abfangen: Stopp-Signale (Pause, Ortswechsel, Atemtechnik) bevor es kippt. Wenn Sie erst reagieren wenn's bei 100 ist, ist Regulation viel teurer.",
      "Nachklang einplanen: Nach emotionalen Situationen nicht direkt wieder volle Anforderungen. Geben Sie dem System Zeit zum Abklingen – 30 Min, 2 Stunden, je nach Intensität.",
      "Kurzstrategien bevorzugen: 60–120 Sekunden regulieren (Atem, Bewegung, Kälte), dann erst interpretieren. Runterfahren geht vor Verstehen.",
      "Bei starkem Wechsel: Trigger-Ketten identifizieren (Reiz → Gedanke → Körper → Verhalten) und an einer Stelle entkoppeln. Sie müssen nicht die ganze Kette durchbrechen, ein Glied reicht."
    ],

    attention: [
      "Interesse/Belohnung einbauen: Sinn klären (Warum wichtig?), kleine Belohnung setzen, Gamification nutzen. Interesse ist Ihr Motor – finden Sie einen Weg, ihn anzuwerfen.",
      "Kurze Arbeitsfenster statt 'durchziehen': Timeboxing (25 Min arbeiten, 5 Min Pause). Ihr System läuft besser in Sprints als in Marathons.",
      "Ablenkung nach Plan: Definierte 'Ablenkungsfenster' (10 Min Handy nach 50 Min Arbeit) statt Dauer-Fragmentierung. Ablenkung ist ok – unkontrollierte Ablenkung ist das Problem.",
      "Start erleichtern: Umfeld vorbereiten (alles Nötige bereit), dann 2–5 Minuten Einstieg. Perfektion kommt später, Anfangen kommt jetzt."
    ],

    structure: [
      "Routinen als Stabilisierung nutzen, aber flexibel absichern (Plan B). Starre Struktur bricht bei Störung, flexible Struktur federt ab.",
      "Änderungen ankündigen und in kleinen Schritten einführen. Ihr System braucht Vorlaufzeit – nicht weil Sie langsam sind, sondern weil Sie gründlicher verarbeiten.",
      "Komplexität reduzieren: Weniger parallele Projekte, klare Reihenfolge, weniger Kontextwechsel. Jeder Wechsel kostet, auch wenn er 'nur klein' ist.",
      "Wenn Struktur bricht: Recovery-Zeit einplanen, nicht sofort 'hart gegensteuern'. Das System braucht erst Ruhe, dann kann es wieder Struktur aufbauen."
    ],

    social: [
      "Soziale Dichte dosieren: Dauer, Anzahl, Pausen planen. Nicht als Schwäche, sondern als Energiemanagement. Sie sind nicht 'zu wenig belastbar' – andere brauchen nur weniger Energie dafür.",
      "Explizite Kommunikation bevorzugen: Erwartungen klären, Missverständnisse direkt ansprechen. Sie sind nicht 'zu direkt' – andere sind zu indirekt.",
      "Nach sozialen Ereignissen Erholung fest einplanen (nicht als Bonus, sondern als Teil des Termins). 2 Stunden Meeting = 2 Stunden Meeting + 1 Stunde Erholung.",
      "Wenn soziale Situationen 'teuer' sind: Setting ändern (kleiner, ruhiger, kürzer). Sie müssen nicht 'besser werden in sozialen Situationen' – Sie können die Situationen passender machen."
    ],

    alexithymia: [
      "Gefühle indirekt tracken: Körperzustand (angespannt/entspannt), Energie (voll/leer), Spannung, Reizbarkeit. Worte sind nur ein Zugang, nicht der einzige.",
      "Wörter reduzieren: Wenige Kategorien (z.B. 'ok/nicht ok', 'angespannt/ruhig'), dafür regelmäßig nutzen. Differenzierung kommt später, Orientierung kommt jetzt.",
      "Zeitversatz nutzen: Nach Situationen kurz protokollieren (Was war? Was im Körper? Was danach?). Gefühle zeigen sich oft erst im Nachhinein klarer.",
      "Bei hoher Intensität + schwerer Benennbarkeit: Externe Struktur (Coaching/Therapie/Hypnose) entlastet oft sofort. Sie müssen das nicht allein 'lernen' – Unterstützung ist Werkzeug, nicht Versagen."
    ],

    hyperfocus: [
      "Zeit- und Bedürfnis-Reminder setzen: Timer für Essen, Trinken, Pause. Hyperfokus schaltet Körpersignale leise – Sie brauchen externe Erinnerungen.",
      "Ausstiegshilfe vorbereiten: Klare Stopp-Regel (Wecker, feste Uhrzeit) + nächster Schritt notiert. Ausstieg ist schwerer als Einstieg – planen Sie ihn bewusst.",
      "Hyperfokus als Stärke gezielt einsetzen: Fokusfenster bewusst reservieren (beste Tageszeit, keine Störungen) und danach Recovery einplanen. Intensität erzeugt Leistung UND verbraucht Ressourcen.",
      "Wenn Ausstieg schwerfällt: Übergang ritualisieren (Timer → kurzer Abschluss → Notiz was als nächstes → körperlicher Reset wie aufstehen/dehnen). Nicht abrupt stoppen, sondern sanft ausleiten."
    ]
  }
}

};


/* =====================================================
   HERO-BESCHREIBUNGEN (ersetzt profile_descriptions.js)
   - Diese Map kann direkt aus der Hero-Logik genutzt werden.
   - Stil: präzise, bezogen auf Muster, ohne Normierungsbehauptungen.
===================================================== */

const PROFILE_DESCRIPTIONS = {

  adhd: {
    very_high: {
      title: "ADHS-nahes Kernprofil",
      description:
        "Ihre Antworten zeigen ein konsistentes ADHS-nahes Muster über mehrere Kernbereiche: interessengeleitete Aufmerksamkeit, " +
        "hoher exekutiver Aufwand im Alltag und starke Vertiefung bei persönlichem Interesse."
    },
    high: {
        title: "ADHS-nahes Kernprofil",
      description:
        "Mehrere ADHS-nahe Dimensionen sind deutlich erhöht. Das Muster passt gut zusammen und dürfte im Alltag spürbar sein."
    },
    medium: {
      title: "ADHS-nahe Tendenzen",
      description:
        "ADHS-nahe Merkmale sind erkennbar, aber nicht in allen Teilbereichen gleich stark. Kontext und Belastung können hier viel steuern."
    },
    low: {
      title: "Leichte ADHS-nahe Merkmale",
      description:
        "Einige ADHS-nahe Aspekte sind vorhanden, aber ohne klare Dominanz. Details unten sind wichtiger als ein Label."
    },
    very_low: {
      title: "ADHS-nahe Merkmale nicht dominant",
      description:
        "ADHS-nahe Muster stehen in Ihren Antworten nicht im Vordergrund."
    }
  },

  autism: {
    very_high: {
      title: "Autismus-nahes Kernprofil",
      description:
        "Ihre Antworten zeigen ein konsistentes autismus-nahes Muster: Reizverarbeitung, Struktur/ Vorhersehbarkeit und " +
        "sozial-analytische Verarbeitung sind gemeinsam deutlich erhöht."
    },
    high: {
        title: "Autismus-nahes Kernprofil",
      description:
        "Mehrere autismus-nahe Dimensionen sind deutlich erhöht. Das Muster ist stimmig und dürfte im Alltag spürbar sein."
    },
    medium: {
      title: "Autismus-nahe Tendenzen",
      description:
        "Autismus-nahe Merkmale sind erkennbar, aber nicht durchgehend dominant. Umweltpassung und Kompensation können hier viel erklären."
    },
    low: {
      title: "Leichte autismus-nahe Merkmale",
      description:
        "Einzelne autismus-nahe Aspekte sind vorhanden, aber ohne klare Dominanz."
    },
    very_low: {
      title: "Autismus-nahe Merkmale nicht dominant",
      description:
        "Autismus-nahe Muster stehen in Ihren Antworten nicht im Vordergrund."
    }
  },

  audhd: {
    very_high: {
      title: "AuDHD-Profil",
      description:
        "Ihre Antworten zeigen gleichzeitig deutlich erhöhte ADHS-nahe und autismus-nahe Bereiche. " +
        "Das spricht für ein konsistentes Mischmuster, das sich oft als Wechselspiel aus Strukturbedarf und schwankender Umsetzung zeigt."
    },
    high: {
      title: "Wahrscheinliches AuDHD-Profil",
      description:
        "ADHS-nahe und autismus-nahe Dimensionen sind beide deutlich erhöht. Strategien nur aus einer Richtung passen oft nicht vollständig."
    },
    medium: {
      title: "AuDHD-Tendenzen",
      description:
        "Beide Richtungen sind erkennbar, aber nicht eindeutig dominant. Die Detailbereiche und Muster sind hier zentral."
    },
    low: {
      title: "Leichte AuDHD-Überlappung",
      description:
        "Eine Überlappung ist erkennbar, aber ohne klare Dominanz."
    },
    very_low: {
      title: "Kein AuDHD-Muster im Vordergrund",
      description:
        "Eine deutliche gleichzeitige Dominanz beider Richtungen zeigt sich nicht."
    }
  },

  high_masking: {
    very_high: {
      title: "Hochmaskierungsprofil",
      description:
        "Ihre Antworten zeigen sehr hohen Anpassungsaufwand. Relevant ist oft die Diskrepanz zwischen äußerer Funktion und inneren Kosten."
    },
    high: {
      title: "Starke Maskierung",
      description:
        "Anpassung ist deutlich erhöht. Erholung und sichere Räume werden hier häufig zentral."
    },
    medium: {
      title: "Deutliche Maskierung",
      description:
        "Anpassung ist spürbar. Kosten können in Stressphasen stark steigen."
    },
    low: {
      title: "Moderate Anpassungsleistung",
      description:
        "Anpassung ist vorhanden, aber nicht dominierend."
    }
  },

  stress: {
    very_high: {
      title: "Starkes Überlastungsprofil",
      description:
        "Überlastung/Erholung ist sehr stark erhöht. Priorität ist häufig: Systemlast senken, Stabilität herstellen, dann sauberer einordnen."
    },
    high: {
      title: "Überlastungsprofil",
      description:
        "Überlastung ist deutlich erhöht. Die Belastungsdynamik kann andere Muster verstärken oder überlagern."
    },
    medium: {
      title: "Deutliche Belastung",
      description:
        "Belastung ist erkennbar. Kleine Entlastungen können große Wirkung haben."
    },
    low: {
      title: "Moderate Belastung",
      description:
        "Belastung tritt situationsabhängig auf."
    }
  },

  traits: {
    very_high: {
      title: "Mehrere Merkmale erkennbar ohne klare Dominanz",
      description:
        "Mehrere Merkmale sind deutlich, aber ohne klares Kernprofil. Kontext und Kompensation entscheiden häufig über Alltagseffekt."
    },
    high: {
      title: "Merkmale erkennbar",
      description:
        "Merkmale sind vorhanden, aber ohne klare Dominanz."
    },
    medium: {
      title: "Leichte Tendenzen",
      description:
        "Einige Bereiche sind moderat erhöht."
    },
    low: {
      title: "Sehr leichte Merkmale",
      description:
        "Nur geringe Abweichungen innerhalb dieser Skalen."
    }
  },

  disqualified: {
    adhd: {
      title: "Deutliches ADHS-ähnliches Muster (Auftreten nach 12)",
      description:
        "Ihre Antworten zeigen deutliche ADHS-ähnliche Merkmale: interessengeleitete Aufmerksamkeit, " +
        "hoher exekutiver Aufwand und starke Vertiefung bei Interesse. Das diagnostische Kriterium " +
        "für ADHS (Symptombeginn vor dem 12. Lebensjahr) ist jedoch nicht erfüllt."
    },
    
    autism_criteria_a: {
      title: "Autismus-nahes Muster ohne Diagnosekriterium",
      description:
        "Ihre Antworten zeigen ein starkes autismus-nahes Profil in Reizverarbeitung, Strukturbedarf " +
        "und sozialer Verarbeitung. DSM-5 Kriterium A (alle 3 Bereiche sozialer Kommunikation " +
        "müssen zutreffen) ist jedoch nicht vollständig erfüllt."
    },
    
    autism_criteria_b: {
      title: "Autismus-nahes Muster ohne Diagnosekriterium",
      description:
        "Ihre Antworten zeigen ein starkes autismus-nahes Profil in Reizverarbeitung, Strukturbedarf " +
        "und sozialer Verarbeitung. DSM-5 Kriterium B (mindestens 2 von 4 RRB-Bereichen) " +
        "ist jedoch nicht erfüllt."
    },
    
    audhd: {
      title: "AuDHD-ähnliches Muster ohne Diagnosekriterien",
      description:
        "Ihre Antworten zeigen eine deutliche Überlappung von ADHS-ähnlichen und autismus-ähnlichen Zügen. " +
        "Für ein kombiniertes AuDHD-Profil müssten jedoch beide Diagnosen unabhängig die jeweiligen " +
        "Kriterien erfüllen."
    }
  },

  single_dominant: {
    very_high: {
      title: (scale) => `Schwerpunkt: ${PROFILE_TEXTS.dominant_scale.names[scale] || "prägender Bereich"}`,
      description: (scale, score) => {
        const name = PROFILE_TEXTS.dominant_scale.names[scale] || "dieser Bereich";
        const base = PROFILE_TEXTS.dominant_scale.descriptions[scale] || "Dieser Bereich prägt Ihr Muster deutlich.";
        return `${name} ist im Verhältnis zu den anderen Skalen sehr hoch (${score}%). ${base}`;
      }
    },
    high: {
      title: (scale) => `Schwerpunkt: ${PROFILE_TEXTS.dominant_scale.names[scale] || "prägender Bereich"}`,
      description: (scale, score) =>
        `Dieser Bereich liegt deutlich über den anderen (${score}%) und prägt Ihr Muster spürbar.`
    },
    medium: {
      title: (scale) => `Schwerpunkt: ${PROFILE_TEXTS.dominant_scale.names[scale] || "prägender Bereich"}`,
      description: (scale, score) =>
        `Dieser Bereich ragt erkennbar heraus (${score}%) und steht im Vordergrund.`
    },
    low: {
      title: (scale) => `Schwerpunkt: ${PROFILE_TEXTS.dominant_scale.names[scale] || "prägender Bereich"}`,
      description: (scale, score) =>
        `Dieser Bereich ist etwas höher als die anderen (${score}%) und beeinflusst das Muster leicht.`
    }
  },

  mixed: {
    title: "Gemischtes Profil",
    description:
      "Ihre Ergebnisse verteilen sich über mehrere Bereiche ohne klare Dominanz. Das ist häufig. Die Details unten sind entscheidend."
  },

  unremarkable: {
    title: "Unauffälliges Profil",
    description:
      "Ihre Werte liegen überwiegend im mittleren Bereich dieser Skalen. Es zeigt sich kein dominantes Muster in den abgefragten Dimensionen."
  }
};

// --- Aliase: canonical keys ---
PROFILE_DESCRIPTIONS.overload = PROFILE_DESCRIPTIONS.stress;
PROFILE_DESCRIPTIONS.masking  = PROFILE_DESCRIPTIONS.high_masking;

export { PROFILE_TEXTS, PROFILE_DESCRIPTIONS };

