-- Share tracking for referral attribution

CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  share_type TEXT NOT NULL CHECK (share_type IN ('venue', 'collection', 'profile')),
  platform TEXT,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shares_user ON shares (user_id, created_at DESC);
CREATE INDEX idx_shares_referral ON shares (referral_code);

ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own shares"
  ON shares FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own shares"
  ON shares FOR SELECT
  USING (auth.uid()::text = user_id::text);
