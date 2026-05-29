// server.js
// neuronativ/backend/server.js
// Im Container: /app/backend/server.js
// __dirname = /app/backend
// Frontend liegt in: /app/ (join(__dirname, '../'))

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

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

app.use(express.json({ limit: "2mb" }));

// -------------------------
// Statische Frontend-Files
// -------------------------
// __dirname = /app/backend → '../' = /app = Repo-Root
app.use(express.static(path.join(__dirname, '../')));

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

// Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// -------------------------
// Start
// -------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Neuronativ Backend läuft auf Port ${PORT}`);
});