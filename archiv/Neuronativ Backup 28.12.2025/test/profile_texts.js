// profile_texts.js
// Allgemeine Texte und Erklärungen für das Profiling-System

const PROFILE_TEXTS = {

  /* =====================================================
     1. ALLGEMEINE EINLEITUNG
  ===================================================== */
  
  introduction: {
    title: "Wie funktioniert dieses Profiling?",
    
    methodology: `Dieses Profil basiert auf einem wissenschaftlich fundierten Modell, das Ihre Antworten aus 10 verschiedenen 
    Bereichen neurodivergenter Kognition auswertet. Die Analyse erfolgt in mehreren Schritten: Zunächst werden Ihre Rohwerte 
    in jedem Bereich normiert (50% entspricht dem Bevölkerungsdurchschnitt), dann werden thematisch zusammenhängende Bereiche 
    zu vier Hauptclustern verdichtet. Anschließend erkennt ein Musterkennungssystem spezifische Kombinationen, die auf 
    bestimmte neurodivergente Profile hinweisen können.`,
    
    interpretation: `Wichtig zu verstehen: Ein hoher Wert in einem Cluster bedeutet nicht automatisch eine "Störung", sondern 
    zeigt an, dass Ihre Wahrnehmung, Informationsverarbeitung oder Selbstregulation in diesem Bereich vom statistischen 
    Durchschnitt abweicht. Neurodivergenz beschreibt eine andere Art der Kognition, nicht per se eine Einschränkung. Ob diese 
    Unterschiede als belastend erlebt werden oder nicht, hängt stark von Kontext, Kompensationsstrategien und Umweltfaktoren ab.`,
    
    limitations: `Dieses Screening-Tool dient der Orientierung und Selbstreflexion. Es kann keine professionelle Diagnostik 
    ersetzen, da formale Diagnosen nach ICD-11 oder DSM-5 eine umfassende klinische Untersuchung, Verhaltensbeobachtung und 
    Differentialdiagnostik durch qualifizierte Fachpersonen erfordern. Die Ergebnisse können jedoch als Gesprächsgrundlage für 
    ärztliche oder therapeutische Abklärung dienen.`
  },

  /* =====================================================
     2. CLUSTER-ERKLÄRUNGEN
  ===================================================== */
  
  clusters: {
    
    adhd: {
      name: "ADHS-Cluster",
      
      description: `Dieses Cluster erfasst Merkmale, die mit der Aufmerksamkeitsdefizit-/Hyperaktivitätsstörung (ADHS) 
      assoziiert sind. Es vereint drei zentrale Bereiche: Die Fähigkeit zur Aufmerksamkeitssteuerung (interessenbasiert 
      vs. anforderungsbasiert), die exekutiven Funktionen (Arbeitsgedächtnis, Handlungsplanung, Impulskontrolle) und das 
      Phänomen des Hyperfokus (intensive Vertiefung bei intrinsischem Interesse). ADHS ist keine Aufmerksamkeitsstörung 
      im Sinne eines Defizits, sondern eine andere Form der Aufmerksamkeitsregulation, die stark vom inneren Interesse 
      und der Dopamin-Verfügbarkeit abhängt.`,
      
      scales_included: [
        "Aufmerksamkeit & Selbstregulation",
        "Exekutivfunktionen", 
        "Hyperfokus & Spezialinteressen"
      ],
      
      what_high_means: `Ein hoher Wert zeigt, dass Ihre Aufmerksamkeit stark kontextabhängig arbeitet, exekutive Funktionen 
      wie Arbeitsgedächtnis oder Impulskontrolle Sie mehr Energie kosten als andere, und Sie zu intensiver Vertiefung neigen, 
      wenn etwas Sie fasziniert. Dies kann auf ADHS hinweisen, tritt aber auch bei Hochbegabung, chronischem Stress oder als 
      Kompensation bei Autismus auf.`,
      
      what_low_means: `Ein niedriger Wert bedeutet, dass Sie Ihre Aufmerksamkeit relativ unabhängig vom inneren Interesse 
      steuern können, exekutive Funktionen stabil arbeiten und Vertiefung gut dosierbar bleibt. ADHS-typische Merkmale sind 
      in Ihrem Profil wenig ausgeprägt.`
    },
    
    autism: {
      name: "Autismus-Cluster",
      
      description: `Dieses Cluster bildet Merkmale ab, die mit dem Autismus-Spektrum assoziiert sind. Es umfasst sensorische 
      Verarbeitungsbesonderheiten (erhöhte oder verminderte Sensibilität für Sinnesreize), Unterschiede in der sozialen 
      Informationsverarbeitung (analytisch vs. intuitiv, Präferenz für Klarheit und Vorhersehbarkeit) sowie das Bedürfnis 
      nach Struktur und Routine. Autismus ist keine soziale Störung, sondern eine andere neurologische Verarbeitungsweise, 
      die sich auf Wahrnehmung, Denken und soziale Kognition auswirkt.`,
      
      scales_included: [
        "Sensorische Empfindlichkeit",
        "Soziale Wahrnehmung",
        "Struktur & Sicherheit"
      ],
      
      what_high_means: `Ein hoher Wert zeigt, dass Sie sensorische Reize intensiver verarbeiten als andere, soziale Situationen 
      eher analytisch als intuitiv erfassen und Vorhersehbarkeit sowie klare Strukturen für Ihr inneres Gleichgewicht wichtig 
      sind. Dies kann auf Autismus hinweisen, tritt aber auch bei Hochsensibilität (HSP) oder nach traumatischen Erfahrungen auf.`,
      
      what_low_means: `Ein niedriger Wert bedeutet, dass Sinnesreize Sie wenig belasten, Sie soziale Signale intuitiv erfassen 
      und flexibel mit Veränderungen umgehen können. Autismus-typische Merkmale sind in Ihrem Profil wenig ausgeprägt.`
    },
    
    emotional: {
      name: "Emotionale Verarbeitung",
      
      description: `Dieses Cluster erfasst zwei miteinander verbundene Bereiche: Die Fähigkeit, eigene Emotionen wahrzunehmen 
      und zu benennen (Alexithymie-Spektrum), sowie die Regulation emotionaler Intensität und Dauer. Beide Phänomene treten 
      häufig sowohl bei ADHS als auch bei Autismus auf und sind keine eigenständigen Störungen, sondern Merkmale, die sich aus 
      unterschiedlicher neuronaler Verarbeitung ergeben. Emotionale Dysregulation bei ADHS zeigt sich oft in schnellen, intensiven 
      Wechseln, während Alexithymie bei Autismus eher mit verzögerter bewusster Verarbeitung einhergeht.`,
      
      scales_included: [
        "Emotionswahrnehmung (Alexithymie)",
        "Emotionale Regulation"
      ],
      
      what_high_means: `Ein hoher Wert zeigt, dass Sie eigene Gefühle schwerer in Worte fassen können oder erst verzögert bewusst 
      wahrnehmen, und/oder dass emotionale Intensität, Dauer oder Wechsel schwer zu steuern sind. Dies tritt sowohl bei ADHS 
      (emotionale Dysregulation) als auch bei Autismus (Interozeptionsschwierigkeiten) auf und kann durch chronischen Stress 
      oder Traumata verstärkt werden.`,
      
      what_low_means: `Ein niedriger Wert bedeutet, dass Sie eigene Emotionen gut wahrnehmen, benennen und regulieren können. 
      Gefühle bleiben im handhabbaren Bereich und beeinträchtigen Ihr Denken oder Handeln kaum.`
    },
    
    compensation: {
      name: "Kompensation & Belastung",
      
      description: `Dieses Cluster erfasst keine Kernsymptome, sondern Folge- und Anpassungsphänomene. Maskierung beschreibt 
      bewusste oder unbewusste Anpassung des eigenen Verhaltens an neurotypische Erwartungen, oft verbunden mit hohem Energieaufwand 
      und verzögerter Erschöpfung. Überlastung (Overload) zeigt, wie schnell sensorische oder emotionale Reize das innere System 
      überfordern und wie lange Erholung benötigt wird. Beide Phänomene sind keine eigenständigen Merkmale, sondern entstehen durch 
      den Versuch, in einer nicht passgenauen Umwelt zu funktionieren.`,
      
      scales_included: [
        "Maskierung & Anpassung",
        "Sensorische & emotionale Überlastung"
      ],
      
      what_high_means: `Ein hoher Wert zeigt, dass Sie viel Energie in soziale Anpassung investieren (was nach außen oft unsichtbar 
      bleibt) und/oder dass Ihre Belastungsgrenzen niedriger liegen als bei anderen, sodass Erholung mehr Zeit braucht. Hohe Werte 
      hier sind oft eine Folge unerkannter Neurodivergenz oder chronischer Überforderung. Sie weisen darauf hin, dass äußere 
      Funktionsfähigkeit nicht mit innerem Wohlbefinden gleichzusetzen ist.`,
      
      what_low_means: `Ein niedriger Wert bedeutet, dass Sie wenig bewusste Anpassung leisten müssen, um sozial zu funktionieren, 
      und dass Ihre Belastungsgrenzen im durchschnittlichen Bereich liegen. Kompensation spielt in Ihrem Alltag keine zentrale Rolle.`
    }
  },

  /* =====================================================
     3. PROFIL-TYPEN ALLGEMEIN
  ===================================================== */
  
  profile_types: {
    
    adhd: {
      name: "ADHS-Profil",
      
      general_description: `Ein ADHS-Profil liegt vor, wenn das ADHS-Cluster deutlich erhöht ist, während das Autismus-Cluster 
      im unteren bis mittleren Bereich bleibt. ADHS (Aufmerksamkeitsdefizit-/Hyperaktivitätsstörung) beschreibt eine neurobiologische 
      Besonderheit, die sich auf Aufmerksamkeitssteuerung, exekutive Funktionen und emotionale Regulation auswirkt. Der Begriff 
      "Defizit" ist irreführend – es handelt sich nicht um einen Mangel an Aufmerksamkeit, sondern um eine andere Form der 
      Aufmerksamkeitsregulation, die stark vom inneren Interesse (Dopamin-getrieben) abhängt.`,
      
      key_characteristics: `ADHS zeigt sich in interessenbasierter Aufmerksamkeit (bei intrinsischer Motivation außergewöhnlich 
      fokussiert, bei fremdbestimmten Anforderungen schwer aufrechtzuerhalten), erhöhtem Energieaufwand für exekutive Funktionen 
      (Arbeitsgedächtnis, Handlungsplanung, Impulskontrolle), emotionaler Dysregulation (schnelle, intensive Wechsel), und der 
      Fähigkeit zu Hyperfokus bei persönlich bedeutsamen Themen. Wichtig: ADHS-Merkmale sind nicht immer sichtbar – viele 
      Betroffene entwickeln Kompensationsstrategien, die nach außen funktional wirken, aber viel innere Energie kosten.`,
      
      subtypes: `ADHS zeigt sich in verschiedenen Ausprägungen: Der primär unaufmerksame Typ (früher ADS) ist nach außen oft 
      unauffällig, da Unruhe eher innerlich bleibt. Der hyperaktiv-impulsive Typ zeigt sich in motorischer oder verbaler Unruhe. 
      Der kombinierter Typ vereint beide Merkmale. Diese Kategorisierung ist jedoch vereinfachend – die meisten Menschen zeigen 
      Mischformen, und Ausprägung kann sich über die Lebensspanne verändern.`
    },
    
    autism: {
      name: "Autismus-Profil",
      
      general_description: `Ein Autismus-Profil liegt vor, wenn das Autismus-Cluster deutlich erhöht ist, während das ADHS-Cluster 
      im unteren bis mittleren Bereich bleibt. Autismus (Autismus-Spektrum-Störung, ASS) beschreibt eine neurologische Entwicklungs-
      variante, die sich auf Wahrnehmung, Informationsverarbeitung und soziale Kognition auswirkt. Der Begriff "Spektrum" verweist 
      auf die große Bandbreite individueller Ausprägungen – von Menschen, die im Alltag kaum Unterstützung benötigen, bis zu solchen 
      mit hohem Hilfebedarf.`,
      
      key_characteristics: `Autismus zeigt sich in sensorischen Verarbeitungsbesonderheiten (erhöhte oder verminderte Empfindlichkeit 
      für Sinnesreize), Unterschieden in der sozialen Informationsverarbeitung (analytisch-systematisch statt intuitiv-spontan, 
      Präferenz für explizite Kommunikation), Bedürfnis nach Vorhersehbarkeit und Struktur, sowie oft spezifischen, intensiven 
      Interessen. Wichtig: Autismus ist keine soziale Störung im Sinne mangelnden Interesses an Kontakt, sondern eine andere Art, 
      soziale Informationen zu verarbeiten. Viele autistische Menschen wünschen sich soziale Verbindung, finden aber konventionelle 
      Sozialformen anstrengend oder andurchsichtig.`,
      
      masking: `Besonders bei weiblicher oder nicht-binärer Sozialisation wird Autismus häufig spät oder gar nicht erkannt, da 
      Betroffene intensive Kompensationsstrategien (Maskierung) entwickeln. Diese können jahrzehntelang funktionieren, führen aber 
      oft zu verzögerter Erschöpfung, Burnout oder psychischen Folgeerkrankungen. Maskierung bedeutet: Bewusstes Imitieren 
      neurotypischer Sozialformen, Unterdrückung eigener sensorischer oder emotionaler Bedürfnisse, ständige Selbstbeobachtung 
      und Anpassung. Dies ist keine bewusste Täuschung, sondern ein erlernter Überlebensmechanismus in einer nicht-autistischen Umwelt.`
    },
    
    audhd: {
      name: "AuDHD-Profil",
      
      general_description: `Ein AuDHD-Profil (auch: Autismus + ADHS, AuDHS) liegt vor, wenn sowohl das ADHS-Cluster als auch das 
      Autismus-Cluster deutlich erhöht sind. Lange galt dies als unmöglich (DSM-IV schloss beides aus), aber aktuelle Forschung 
      zeigt: 50-70% der autistischen Menschen erfüllen auch ADHS-Kriterien, und umgekehrt. AuDHD ist nicht einfach die Addition 
      beider "Störungen", sondern ein eigenständiges Profil mit spezifischen Merkmalen, die über die Summe hinausgehen.`,
      
      key_characteristics: `AuDHD zeigt paradoxe Kombinationen: Bedürfnis nach Struktur (Autismus) trifft auf schwankende exekutive 
      Funktionen (ADHS). Hyperfokus (beide) kann extrem intensiv werden. Soziale Erschöpfung (Autismus) kombiniert mit emotionaler 
      Dysregulation (ADHS) führt zu besonders hoher Überlastung. Sensorische Sensibilität (Autismus) trifft auf reduzierte 
      Impulskontrolle (ADHS), was Selbstregulation erschwert. Maskierung wird oft besonders intensiv eingesetzt, da zwei 
      Richtungen kompensiert werden müssen.`,
      
      unique_challenges: `Menschen mit AuDHD erleben oft, dass Strategien, die für ADHS oder Autismus allein hilfreich sind, bei 
      ihnen nicht funktionieren oder sich widersprechen. Routinen (hilfreich bei Autismus) scheitern an exekutiven Schwierigkeiten 
      (ADHS). Flexibilität (hilfreich bei ADHS) überfordert das Bedürfnis nach Vorhersehbarkeit (Autismus). Diese inneren Widersprüche 
      führen oft zu Selbstzweifeln oder dem Gefühl, "nicht richtig" autistisch oder ADHS zu sein. Tatsächlich ist AuDHD ein kohärentes, 
      eigenständiges neurologisches Profil.`
    },
    
    high_masking: {
      name: "Hochmaskiertes Profil",
      
      general_description: `Ein hochmaskiertes Profil liegt vor, wenn das Kompensations-Cluster sehr hoch ist, auch wenn andere 
      Cluster mittlere bis hohe Werte zeigen. Maskierung (auch: Camouflaging) beschreibt bewusste oder unbewusste Anpassung des 
      eigenen Verhaltens, um neurotypische Erwartungen zu entsprechen. Dies ist keine bewusste Täuschung, sondern oft ein erlernter 
      Schutzmechanismus, der über Jahre automatisiert wurde. Besonders häufig bei weiblicher, nicht-binärer oder kulturell minoritärer 
      Sozialisation.`,
      
      key_characteristics: `Hochmaskierung zeigt sich in starker Diskrepanz zwischen äußerer Funktionsfähigkeit und innerem Erleben. 
      Nach außen wirken Betroffene sozial kompetent, organisiert und angepasst, während innerlich hohe Anspannung, Erschöpfung oder 
      Desorientierung besteht. Soziale Situationen werden mental vorbereitet, Reaktionen eingeübt, eigene Bedürfnisse zurückgestellt. 
      Diese Anpassungsleistung bleibt für andere meist unsichtbar, weshalb Erschöpfung oder Zusammenbrüche als "überraschend" oder 
      "unerklärlich" wahrgenommen werden.`,
      
      consequences: `Langfristige Maskierung führt häufig zu verzögerter Diagnose (oft erst im Erwachsenenalter), Burnout, 
      Depressionen, Angststörungen oder Identitätskrisen. Viele Betroffene berichten, nicht mehr zu wissen, wer sie "wirklich" sind, 
      da authentisches Verhalten so lange unterdrückt wurde. Das Risiko für Suizidalität ist bei hochmaskierten neurodivergenten 
      Menschen deutlich erhöht. Gleichzeitig ermöglicht Maskierung oft gesellschaftliche Teilhabe und schützt vor Diskriminierung – 
      eine ambivalente Strategie mit hohem persönlichem Preis.`
    },
    
    stress: {
      name: "Belastungsprofil",
      
      general_description: `Ein Belastungsprofil liegt vor, wenn das Kompensations-Cluster oder spezifische Überlastungsmerkmale 
      dominant sind, während die Kernsymptom-Cluster (ADHS/Autismus) weniger ausgeprägt erscheinen. Dies kann bedeuten: Aktuelle 
      extreme Belastung überlagert zugrundeliegende neurodivergente Merkmale, oder die Merkmale sind primär stressbedingt und nicht 
      neurodevelopmental. Differenzierung ist wichtig, da Behandlung und Perspektive sich unterscheiden.`,
      
      key_characteristics: `Chronischer Stress, Trauma oder Burnout können ADHS- oder Autismus-ähnliche Symptome erzeugen: Konzentrations-
      schwierigkeiten, emotionale Dysregulation, sensorische Überlastung, soziale Erschöpfung. Der zentrale Unterschied liegt im 
      zeitlichen Verlauf: Neurodivergenz besteht meist seit Kindheit/Jugend (auch wenn erst spät erkannt), während stressbedingte 
      Symptome sich nach spezifischen Belastungsereignissen entwickeln oder verstärken. Wichtig: Stress kann auch bestehende 
      Neurodivergenz sichtbar machen, die vorher kompensiert war.`,
      
      differentiation: `Zur Unterscheidung wichtig: Beginn der Symptome (Kindheit vs. Erwachsenenalter), Kontextabhängigkeit 
      (immer vs. nur in belastenden Situationen), Erholung (bleiben Symptome auch nach Entlastung), familiäre Häufung 
      (Neurodivergenz ist erblich). Im Zweifel: Nach Stabilisierung Re-Evaluation erwägen. Beide Perspektiven schließen sich nicht 
      aus – neurodivergente Menschen können zusätzlich trauma- oder stressbedingte Symptome entwickeln.`
    },
    
    traits: {
      name: "Subklinisches Profil (Traits)",
      
      general_description: `Ein subklinisches Profil liegt vor, wenn neurodivergente Merkmale erkennbar sind (Werte leicht über 
      Durchschnitt), aber nicht das Ausmaß erreichen, das typischerweise mit klinischer Diagnose oder signifikanter Beeinträchtigung 
      einhergeht. "Subklinisch" bedeutet nicht "unbedeutend", sondern: Die Merkmale sind vorhanden, aber möglicherweise gut kompensiert, 
      kontextabhängig auftretend, oder tatsächlich wenig beeinträchtigend. Dies wird auch als "Broader Autism Phenotype" (BAP) oder 
      "ADHS-Traits" bezeichnet.`,
      
      key_characteristics: `Menschen mit subklinischen Merkmalen zeigen oft spezifische Präferenzen oder Sensibilitäten: Leichte 
      sensorische Empfindlichkeiten, Präferenz für Struktur oder Routinen, leicht erhöhte soziale Erschöpfung, interesse-basierte 
      Aufmerksamkeit. Diese Merkmale sind im Alltag erkennbar, führen aber nicht zu gravierender Beeinträchtigung in Beruf, 
      Beziehungen oder Selbstfürsorge. Oft entwickeln Betroffene intuitiv passende Strategien oder wählen Umfelder, die zu ihren 
      Bedürfnissen passen.`,
      
      when_to_seek_help: `Eine formale Diagnose ist nicht zwingend notwendig, wenn keine Beeinträchtigung besteht. Sinnvoll wird 
      Abklärung bei: Zunehmender Belastung (z.B. durch Lebensübergänge, neue Anforderungen), Zusammenbruch bisheriger Kompensations-
      strategien, Wunsch nach Selbstverständnis oder externer Validierung, Zugang zu Unterstützungsleistungen. Selbstverständnis 
      als neurodivergent kann auch ohne formale Diagnose hilfreich sein, wenn es Selbstakzeptanz und passende Anpassungen ermöglicht.`
    }
  },

  // =========================
  // UI & RENDER TEXTE
  // =========================
  ui: {
        hero: {
      main_title_fallback: 'Individuelles Neurodivergenz-Profil',

      confidence_label: 'Konfidenz der Einordnung: {confidence}%',

      description: {
  very_low: 'Ihre Antworten zeigen keine ausgeprägten neurodivergenten Merkmale. Die niedrigen Werte in allen Bereichen deuten auf eine neurotypische Verarbeitung hin oder darauf, dass die Fragen nicht auf Ihre Situation zutreffen.',
  
  low: 'Ihre Antworten zeigen einige neurodivergente Merkmale, die jedoch nicht stark ausgeprägt sind. Das Muster ist nicht eindeutig und könnte auf subklinische Traits hinweisen.',
  
  moderate: 'Ihre Antworten zeigen deutliche neurodivergente Merkmale in mehreren Bereichen. Im Folgenden sehen Sie, wie diese sich zu einem Gesamtprofil zusammenfügen.',
  
  high: 'Ihre Antworten ergeben ein klares Muster neurodivergenter Merkmale. Im Folgenden sehen Sie, wie diese sich zu einem Gesamtprofil zusammenfügen und was das für Sie bedeuten kann.',
  
  default: 'Ihre Antworten ergeben ein erkennbares Muster. Im Folgenden sehen Sie die Auswertung Ihrer Ergebnisse.',
  
  single_dominant: 'Ihre Ergebnisse zeigen ein sehr klares Muster mit einem dominanten Bereich, der Ihr Profil prägt. Im Folgenden sehen Sie die detaillierte Auswertung.',

  adhd: 'Ihre Auswertung zeigt ein Profil mit interessenbasierter Aufmerksamkeit, hohem Energieaufwand für Alltagsaufgaben und oft intensiver Vertiefung bei persönlich bedeutsamen Themen.',
  
  autism: 'Ihre Auswertung zeigt ein Profil mit intensiver Sinneswahrnehmung, Bedürfnis nach Klarheit und Struktur sowie analytischer Verarbeitung sozialer Informationen.',
  
  audhd: 'Ihre Auswertung zeigt eine Mischform aus ADHS- und Autismus-Merkmalen – ein eigenständiges AuDHD-Profil mit oft inneren Widersprüchen, aber auch besonderen Stärken.',
  
  fallback: 'Ihr Profil zeigt erkennbare neurodivergente Merkmale, die jedoch nicht eindeutig einem der klassischen Profile (ADHS, Autismus oder AuDHD) zugeordnet werden können. Das ist völlig normal – viele Menschen haben eine einzigartige Kombination. Ihr Profil ist genauso gültig. Im Folgenden sehen Sie, welche Bereiche bei Ihnen besonders ausgeprägt sind.'
},
      no_data: 'Keine Testergebnisse gefunden. Bitte schließen Sie den Test ab und klicken Sie auf "Zu den Profilen".'
    },

    onset: {
      label: 'Zeitlicher Beginn der Merkmale:',
      unsure: 'Zeitpunkt unklar – dies ist selbst ein häufiges Merkmal und kein Fehler',
      childhood: 'Seit Kindheit',
      youth: 'Seit Jugend',
      adult: 'Seit Erwachsenenalter',
      recent: 'Kürzlich aufgetreten'
    },

    discrepancy: {
      section_title: 'Besondere Muster & Hinweise',
      icon: '⚠️',
      flag_labels: {
        consider_differential: 'Weitere Abklärung empfohlen',
        social_anxiety_likely: 'Soziale Komponente beachten',
        monitor_burnout_risk: 'Burnout-Risiko beobachten',
        reassess_after_recovery: 'Re-Test nach Erholung empfohlen',
        autism_marker: 'Autismus-typisches Muster',
        adhd_trauma_likely: 'ADHS oder Trauma wahrscheinlich',
        subclinical_traits: 'Subklinische Merkmale',
        urgent_intervention_needed: '⚠️ DRINGEND: Intervention empfohlen',
    complex_emotional_pattern: 'Komplexes emotionales Muster',
    monitor_delayed_burnout: 'Verzögertes Burnout-Risiko',
    check_historical_hyperfocus: 'Hyperfokus-Veränderung prüfen',
    autism_specific_structure_need: 'Autismus-spezifisches Strukturbedürfnis',
    autism_sensory_emotional_pattern: 'Sensorisch-emotionales Autismus-Muster',
    urgent_professional_assessment: '⚠️ DRINGEND: Professionelle Diagnostik'
      }
    },

    sections: {
      cluster_title: 'Cluster-Auswertung',
      detail_title: 'Detail-Profile',
      reasoning_title: 'Grundlage der Einordnung',
      patterns_title: 'Erkannte Muster',
      next_steps_title: 'Empfohlene nächste Schritte'
    },

    status: {
      primary: 'Primär',
      secondary: 'Sekundär',
      low: 'Nicht ausgeprägt'
    },

    buttons: {
      pdf: 'Als PDF speichern',
      close: 'Fenster schließen',
      methodology: 'Zur Methodik'
    },

    disclaimer: 'Wichtiger Hinweis: Dieses Profil basiert auf einem Selbsteinschätzungs-Screening und ersetzt keine professionelle Diagnostik. Die Ergebnisse dienen der Orientierung und können als Gesprächsgrundlage für fachärztliche Abklärung genutzt werden. Eine formale Diagnose kann nur durch qualifizierte Fachpersonen (Psychiatrie, Neurologie, spezialisierte Psychologie) gestellt werden.'
  }

};  // Schließt PROFILE_TEXTS

export { PROFILE_TEXTS };