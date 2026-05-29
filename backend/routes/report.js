// routes/report.js
// GET /api/report/:code
// Gibt report_free oder report_full zurück je nach Zahlungsstatus

import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await db.query(
      `SELECT report_free, report_full, paid FROM sessions WHERE code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session nicht gefunden" });
    }

    const { report_free, report_full, paid } = result.rows[0];

    if (paid) {
      // Vollständiger Report
      return res.json({
        paid: true,
        ...report_full,
      });
    }

    // Nur Free-Report
    res.json({
      paid: false,
      reportFree: report_free,
    });

  } catch (err) {
    console.error("report error:", err);
    res.status(500).json({ error: "Report konnte nicht geladen werden" });
  }
});

export default router;
