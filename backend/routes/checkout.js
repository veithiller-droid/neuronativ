// routes/checkout.js
// POST /api/checkout
// Erstellt Stripe Checkout Session

import express from "express";
import Stripe from "stripe";
import { db } from "../server.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "code fehlt" });
    }

    // Session prüfen
    const result = await db.query(
      `SELECT id, paid FROM sessions WHERE code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session nicht gefunden" });
    }

    if (result.rows[0].paid) {
      return res.status(400).json({ error: "Bereits bezahlt" });
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://neuronativ.de/test/result.html?code=${code}&paid=true`,
      cancel_url: `https://neuronativ.de/test/result.html?code=${code}`,
      metadata: { code },
    });

    // Stripe Session ID in DB speichern
    await db.query(
      `UPDATE sessions SET stripe_session_id = $1 WHERE code = $2`,
      [session.id, code]
    );

    res.json({ url: session.url });

  } catch (err) {
    console.error("checkout error:", err);
    res.status(500).json({ error: "Checkout fehlgeschlagen" });
  }
});

export default router;
