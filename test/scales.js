// scales.js
// Skalen-Definitionen für Neurodivergenz-Test
// Version: 2.0 (angepasst für 115 Fragen)

export const SCALES = {
  
  attention: {
    label: "Aufmerksamkeit & Selbstregulation",
    items: [
      "att_01", "att_02", "att_03", "att_04", "att_05",
      "att_06", "att_07", "att_08", "att_09", "att_10"
    ]
    // 10 Items (unverändert)
  },
  
  sensory: {
    label: "Sensorische Empfindlichkeit",
    items: [
      "sen_01", "sen_02", "sen_03", "sen_04", "sen_05",
      "sen_06", "sen_07", "sen_08", "sen_09", "sen_10",
      "sen_11", "sen_12", "sen_13", "sen_14"
    ]
    // 14 Items (+5 neu: sen_10-sen_14)
    // Neu: Hyposensitivität, Geruch, Geschmack, Interozeption, Feinmotorik
  },
  
  social: {
    label: "Soziale Wahrnehmung",
    items: [
      "soc_01", "soc_02", "soc_04", "soc_05", "soc_06",
      "soc_07", "soc_08", "soc_09", "soc_10", "soc_11",
      "soc_12"
    ]
    // 11 Items (+2 neu, -1 entfernt)
    // ENTFERNT: soc_03 (Duplett zu soc_10)
    // NEU: soc_11 (non-verbale Signale), soc_12 (enge Beziehungen)
  },
  
  masking: {
    label: "Maskierung & Anpassung",
    items: [
      "mas_01", "mas_02", "mas_03", "mas_04", "mas_05",
      "mas_06", "mas_07", "mas_08", "mas_09", "mas_10",
      "mas_11", "mas_12"
    ]
    // 12 Items (+4 neu: mas_09-mas_12)
    // Neu: Gesprächsskripte, Mimik imitieren, Augenkontakt, Langzeitfolgen
  },
  
  structure: {
    label: "Struktur & Sicherheit",
    items: [
      "str_01", "str_02", "str_04", "str_05", "str_06",
      "str_07", "str_08", "str_09", "str_10", "str_11",
      "str_12"
    ]
    // 12 Items (+3 neu, -1 kombiniert, +1 umplatziert)
    // KOMBINIERT: str_01 (war str_01 + str_03)
    // ENTFERNT: str_03 (kombiniert mit str_01)
    // UMPLATZIERT: str_10 (war hyp_09)
    // NEU: str_11 (Rituale), str_12 (Spezialinteressen)
  },
  
  overload: {
    label: "Sensorische & emotionale Überlastung",
    items: [
      "ovl_01", "ovl_02", "ovl_03", "ovl_04", "ovl_06",
      "ovl_07", "ovl_08", "ovl_09"
    ]
    // 8 Items (-1 kombiniert)
    // KOMBINIERT: ovl_02 (war ovl_02 + ovl_05)
    // ENTFERNT: ovl_05 (kombiniert mit ovl_02)
  },
  
  alexithymia: {
    label: "Emotionswahrnehmung",
    items: [
      "alx_01", "alx_02", "alx_03", "alx_04", "alx_05",
      "alx_06", "alx_07", "alx_08", "alx_09", "alx_10",
      "alx_11"
    ]
    // 11 Items (+2 neu: alx_10-alx_11)
    // Neu: Gefühle anderer einschätzen (ToM), affektive Empathie
  },
  
  executive: {
    label: "Exekutivfunktionen",
    items: [
      "exe_01", "exe_02", "exe_03", "exe_04", "exe_05",
      "exe_06", "exe_07", "exe_08", "exe_09", "exe_10",
      "exe_11", "exe_12", "exe_13", "exe_14", "exe_15",
      "exe_16", "exe_17"
    ]
    // 17 Items (+7 neu: exe_11-exe_17)
    // Neu: Set-Shifting, Multitasking, Impulskontrolle (Handlung), 
    //      Bedürfnisaufschub, Task Initiation (2x), Priorisierung
  },
  
  emotreg: {
    label: "Emotionale Regulation",
    items: [
      "emo_01", "emo_02", "emo_03", "emo_04", "emo_05",
      "emo_06", "emo_07", "emo_08", "emo_09", "emo_10"
    ]
    // 10 Items (unverändert)
  },
  
  hyperfocus: {
    label: "Hyperfokus & Spezialinteressen",
    items: [
      "hyp_01", "hyp_02", "hyp_03", "hyp_04", "hyp_05",
      "hyp_06", "hyp_07", "hyp_08", "hyp_10", "hyp_11",
      "hyp_12"
    ]
    // 11 Items (+2 neu, -1 umplatziert)
    // UMPLATZIERT: hyp_09 (jetzt str_10)
    // NEU: hyp_11 (Interest-Cycling), hyp_12 (Stärken-Perspektive)
  }
};

// Gesamtzahl Items: 115
// Verteilung:
// - Attention:    10
// - Sensory:      14 ✨
// - Social:       11 ✨
// - Masking:      12 ✨
// - Structure:    12 ✨ (inkl. 1 umplatziert)
// - Overload:      8 ✨
// - Alexithymia:  11 ✨
// - Executive:    17 ✨
// - Emotreg:      10
// - Hyperfocus:   11 ✨
//
// ✨ = Geändert gegenüber Version 1.0