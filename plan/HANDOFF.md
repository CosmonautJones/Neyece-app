# Phase 2 → Phase 3 Handoff

> Last updated: 2026-03-15 | Phase 2 complete | Branch: `claude/create-plan-repo-NQYZP`

---

## What's Done (Phase 2: Intelligence)

All 7 sessions shipped in one commit (f0dbd83). Build passes clean.

### S2.1 — Neyece Score Engine
| File | Purpose |
|------|---------|
| `src/lib/scoring.ts` | Pure math: cosine similarity, weighted formula (50/20/20/10) |
| `src/lib/scoring-service.ts` | Server orchestration: bulk compute + 24h cache + single-venue lookup |
| `src/app/api/scores/route.ts` | `GET /api/scores?city=nyc&mood=Chill` |
| `src/lib/fingerprint.ts` | `DIMENSIONS` now exported |
| `src/lib/supabase/queries.ts` | Added `upsertScoresBatch()`, `invalidateUserScores()` |
| `src/components/discover/DiscoverFeed.tsx` | Accepts `scores` prop (removed `MOCK_SCORES` import) |
| `src/app/(main)/discover/page.tsx` | Passes `scores` prop |

### S2.2 — AI Insights
| File | Purpose |
|------|---------|
| `src/lib/insights.ts` | Claude API (claude-sonnet-4-6) + template fallback |
| `src/app/api/insights/[venueId]/route.ts` | `GET /api/insights/:venueId` (1h cache) |
| `src/components/discover/VibeInsight.tsx` | Client component: template-first, lazy AI swap with fade |
| `src/components/discover/VenueDetail.tsx` | Uses `<VibeInsight>` instead of static block |

### S2.3 — Learning Loop
| File | Purpose |
|------|---------|
| `supabase/migrations/00003_user_signals.sql` | `user_signals` table + RLS |
| `src/lib/supabase/types.ts` | Added `UserSignal`, `SignalType` types |
| `src/lib/supabase/queries.ts` | `recordSignal()`, `getSignalCounts()`, `getUserSignals()` |
| `src/app/api/signals/route.ts` | `POST /api/signals` (Zod validated, fire-and-forget) |
| `src/lib/track-signal.ts` | Client utility with `sendBeacon` for view/share |
| `src/lib/vibe-learner.ts` | Vector drift: neyece=3x, save=2x, share=2x, view=0.5x |
| `src/app/api/profile/drift/route.ts` | `POST /api/profile/drift` (compute + invalidate) |
| `src/components/discover/VenueDetail.tsx` | Wired: view, save, unsave, neyece, share signals |

---

## Known TODOs Left Over

1. **Real Supabase connection** — Discover page and venue detail still use `MOCK_VENUES` / `MOCK_SCORES` as data source. The scoring service is fully wired but needs a live DB to serve real scores. Swap happens when Supabase is connected.
2. **Social signal in scores** — `computeScoresForUser()` passes `saveCount: 0, neyeceCount: 0` (line 70-71 in scoring-service.ts). The `getSignalCounts()` query exists but isn't called in the scoring loop yet to avoid N+1 queries on mock data. Wire it when going live.
3. **Drift trigger on feed load** — The plan calls for checking `shouldUpdateProfile()` at the start of `computeScoresForUser()`. Not wired yet since it requires a live DB. Simple to add: import `shouldUpdateProfile` + `computeVectorDrift` and call before scoring.
4. **ANTHROPIC_API_KEY** — Needs to be set in `.env.local` for AI insights. Without it, template fallback works silently.

---

## What's Next (Phase 3: Social Layer)

8 sessions across 4 sprints. Detailed plans in `plan/phase-3/`.

| Sprint | Sessions | What |
|--------|----------|------|
| S3.1 User Profiles | 2 | Profile page, public profiles, OG images, account settings |
| S3.2 Saved Spots + Collections | 2 | Saved grid, collections CRUD, add-to-collection flow |
| S3.3 Share System | 2 | `@vercel/og` share cards, share bottom sheet, referral tracking |
| S3.4 Gamification | 2 | Streaks, 6 achievements, 4-tier system, badges |

### New DB tables needed
- `collections` (id, user_id, name, description, cover_image)
- `collection_venues` (collection_id, venue_id, added_at, notes)
- `streaks` (user_id, current_streak, longest_streak, last_active_week)
- `achievements` (id, user_id, achievement_type, unlocked_at)
- `shares` (id, user_id, venue_id, platform, referral_code)
- `users` table updates: avatar_url, username, profile_visibility

### Suggested start order
1. **S3.1 Session 1** (Profile page) — foundational, everything else hangs off it
2. **S3.2 Session 1** (Saved Spots grid) — uses existing `saved_spots` table
3. **S3.1 Session 2** (Public profiles) — enables sharing
4. **S3.3** (Share system) — needs public profiles to share
5. **S3.2 Session 2** (Collections) — nice-to-have, can parallelize
6. **S3.4** (Gamification) — depends on signals from Phase 2

---

## API Routes (14 total)

```
Auth:
  POST /api/webhooks/clerk
  POST /api/onboarding/complete

Venues:
  GET  /api/venues
  GET  /api/venues/:id
  POST /api/venues/:id/save
  DELETE /api/venues/:id/save

Scores:
  GET  /api/scores?city=&mood=

Insights:
  GET  /api/insights/:venueId

Signals:
  POST /api/signals

Profile:
  POST /api/profile/drift

Waitlist:
  POST /api/waitlist
```

---

## Build Verification

```bash
npx next build   # clean, all 14 routes compile
npx tsx src/lib/scoring.ts   # sanity: cosine sim 0.577, score 75
```
