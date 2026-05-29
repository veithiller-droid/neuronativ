// server.js
// Neuronativ Backend – Railway/Express/PostgreSQL

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------
// DB Pool
// -------------------------
export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// -------------------------
// Middleware
// -------------------------
app.use(cors({
  origin: [
    "https://neuronativ.de",
    "https://www.neuronativ.de",
    "http://localhost:8000",
    "http://localhost:3000",
  ],
  credentials: true,
}));

// Stripe Webhook braucht raw body – VOR express.json()
import webhookRouter from "./routes/webhook.js";
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRouter);

// Alle anderen Routen bekommen JSON
app.use(express.json({ limit: "2mb" }));

// -------------------------
// Routen
// -------------------------
import submitRouter   from "./routes/submit.js";
import reportRouter   from "./routes/report.js";
import checkoutRouter from "./routes/checkout.js";
import pdfRouter      from "./routes/pdf.js";
import adminRouter    from "./routes/admin.js";

app.use("/api/submit",   submitRouter);
app.use("/api/report",   reportRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/pdf",      pdfRouter);
app.use("/api/admin",    adminRouter);

// -------------------------
// Health Check
// -------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// -------------------------
// Start
// -------------------------
app.listen(PORT, () => {
  console.log(`Neuronativ Backend läuft auf Port ${PORT}`);
});