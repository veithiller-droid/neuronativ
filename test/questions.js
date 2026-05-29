// questions.js
// 115 Test-Fragen für Neurodivergenz-Screening
// Version: 2.0 (Forschungsniveau)
// Organisation: Nach Skalen gruppiert für bessere Wartbarkeit
// Frontend kann Reihenfolge beim Rendern mischen

export const questions = [
  
  // ========================================
  // ATTENTION (10 Fragen)
  // ========================================
  { id: "att_01", scale: "attention", text: "Ich beginne Aufgaben motiviert, verliere aber unterwegs den inneren Halt." },
  { id: "att_02", scale: "attention", text: "Meine Aufmerksamkeit schwankt stark je nach Interesse." },
  { id: "att_03", scale: "attention", text: "Ich brauche viel innere Energie, um Alltägliches zu erledigen." },
  { id: "att_04", scale: "attention", text: "Routinetätigkeiten kosten mich unverhältnismäßig viel Kraft." },
  { id: "att_05", scale: "attention", text: "Ich arbeite besser unter Druck als ohne klare äußere Vorgaben." },
  { id: "att_06", scale: "attention", text: "Ich weiß oft, was zu tun wäre, komme aber schwer ins Tun." },
  { id: "att_07", scale: "attention", text: "Meine Gedanken laufen parallel in mehrere Richtungen." },
  { id: "att_08", scale: "attention", text: "Ich verliere Zeitgefühl, wenn mich etwas interessiert." },
  { id: "att_09", scale: "attention", text: "Ich bin innerlich oft unruhig, auch wenn ich nach außen ruhig wirke." },
  { id: "att_10", scale: "attention", text: "Ich muss mich aktiv strukturieren, um nicht den Überblick zu verlieren." },
  
  // ========================================
  // SENSORY (14 Fragen - erweitert von 9)
  // ========================================
  { id: "sen_01", scale: "sensory", text: "Bestimmte Geräusche empfinde ich als körperlich unangenehm." },
  { id: "sen_02", scale: "sensory", text: "Helles Licht oder visuelle Unruhe ermüden mich schnell." },
  { id: "sen_03", scale: "sensory", text: "Mehrere gleichzeitige Eindrücke überfordern mich innerlich." },
  { id: "sen_04", scale: "sensory", text: "Ich bemerke Reize oft früher als andere." },
  { id: "sen_05", scale: "sensory", text: "Kleidung, Materialien oder Berührungen können mich stark irritieren." },
  { id: "sen_06", scale: "sensory", text: "Ich meide bestimmte Orte wegen Geräuschen, Licht oder Gerüchen." },
  { id: "sen_07", scale: "sensory", text: "Ich nehme feine Unterschiede in Licht, Farben oder Bewegungen stark wahr." },
  { id: "sen_08", scale: "sensory", text: "Mein Körper reagiert deutlich auf sensorische Überforderung." },
  { id: "sen_09", scale: "sensory", text: "Nach sensorischer Belastung brauche ich bewusst Ruhe zur Regulation." },
  { id: "sen_10", scale: "sensory", text: "Ich suche aktiv nach sensorischen Reizen wie Druck oder Bewegung, um mich zu beruhigen." },
  { id: "sen_11", scale: "sensory", text: "Bestimmte Gerüche (z.B. Parfüm, Reinigungsmittel) sind für mich unerträglich." },
  { id: "sen_12", scale: "sensory", text: "Ich bin sehr wählerisch beim Essen, oft wegen Konsistenz oder Geschmack." },
  { id: "sen_13", scale: "sensory", text: "Ich bemerke Hunger, Durst oder Harndrang oft erst sehr spät." },
  { id: "sen_14", scale: "sensory", text: "Feinmotorische Aufgaben wie Schreiben oder Knöpfe schließen fallen mir schwer." },
  
  // ========================================
  // SOCIAL (11 Fragen - erweitert von 10, -1 Duplett)
  // ========================================
  { id: "soc_01", scale: "social", text: "Small Talk kostet mich viel Energie." },
  { id: "soc_02", scale: "social", text: "Gruppensituationen sind innerlich anstrengend für mich." },
  // soc_03 ENTFERNT (Duplett zu soc_10: "Nach sozialen Kontakten brauche ich Erholungszeit")
  { id: "soc_04", scale: "social", text: "Ich denke Gespräche oft vor oder nach." },
  { id: "soc_05", scale: "social", text: "Ironie oder Andeutungen irritieren mich manchmal." },
  { id: "soc_06", scale: "social", text: "Ich beobachte andere, um angemessen zu reagieren." },
  { id: "soc_07", scale: "social", text: "Spontane soziale Situationen stressen mich." },
  { id: "soc_08", scale: "social", text: "Ich bevorzuge klare, direkte Kommunikation." },
  { id: "soc_09", scale: "social", text: "Ich analysiere soziale Situationen bewusst." },
  { id: "soc_10", scale: "social", text: "Nach sozialen Kontakten bin ich innerlich erschöpft." },
  { id: "soc_11", scale: "social", text: "Ich habe Schwierigkeiten, non-verbale Signale wie Mimik oder Tonfall zu deuten." },
  { id: "soc_12", scale: "social", text: "Ich fühle mich in engen Beziehungen überfordert von emotionalen Erwartungen." },
  
  // ========================================
  // MASKING (12 Fragen - erweitert von 8)
  // ========================================
  { id: "mas_01", scale: "masking", text: "Ich passe meine Ausdrucksweise an mein Gegenüber an." },
  { id: "mas_02", scale: "masking", text: "Ich habe gelernt, mich sozial richtig zu verhalten." },
  { id: "mas_03", scale: "masking", text: "Ich übe Reaktionen oder Gespräche innerlich vor." },
  { id: "mas_04", scale: "masking", text: "Ich versuche, möglichst unauffällig zu wirken." },
  { id: "mas_05", scale: "masking", text: "Ich unterdrücke Bedürfnisse, um dazuzugehören." },
  { id: "mas_06", scale: "masking", text: "Ich merke erst im Nachhinein, wie anstrengend soziale Situationen waren." },
  { id: "mas_07", scale: "masking", text: "Mein äußeres Auftreten entspricht nicht immer meinem inneren Zustand." },
  { id: "mas_08", scale: "masking", text: "Anpassung kostet mich mehr Kraft, als man sieht." },
  { id: "mas_09", scale: "masking", text: "Ich habe mir Gesprächsskripte oder Standardantworten zurechtgelegt." },
  { id: "mas_10", scale: "masking", text: "Ich imitiere bewusst Mimik oder Körpersprache anderer." },
  { id: "mas_11", scale: "masking", text: "Ich zwinge mich zu Augenkontakt, auch wenn es unangenehm ist." },
  { id: "mas_12", scale: "masking", text: "Masking führt langfristig zu Erschöpfung oder dem Gefühl, mich selbst zu verlieren." },
  
  // ========================================
  // STRUCTURE (12 Fragen - erweitert von 9, -1 Duplett, +1 umplatziert)
  // ========================================
  { id: "str_01", scale: "structure", text: "Klare Abläufe und Planung geben mir innere Sicherheit und Ruhe." }, 
  { id: "str_02", scale: "structure", text: "Zu viele Optionen überfordern mich." },
  // str_03 ENTFERNT (kombiniert mit str_01: "Planung hilft mir, innerlich ruhig zu bleiben")
  { id: "str_04", scale: "structure", text: "Spontane Entscheidungen anderer stressen mich." },
  { id: "str_05", scale: "structure", text: "Chaos im Außen wirkt sich stark auf mein Inneres aus." },
  { id: "str_06", scale: "structure", text: "Ich reagiere sensibel auf Unklarheit oder Unsicherheit." },
  { id: "str_07", scale: "structure", text: "Struktur ist für mich entlastend, nicht einengend." },
  { id: "str_08", scale: "structure", text: "Veränderungen kosten mich mehr Energie als andere vermuten." },
  { id: "str_09", scale: "structure", text: "Ich brauche Vorhersehbarkeit, um mich wohlzufühlen." },
  { id: "str_10", scale: "structure", text: "Bewährte Abläufe geben mir Halt, Veränderungen kosten Energie." }, // UMPLATZIERT von hyp_09
  { id: "str_11", scale: "structure", text: "Ich entwickle eigene Rituale oder Abläufe, um den Alltag zu bewältigen." },
  { id: "str_12", scale: "structure", text: "Ich habe Themen, mit denen ich mich sehr intensiv und detailliert beschäftige." },
  
  // ========================================
  // OVERLOAD (8 Fragen - reduziert von 9, -1 Duplett)
  // ========================================
  { id: "ovl_01", scale: "overload", text: "Ich merke oft erst spät, dass mir Reize zu viel werden." },
  { id: "ovl_02", scale: "overload", text: "Ich reguliere mich über Rückzug, Stille, Wiederholung oder ähnliche Strategien." }, // KOMBINIERT (ovl_02 + ovl_05)
  { id: "ovl_03", scale: "overload", text: "Mein Körper reagiert stark auf Stress oder Überforderung." },
  { id: "ovl_04", scale: "overload", text: "In vollen oder lauten Umgebungen fühle ich mich schnell leer." },
  // ovl_05 ENTFERNT (kombiniert mit ovl_02: "Ich reguliere mich über Rückzug, Stille oder Wiederholung")
  { id: "ovl_06", scale: "overload", text: "Wenn ich überreizt bin, fällt mir Denken oder Sprechen schwerer." },
  { id: "ovl_07", scale: "overload", text: "Nach reizintensiven Tagen bin ich emotional erschöpft." },
  { id: "ovl_08", scale: "overload", text: "Andere unterschätzen, wie stark mich Sinneseindrücke beeinflussen." },
  { id: "ovl_09", scale: "overload", text: "Erholung dauert bei mir länger als bei anderen." },
  
  // ========================================
  // ALEXITHYMIA (11 Fragen - erweitert von 9)
  // ========================================
  { id: "alx_01", scale: "alexithymia", text: "Es fällt mir schwer, meine Gefühle in Worte zu fassen." },
  { id: "alx_02", scale: "alexithymia", text: "Körperliche Spannungen erkenne ich früher als Gefühle." },
  { id: "alx_03", scale: "alexithymia", text: "Ich analysiere Situationen eher sachlich als emotional." },
  { id: "alx_04", scale: "alexithymia", text: "Ich merke oft erst spät, wie es mir emotional geht." },
  { id: "alx_05", scale: "alexithymia", text: "Gefühle zeigen sich bei mir eher körperlich als gedanklich." },
  { id: "alx_06", scale: "alexithymia", text: "Ich brauche Zeit, um zu verstehen, was ich fühle." },
  { id: "alx_07", scale: "alexithymia", text: "Wenn andere nach meinen Gefühlen fragen, bin ich unsicher, was ich antworten soll." },
  { id: "alx_08", scale: "alexithymia", text: "Mir fällt es leichter, über Gedanken als über Gefühle zu sprechen." },
  { id: "alx_09", scale: "alexithymia", text: "Ich spüre, dass etwas in mir los ist, kann es aber schwer benennen." },
  { id: "alx_10", scale: "alexithymia", text: "Ich habe Mühe, die Gefühle anderer korrekt einzuschätzen." },
  { id: "alx_11", scale: "alexithymia", text: "Ich fühle mit anderen stark mit, aber es überfordert mich emotional." },
  
  // ========================================
  // EXECUTIVE (17 Fragen - erweitert von 10)
  // ========================================
  { id: "exe_01", scale: "executive", text: "Ich vergesse, was ich gerade tun wollte." },
  { id: "exe_02", scale: "executive", text: "Beim Einkaufen vergesse ich Dinge, selbst mit Liste." },
  { id: "exe_03", scale: "executive", text: "Ich unterbreche andere, bevor sie fertig sind." },
  { id: "exe_04", scale: "executive", text: "Ich sage Dinge, bevor ich zu Ende gedacht habe." },
  { id: "exe_05", scale: "executive", text: "Zwischen Aufgaben zu wechseln kostet mich viel Energie." },
  { id: "exe_06", scale: "executive", text: "Wenn ich unterbrochen werde, fällt es schwer, wieder reinzukommen." },
  { id: "exe_07", scale: "executive", text: "Ich muss mich bewegen, um zu denken." },
  { id: "exe_08", scale: "executive", text: "Stillsitzen fällt mir körperlich schwer." },
  { id: "exe_09", scale: "executive", text: "Wichtige Dinge verlege ich regelmäßig." },
  { id: "exe_10", scale: "executive", text: "Zeitabschätzung fällt mir schwer." },
  { id: "exe_11", scale: "executive", text: "Ich bleibe oft an einer Lösungsstrategie hängen, auch wenn sie nicht funktioniert." },
  { id: "exe_12", scale: "executive", text: "Multitasking ist für mich unmöglich, ohne Fehler zu machen." },
  { id: "exe_13", scale: "executive", text: "Ich kaufe Dinge spontan, über die ich später nachdenke." },
  { id: "exe_14", scale: "executive", text: "Ich habe Schwierigkeiten, auf Belohnungen zu warten." },
  { id: "exe_15", scale: "executive", text: "Selbst wichtige Aufgaben zu beginnen, fühlt sich an wie gegen eine Wand zu laufen." },
  { id: "exe_16", scale: "executive", text: "Zwischen 'wissen was zu tun ist' und 'es tatsächlich tun' liegt bei mir eine unsichtbare Barriere." },
  { id: "exe_17", scale: "executive", text: "Ich habe Schwierigkeiten, Prioritäten zu setzen, wenn mehrere Aufgaben anstehen." },
  
  // ========================================
  // EMOTREG (10 Fragen - unverändert)
  // ========================================
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
  
  // ========================================
  // HYPERFOCUS (11 Fragen - erweitert von 10, -1 umplatziert)
  // ========================================
  { id: "hyp_01", scale: "hyperfocus", text: "Wenn mich etwas fasziniert, vergesse ich alles andere." },
  { id: "hyp_02", scale: "hyperfocus", text: "Ich recherchiere Themen bis zur Erschöpfung." },
  { id: "hyp_03", scale: "hyperfocus", text: "Meine Interessen sind sehr intensiv." },
  { id: "hyp_04", scale: "hyperfocus", text: "Ich kann stundenlang an einer Sache arbeiten, ohne Pause." },
  { id: "hyp_05", scale: "hyperfocus", text: "Wenn ich in etwas vertieft bin, höre ich nicht, wenn man mich anspricht." },
  { id: "hyp_06", scale: "hyperfocus", text: "Ich verliere mich in Details." },
  { id: "hyp_07", scale: "hyperfocus", text: "Neue Interessen packen mich vollständig." },
  { id: "hyp_08", scale: "hyperfocus", text: "Ich kann nicht aufhören, auch wenn ich erschöpft bin." },
  // hyp_09 UMPLATZIERT zu str_10 ("Bewährte Abläufe geben mir Halt, Veränderungen kosten Energie")
  { id: "hyp_10", scale: "hyperfocus", text: "Intensive Beschäftigung führt zum Vergessen von Zeit und Bedürfnissen." },
  { id: "hyp_11", scale: "hyperfocus", text: "Meine Interessen wechseln abrupt, sobald die Intensität nachlässt." },
  { id: "hyp_12", scale: "hyperfocus", text: "Hyperfokus hilft mir, in bestimmten Bereichen überdurchschnittlich gut zu sein." }
];

// ========================================
// ZUSAMMENFASSUNG
// ========================================
// Gesamtzahl: 115 Fragen
// 
// Verteilung:
// - Attention:    10 (unverändert)
// - Sensory:      14 (+5 neu)
// - Social:       11 (+2 neu, -1 Duplett)
// - Masking:      12 (+4 neu)
// - Structure:    12 (+3 neu, -1 Duplett, +1 umplatziert)
// - Overload:      8 (-1 Duplett)
// - Alexithymia:  11 (+2 neu)
// - Executive:    17 (+7 neu)
// - Emotreg:      10 (unverändert)
// - Hyperfocus:   11 (+2 neu, -1 umplatziert)
//
// Änderungslog:
// - soc_03 entfernt (Duplett zu soc_10)
// - ovl_02 + ovl_05 kombiniert zu neuem ovl_02
// - str_01 + str_03 kombiniert zu neuem str_01
// - hyp_09 umplatziert zu str_10
// + 24 neue Fragen für medizinische Tiefe