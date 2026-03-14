-- Neyece Phase 0: Row Level Security Policies
-- Supabase uses auth.uid() to get the current Clerk-mapped user

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE neyece_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS
-- Users can read their own row, service role can manage all
-- ============================================================
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (clerk_id = auth.jwt()->>'sub');

-- Insert handled by webhook (service role), not client
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- VENUES
-- Public read for everyone, write restricted to service role
-- ============================================================
CREATE POLICY "Venues are publicly readable"
  ON venues FOR SELECT
  USING (true);

-- Inserts/updates only via service role (seed scripts, admin)

-- ============================================================
-- VIBE PROFILES
-- Users can read/write their own profile
-- ============================================================
CREATE POLICY "Users can read own vibe profile"
  ON vibe_profiles FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can insert own vibe profile"
  ON vibe_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can update own vibe profile"
  ON vibe_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

-- ============================================================
-- NEYECE SCORES
-- Users can read their own scores, computation via service role
-- ============================================================
CREATE POLICY "Users can read own scores"
  ON neyece_scores FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

-- Insert/update only via service role (score computation)

-- ============================================================
-- SAVED SPOTS
-- Users can fully manage their own saved spots
-- ============================================================
CREATE POLICY "Users can read own saved spots"
  ON saved_spots FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can save spots"
  ON saved_spots FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can unsave spots"
  ON saved_spots FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

-- ============================================================
-- WAITLIST
-- Public insert (anyone can join), read restricted to service role
-- ============================================================
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);
