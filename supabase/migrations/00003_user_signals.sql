-- User signals table for tracking implicit/explicit behavior signals
-- Used by the vibe learning loop to drift user fingerprint vectors

CREATE TABLE user_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('save', 'unsave', 'neyece', 'view', 'share')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_signals_user ON user_signals (user_id, created_at DESC);
CREATE INDEX idx_user_signals_venue ON user_signals (venue_id, signal_type);

-- RLS: users can only insert their own signals, never read others'
ALTER TABLE user_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own signals"
  ON user_signals FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own signals"
  ON user_signals FOR SELECT
  USING (auth.uid()::text = user_id::text);
