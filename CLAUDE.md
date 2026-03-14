# Neyece — Claude Code Project Context

## What is Neyece?
A vibe-matched local discovery app. Users complete a vibe quiz, get a fingerprint vector, and see venues scored 0–100 based on how well they match. The core IP is the **Neyece Score** (cosine similarity + mood + freshness + social signals).

## Tech Stack
- **Framework:** Next.js 14, TypeScript, App Router
- **Styling:** Tailwind CSS with brand tokens (coral `#FF6B6B`, yellow `#FFD93D`, cream `#FFF8F0`)
- **Database:** PostgreSQL via Supabase (+ pgvector for embeddings)
- **Auth:** Clerk (email + Google sign-in)
- **AI:** Anthropic API (Claude) for vibe insights
- **Venue Data:** Google Places API + Foursquare
- **Hosting:** Vercel
- **Analytics:** PostHog
- **Payments:** Stripe (future)

## Brand Voice
Warm, playful, like a cool local friend. Never corporate. Tagline system: "That's Neyece" / "So Neyece" / "Very Neyece" / "Stay Neyece".

## Fonts
- **Display:** Fraunces (serif, warm)
- **Body:** Nunito (sans-serif, friendly)

## Project Structure (Target)
```
/app                    — Next.js App Router pages + layouts
  /(auth)               — Onboarding flow
  /venue/[id]           — Venue detail
  /profile              — User profile
  /api                  — API routes
/components             — Reusable UI components
/lib                    — Utilities, Supabase client, scoring logic
/scripts                — Seed scripts, cron jobs
/design                 — HTML mockups (reference only)
/docs                   — Sprint plan, architecture docs
/plan                   — Session-based build plans
/supabase/migrations    — Database migrations
```

## Database Tables
- `users` — id, email, name, city, created_at, vibe_profile (JSONB)
- `venues` — id, name, neighborhood, city, lat, lng, category, google_place_id, vibe_tags (JSONB)
- `vibe_profiles` — user_id, answers (JSONB), fingerprint_vector, updated_at
- `neyece_scores` — venue_id, user_id, score (0–100), computed_at
- `saved_spots` — user_id, venue_id, saved_at, notes
- `waitlist` — email, city, created_at, converted

## Neyece Score Formula
- **Vibe Match (50%)** — cosine similarity: user fingerprint vector × venue tag vector
- **Freshness (20%)** — venues not yet visited score higher
- **Mood Alignment (20%)** — current mood matches venue primary vibe
- **Social Signal (10%)** — boosted by saves + "That's Neyece" clicks from similar users
- 85–100 = Featured cards, 70–84 = Nearby Gems, <70 = not surfaced

## Development Conventions
- Mobile-first design (test on iOS Safari + Android Chrome)
- Server components by default, client components only when needed
- Supabase RLS policies on all tables
- Zod for API input validation
- All env vars in `.env.local` (never committed)
- Commit messages: concise, imperative tense

## Working Style
Work is organized into **phases → sprints → sessions**. Each session is a focused Claude Code working block. See `/plan` directory for the full breakdown.
