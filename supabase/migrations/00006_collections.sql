-- Collections for organizing saved spots

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collection_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (collection_id, venue_id)
);

CREATE INDEX idx_collections_user ON collections (user_id, created_at DESC);
CREATE INDEX idx_collection_venues_collection ON collection_venues (collection_id);

-- RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public collections are readable"
  ON collections FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can manage own collection venues"
  ON collection_venues FOR ALL
  USING (
    collection_id IN (
      SELECT id FROM collections WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Public collection venues are readable"
  ON collection_venues FOR SELECT
  USING (
    collection_id IN (
      SELECT id FROM collections WHERE is_public = true
    )
  );
