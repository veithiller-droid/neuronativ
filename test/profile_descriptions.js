// profile_descriptions.js
// Konfidenz-abhängige Beschreibungen für Hero-Container

const PROFILE_DESCRIPTIONS = {

  /* =====================================================
     1. ADHS-PROFIL - 5 Konfidenz-Stufen
  ===================================================== */
  
  adhd: {
    
    very_high: { // 85-100%
      title: "ADHS-Profil",
      description: `Ihre Ergebnisse zeigen ein deutliches ADHS-Profil mit hoher Übereinstimmung in mehreren Kernbereichen. 
      ADHS beschreibt eine neurobiologische Besonderheit der Aufmerksamkeitsregulation, bei der Fokus stark vom inneren Interesse 
      abhängt. Exekutive Funktionen wie Arbeitsgedächtnis und Impulskontrolle kosten mehr Energie als bei anderen, während 
      Hyperfokus bei persönlich bedeutsamen Themen außergewöhnlich intensiv sein kann. Diese Merkmale sind nicht willentlich 
      steuerbar und keine Charakterschwäche.`
    },
    
    high: { // 75-84%
      title: "Wahrscheinliches ADHS-Profil",
      description: `Ihre Ergebnisse sprechen mit hoher Wahrscheinlichkeit für ein ADHS-Profil. Die Merkmale zeigen sich 
      deutlich in mehreren Bereichen: interessenbasierte Aufmerksamkeit, erhöhter Aufwand für exekutive Funktionen und 
      Fähigkeit zu intensivem Hyperfokus. Die Ausprägung ist stark genug, um im Alltag spürbar zu sein, auch wenn 
      möglicherweise Kompensationsstrategien entwickelt wurden.`
    },
    
    medium: { // 60-74%
      title: "ADHS-Tendenzen erkennbar",
      description: `Ihre Ergebnisse zeigen ADHS-typische Merkmale, die jedoch nicht in allen Bereichen gleich stark 
      ausgeprägt sind. Aufmerksamkeit folgt eher innerem Interesse als äußeren Anforderungen, exekutive Funktionen 
      kosten mehr Energie als erwartet, und Vertiefung ist bei Faszination intensiv. Diese Merkmale können je nach 
      Kontext mehr oder weniger deutlich hervortreten.`
    },
    
    low: { // 45-59%
      title: "Leichte ADHS-Merkmale",
      description: `Einige ADHS-typische Tendenzen sind in Ihren Ergebnissen erkennbar, aber nicht ausgeprägt genug 
      für eine eindeutige Einordnung. Möglicherweise zeigen sich interessenbasierte Aufmerksamkeit oder exekutive 
      Herausforderungen nur in bestimmten Situationen, oder Kompensationsstrategien gleichen vieles aus. Eine andere 
      Konstellation ist ebenfalls möglich.`
    },
    
    very_low: { // <45%
      title: "ADHS-Merkmale nicht dominant",
      description: `ADHS-typische Merkmale zeigen sich in Ihren Ergebnissen nur schwach oder vereinzelt. Ihre 
      Aufmerksamkeitsregulation und exekutiven Funktionen scheinen weitgehend stabil zu arbeiten, auch wenn 
      andere Bereiche erhöht sein können.`
    }
  },

  /* =====================================================
     2. AUTISMUS-PROFIL - 5 Konfidenz-Stufen
  ===================================================== */
  
  autism: {
    
    very_high: { // 85-100%
      title: "Autismus-Profil",
      description: `Ihre Ergebnisse zeigen ein deutliches Autismus-Profil mit hoher Übereinstimmung in mehreren 
      Kernbereichen. Autismus beschreibt eine andere neurologische Verarbeitung, die sich auf sensorische Wahrnehmung, 
      soziale Informationsverarbeitung und Strukturbedürfnis auswirkt. Sinnesreize werden intensiver verarbeitet, 
      soziale Situationen eher analytisch als intuitiv erfasst, und Vorhersehbarkeit bietet wichtige innere Sicherheit. 
      Diese Unterschiede sind keine Defizite, sondern andere Verarbeitungswege.`
    },
    
    high: { // 75-84%
      title: "Wahrscheinliches Autismus-Profil",
      description: `Ihre Ergebnisse sprechen mit hoher Wahrscheinlichkeit für ein Autismus-Profil. Die Merkmale zeigen 
      sich deutlich: erhöhte sensorische Sensibilität, analytische soziale Wahrnehmung und Bedürfnis nach Struktur und 
      Vorhersehbarkeit. Die Ausprägung ist stark genug, um im Alltag spürbar zu sein, auch wenn möglicherweise intensive 
      Kompensation (Maskierung) stattfindet.`
    },
    
    medium: { // 60-74%
      title: "Autismus-Tendenzen erkennbar",
      description: `Ihre Ergebnisse zeigen Autismus-typische Merkmale, die jedoch nicht in allen Bereichen gleich stark 
      ausgeprägt sind. Sensorische Reize werden differenzierter wahrgenommen als bei den meisten Menschen, soziale 
      Situationen werden eher durchdacht als spontan erfasst, und Routinen bieten Stabilität. Diese Merkmale können 
      je nach Kontext und Umfeld mehr oder weniger deutlich hervortreten.`
    },
    
    low: { // 45-59%
      title: "Leichte Autismus-Merkmale",
      description: `Einige Autismus-typische Tendenzen sind in Ihren Ergebnissen erkennbar, aber nicht ausgeprägt genug 
      für eine eindeutige Einordnung. Möglicherweise zeigen sich sensorische Sensibilität, soziale Erschöpfung oder 
      Strukturbedürfnis nur in bestimmten Situationen. Andere Erklärungen wie Hochsensibilität oder situative Faktoren 
      sind ebenfalls möglich.`
    },
    
    very_low: { // <45%
      title: "Autismus-Merkmale nicht dominant",
      description: `Autismus-typische Merkmale zeigen sich in Ihren Ergebnissen nur schwach oder vereinzelt. Sensorische 
      Verarbeitung, soziale Navigation und Strukturbedürfnis scheinen weitgehend im durchschnittlichen Bereich zu liegen, 
      auch wenn andere Bereiche erhöht sein können.`
    }
  },

  /* =====================================================
     3. AuDHD-PROFIL - 5 Konfidenz-Stufen
  ===================================================== */
  
  audhd: {
    
    very_high: { // 85-100%
      title: "AuDHD-Profil",
      description: `Ihre Ergebnisse zeigen ein deutliches AuDHD-Profil – die Kombination von ADHS und Autismus als 
      eigenständiges neurologisches Profil. Dies ist keine einfache Addition beider Merkmale, sondern ein spezifisches 
      Erleben: Bedürfnis nach Struktur (Autismus) trifft auf schwankende exekutive Funktionen (ADHS), intensive Vertiefung 
      (Hyperfokus) auf sensorische Sensibilität, soziale Erschöpfung auf emotionale Dysregulation. Diese paradoxen 
      Kombinationen sind charakteristisch für AuDHD und keine inneren Widersprüche.`
    },
    
    high: { // 75-84%
      title: "Wahrscheinliches AuDHD-Profil",
      description: `Ihre Ergebnisse sprechen mit hoher Wahrscheinlichkeit für ein AuDHD-Profil. Sowohl ADHS-typische als 
      auch Autismus-typische Merkmale sind deutlich erkennbar und beeinflussen sich gegenseitig. Strategien, die nur für 
      ADHS oder nur für Autismus gedacht sind, passen oft nicht vollständig, weil beide Verarbeitungsweisen zusammenwirken.`
    },
    
    medium: { // 60-74%
      title: "AuDHD-Tendenzen erkennbar",
      description: `Ihre Ergebnisse zeigen sowohl ADHS- als auch Autismus-typische Merkmale, die jedoch nicht in allen 
      Bereichen gleich stark ausgeprägt sind. Möglicherweise dominiert eine Richtung oder beide zeigen sich situationsabhängig. 
      Die Überlappung ist erkennbar, aber nicht eindeutig genug für eine klare AuDHD-Zuordnung.`
    },
    
    low: { // 45-59%
      title: "Leichte Überlappung ADHS/Autismus",
      description: `Ihre Ergebnisse zeigen sowohl ADHS- als auch Autismus-typische Tendenzen in leichter Ausprägung. 
      Die Überlappung ist erkennbar, aber nicht stark genug für eine eindeutige AuDHD-Einordnung. Möglicherweise zeigt 
      sich nur eine Richtung deutlicher, oder beide sind eher als Traits vorhanden.`
    },
    
    very_low: { // <45%
      title: "Keine AuDHD-Merkmale",
      description: `Eine Kombination von ADHS und Autismus zeigt sich in Ihren Ergebnissen nicht. Entweder ist eine 
      Richtung dominanter, oder beide sind nicht ausgeprägt vorhanden.`
    }
  },

  /* =====================================================
     4. HOCHMASKIERTES PROFIL - 3 Konfidenz-Stufen
  ===================================================== */
  
  high_masking: {

    very_high: { // >85%
      title: "Extrem hochmaskiertes Profil",
      description: `Ihre Ergebnisse zeigen eine extrem intensive Maskierung – eine jahrelang verfeinerte Anpassung an neurotypische Erwartungen, 
      die enorm viel innere Energie kostet. Nach außen wirken Sie häufig kompetent, stabil und angepasst, während innerlich hohe Anspannung, 
      Erschöpfung oder Identitätsdiffusion besteht. Diese massive Diskrepanz ist typisch für hochmaskierte neurodivergente Menschen 
      und führt häufig zu verzögertem Burnout, psychischen Folgeerkrankungen oder dem Gefühl, "nicht mehr zu wissen, wer man wirklich ist". 
      Weniger maskieren in sicheren Räumen ist keine Schwäche, sondern lebenswichtige Selbstfürsorge.`
    },
    
    high: { // 75%+
      title: "Hochmaskiertes Profil",
      description: `Ihre Ergebnisse zeigen intensive Maskierung – bewusste oder unbewusste Anpassung an neurotypische 
      Erwartungen, die viel innere Energie kostet. Nach außen wirken Sie möglicherweise sozial kompetent und funktional, 
      während innerlich hohe Anspannung, Erschöpfung oder Desorientierung besteht. Diese Diskrepanz zwischen äußerer 
      Funktionsfähigkeit und innerem Erleben ist charakteristisch für hochmaskierte neurodivergente Menschen und führt 
      oft zu verzögerter Diagnose oder Burnout.`
    },
    
    medium: { // 60-74%
      title: "Deutliche Maskierung erkennbar",
      description: `Ihre Ergebnisse zeigen deutliche Maskierung und Anpassungsleistung. Sie investieren spürbar Energie 
      in soziale Anpassung, auch wenn dies nach außen nicht immer sichtbar ist. Diese Kompensation kann zeitweise 
      funktionieren, kostet aber mehr als andere vermuten und braucht regelmäßige Erholung.`
    },
    
    low: { // 45-59%
      title: "Moderate Anpassungsleistung",
      description: `Ihre Ergebnisse zeigen moderate Anpassungsleistung in sozialen Situationen. Sie passen sich 
      situationsabhängig an, ohne dass dies Ihr Leben dominiert. Die Energie, die dies kostet, ist erkennbar aber 
      handhabbar.`
    }
  },

  /* =====================================================
     5. ÜBERLASTUNGSPROFIL - 3 Konfidenz-Stufen
  ===================================================== */
  
  stress: {
    
    very_high: { // >85%
      title: "Starkes Überlastungsprofil",
      description: `Ihre Ergebnisse zeigen eine sehr starke Überlastung, die Ihr Erleben aktuell dominiert. Sensorische, 
      emotionale und soziale Reize überfordern extrem schnell, Erholung braucht sehr lange, und die Belastung überlagert möglicherweise andere Merkmale fast vollständig. 
      Dies kann bedeuten: Eine zugrundeliegende Neurodivergenz wird durch chronischen Stress massiv verstärkt, oder die Symptome sind primär belastungsbedingt. 
      Ohne deutliche Entlastung bleibt eine klare Differenzierung schwierig. Priorität hat jetzt Stabilisierung und Schutz vor weiterer Überforderung.`
    },

    high: { // 75%+
      title: "Überlastungsprofil",
      description: `Ihre Ergebnisse zeigen, dass aktuelle oder chronische Überlastung Ihr Erleben stark prägt. 
      Sensorische oder emotionale Reize überfordern schnell, Erholung braucht lange, und möglicherweise überlagert 
      diese Belastung andere Merkmale. Dies kann bedeuten: Zugrundeliegende Neurodivergenz wird durch Stress sichtbarer, 
      oder die Symptome sind primär belastungsbedingt. Ohne Entlastung ist Differenzierung schwer möglich.`
    },
    
    medium: { // 60-74%
      title: "Deutliche Überlastung erkennbar",
      description: `Ihre Ergebnisse zeigen deutliche Überlastungsmerkmale. Belastungsgrenzen werden häufig erreicht, 
      Erholung braucht Zeit, und möglicherweise verstärkt dies andere Schwierigkeiten. Stabilisierung und Entlastung 
      sind aktuell wichtiger als diagnostische Einordnung.`
    },
    
    low: { // 45-59%
      title: "Moderate Belastung erkennbar",
      description: `Ihre Ergebnisse zeigen moderate Belastungsmerkmale. Überlastung tritt situationsabhängig auf, 
      ist aber nicht permanent dominant. Selbstfürsorge und Pausen helfen meist, wieder ins Gleichgewicht zu kommen.`
    }
  },

  /* =====================================================
     6. SUBKLINISCHES PROFIL / TRAITS - 3 Stufen
  ===================================================== */
  
  traits: {

    very_high: { // 75%+ bei subklinischen Traits
      title: "Starke neurodivergente Traits",
      description: `Ihre Ergebnisse zeigen neurodivergente Merkmale (Traits) in mehreren Bereichen mit hoher Intensität, 
      erreichen aber nicht das Ausmaß einer klassischen klinischen Diagnose. Diese Traits sind deutlich spürbar und prägen Ihren Alltag, 
      sind aber möglicherweise gut kompensiert oder kontextabhängig. Viele Menschen mit starken Traits profitieren von Selbstverständnis als neurodivergent – 
      auch ohne formale Diagnose – weil es zu passenderen Strategien und mehr Selbstakzeptanz führt.`
    },
    
    high: { // 65-74%
      title: "Neurodivergente Traits erkennbar",
      description: `Ihre Ergebnisse zeigen neurodivergente Merkmale (Traits) in mehreren Bereichen, die jedoch nicht 
      das Ausmaß erreichen, das typischerweise mit klinischer Diagnose einhergeht. Sie sind erkennbar anders als der 
      statistische Durchschnitt, aber möglicherweise gut kompensiert, kontextabhängig oder tatsächlich wenig beeinträchtigend. 
      Selbstverständnis als neurodivergent kann auch ohne formale Diagnose hilfreich sein.`
    },
    
    medium: { // 55-64%
      title: "Leichte neurodivergente Tendenzen",
      description: `Ihre Ergebnisse zeigen leichte neurodivergente Tendenzen in einigen Bereichen. Diese Merkmale sind 
      erkennbar, aber moderat ausgeprägt. Möglicherweise zeigen sie sich nur in bestimmten Situationen oder sind durch 
      Anpassung gut handhabbar. Ob formale Abklärung sinnvoll ist, hängt vom persönlichen Leidensdruck ab.`
    },
    
    low: { // 45-54%
      title: "Sehr leichte Merkmale",
      description: `Ihre Ergebnisse zeigen sehr leichte neurodivergente Merkmale, die kaum über dem Durchschnitt liegen. 
      Diese Tendenzen sind minimal und beeinträchtigen vermutlich nicht nennenswert. Eine diagnostische Abklärung ist 
      in diesem Bereich meist nicht indiziert.`
    }
  },

  /* =====================================================
     7. DOMINANTE EINZELSKALA (NEU!)
  ===================================================== */
  
     single_dominant: {
    
    very_high: { // 90%+
      title: (scale) => {
        const names = {
          emotreg: 'Emotionale Dysregulation',
          overload: 'Chronische Überlastung',
          executive: 'Exekutive Dysfunktion',
          sensory: 'Sensorische Empfindlichkeit',
          masking: 'Intensive Maskierung',
          social: 'Soziale Erschöpfung',
          alexithymia: 'Eingeschränkte Emotionswahrnehmung',
          attention: 'Aufmerksamkeitsschwierigkeiten',
          structure: 'Starkes Strukturbedürfnis',
          hyperfocus: 'Intensiver Hyperfokus'
        };
        const name = names[scale] || 'Dieses Merkmal';
        return `Prägendes Merkmal: ${name}`;
      },
      description: (scale, score) => {
        const descriptions = {
          emotreg: `Ihre emotionale Regulation ist extrem erhöht (${score}%) – dies bedeutet massive Schwierigkeiten, Gefühle zu dosieren, Stimmungswechsel zu kontrollieren und nach emotionalen Situationen runterzukommen. Dies sollte prioritär adressiert werden, unabhängig davon ob ADHD, Autismus oder andere Faktoren zugrunde liegen.`,

          overload: `Ihre Überlastungswerte sind extrem hoch (${score}%) – Sie erreichen regelmäßig Ihre Belastungsgrenzen und benötigen deutlich längere Erholungszeiten als andere. Dies kann zugrundeliegende Neurodivergenz überlagern oder Folge chronischer Überforderung sein.`,

          executive: `Ihre exekutiven Funktionen sind stark beeinträchtigt (${score}%) – Arbeitsgedächtnis, Handlungsplanung, Impulskontrolle und kognitive Flexibilität kosten Sie erheblich mehr Energie als durchschnittlich. Dies ist ein Kernsymptom von ADHD, kann aber auch andere Ursachen haben.`,

          sensory: `Ihre sensorische Empfindlichkeit ist extrem ausgeprägt (${score}%) – Reize werden deutlich intensiver wahrgenommen und verarbeitet als bei den meisten Menschen. Dies ist charakteristisch für Autismus, kann aber auch bei ADHD, Hochsensibilität oder nach Trauma auftreten.`,

          masking: `Ihre Maskierungswerte sind extrem hoch (${score}%) – Sie investieren massive Energie in soziale Anpassung und das Verbergen eigener Bedürfnisse. Dies kann jahrelang funktionieren, führt aber oft zu verzögerter Erschöpfung oder Burnout und verschleiert zugrundeliegende Neurodivergenz.`,

          social: `Ihre sozialen Werte sind stark erhöht (${score}%) – soziale Situationen kosten Sie deutlich mehr Energie als durchschnittlich, und Sie müssen soziale Interaktion bewusst analysieren statt intuitiv zu navigieren. Dies kann auf Autismus, soziale Angst oder andere Faktoren hinweisen.`,

          alexithymia: `Ihre Emotionswahrnehmung ist stark eingeschränkt (${score}%) – eigene Gefühle wahrzunehmen, zu benennen und einzuordnen fällt Ihnen deutlich schwerer als den meisten Menschen. Dies kommt häufig bei Autismus vor, kann aber auch andere Ursachen haben.`,

          attention: `Ihre Aufmerksamkeitswerte sind extrem erhöht (${score}%) – die Steuerung und Aufrechterhaltung von Aufmerksamkeit kostet Sie massiv Energie, besonders bei nicht-interessanten Aufgaben. Dies ist ein Kernsymptom von ADHD, kann aber auch durch Depression oder chronische Erschöpfung verursacht sein.`,

          structure: `Ihr Strukturbedürfnis ist extrem ausgeprägt (${score}%) – Vorhersehbarkeit und feste Abläufe sind für Sie essentiell für innere Sicherheit. Veränderungen kosten Sie deutlich mehr Energie als durchschnittlich. Dies ist typisch für Autismus, kann aber auch andere Ursachen haben.`,

          hyperfocus: `Ihr Hyperfokus ist extrem stark ausgeprägt (${score}%) – wenn Sie sich in etwas vertiefen, verschwindet das Bewusstsein für Zeit, Bedürfnisse und Umgebung fast vollständig. Dies ist charakteristisch für ADHD und zeigt, dass Ihre Aufmerksamkeit nicht grundsätzlich gestört ist, sondern interessenbasiert funktioniert.`
        };
        return descriptions[scale] || `Ihr Wert in diesem Bereich ist mit ${score}% extrem erhöht und dominiert Ihr Profil deutlich.`;
      }
    },

    high: { // 85-89%
      title: (scale) => {
        const names = {
          emotreg: 'Emotionale Dysregulation',
          overload: 'Chronische Überlastung',
          executive: 'Exekutive Dysfunktion',
          sensory: 'Sensorische Empfindlichkeit',
          masking: 'Intensive Maskierung',
          social: 'Soziale Erschöpfung',
          alexithymia: 'Eingeschränkte Emotionswahrnehmung',
          attention: 'Aufmerksamkeitsschwierigkeiten',
          structure: 'Starkes Strukturbedürfnis',
          hyperfocus: 'Intensiver Hyperfokus'
        };
        const name = names[scale] || 'Dieses Merkmal';
        return `Deutlich prägendes Merkmal: ${name}`;
      },
      description: (scale, score) => 
        `Ihr Wert in diesem Bereich (${score}%) ist deutlich höher als alle anderen Bereiche. Dieses Merkmal prägt Ihr Erleben spürbar und sollte bei der weiteren Einordnung priorisiert werden.`
    },

    medium: { // 75-84%
      title: (scale) => {
        const names = {
          emotreg: 'Emotionale Dysregulation',
          overload: 'Chronische Überlastung',
          executive: 'Exekutive Dysfunktion',
          sensory: 'Sensorische Empfindlichkeit',
          masking: 'Intensive Maskierung',
          social: 'Soziale Erschöpfung',
          alexithymia: 'Eingeschränkte Emotionswahrnehmung',
          attention: 'Aufmerksamkeitsschwierigkeiten',
          structure: 'Starkes Strukturbedürfnis',
          hyperfocus: 'Intensiver Hyperfokus'
        };
        const name = names[scale] || 'Dieses Merkmal';
        return `Erkennbar prägendes Merkmal: ${name}`;
      },
      description: (scale, score) => 
        `Ihr Wert in diesem Bereich (${score}%) liegt erkennbar über den anderen und prägt Ihr Erleben. Die anderen Bereiche sind moderater ausgeprägt. Dieses Merkmal steht im Vordergrund.`
    },

    low: { // 60-74%
      title: (scale) => {
        const names = {
          emotreg: 'Emotionale Dysregulation',
          overload: 'Chronische Überlastung',
          executive: 'Exekutive Dysfunktion',
          sensory: 'Sensorische Empfindlichkeit',
          masking: 'Intensive Maskierung',
          social: 'Soziale Erschöpfung',
          alexithymia: 'Eingeschränkte Emotionswahrnehmung',
          attention: 'Aufmerksamkeitsschwierigkeiten',
          structure: 'Starkes Strukturbedürfnis',
          hyperfocus: 'Intensiver Hyperfokus'
        };
        const name = names[scale] || 'Dieses Merkmal';
        return `Leicht prägendes Merkmal: ${name}`;
      },
      description: (scale, score) => 
        `Ihr Wert in diesem Bereich (${score}%) ist spürbar höher als die anderen und beeinflusst Ihr Erleben leicht. Es ist nicht extrem dominant, aber erkennbar im Vordergrund.`
    }
  },
  
  /* =====================================================
     8. GEMISCHTES PROFIL
  ===================================================== */
  
  mixed: {
    title: "Gemischtes Profil - keine klare Richtung",
    description: `Ihre Ergebnisse zeigen Merkmale, die sich über verschiedene Bereiche verteilen, ohne dass eine 
    klare Richtung (ADHS, Autismus oder andere) dominant wird. Dies kann bedeuten: (1) Mehrere leichte Tendenzen 
    sind vorhanden ohne spezifisches Profil, (2) Aktuelle Belastung überlagert zugrundeliegende Merkmale, (3) Die 
    Fragen treffen Ihr Erleben nicht präzise genug. Bei Unsicherheit kann Re-Evaluation nach Entlastung oder 
    Austausch mit Fachpersonen hilfreich sein.`
  },

  /* =====================================================
     9. UNTERDURCHSCHNITTLICHE WERTE
  ===================================================== */
  
  very_low: {
    title: "Unterdurchschnittliche Werte",
    description: `Ihre Antworten zeigen durchgehend sehr niedrige Werte in allen Bereichen. Dies kann verschiedene 
    Ursachen haben: (1) Emotionale Erschöpfung oder Depression, bei der alles abgeflacht wirkt, (2) Eingeschränkte 
    Selbstwahrnehmung (Alexithymie, Dissoziation), (3) Ein anderer innerer Zustand, der aktuell die Wahrnehmung 
    beeinflusst, (4) Unterschiedliche Vergleichsmaßstäbe. Falls Sie sich innerlich leer, abgeschnitten oder erschöpft 
    fühlen, kann dies auf einen Zustand hinweisen, der zunächst Stabilisierung braucht.`
  },

  /* =====================================================
     10. UNAUFFÄLLIGES PROFIL
  ===================================================== */
  
  unremarkable: {
    title: "Unauffälliges Profil",
    description: `Ihre Werte liegen weitgehend im durchschnittlichen Bereich. Es zeigen sich keine deutlichen 
    neurodivergenten Merkmale in den erfassten Bereichen. Dies bedeutet nicht, dass Sie keine individuellen 
    Herausforderungen haben können – diese scheinen jedoch nicht primär neurodevelopmental bedingt zu sein. 
    Bei aktuellen Schwierigkeiten können andere Faktoren wie Lebenssituation, Beziehungen, körperliche Gesundheit 
    oder spezifische Belastungen relevanter sein.`
  },
/* =====================================================
     11. ADHS SUBTYPEN
  ===================================================== */
  
  adhd_subtypes: {
    
    inattentive: {
      title: "ADHS - Unaufmerksamer Typ",
      description: `Ihre Aufmerksamkeit wandert besonders bei weniger interessanten Aufgaben. Handlungsplanung und Impulskontrolle sind weniger betroffen als die Aufrechterhaltung von Fokus. Dies ist der "stille" ADHS-Typ, der oft übersehen wird, weil keine motorische Unruhe vorliegt.`,
      clinical_note: "ADHD-I (Predominantly Inattentive Type)"
    },
    
    hyperactive: {
      title: "ADHS - Hyperaktiv-Impulsiver Typ",
      description: `Impulskontrolle und innere Unruhe dominieren Ihr Profil. Sie brauchen Bewegung, haben Schwierigkeiten stillzusitzen, und emotionale Regulation kostet viel Energie. Ihre Aufmerksamkeit selbst ist weniger das Problem als die innere motorische Spannung.`,
      clinical_note: "ADHD-H (Predominantly Hyperactive-Impulsive Type)"
    },
    
    combined: {
      title: "ADHS - Kombinierter Typ",
      description: `Sowohl Aufmerksamkeitssteuerung als auch Impulskontrolle und innere Unruhe sind deutlich ausgeprägt. Diese Kombination zeigt sich in vielen Alltagssituationen und ist der häufigste ADHS-Subtyp.`,
      clinical_note: "ADHD-C (Combined Type)"
    },
    
    emotional: {
      title: "ADHS mit emotionaler Dysregulation",
      description: `Neben den Aufmerksamkeits- und Steuerungsthemen ist besonders die emotionale Regulation stark betroffen. Gefühle können überwältigend sein, Stimmungswechsel sind abrupt, und das Runterregulieren nach intensiven Emotionen dauert lange. Dies wird zunehmend als eigenständiges ADHS-Muster erkannt.`,
      clinical_note: "ADHD with Emotional Dysregulation"
    }
  },

  /* =====================================================
     12. AUTISMUS SUBTYPEN
  ===================================================== */

  autism_subtypes: {
    
    classic: {
      title: "Klassisches Autismus-Profil",
      description: `Sie nehmen Sinnesreize intensiver wahr, verarbeiten soziale Situationen eher analytisch als intuitiv, und Vorhersehbarkeit gibt Ihnen wichtige innere Sicherheit. Diese drei Bereiche (sensorisch, sozial, Struktur) zeigen sich alle deutlich - das klassische Autismus-Profil.`,
      clinical_note: "Classic Autism Profile"
    },
    
    masked: {
      title: "Hochmaskiertes Autismus-Profil",
      description: `Sie haben intensive Strategien entwickelt, um sozial anzupassen. Das kostet massive Energie und kann jahrelang unbemerkt bleiben. Ihre sensorische Wahrnehmung ist differenzierter als bei den meisten, aber die Kompensation steht im Vordergrund. Dies führt oft zu später Diagnose oder Burnout.`,
      clinical_note: "Highly Masked Autism (Late Recognition Pattern)"
    },
    
    female: {
      title: "Female/Diverse Autismus-Präsentation",
      description: `Ihr Muster zeigt intensive soziale Anpassung bei gleichzeitig hohem Energieaufwand. Diese Art der Kompensation ist häufig bei weiblich sozialisierten oder diversen autistischen Menschen und wurde möglicherweise lange nicht als autistisch erkannt. Forschung zeigt: Frauen maskieren intensiver und werden durchschnittlich 6 Jahre später diagnostiziert.`,
      clinical_note: "Female/Diverse Autism Presentation"
    },
    
    hyperfocus: {
      title: "Autismus mit intensiven Spezialinteressen",
      description: `Zusätzlich zu den autistischen Merkmalen zeigt sich bei Ihnen sehr intensiver Hyperfokus. Wenn Sie sich in ein Thema vertiefen, verschwindet das Zeitgefühl fast vollständig. Spezialinteressen sind bei Ihnen nicht nur "Hobbys", sondern essentiell für Regulation und Wohlbefinden.`,
      clinical_note: "Autism with Intense Special Interest Pattern"
    }
  },

  /* =====================================================
     13. AuDHD SUBTYPEN
  ===================================================== */

  audhd_subtypes: {
    
    specific: {
      title: "Eigenständiges AuDHD-Profil",
      description: `Ihre Merkmale sprechen für eine Kombination aus ADHS und Autismus, die sich gegenseitig beeinflusst. Intensive Vertiefung (ADHS) trifft auf Strukturbedürfnis (Autismus), während gleichzeitig beide Systeme viel Energie kosten. Dies ist KEIN "doppeltes Pech", sondern ein eigenständiges neurologisches Profil mit eigener Dynamik.`,
      clinical_note: "AuDHD as distinct profile (not simple comorbidity)"
    },
    
    conflict: {
      title: "AuDHD mit inneren Konflikten",
      description: `Sie erleben möglicherweise innere Widersprüche: Das Bedürfnis nach Struktur (Autismus) kollidiert mit Schwierigkeiten, diese aufrechtzuerhalten (ADHS). Oder: Intensive Vertiefung widerspricht dem Wunsch nach Varianz. Diese scheinbaren Widersprüche sind bei AuDHD normal und kein Zeichen von "schlechter Kompensation".`,
      clinical_note: "AuDHD with internal conflicts"
    }
  }

}

export { PROFILE_DESCRIPTIONS };
