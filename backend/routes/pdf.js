// routes/pdf.js
// GET /api/pdf/:code
// Generiert PDF aus vollständigem Report (nur nach Zahlung)

import express from "express";
import puppeteer from "puppeteer";
import { db } from "../server.js";

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Session prüfen
    const result = await db.query(
      `SELECT report_full, paid FROM sessions WHERE code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session nicht gefunden" });
    }

    if (!result.rows[0].paid) {
      return res.status(403).json({ error: "Nicht freigeschaltet" });
    }

    const { report_full } = result.rows[0];

    // HTML für PDF generieren
    const html = buildPdfHtml(report_full);

    // Puppeteer PDF generieren
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="neuronativ-profil-${code}.pdf"`
    );
    res.send(pdf);

  } catch (err) {
    console.error("pdf error:", err);
    res.status(500).json({ error: "PDF-Generierung fehlgeschlagen" });
  }
});

function buildPdfHtml(reportFull) {
  const { profileResult } = reportFull;
  const mainType = profileResult?.mainProfile?.type || "—";
  const clusters = profileResult?.clusterScores || {};

  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: system-ui, sans-serif;
          color: #2F3A40;
          line-height: 1.6;
          font-size: 14px;
        }
        h1 { font-size: 24px; font-weight: 300; margin-bottom: 8px; }
        h2 { font-size: 18px; font-weight: 400; margin-top: 24px; }
        .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
        .cluster { margin: 8px 0; }
        .cluster-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-top: 4px;
        }
        .cluster-fill {
          height: 8px;
          background: #EAB308;
          border-radius: 4px;
        }
        .disclaimer {
          margin-top: 40px;
          font-size: 11px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }
      </style>
    </head>
    <body>
      <h1>Neuronativ – Ihr Neurodivergenz-Profil</h1>
      <p class="meta">Erstellt mit neuronativ.de · Kein Ersatz für fachliche Diagnostik</p>

      <h2>Hauptprofil: ${mainType}</h2>

      <h2>Cluster-Auswertung</h2>
      ${Object.entries(clusters).map(([key, val]) => `
        <div class="cluster">
          <div>${key}: ${Math.round(val)}%</div>
          <div class="cluster-bar">
            <div class="cluster-fill" style="width: ${Math.round(val)}%"></div>
          </div>
        </div>
      `).join("")}

      <p class="disclaimer">
        Dieses Profil basiert auf einer Selbsteinschätzung. Es ist keine klinische Diagnostik 
        und ersetzt keine fachliche Abklärung.
      </p>
    </body>
    </html>
  `;
}

export default router;
