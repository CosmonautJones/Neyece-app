-- Add username and profile visibility for public profiles

ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_public BOOLEAN DEFAULT false;

CREATE INDEX idx_users_username ON users (username) WHERE username IS NOT NULL;
