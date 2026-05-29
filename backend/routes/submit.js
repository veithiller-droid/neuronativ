// routes/submit.js
// POST /api/submit
// Empfängt Antworten, scored, speichert in DB, gibt Session-Code zurück

import express from "express";
import { nanoid } from "nanoid";
import { db } from "../server.js";
import { calculateReport } from "../scoring/scoringEngine.js";
import { calculateProfile } from "../scoring/profile_scoring.js";
import { PROFILE_SELECTORS } from "../scoring/profile_selectors.js";
import { PROFILE_TEXTS } from "../scoring/profile_texts.js";

const router = express.Router();

// Freemium-Schwelle: mindestens ein Cluster >= 55%
const FREEMIUM_THRESHOLD = 55;

function buildReportFree(report, profileResult) {
  const clusters = profileResult.clusterScores;
  const maxCluster = Math.max(...Object.values(clusters));
  const hasProfile = maxCluster >= FREEMIUM_THRESHOLD;

  // Dominanten Cluster finden
  const dominantCluster = Object.entries(clusters)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Profil-Text aus profile_texts.js
  let profileText = null;
  if (hasProfile && dominantCluster) {
    profileText = PROFILE_TEXTS.profiles?.cards?.[
      dominantCluster === "compensation" ? "high_masking" : dominantCluster
    ] || null;
  }

  return {
    hasProfile,
    dominantCluster: hasProfile ? dominantCluster : null,
    profileText,
    clusterScores: clusters,
    mainProfileType: hasProfile ? profileResult.mainProfile?.type : "unremarkable",
  };
}

router.post("/", async (req, res) => {
  try {
    const { answers, meta, onset, itemsByScale } = req.body;

    // Validierung
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers fehlt" });
    }
    if (!itemsByScale || typeof itemsByScale !== "object") {
      return res.status(400).json({ error: "itemsByScale fehlt" });
    }

    // 1) Scoring Engine
    const report = calculateReport({
      answers,
      itemsByScale,
      meta: meta || {},
      onset: onset || {},
    });

    // 2) Profile Scoring (Diagnose-Layer)
    const profileResult = calculateProfile(
      report,
      meta || {},
      null,
      null,
      report
    );

    // 3) Freemium Split
    const reportFree = buildReportFree(report, profileResult);
    const reportFull = {
      report,
      profileResult,
    };

    // 4) Session-Code generieren
    const code = nanoid(10);

    // 5) In DB speichern
    await db.query(
      `INSERT INTO sessions (code, report_free, report_full)
       VALUES ($1, $2, $3)`,
      [code, JSON.stringify(reportFree), JSON.stringify(reportFull)]
    );

    // 6) Response
    res.json({
      code,
      reportFree,
    });

  } catch (err) {
    console.error("submit error:", err);
    res.status(500).json({ error: "Scoring fehlgeschlagen" });
  }
});

export default router;
