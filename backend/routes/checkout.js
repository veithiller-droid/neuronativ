// routes/checkout.js
// TEST MODE - kein Stripe

import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "code fehlt" });
    }

    const result = await db.query(
      `SELECT id, paid FROM sessions WHERE code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session nicht gefunden" });
    }

    // TEST: direkt paid=true setzen
    await db.query(
      `UPDATE sessions SET paid = true WHERE code = $1`,
      [code]
    );

    // Direkt zur Profil-Seite
    res.json({ 
      url: `https://neuronativ-production-244f.up.railway.app/test/profile.html?code=${code}` 
    });

  } catch (err) {
    console.error("checkout error:", err);
    res.status(500).json({ error: "Checkout fehlgeschlagen" });
  }
});

export default router;