-- Rate limiting: one row per (ip, function_name) per 24h window
CREATE TABLE IF NOT EXISTS ai_rate_limits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip            TEXT NOT NULL,
  function_name TEXT NOT NULL,
  calls         INT NOT NULL DEFAULT 1,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON ai_rate_limits (ip, function_name, window_start);

-- Public feedback submissions
CREATE TABLE IF NOT EXISTS feedback (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message    TEXT NOT NULL,
  page       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: allow anyone to insert feedback, block reads
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
