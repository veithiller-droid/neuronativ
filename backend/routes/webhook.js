// routes/webhook.js
// POST /api/webhook
// Stripe Webhook – setzt paid=true nach erfolgreicher Zahlung + sendet E-Mail mit Session-Code

import express from "express";
import Stripe from "stripe";
import { Resend } from "resend";
import { db } from "../server.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "https://www.neuronativ.de";

async function sendCodeEmail(email, code) {
  const profileUrl = `${FRONTEND_URL}/test/profile.html?code=${code}`;

  try {
    await resend.emails.send({
      from: "Neuronativ <info@neuronativ.de>",
      to: email,
      subject: "Ihre Neuronativ-Auswertung ist bereit",
      html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F0F9FF;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#ffffff;border-bottom:3px solid #EAB308;padding:24px 40px;">
      <span style="font-size:1.3rem;font-weight:300;letter-spacing:2px;color:#2F3A40;">neuronativ</span>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h1 style="font-size:1.5rem;font-weight:300;color:#2F3A40;margin:0 0 16px;">
        Ihre vollständige Auswertung ist bereit
      </h1>
      <p style="color:#5F6C73;line-height:1.7;margin:0 0 24px;">
        Vielen Dank für Ihre Zahlung. Ihre persönliche Neuronativ-Auswertung kann jetzt abgerufen werden.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${profileUrl}" 
           style="background:#EAB308;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:1rem;display:inline-block;">
          Auswertung öffnen
        </a>
      </div>

      <!-- Code Box -->
      <div style="background:#F2F5F7;border:1px solid #D8DEE4;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
        <p style="color:#5F6C73;font-size:0.85rem;margin:0 0 8px;">Ihr persönlicher Zugangscode</p>
        <p style="color:#2F3A40;font-size:1.3rem;font-weight:700;letter-spacing:2px;margin:0;font-family:monospace;">
          ${code}
        </p>
        <p style="color:#5F6C73;font-size:0.8rem;margin:8px 0 0;">
          Speichern Sie diesen Code — er ist Ihr einziger Zugang zur Auswertung.
        </p>
      </div>

      <p style="color:#5F6C73;line-height:1.7;margin:0 0 8px;font-size:0.9rem;">
        Oder öffnen Sie die Auswertung direkt über diesen Link:
      </p>
      <p style="margin:0;">
        <a href="${profileUrl}" style="color:#EAB308;font-size:0.85rem;word-break:break-all;">${profileUrl}</a>
      </p>

      <hr style="border:none;border-top:1px solid #D8DEE4;margin:32px 0;">

      <p style="color:#5F6C73;font-size:0.82rem;line-height:1.6;margin:0;">
        Ihre Auswertung ist <strong>90 Tage</strong> über den obigen Link abrufbar. 
        Bei Fragen erreichen Sie uns unter 
        <a href="mailto:info@neuronativ.de" style="color:#EAB308;">info@neuronativ.de</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#F2F5F7;padding:20px 40px;text-align:center;">
      <p style="color:#5F6C73;font-size:0.78rem;margin:0;">
        © 2026 Neuronativ · 
        <a href="${FRONTEND_URL}/datenschutz.html" style="color:#5F6C73;">Datenschutz</a> · 
        <a href="${FRONTEND_URL}/impressum.html" style="color:#5F6C73;">Impressum</a>
      </p>
    </div>

  </div>
</body>
</html>
      `,
    });
    console.log(`E-Mail gesendet an: ${email}`);
  } catch (err) {
    console.error("Resend Fehler:", err);
    // Nicht werfen — E-Mail-Fehler soll Webhook nicht blockieren
  }
}

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

      // E-Mail senden wenn E-Mail-Adresse vorhanden
      if (email) {
        await sendCodeEmail(email, code);
      }
    }
  }

  res.json({ received: true });
});

export default router;
