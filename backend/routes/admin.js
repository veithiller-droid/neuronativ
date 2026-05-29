// routes/admin.js
// GET /api/admin/sessions
// Einfaches Admin Panel (Token-geschützt)

import express from "express";
import { db } from "../server.js";

const router = express.Router();

// Token-Auth Middleware
function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Nicht autorisiert" });
  }
  next();
}

// Alle Sessions
router.get("/sessions", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        id, code, paid, email, 
        created_at, paid_at,
        report_free->>'mainProfileType' as profile_type,
        report_free->>'dominantCluster' as dominant_cluster
       FROM sessions
       ORDER BY created_at DESC
       LIMIT 100`
    );
    res.json({ sessions: result.rows });
  } catch (err) {
    console.error("admin sessions error:", err);
    res.status(500).json({ error: "Fehler beim Laden der Sessions" });
  }
});

// Stats
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE paid = true) as paid,
        COUNT(*) FILTER (WHERE paid = false) as free,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7_days
      FROM sessions
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("admin stats error:", err);
    res.status(500).json({ error: "Fehler beim Laden der Stats" });
  }
});

export default router;
