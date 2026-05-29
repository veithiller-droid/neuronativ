// server.js
// Neuronativ Backend – Railway/Express/PostgreSQL
// Serviert auch Frontend-Files statisch

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

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
    "https://neuronativ-production.up.railway.app",
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
// API Routen
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
// Statische Frontend-Files
// -------------------------
// /test/* → test/ Ordner
app.use("/test", express.static(join(__dirname, "..", "test")));

// Root Files (index.html, impressum etc.)
app.use(express.static(join(__dirname, "..")));

// Fallback: alle unbekannten Routen → index.html
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "..", "index.html"));
});

// -------------------------
// Start
// -------------------------
app.listen(PORT, () => {
  console.log(`Neuronativ Backend läuft auf Port ${PORT}`);
});