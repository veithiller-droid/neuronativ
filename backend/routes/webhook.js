// routes/webhook.js
// POST /api/webhook
// Stripe Webhook – setzt paid=true nach erfolgreicher Zahlung

import express from "express";
import Stripe from "stripe";
import { db } from "../server.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const code = session.metadata?.code;
    const email = session.customer_details?.email || null;

    if (code) {
      await db.query(
        `UPDATE sessions 
         SET paid = true, paid_at = NOW(), email = $1
         WHERE code = $2`,
        [email, code]
      );
      console.log(`Zahlung erfolgreich: ${code}`);
    }
  }

  res.json({ received: true });
});

export default router;
