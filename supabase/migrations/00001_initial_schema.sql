-- Neyece Phase 0: Initial Schema
-- All 6 core tables + indexes + RLS policies

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  city TEXT,
  vibe_profile JSONB DEFAULT '{}',
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_clerk_id ON users (clerk_id);
CREATE INDEX idx_users_city ON users (city);

-- ============================================================
-- VENUES
-- ============================================================
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  neighborhood TEXT,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  category TEXT,
  google_place_id TEXT UNIQUE,
  vibe_tags JSONB DEFAULT '[]',
  description TEXT,
  image_url TEXT,
  price_level INTEGER,
  hours JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_venues_city ON venues (city);
CREATE INDEX idx_venues_category ON venues (category);
CREATE INDEX idx_venues_neighborhood ON venues (city, neighborhood);
CREATE INDEX idx_venues_google_place_id ON venues (google_place_id);

-- ============================================================
-- VIBE PROFILES
-- ============================================================
CREATE TABLE vibe_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '{}',
  fingerprint_vector DOUBLE PRECISION[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_vibe_profiles_user_id ON vibe_profiles (user_id);

-- ============================================================
-- NEYECE SCORES
-- ============================================================
CREATE TABLE neyece_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  computed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(venue_id, user_id)
);

CREATE INDEX idx_neyece_scores_user_id ON neyece_scores (user_id);
CREATE INDEX idx_neyece_scores_user_score ON neyece_scores (user_id, score DESC);

-- ============================================================
-- SAVED SPOTS
-- ============================================================
CREATE TABLE saved_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

CREATE INDEX idx_saved_spots_user_id ON saved_spots (user_id);

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  city TEXT,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_waitlist_email ON waitlist (email);
CREATE INDEX idx_waitlist_city ON waitlist (city);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_vibe_profiles_updated_at
  BEFORE UPDATE ON vibe_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
