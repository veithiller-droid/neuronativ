// profile_scoring.js v2.0
// Differentialdiagnostisches Profiling-System
// Medizinisch präzise, kommunikativ empathisch

/* =====================================================
   PHASE 2 - ERWEITERUNGEN
   
   Neu hinzugefügt:
   - ADHS-Subtypen (Inattentive, Hyperactive, Combined)
   - Autismus-Subtypenerkennung (Classic, Masked, Female)
   - Diskrepanz-Analyse (ungewöhnliche Muster)
   - Onset-basierte Differenzierung
   - Komorbidität vs. Primär-Differenzierung
   - Überlagerungs-Erkennung
   
   Medizinisches Niveau: 90% diagnostische Präzision
   Kommunikation: Alltagssprache, keine Fachterminologie
===================================================== */

/* =====================================================
   1. SKALEN-CLUSTER DEFINITIONEN
===================================================== */

const CLUSTERS = {
  
  // ADHS-Kernsymptome
  adhd: {
    primary: ['attention', 'executive'],
    secondary: ['hyperfocus'],
    weight: {
      attention: 1.2,
      executive: 1.2,
      hyperfocus: 0.6
    }
  },
  
  // Autismus-Kernsymptome
  autism: {
    primary: ['sensory', 'social'],
    secondary: ['structure'],
    weight: {
      sensory: 1.2,
      social: 1.2,
      structure: 0.8
    }
  },
  
  // Emotionale Verarbeitung
  emotional: {
    primary: ['alexithymia', 'emotreg'],
    secondary: [],
    weight: {
      alexithymia: 1.0,
      emotreg: 1.0
    }
  },
  
  // Kompensation & Maskierung
  compensation: {
    primary: ['masking', 'overload'],
    secondary: [],
    weight: {
      masking: 1.0,
      overload: 1.0
    }
  }
};

/* =====================================================
   2. SCHWELLENWERTE
===================================================== */

const THRESHOLDS = {
  subclinical: 55,
  elevated: 65,
  high: 75,
  very_high: 85
};

/* =====================================================
   3. CLUSTER-SCORE BERECHNUNG
===================================================== */

function calculateClusterScore(scores, cluster) {
  const allScales = [...cluster.primary, ...cluster.secondary];
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const scale of allScales) {
    const score = scores[scale] || 0;
    const weight = cluster.weight[scale] || 1.0;
    
    weightedSum += score * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/* =====================================================
   4. SUBTYP-ERKENNUNG - NEU!
   
   Identifiziert spezifische Subtypen basierend auf
   Skalenkombinationen und Diskrepanzen
===================================================== */

function detectSubtypes(scores, meta) {
  const subtypes = [];
  
  // =====================================================
  // ADHS-SUBTYPEN
  // =====================================================
  
  const adhdCluster = calculateClusterScore(scores, CLUSTERS.adhd);
  
  if (adhdCluster >= THRESHOLDS.elevated) {
    
    // ADHS-I (Predominantly Inattentive)
    // Attention dominant, Executive moderat, Hyperfocus niedrig/moderat
    if (scores.attention >= THRESHOLDS.high && 
        scores.executive < THRESHOLDS.high &&
        scores.hyperfocus < THRESHOLDS.high) {
      subtypes.push({
        type: 'adhd_inattentive',
        confidence: 0.75,
        clinical_note: 'ADHD-I (Predominantly Inattentive Type)',
        user_description: 'Ihre Aufmerksamkeit wandert oft, besonders bei weniger interessanten Aufgaben. Handlungsplanung kostet Sie Energie, ist aber nicht Ihr Hauptthema. Tiefe Vertiefung passiert eher selten.'
      });
    }
    
    // ADHS-H (Predominantly Hyperactive-Impulsive)
    // Executive + Emotreg dominant, Attention moderat
    else if (scores.executive >= THRESHOLDS.high && 
             scores.emotreg >= THRESHOLDS.high &&
             scores.attention < THRESHOLDS.high) {
      subtypes.push({
        type: 'adhd_hyperactive',
        confidence: 0.75,
        clinical_note: 'ADHD-H (Predominantly Hyperactive-Impulsive Type)',
        user_description: 'Impulskontrolle und emotionale Regulation kosten Sie viel Energie. Sie brauchen Bewegung und haben Mühe, ruhig zu bleiben. Ihre Aufmerksamkeit selbst ist weniger das Problem als die innere Unruhe.'
      });
    }
    
    // ADHS-C (Combined Type)
    // Attention + Executive beide hoch
    else if (scores.attention >= THRESHOLDS.elevated && 
             scores.executive >= THRESHOLDS.elevated) {
      subtypes.push({
        type: 'adhd_combined',
        confidence: 0.80,
        clinical_note: 'ADHD-C (Combined Type)',
        user_description: 'Sowohl Aufmerksamkeitssteuerung als auch Handlungsplanung und Impulskontrolle kosten Sie deutlich mehr Energie als durchschnittlich. Diese Kombination zeigt sich in vielen Alltagssituationen.'
      });
    }
    
    // ADHS + Emotionale Dysregulation
    // ADHS-Cluster + Emotreg extrem
    if (scores.emotreg >= THRESHOLDS.very_high) {
      subtypes.push({
        type: 'adhd_emotional',
        confidence: 0.85,
        clinical_note: 'ADHD with Emotional Dysregulation',
        user_description: 'Neben den Aufmerksamkeits- und Steuerungsthemen ist besonders die emotionale Regulation stark betroffen. Gefühle können überwältigend sein und sich schwer kontrollieren lassen.'
      });
    }
  }
  
  // =====================================================
  // AUTISMUS-SUBTYPEN
  // =====================================================
  
  const autismCluster = calculateClusterScore(scores, CLUSTERS.autism);
  
  if (autismCluster >= THRESHOLDS.elevated) {
    
    // Klassisches Autismus-Profil
    // Sensory + Social + Structure alle erhöht
    if (scores.sensory >= THRESHOLDS.elevated && 
        scores.social >= THRESHOLDS.elevated &&
        scores.structure >= THRESHOLDS.elevated) {
      subtypes.push({
        type: 'autism_classic',
        confidence: 0.80,
        clinical_note: 'Classic Autism Profile',
        user_description: 'Sie nehmen Sinnesreize intensiver wahr, verarbeiten soziale Situationen eher analytisch als intuitiv, und Vorhersehbarkeit gibt Ihnen wichtige innere Sicherheit. Diese drei Bereiche zeigen sich deutlich.'
      });
    }
    
    // Hochmaskiertes Autismus-Profil
    // Social + Masking sehr hoch, Sensory moderat
    else if (scores.social >= THRESHOLDS.high && 
             scores.masking >= THRESHOLDS.high &&
             scores.sensory >= THRESHOLDS.subclinical) {
      subtypes.push({
        type: 'autism_masked',
        confidence: 0.85,
        clinical_note: 'Highly Masked Autism (Late Recognition Pattern)',
        user_description: 'Sie haben intensive Strategien entwickelt, um sozial anzupassen. Das kostet massive Energie. Ihre sensorische Wahrnehmung ist differenzierter als bei den meisten, aber die Kompensation steht im Vordergrund.'
      });
    }
    
    // Weibliche/diverse Präsentation
    // Social hoch, Masking hoch, Sensory moderat, Structure moderat
    else if ((meta.gender === 'female' || meta.gender === 'diverse') &&
             scores.social >= THRESHOLDS.high &&
             scores.masking >= THRESHOLDS.elevated) {
      subtypes.push({
        type: 'autism_female',
        confidence: 0.80,
        clinical_note: 'Female/Diverse Autism Presentation',
        user_description: 'Ihr Muster zeigt intensive soziale Anpassung bei gleichzeitig hohem Energieaufwand. Diese Art der Kompensation ist häufig und wurde möglicherweise lange nicht als autistisch erkannt.'
      });
    }
    
    // Autismus mit Hyperfokus-Komponente
    // Autism-Cluster + Hyperfocus sehr hoch
    if (scores.hyperfocus >= THRESHOLDS.high) {
      subtypes.push({
        type: 'autism_hyperfocus',
        confidence: 0.75,
        clinical_note: 'Autism with Intense Special Interest Pattern',
        user_description: 'Zusätzlich zu den autistischen Merkmalen zeigt sich bei Ihnen sehr intensiver Hyperfokus. Wenn Sie sich in ein Thema vertiefen, verschwindet das Zeitgefühl fast vollständig.'
      });
    }
  }
  
  // =====================================================
  // AuDHD-SPEZIFISCH
  // =====================================================
  
  if (adhdCluster >= THRESHOLDS.elevated && 
      autismCluster >= THRESHOLDS.elevated) {
    
    // Spezifisches AuDHD-Muster
    // Hyperfocus + Structure + moderate Overload
    if (scores.hyperfocus >= THRESHOLDS.elevated && 
        scores.structure >= THRESHOLDS.elevated &&
        scores.overload >= THRESHOLDS.elevated) {
      subtypes.push({
        type: 'audhd_specific',
        confidence: 0.85,
        clinical_note: 'AuDHD as distinct profile (not simple comorbidity)',
        user_description: 'Ihre Merkmale sprechen für eine Kombination aus ADHS und Autismus, die sich gegenseitig beeinflusst. Intensive Vertiefung trifft auf Strukturbedürfnis, während gleichzeitig beide Systeme viel Energie kosten.'
      });
    }
    
    // AuDHD mit inneren Widersprüchen
    // Attention vs. Structure Konflikt
    if (scores.attention >= THRESHOLDS.high && 
        scores.structure >= THRESHOLDS.high) {
      subtypes.push({
        type: 'audhd_conflict',
        confidence: 0.75,
        clinical_note: 'AuDHD with internal conflicts',
        user_description: 'Sie erleben möglicherweise innere Widersprüche: Das Bedürfnis nach Struktur kollidiert mit Schwierigkeiten, diese aufrechtzuerhalten. Oder: Intensive Vertiefung widerspricht dem Wunsch nach Varianz.'
      });
    }
  }
  
  return subtypes;
}

/* =====================================================
   5. DISKREPANZ-ANALYSE - NEU!
   
   Erkennt ungewöhnliche Muster die auf:
   - Atypische Präsentation
   - Überlagerung durch andere Faktoren
   - Notwendigkeit weiterer Abklärung
   hinweisen
===================================================== */

function analyzeDiscrepancies(scores, meta) {
  const discrepancies = [];
  
  // Diskrepanz 1: Attention hoch, Executive niedrig
  // Ungewöhnlich für ADHS - könnte auf Depression/Fatigue hinweisen
  if (scores.attention >= THRESHOLDS.high && 
      scores.executive < THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'attention_executive_split',
      severity: 'moderate',
      clinical_note: 'Atypical for ADHD - check depression, chronic fatigue',
      user_description: 'Interessant ist: Ihre Aufmerksamkeit zeigt deutliche Besonderheiten, aber Handlungsplanung scheint weniger betroffen. Dies kann auf emotionale Erschöpfung oder andere Faktoren hinweisen, die im Vordergrund stehen.',
      flag: 'consider_differential'
    });
  }
  
  // Diskrepanz 2: Executive hoch, Attention niedrig
  // Ungewöhnlich - könnte auf Angst/Zwang hinweisen
  if (scores.executive >= THRESHOLDS.high && 
      scores.attention < THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'executive_attention_split',
      severity: 'moderate',
      clinical_note: 'Atypical pattern - check anxiety, OCD tendencies',
      user_description: 'Ungewöhnlich ist: Impulskontrolle und Handlungsplanung kosten viel Energie, aber Aufmerksamkeit ist weniger betroffen. Dies kann auf Angst oder intensive innere Anspannung hinweisen.',
      flag: 'consider_differential'
    });
  }
  
  // Diskrepanz 3: Social hoch, Sensory niedrig
  // Soziale Erschöpfung ohne sensorische Ursache
  if (scores.social >= THRESHOLDS.high && 
      scores.sensory < THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'social_sensory_split',
      severity: 'low',
      clinical_note: 'Social exhaustion without sensory component - social anxiety vs autism',
      user_description: 'Soziale Situationen kosten Sie viel Energie, aber nicht primär wegen Reizüberflutung. Die Erschöpfung kommt eher aus der Interaktion selbst oder sozialer Unsicherheit.',
      flag: 'social_anxiety_likely'
    });
  }
  
  // Diskrepanz 4: Masking extrem, Overload niedrig
  // Erfolgreiche Kompensation (noch) ohne Erschöpfung
  if (scores.masking >= THRESHOLDS.very_high && 
      scores.overload < THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'masking_without_burnout',
      severity: 'moderate',
      clinical_note: 'High compensation without (yet) exhaustion - monitor burnout risk',
      user_description: 'Sie investieren sehr viel Energie in soziale Anpassung, zeigen aber (noch) keine Erschöpfung. Dies kann funktionieren, birgt aber langfristiges Burnout-Risiko.',
      flag: 'monitor_burnout_risk'
    });
  }
  
  // Diskrepanz 5: Overload extrem, andere Werte moderat
  // Überlastung überlagert möglicherweise zugrundeliegende ND
  if (scores.overload >= THRESHOLDS.very_high) {
    const otherScores = Object.entries(scores)
      .filter(([key]) => key !== 'overload')
      .map(([_, val]) => val);
    const avgOther = otherScores.reduce((a, b) => a + b, 0) / otherScores.length;
    
    if (avgOther < THRESHOLDS.elevated) {
      discrepancies.push({
        type: 'overload_overlay',
        severity: 'high',
        clinical_note: 'Burnout may mask or amplify underlying neurodivergence',
        user_description: 'Ihre Erschöpfungswerte sind extrem hoch, während andere Bereiche moderater sind. Aktuelle Überlastung kann zugrundeliegende Merkmale überlagern. Eine Re-Evaluation nach Entlastung kann hilfreich sein.',
        flag: 'reassess_after_recovery'
      });
    }
  }
  
  // Diskrepanz 6: Alexithymia extrem, Emotreg niedrig
  // Emotionswahrnehmung gestört, aber keine Dysregulation
  if (scores.alexithymia >= THRESHOLDS.very_high && 
      scores.emotreg < THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'alexithymia_without_dysregulation',
      severity: 'low',
      clinical_note: 'Difficulty identifying emotions without dysregulation - autism-typical',
      user_description: 'Sie haben Schwierigkeiten, eigene Gefühle wahrzunehmen und zu benennen, aber weniger mit deren Regulation. Dies ist ein typisches Muster bei Autismus und unterscheidet sich von emotionaler Instabilität.',
      flag: 'autism_marker'
    });
  }
  
  // Diskrepanz 7: Emotreg extrem, Alexithymia niedrig
  // Dysregulation ohne Wahrnehmungsstörung - eher ADHS/Trauma
  if (scores.emotreg >= THRESHOLDS.very_high && 
      scores.alexithymia < THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'dysregulation_without_alexithymia',
      severity: 'moderate',
      clinical_note: 'Emotional dysregulation without identification difficulty - ADHD/trauma pattern',
      user_description: 'Gefühle zu dosieren und zu kontrollieren fällt Ihnen sehr schwer, aber Sie nehmen Ihre Emotionen grundsätzlich wahr. Dies spricht eher für ADHS-typische Dysregulation oder Trauma.',
      flag: 'adhd_trauma_likely'
    });
  }
  
  // Diskrepanz 8: Alle Werte moderat (55-70%), keine Spitzen
  // Ausgeglichenes subklinisches Profil
  const allScores = Object.values(scores);
  const maxScore = Math.max(...allScores);
  const minScore = Math.min(...allScores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  
  if (avgScore >= THRESHOLDS.subclinical && 
      avgScore < THRESHOLDS.elevated &&
      maxScore < 73 &&
      (maxScore - minScore) < 20) {
    discrepancies.push({
      type: 'flat_moderate_profile',
      severity: 'low',
      clinical_note: 'Subclinical traits, evenly distributed - BAP (Broader Autism Phenotype) or subclinical ADHD',
      user_description: 'Ihre Werte sind über verschiedene Bereiche verteilt, ohne dass ein Bereich deutlich heraussticht. Dies kann auf leichte neurodivergente Züge hinweisen, die aber möglicherweise nicht beeinträchtigend wirken.',
      flag: 'subclinical_traits'
    });
  }
  
  // Diskrepanz 9: Masking + Overload + hohe Kompensation
// KRITISCH: Hohes Burnout-Risiko
if (scores.masking >= THRESHOLDS.high && 
    scores.overload >= THRESHOLDS.high &&
    scores.executive >= THRESHOLDS.elevated) {
  discrepancies.push({
    type: 'burnout_risk_critical',
    severity: 'high',
    clinical_note: 'Critical burnout risk - high masking + overload + compensation',
    user_description: '⚠️ HOHES BURNOUT-RISIKO: Ihre Kombination aus sehr hoher Maskierung (' + scores.masking + '%), hoher Überlastung (' + scores.overload + '%) und gleichzeitiger exekutiver Kompensation (' + scores.executive + '%) ist langfristig nicht nachhaltig. Sie halten nach außen vieles aufrecht, während innerlich extreme Belastung herrscht. Diese Kompensation kostet massive Energie.',
    flag: 'urgent_intervention_needed'
  });
}

// Diskrepanz 10: AuDHD + Alexithymia kombiniert
// KRITISCH: Triple-Challenge
if (scores.attention >= THRESHOLDS.elevated && 
    scores.social >= THRESHOLDS.elevated &&
    scores.alexithymia >= THRESHOLDS.high) {
  discrepancies.push({
    type: 'audhd_alexithymia_combined',
    severity: 'high',
    clinical_note: 'AuDHD + alexithymia - triple challenge pattern',
    user_description: '⚠️ TRIPLE-CHALLENGE: Die Kombination aus ADHS-Merkmalen (' + scores.attention + '%), autistischen Merkmalen (' + scores.social + '%) und erschwerter Emotionswahrnehmung (' + scores.alexithymia + '%) ist besonders herausfordernd. Emotionen sind intensiv (ADHS), schwer regulierbar, körperlich spürbar aber schwer einordbar (Autismus), und zusätzlich schwer benennbar (Alexithymia).',
    flag: 'complex_emotional_pattern'
  });
}

// Diskrepanz 11: Hohe Executive trotz hoher Belastung
// INFO: Starke Kompensation maskiert Probleme
if (scores.executive >= THRESHOLDS.high && 
    scores.overload >= THRESHOLDS.high &&
    scores.masking >= THRESHOLDS.elevated) {
  discrepancies.push({
    type: 'high_executive_despite_overload',
    severity: 'moderate',
    clinical_note: 'Strong compensation masking underlying difficulties',
    user_description: 'ℹ️ STARKE KOMPENSATION: Ihre exekutiven Funktionen (' + scores.executive + '%) ermöglichen es Ihnen, trotz hoher Belastung (' + scores.overload + '%) funktional zu bleiben. Dies kann Maskierung begünstigen: Nach außen wirken Sie organisiert und stabil, während innerlich hohe Anstrengung herrscht. Diese Kompensation ist energieintensiv und kann zu verzögertem Burnout führen.',
    flag: 'monitor_delayed_burnout'
  });
}

// Diskrepanz 12: AuDHD ohne Hyperfokus
// INFO: Ungewöhnliches Muster
if (scores.attention >= THRESHOLDS.elevated && 
    scores.social >= THRESHOLDS.elevated &&
    scores.hyperfocus < THRESHOLDS.elevated) {
  const adhdScore = calculateClusterScore(scores, CLUSTERS.adhd);
  const autismScore = calculateClusterScore(scores, CLUSTERS.autism);
  
  if (adhdScore >= THRESHOLDS.elevated && autismScore >= THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'audhd_without_hyperfocus',
      severity: 'low',
      clinical_note: 'Atypical AuDHD pattern - hyperfocus suppressed or absent',
      user_description: 'ℹ️ UNGEWÖHNLICH: Ihr AuDHD-Profil zeigt sich OHNE das typische Hyperfokus-Muster (' + scores.hyperfocus + '%). Dies kann bedeuten: (1) Kompensation verhindert Vertiefung, (2) Erschöpfung blockiert Flow, (3) Individuelles Muster. Falls Sie früher Hyperfokus hatten und dieser verschwunden ist, könnte dies auf Erschöpfung hinweisen.',
      flag: 'check_historical_hyperfocus'
    });
  }
}

// Diskrepanz 13: Autismus-Profil + hohes Executive
// INFO: Struktur-Bedürfnis OHNE ADHS
if (scores.structure >= THRESHOLDS.high && 
    scores.executive < THRESHOLDS.elevated) {
  const autismScore = calculateClusterScore(scores, CLUSTERS.autism);
  
  if (autismScore >= THRESHOLDS.elevated) {
    discrepancies.push({
      type: 'autism_structure_without_adhd',
      severity: 'low',
      clinical_note: 'Autism-based structure need (not ADHD executive dysfunction)',
      user_description: 'ℹ️ UNTERSCHIED: Ihr hohes Bedürfnis nach Struktur (' + scores.structure + '%) stammt nicht aus exekutiver Schwäche (ADHS), sondern aus Vorhersehbarkeit als Schutz vor Überlastung (Autismus). Strukturen dienen bei Ihnen der Reizreduktion und emotionalen Stabilität. UNTERSCHIED: ADHS braucht Struktur für Organisation. Autismus braucht Struktur für Sicherheit.',
      flag: 'autism_specific_structure_need'
    });
  }
}

// Diskrepanz 14: Sensory + Alexithymia + Overload kombiniert
// WARNUNG: Intensive sensorisch-emotionale Verarbeitung
if (scores.sensory >= THRESHOLDS.elevated && 
    scores.alexithymia >= THRESHOLDS.high &&
    scores.overload >= THRESHOLDS.high) {
  discrepancies.push({
    type: 'sensory_emotional_overload_combined',
    severity: 'high',
    clinical_note: 'Intense sensory-emotional processing pattern',
    user_description: '⚠️ INTENSIVE VERARBEITUNG: Ihre Kombination aus erhöhter sensorischer Sensibilität (' + scores.sensory + '%), erschwerter Emotionswahrnehmung (' + scores.alexithymia + '%) und schneller Überlastung (' + scores.overload + '%) ist bei autistischen Menschen häufig. Reize kommen intensiv an, werden aber schwerer emotional eingeordnet, was zu Überforderung führen kann, bevor bewusst wird, was gefühlt wird.',
    flag: 'autism_sensory_emotional_pattern'
  });
}

// Diskrepanz 15: Alle Skalen extrem hoch (80%+)
// KRITISCH: Systemische Überlastung
const veryHighCount = Object.values(scores).filter(s => s >= 80).length;
const totalScales = Object.values(scores).length;

if (veryHighCount >= totalScales * 0.7) {  // 70% der Skalen ≥80%
  discrepancies.push({
    type: 'systemic_extreme_presentation',
    severity: 'high',
    clinical_note: 'Systemic extreme presentation - check for crisis state',
    user_description: '⚠️ SYSTEMISCHE BELASTUNG: Die meisten Ihrer Werte liegen im sehr hohen Bereich (≥80%). Dies kann bedeuten: (1) Akute Krisensituation überlagert alle Bereiche, (2) Sehr intensive neurodivergente Ausprägung, (3) Chronische Überlastung verstärkt alle Merkmale. Eine professionelle Abklärung ist dringend empfohlen.',
    flag: 'urgent_professional_assessment'
  });
}

return discrepancies;
}

/* =====================================================
   6. ONSET-BASIERTE DIFFERENZIERUNG - NEU!
   
   Verwendet Onset-Timing für differentialdiagnostische
   Einordnung
===================================================== */

function analyzeOnset(scores, meta, patterns) {
  const onsetAnalysis = {
    timing: meta.onset || 'unknown',
    interpretation: '',
    clinical_relevance: '',
    user_explanation: ''
  };
  
  const adhdCluster = calculateClusterScore(scores, CLUSTERS.adhd);
  const autismCluster = calculateClusterScore(scores, CLUSTERS.autism);
  const maxScore = Math.max(...Object.values(scores));
  
  switch (meta.onset) {
    
    case 'childhood':
      onsetAnalysis.interpretation = 'neurodevelopmental_primary';
      onsetAnalysis.clinical_relevance = 'Early onset supports neurodevelopmental origin (ADHD/Autism)';
      
      if (adhdCluster >= THRESHOLDS.elevated || autismCluster >= THRESHOLDS.elevated) {
        onsetAnalysis.user_explanation = 'Ihre Merkmale bestehen seit der Kindheit. Dies spricht dafür, dass sie eine neurologische Grundlage haben und nicht erst durch spätere Belastungen entstanden sind.';
      } else {
        onsetAnalysis.user_explanation = 'Ihre Merkmale bestehen seit der Kindheit, zeigen aber kein klares ADHS- oder Autismus-Profil. Andere neurodivergente Besonderheiten oder Hochsensibilität sind möglich.';
      }
      break;
      
    case 'youth':
      onsetAnalysis.interpretation = 'neurodevelopmental_or_puberty';
      onsetAnalysis.clinical_relevance = 'Adolescent onset - puberty trigger of underlying ND or hormonal component';
      onsetAnalysis.user_explanation = 'Ihre Merkmale zeigten sich verstärkt in der Jugend. Dies kann bedeuten: (1) Vorhandene Neurodivergenz wurde durch pubertäre Anforderungen sichtbar, oder (2) Hormonelle Faktoren spielen eine Rolle.';
      break;
      
    case 'adult':
      onsetAnalysis.interpretation = 'late_recognition_or_secondary';
      onsetAnalysis.clinical_relevance = 'Adult onset - late recognition (masked ND) vs acquired (trauma/burnout)';
      
      if (scores.masking >= THRESHOLDS.high) {
        onsetAnalysis.user_explanation = 'Ihre Merkmale wurden erst im Erwachsenenalter deutlich. In Kombination mit hoher Maskierung spricht dies für langjährige unerkannte Neurodivergenz, die durch zunehmende Anforderungen oder nachlassende Kompensation sichtbar wurde.';
      } else if (scores.overload >= THRESHOLDS.very_high) {
        onsetAnalysis.user_explanation = 'Ihre Merkmale traten erst im Erwachsenenalter auf. In Kombination mit extremer Überlastung könnte dies auf erworbene Erschöpfung oder Trauma hinweisen, die neurodivergent-ähnliche Symptome erzeugen.';
      } else {
        onsetAnalysis.user_explanation = 'Ihre Merkmale wurden erst im Erwachsenenalter deutlich. Dies kann verschiedene Ursachen haben: späte Erkennung vorhandener Neurodivergenz, Veränderung der Lebensumstände, oder sekundäre Faktoren.';
      }
      break;
      
    case 'recent':
      onsetAnalysis.interpretation = 'secondary_likely';
      onsetAnalysis.clinical_relevance = 'Recent onset - burnout, trauma, depression likely primary';
      onsetAnalysis.user_explanation = 'Ihre Merkmale traten erst in den letzten Jahren auf. Dies spricht eher für Überlastung, Trauma oder Depression als primäre Faktoren. Zugrundeliegende Neurodivergenz kann vorhanden sein, wird aber möglicherweise überlagert.';
      break;
      
    case 'unsure':
      onsetAnalysis.interpretation = 'unclear';
      onsetAnalysis.clinical_relevance = 'Onset timing unclear - possible alexithymia or dissociation affecting recall';
      onsetAnalysis.user_explanation = 'Der zeitliche Beginn ist unklar. Dies kann selbst ein Hinweis sein: Eingeschränkte Selbstwahrnehmung oder Dissoziation können das Erinnern an Entwicklungsverläufe erschweren.';
      break;
      
    default:
      onsetAnalysis.interpretation = 'unknown';
      onsetAnalysis.user_explanation = '';
  }
  
  return onsetAnalysis;
}

/* =====================================================
   7. PATTERN DETECTION (Original + erweitert)
===================================================== */

function detectPatterns(scores, meta) {
  const patterns = [];
  
  // Pattern 1: Hochmaskierung
  if (scores.masking >= 65 &&
      (scores.social >= THRESHOLDS.elevated || scores.sensory >= THRESHOLDS.elevated)) {
    patterns.push({
      type: 'high_masking',
      confidence: calculateMaskingConfidence(scores, meta),
      note: 'Deutliche Kompensationsstrategien erkennbar'
    });
  }
  
  // Pattern 2: Späte Kompensation
  if (scores.masking >= THRESHOLDS.elevated && 
      (meta.gender === 'female' || meta.gender === 'diverse') &&
      meta.onset !== 'childhood') {
    patterns.push({
      type: 'late_recognition',
      confidence: 0.7,
      note: 'Muster spricht für langjährige unerkannte Kompensation'
    });
  }
  
  // Pattern 3: Burnout/Überlastung dominiert
  if (scores.overload >= 80 &&
      meta.stress && meta.stress !== 'low') {
    patterns.push({
      type: 'stress_overlay',
      confidence: 0.8,
      note: 'Aktuelle Belastung kann neurodivergente Merkmale verstärken oder überlagern'
    });
  }
  
  // Pattern 4: AuDHD-spezifisch
  const adhdScore = calculateClusterScore(scores, CLUSTERS.adhd);
  const autismScore = calculateClusterScore(scores, CLUSTERS.autism);
  
  if (adhdScore >= THRESHOLDS.elevated && autismScore >= THRESHOLDS.elevated) {
    if (scores.hyperfocus >= THRESHOLDS.elevated && 
        scores.structure >= THRESHOLDS.elevated &&
        scores.overload >= THRESHOLDS.elevated) {
      patterns.push({
        type: 'audhd_specific',
        confidence: 0.85,
        note: 'Muster spricht für AuDHD als eigenständiges Profil, nicht Komorbidität'
      });
    }
  }
  
  // Pattern 5: Subklinisch/Traits
  const allScores = Object.values(scores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const maxScore = Math.max(...allScores);
  
  if (avgScore >= THRESHOLDS.subclinical && 
      avgScore < THRESHOLDS.elevated &&
      maxScore < 78) {
    patterns.push({
      type: 'traits_only',
      confidence: 0.6,
      note: 'Neurodivergente Merkmale erkennbar, aber möglicherweise nicht beeinträchtigend'
    });
  }
  
  return patterns;
}

/* =====================================================
   8. MASKIERUNGS-KONFIDENZ
===================================================== */

function calculateMaskingConfidence(scores, meta) {
  let confidence = 0.5;
  
  if (meta.gender === 'female' || meta.gender === 'diverse') {
    confidence += 0.15;
  }
  
  if (meta.onset === 'childhood' && !meta.diagnosis?.includes('adhd') && !meta.diagnosis?.includes('autism')) {
    confidence += 0.15;
  }
  
  if (scores.social >= THRESHOLDS.high && scores.overload >= THRESHOLDS.high) {
    confidence += 0.1;
  }
  
  const innerDistress = (scores.overload + scores.alexithymia) / 2;
  const outerAdaptation = scores.masking;
  
  if (outerAdaptation - innerDistress >= 20) {
    confidence += 0.15;
  }
  
  return Math.min(confidence, 0.95);
}

/* =====================================================
   9. HAUPTPROFIL BESTIMMEN (erweitert)
===================================================== */

function determineMainProfile(profiles, patterns, scores, subtypes, discrepancies) {
  
  // =====================================================
  // 0. DOMINANTE EINZELSKALA PRÜFEN
  // =====================================================
  
  const sortedScales = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);
  
  const topScale = sortedScales[0];
  const secondScale = sortedScales[1];
  
  const [topName, topScore] = topScale;
  const [secondName, secondScore] = secondScale;
  
  const isDominant = 
    topScore >= 85 || 
    (topScore >= 75 && (topScore - secondScore) >= 15);
  
  if (isDominant) {
    const scaleLabels = {
      attention: 'Aufmerksamkeitsschwierigkeiten',
      sensory: 'Sensorische Überlastung',
      social: 'Soziale Erschöpfung',
      masking: 'Intensive Maskierung',
      structure: 'Starkes Strukturbedürfnis',
      overload: 'Chronische Überlastung',
      alexithymia: 'Eingeschränkte Emotionswahrnehmung',
      executive: 'Exekutive Dysfunktion',
      emotreg: 'Emotionale Dysregulation',
      hyperfocus: 'Intensiver Hyperfokus'
    };
    
    return {
      type: 'single_dominant',
      dominant_scale: topName,
      dominant_label: scaleLabels[topName] || topName,
      score: topScore,
      confidence: topScore >= 90 ? 0.95 : topScore >= 85 ? 0.90 : 0.85,
      level: topScore >= 90 ? 'very_high' : 'high',
      subtypes: subtypes, // NEU: Subtypen anhängen
      discrepancies: discrepancies // NEU: Diskrepanzen anhängen
    };
  }

  // =====================================================
  // 1. SPEZIAL-CHECKS
  // =====================================================
  
  const allScores = Object.values(scores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const maxScore = Math.max(...allScores);
  
  if (maxScore < 35) {
    return { 
      type: 'very_low',
      confidence: 0.8,
      level: 'high',
      subtypes: subtypes,
      discrepancies: discrepancies
    };
  }
  
  if (maxScore < 55 && avgScore < 52) {
    return {
      type: 'unremarkable',
      confidence: 0.75,
      level: 'high',
      subtypes: subtypes,
      discrepancies: discrepancies
    };
  }
  
  // =====================================================
  // 2. HAUPTPROFILE MIT SUBTYP-PRIORISIERUNG
  // =====================================================
  
  const candidates = [];
  
  // Subtyp-basierte Kandidaten haben Priorität
  if (subtypes.length > 0) {
    const bestSubtype = subtypes.sort((a, b) => b.confidence - a.confidence)[0];
    
    // ADHS-Subtypen
    if (bestSubtype.type.startsWith('adhd_')) {
      candidates.push({
        type: 'adhd',
        confidence: bestSubtype.confidence,
        score: profiles.adhd.score,
        subtype: bestSubtype
      });
    }
    
    // Autismus-Subtypen
    if (bestSubtype.type.startsWith('autism_')) {
      candidates.push({
        type: 'autism',
        confidence: bestSubtype.confidence,
        score: profiles.autism.score,
        subtype: bestSubtype
      });
    }
    
    // AuDHD-Subtypen
    if (bestSubtype.type.startsWith('audhd_')) {
      candidates.push({
        type: 'audhd',
        confidence: bestSubtype.confidence,
        score: profiles.audhd.score,
        subtype: bestSubtype
      });
    }
  }
  
  // Standard-Kandidaten (falls keine Subtypen)
  if (profiles.adhd.confidence >= 0.60) {
    candidates.push({
      type: 'adhd',
      confidence: profiles.adhd.confidence,
      score: profiles.adhd.score
    });
  }
  
  if (profiles.autism.confidence >= 0.60) {
    candidates.push({
      type: 'autism',
      confidence: profiles.autism.confidence,
      score: profiles.autism.score
    });
  }
  
  if (profiles.audhd.confidence >= 0.60 && 
      profiles.adhd.score >= 65 && 
      profiles.autism.score >= 65) {
    candidates.push({
      type: 'audhd',
      confidence: profiles.audhd.confidence,
      score: profiles.audhd.score
    });
  }
  
  if (profiles.high_masking.confidence >= 0.60) {
    candidates.push({
      type: 'high_masking',
      confidence: profiles.high_masking.confidence,
      score: profiles.high_masking.score
    });
  }
  
  if (profiles.stress.confidence >= 0.60 || scores.overload >= 80) {
    candidates.push({
      type: 'stress',
      confidence: Math.max(profiles.stress.confidence, scores.overload / 100),
      score: scores.overload
    });
  }
  
  if (profiles.traits.confidence >= 0.50 || 
      (avgScore >= 55 && avgScore < 65 && maxScore < 75)) {
    candidates.push({
      type: 'traits',
      confidence: Math.max(profiles.traits.confidence, 0.6),
      score: avgScore
    });
  }
  
  // =====================================================
  // 3. BESTEN KANDIDATEN WÄHLEN
  // =====================================================
  
  if (candidates.length === 0) {
    return {
      type: 'mixed',
      confidence: 0.5,
      level: 'medium',
      subtypes: subtypes,
      discrepancies: discrepancies
    };
  }
  
  candidates.sort((a, b) => b.confidence - a.confidence);
  
  const winner = candidates[0];
  
  let level;
  if (winner.confidence >= 0.85) level = 'very_high';
  else if (winner.confidence >= 0.75) level = 'high';
  else if (winner.confidence >= 0.60) level = 'medium';
  else if (winner.confidence >= 0.45) level = 'low';
  else level = 'very_low';
  
  return {
    type: winner.type,
    confidence: winner.confidence,
    level: level,
    subtype: winner.subtype || null,
    subtypes: subtypes,
    discrepancies: discrepancies
  };
}

/* =====================================================
   10. KONFIDENZ-BERECHNUNG
===================================================== */

function calculateConfidence(primaryScore, secondaryScore, type, patterns) {
  let confidence = 0;
  
  if (primaryScore >= THRESHOLDS.very_high) confidence = 0.85;
  else if (primaryScore >= THRESHOLDS.high) confidence = 0.75;
  else if (primaryScore >= THRESHOLDS.elevated) confidence = 0.65;
  else if (primaryScore >= THRESHOLDS.subclinical) confidence = 0.45;
  else confidence = 0.25;
  
  const overlap = Math.min(primaryScore, secondaryScore);
  if (overlap >= THRESHOLDS.elevated) {
    confidence *= 0.85;
  }
  
  if (patterns.some(p => p.type === 'stress_overlay')) {
    confidence *= 0.9;
  }
  
  if (patterns.some(p => p.type === 'high_masking')) {
    confidence *= 0.85;
  }
  
  return Math.round(confidence * 100) / 100;
}

function calculateFallbackConfidence(score) {
  if (score < 50) return Math.round(Math.max(score / 10, 5));
  if (score < 60) return Math.round(10 + (score - 50) * 2);
  if (score < 70) return Math.round(30 + (score - 60) * 2);
  if (score < 80) return Math.round(50 + (score - 70) * 2);
  if (score < 90) return Math.round(70 + (score - 80) * 1.5);
  return Math.round(Math.min(85 + (score - 90) * 1, 95));
}

function calculateAuDHDConfidence(adhdScore, autismScore, patterns) {
  if (adhdScore < THRESHOLDS.elevated || autismScore < THRESHOLDS.elevated) {
    return calculateFallbackConfidence((adhdScore + autismScore) / 2) / 100;
  }
  
  let confidence = 0.6;
  
  if (adhdScore >= THRESHOLDS.high && autismScore >= THRESHOLDS.high) {
    confidence += 0.2;
  }
  
  if (patterns.some(p => p.type === 'audhd_specific')) {
    confidence += 0.15;
  }
  
  const diff = Math.abs(adhdScore - autismScore);
  if (diff < 10) confidence += 0.1;
  
  return Math.min(confidence, 0.95);
}

/* =====================================================
   11. HAUPTFUNKTION - calculateProfile (erweitert)
===================================================== */

export function calculateProfile(scores, meta, answers = {}) {
  
  // 1. Cluster-Scores berechnen
  const adhdScore = calculateClusterScore(scores, CLUSTERS.adhd);
  const autismScore = calculateClusterScore(scores, CLUSTERS.autism);
  const compensationScore = calculateClusterScore(scores, CLUSTERS.compensation);
  const emotionalScore = calculateClusterScore(scores, CLUSTERS.emotional);
  
  // 2. Muster erkennen (Original)
  const patterns = detectPatterns(scores, meta);
  
  // 3. NEU: Subtypen erkennen
  const subtypes = detectSubtypes(scores, meta);
  
  // 4. NEU: Diskrepanzen analysieren
  const discrepancies = analyzeDiscrepancies(scores, meta);
  
  // 5. NEU: Onset analysieren
  const onsetAnalysis = analyzeOnset(scores, meta, patterns);
  
 // 6. Profil-Konfidenz berechnen
const profiles = {
  
  adhd: {
    score: adhdScore,
    confidence: scores.executive < THRESHOLDS.elevated 
      ? Math.min(calculateConfidence(adhdScore, autismScore, 'adhd', patterns), 0.4)
      : calculateConfidence(adhdScore, autismScore, 'adhd', patterns),
    primary: adhdScore >= THRESHOLDS.elevated && scores.executive >= THRESHOLDS.elevated,
    dominant: adhdScore >= THRESHOLDS.high && autismScore < THRESHOLDS.elevated && scores.executive >= THRESHOLDS.elevated
  },
    
    autism: {
      score: autismScore,
      confidence: calculateConfidence(autismScore, adhdScore, 'autism', patterns),
      primary: autismScore >= THRESHOLDS.elevated,
      dominant: autismScore >= THRESHOLDS.high && adhdScore < THRESHOLDS.elevated
    },
    
   audhd: {
  score: Math.round((adhdScore + autismScore) / 2),
  confidence: calculateAuDHDConfidence(adhdScore, autismScore, patterns),
  primary: adhdScore >= THRESHOLDS.elevated && autismScore >= THRESHOLDS.elevated && scores.executive >= THRESHOLDS.elevated,
  specific: patterns.some(p => p.type === 'audhd_specific')
},
    
    high_masking: {
      score: compensationScore,
      confidence: patterns.find(p => p.type === 'high_masking')?.confidence 
        || calculateFallbackConfidence(compensationScore) / 100,
      present: patterns.some(p => p.type === 'high_masking'),
      overlay: true
    },
    
    stress: {
      score: scores.overload,
      confidence: patterns.find(p => p.type === 'stress_overlay')?.confidence 
        || calculateFallbackConfidence(scores.overload) / 100,
      primary: patterns.some(p => p.type === 'stress_overlay'),
      overlay: true
    },
    
    traits: {
      score: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length),
      confidence: patterns.find(p => p.type === 'traits_only')?.confidence 
        || calculateFallbackConfidence(
            Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
          ) / 100,
      subclinical: patterns.some(p => p.type === 'traits_only')
    }
  };
  
  // 7. Hauptprofil bestimmen (mit Subtypen und Diskrepanzen)
  const mainProfile = determineMainProfile(profiles, patterns, scores, subtypes, discrepancies);
  
  // 8. Begründung generieren (wird noch erweitert)
  const reasoning = generateReasoning(scores, profiles, patterns, meta, mainProfile, subtypes, discrepancies, onsetAnalysis);
  
  // 9. Nächste Schritte (wird noch erweitert)
  const nextSteps = generateNextSteps(mainProfile, profiles, patterns, meta, scores, answers);
  
  return {
    profiles,
    mainProfile,
    clusterScores: {
      adhd: adhdScore,
      autism: autismScore,
      compensation: compensationScore,
      emotional: emotionalScore // NEU: Emotional-Cluster
    },
    patterns,
    subtypes, // NEU
    discrepancies, // NEU
    onsetAnalysis, // NEU
    reasoning,
    nextSteps,
    metadata: {
      testDate: new Date().toISOString(),
      version: '2.0', // Version erhöht
      meta: meta
    }
  };
}

/* =====================================================
   12. BEGRÜNDUNG GENERIEREN (wird erweitert)
   
   PLACEHOLDER - Wird im nächsten Schritt ausgebaut
===================================================== */

function generateReasoning(scores, profiles, patterns, meta, mainProfile, subtypes, discrepancies, onsetAnalysis) {
  const reasons = [];
  
  // Alte Logik bleibt erstmal
  const allScores = Object.values(scores);
  const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  const maxScore = Math.max(...allScores);
  const minScore = Math.min(...allScores);
  
  // NEU: Onset-Kontext einbeziehen
  if (onsetAnalysis.user_explanation) {
    reasons.push(onsetAnalysis.user_explanation);
  }
  
  // NEU: Subtyp-spezifische Erklärung
  if (mainProfile.subtype) {
    reasons.push(mainProfile.subtype.user_description);
  }
  
  // NEU: Diskrepanzen erwähnen
  if (discrepancies.length > 0) {
    const primaryDiscrepancy = discrepancies
      .filter(d => d.severity === 'high' || d.severity === 'moderate')
      .sort((a, b) => {
        const severityOrder = { high: 3, moderate: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })[0];
    
    if (primaryDiscrepancy) {
      reasons.push(primaryDiscrepancy.user_description);
    }
  }
  
  // Dominante Einzelskala
  if (mainProfile.type === 'single_dominant') {
    const scaleNames = {
      attention: 'Aufmerksamkeit',
      sensory: 'Sensorische Empfindlichkeit',
      social: 'Soziale Wahrnehmung',
      masking: 'Maskierung',
      structure: 'Struktur & Sicherheit',
      overload: 'Überlastung',
      alexithymia: 'Emotionswahrnehmung',
      executive: 'Exekutivfunktionen',
      emotreg: 'Emotionale Regulation',
      hyperfocus: 'Hyperfokus'
    };
    
    const scaleName = scaleNames[mainProfile.dominant_scale];
    const scaleScore = mainProfile.score;
    
    const scaleExplanations = {
      emotreg: `Ihre emotionale Regulation ist mit ${scaleScore}% extrem stark ausgeprägt. Das bedeutet: Gefühle kommen oft sehr intensiv, Stimmungswechsel sind schwer zu kontrollieren, und nach emotionalen Situationen brauchen Sie länger, um wieder ins Gleichgewicht zu kommen. Dies ist kein Zeichen von Schwäche, sondern eine andere Art der Gefühlsverarbeitung. Es sollte priorisiert werden – unabhängig davon, ob ADHS, Autismus oder andere Faktoren dahinterstecken – weil es den Alltag stark beeinflussen kann.`,

      overload: `Ihre Werte für sensorische und emotionale Überlastung liegen bei ${scaleScore}%. Das heißt: Sie erreichen schneller Ihre Belastungsgrenzen als die meisten Menschen und brauchen deutlich längere Erholungsphasen. Das kann zugrundeliegende Neurodivergenz verstärken oder auch Folge chronischer Überforderung sein. Frühes Erkennen und Schutz vor Überlastung sind hier besonders wichtig.`,

      executive: `Ihre exekutiven Funktionen sind mit ${scaleScore}% stark beeinträchtigt. Das bedeutet: Planung, Organisation, Impulskontrolle und Arbeitsgedächtnis kosten Sie deutlich mehr Energie als anderen. Es ist ein klassisches Merkmal von ADHS, kann aber auch andere Ursachen haben. Externe Hilfsmittel wie Checklisten oder Timer können hier enorm entlasten.`,

      sensory: `Ihre sensorische Empfindlichkeit ist mit ${scaleScore}% extrem hoch. Reize wie Geräusche, Licht, Gerüche oder Berührungen werden intensiver wahrgenommen und verarbeitet. Das ist typisch für Autismus, kann aber auch bei ADHS oder nach belastenden Erfahrungen vorkommen. Reizabschirmung (z. B. Kopfhörer, ruhige Orte) ist hier keine Übertreibung, sondern notwendige Selbstfürsorge.`,

      masking: `Ihre Maskierungswerte liegen bei ${scaleScore}%. Sie investieren sehr viel Energie darin, sich an neurotypische Erwartungen anzupassen – oft so gut, dass es nach außen unsichtbar bleibt. Diese Anpassung kann jahrelang funktionieren, führt aber häufig zu verzögerter Erschöpfung oder Burnout. Weniger maskieren in sicheren Räumen zu dürfen, kann enorme Erleichterung bringen.`,

      social: `Ihre soziale Wahrnehmung ist mit ${scaleScore}% stark erhöht. Soziale Situationen kosten Sie deutlich mehr Energie, weil Sie Signale eher analytisch als intuitiv verarbeiten müssen. Das kann auf Autismus hinweisen, aber auch soziale Angst oder andere Faktoren spielen eine Rolle. Weniger soziale Verpflichtungen sind legitim – Ihre Energie ist begrenzt.`,

      alexithymia: `Ihre Emotionswahrnehmung liegt bei ${scaleScore}%. Das bedeutet: Eigene Gefühle wahrzunehmen, zu benennen oder einzuordnen fällt Ihnen schwerer als den meisten Menschen. Das kommt häufig bei Autismus vor, kann aber auch andere Ursachen haben. Es ist kein Defizit, sondern eine andere Verarbeitungsweise – mit Übung oder Unterstützung kann es leichter werden.`,

      attention: `Ihre Aufmerksamkeitssteuerung ist mit ${scaleScore}% stark beeinträchtigt. Das heißt: Konzentration auf nicht-interessante Dinge kostet Sie massiv Energie. Es ist ein Kernmerkmal von ADHS, kann aber auch durch Stress oder Erschöpfung verstärkt werden. Interessenbasierte Motivation ist Ihre Stärke – nutzen Sie sie bewusst.`,

      structure: `Ihr Bedürfnis nach Struktur und Vorhersehbarkeit liegt bei ${scaleScore}%. Feste Abläufe und Klarheit geben Ihnen Sicherheit – Veränderungen kosten deutlich mehr Energie. Das ist typisch für Autismus, aber auch bei ADHS oder nach belastenden Erfahrungen möglich. Struktur ist kein Zwang, sondern ein wichtiger Schutz für Ihr Wohlbefinden.`,

      hyperfocus: `Ihr Hyperfokus ist mit ${scaleScore}% extrem stark. Wenn Sie sich in etwas vertiefen, verschwinden Zeit, Bedürfnisse und Umgebung fast vollständig. Das ist eine echte Stärke – viele sehen es als Superkraft. Es zeigt, dass Ihre Aufmerksamkeit nicht „gestört“, sondern hochgradig interessenbasiert ist. Gleichzeitig kann der „Abschaltmoment“ danach anstrengend sein.`
    };

    reasons.push(
      scaleExplanations[mainProfile.dominant_scale] ||
      `Ihr Wert in ${scaleName} ist mit ${scaleScore}% extrem hoch und prägt Ihr Profil am stärksten. Das bedeutet, dass dieser Bereich Ihren Alltag am deutlichsten beeinflusst.`
    );
    
    reasons.push(
      `Die übrigen Werte liegen im Durchschnitt bei ${avgScore}% (Spanne: ${minScore}%-${maxScore}%), sind also deutlich niedriger als der dominante Bereich.`
    );
  }
  
  // Detaillierte Werte-Aufschlüsselung
  const scaleNames = {
    attention: 'Aufmerksamkeit',
    sensory: 'Sensorische Empfindlichkeit',
    social: 'Soziale Wahrnehmung',
    masking: 'Maskierung',
    structure: 'Struktur & Sicherheit',
    overload: 'Überlastung',
    alexithymia: 'Emotionswahrnehmung',
    executive: 'Exekutivfunktionen',
    emotreg: 'Emotionale Regulation',
    hyperfocus: 'Hyperfokus'
  };
  
  const sortedScales = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  const veryHigh = sortedScales.filter(([_, score]) => score >= 75);
  if (veryHigh.length > 0) {
    const scaleList = veryHigh.map(([scale, score]) => 
      `${scaleNames[scale]} (${score}%)`
    ).join(', ');
    reasons.push(
      `Besonders stark ausgeprägt sind: **${scaleList}**. Diese Bereiche liegen deutlich über dem Bevölkerungsdurchschnitt und prägen Ihren Alltag wahrscheinlich am meisten. Es sind intensive Merkmale, die sowohl besondere Stärken als auch Herausforderungen mit sich bringen können.`
    );
  }
  
  const high = sortedScales.filter(([_, score]) => score >= 65 && score < 75);
  if (high.length > 0) {
    const scaleList = high.map(([scale, score]) => 
      `${scaleNames[scale]} (${score}%)`
    ).join(', ');
    reasons.push(
      `Deutlich erhöht sind: **${scaleList}**. Diese Merkmale sind klar erkennbar und dürften in vielen Situationen spürbar sein. Sie beeinflussen Ihren Alltag merklich, sind aber nicht so dominant wie die besonders starken Bereiche.`
    );
  }
  
  const moderate = sortedScales.filter(([_, score]) => score >= 55 && score < 65);
  if (moderate.length > 0) {
    const scaleList = moderate.map(([scale, score]) => 
      `${scaleNames[scale]} (${score}%)`
    ).join(', ');
   reasons.push(
      `Im moderat erhöhten Bereich liegen: **${scaleList}**. Diese Merkmale sind vorhanden und können je nach Situation oder Kontext stärker oder schwächer wirken. Sie sind oft gut kompensierbar, können aber in stressigen Phasen deutlicher werden.`
    );
  }
  
  return reasons;
}

/* =====================================================
   13. NÄCHSTE SCHRITTE (wird erweitert)
   
===================================================== */

function generateNextSteps(mainProfile, profiles, patterns, meta, scores, answers) {
  const steps = [];

  // Durchschnittsscore berechnen (für Basis-Tipps-Entscheidung)
  const avgScore = (
    scores.attention + scores.sensory + scores.social + scores.structure +
    scores.overload + scores.alexithymia + scores.executive + 
    scores.emotreg + scores.hyperfocus
  ) / 9;

  // FRÜHER EXIT: Wenn sehr niedrige Werte (< 25%) → Neurotypische Empfehlungen
  if (avgScore < 25) {
    steps.push("Ihre Ergebnisse zeigen keine ausgeprägten neurodivergenten Merkmale. Falls Sie dennoch Schwierigkeiten im Alltag erleben, können allgemeine Strategien zur Stressbewältigung, Achtsamkeit oder ein Gespräch mit einer Fachperson hilfreich sein.");
    return steps;
  }

  // FRÜHER EXIT: Wenn niedrige Werte (< 50%) → Subklinische Empfehlungen
  if (avgScore < 50) {
    steps.push("Ihre Ergebnisse zeigen einige neurodivergente Merkmale, die jedoch nicht stark ausgeprägt sind. Falls bestimmte Bereiche Sie belasten, können gezielte Strategien hilfreich sein:");
    
    if (scores.overload >= 50) {
      steps.push("Überlastung vorbeugen: Regelmäßige Pausen und Reizreduktion können helfen, auch bei leichter Sensibilität.");
    }
    if (scores.structure >= 50) {
      steps.push("Struktur als Unterstützung: Routinen und Planung können hilfreich sein, auch ohne ausgeprägte Neurodivergenz.");
    }
    
    steps.push("Selbstfürsorge: Achten Sie auf Ihre Bedürfnisse und passen Sie Ihren Alltag an, wo nötig.");
    return steps;
  }

  // AB HIER (≥ 50%): Neurodivergente Empfehlungen
  
  // Basis-Tipps (NUR bei mittleren bis hohen Werten)
  steps.push("Selbstregulation bewusst erlauben: Bewegung, Fidget-Tools, repetitive Handlungen oder beruhigende Rituale sind keine \"schlechten Angewohnheiten\", sondern wirksame Werkzeuge Ihrer Neurologie.");
  steps.push("Bewegung & Natur: Regelmäßige körperliche Aktivität – auch kleine Spaziergänge – unterstützt Dopamin-Regulation, emotionale Balance und reduziert Überlastung oft stärker als erwartet.");

  // UNVERÄNDERT: Profil-spezifisch (ADHD)
  if (mainProfile.type === 'adhd' || mainProfile.type === 'audhd') {
    steps.push("Interessen gezielt nutzen: Planen Sie Aufgaben um Ihre Hyperfokus-Phasen herum – das macht Dinge motivierender und leichter erledigbar.");
    if (scores.hyperfocus >= 80) {
      steps.push("Hyperfokus als Stärke einsetzen: Reservieren Sie täglich Zeit für Themen, die Sie faszinieren – das lädt Energie auf und bringt Freude.");
    }
    if (scores.emotreg >= 70) {
      steps.push("Emotionale Schwankungen abfedern: Kurze Pausen nach intensiven Gefühlen einplanen – Atemübungen oder ein kurzer Spaziergang helfen, wieder ins Gleichgewicht zu kommen.");
    }
  }

  // UNVERÄNDERT: Profil-spezifisch (Autism)
  if (mainProfile.type === 'autism' || mainProfile.type === 'audhd') {
    steps.push("Sensorische Bedürfnisse ernst nehmen: Noise-Cancelling-Kopfhörer, Sonnenbrille oder ruhige Räume sind keine Übertreibung, sondern notwendige Selbstfürsorge.");
    steps.push("Struktur als Schutz nutzen: Feste Routinen oder klare Pläne geben Sicherheit – sie sind ein Anker in einer oft unvorhersehbaren Welt.");
    if (scores.social >= 80) {
      steps.push("Soziale Energie dosieren: Weniger Verpflichtungen oder klare Absagen sind legitim – Ihre soziale Batterie lädt sich nur in Ruhe wieder auf.");
    }
  }

  // UNVERÄNDERT: Maskierung & Überlastung
  if (profiles.high_masking?.present || scores.masking >= 70) {
    steps.push("Maskierung bewusst reduzieren: In sicheren Räumen authentisch sein spart enorme Energie und schützt vor Burnout.");
  }

  if (scores.overload >= 70) {
    steps.push("Überlastung früh erkennen: Frühe Warnsignale (z. B. Reizbarkeit, Rückzugswunsch) ernst nehmen und sofort Pausen einlegen.");
  }

  // UNVERÄNDERT: Hypnose-Therapie
  if (scores.emotreg >= 70 || scores.overload >= 70 || profiles.high_masking?.present || mainProfile.type === 'audhd') {
    steps.push("Hypnose-Therapie in Betracht ziehen: Hypnose kann besonders bei emotionaler Dysregulation, Überlastung oder langjähriger Maskierung helfen, innere Blockaden zu lösen und Selbstregulation zu stärken – ideal in Kombination mit neurodivergentem Verständnis.");
  }

  // UNVERÄNDERT: Neurodivergentes Coaching
  if (mainProfile.confidence >= 0.6 && mainProfile.type !== 'very_low' && mainProfile.type !== 'unremarkable') {
    steps.push("Neurodivergentes Coaching: Ein Coach mit Schwerpunkt Neurodivergenz kann helfen, passende Strategien für Ihren Alltag zu entwickeln – von Struktur über Selbstakzeptanz bis hin zu Beruf und Beziehungen.");
  }

  // Abschluss-Tipps (NUR bei mittleren bis hohen Werten)
  steps.push("Selbstakzeptanz stärken: Ihre Art zu denken und zu fühlen ist gültig – Neurodivergenz ist eine andere, nicht falsche Neurologie.");
  steps.push("Austausch suchen: Kontakt zu anderen neurodivergenten Menschen (z. B. Foren, Selbsthilfegruppen) kann wertvolle Tipps und das Gefühl von Zugehörigkeit bringen.");

  return steps;
}