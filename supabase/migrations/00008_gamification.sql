-- Gamification: streaks and achievements

CREATE TABLE streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_week TEXT, -- ISO week: '2026-W11'
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, achievement_type)
);

CREATE INDEX idx_achievements_user ON achievements (user_id);

-- RLS
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own streaks"
  ON streaks FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT
  USING (auth.uid()::text = user_id::text);
