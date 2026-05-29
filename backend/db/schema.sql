-- db/schema.sql
-- Neuronativ Datenbank Schema

CREATE TABLE IF NOT EXISTS sessions (
  id                SERIAL PRIMARY KEY,
  code              VARCHAR(12) UNIQUE NOT NULL,

  -- Freemium Split
  report_free       JSONB NOT NULL,      -- Cluster-Scores + Profil-Typ (immer sichtbar)
  report_full       JSONB NOT NULL,      -- Vollständiger Report (nur nach Zahlung)

  -- Payment
  paid              BOOLEAN DEFAULT FALSE,
  stripe_session_id VARCHAR(255),
  email             VARCHAR(255),

  -- Meta
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  paid_at           TIMESTAMPTZ
);

-- Index für schnellen Code-Lookup
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);

-- Index für Stripe Webhook
CREATE INDEX IF NOT EXISTS idx_sessions_stripe ON sessions(stripe_session_id);