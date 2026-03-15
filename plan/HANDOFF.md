# Phase 3 → Phase 4 Handoff

> Last updated: 2026-03-15 | Phase 3 complete | Branch: `claude/create-plan-repo-NQYZP`

---

## What's Done (Phase 3: Social Layer)

All 8 sessions shipped. Build passes clean with 27 routes.

### S3.1 — User Profiles
- Profile page at `/profile`: editable header, vibe summary (tag pills + bars), discovery stats (2x2 grid)
- Public profiles at `/profile/[username]`: read-only with OG metadata
- Profile settings: username editing, public toggle, sign out
- Migration: `avatar_url`, `username`, `profile_public` on users table
- API: `GET /api/profile`, `PATCH /api/profile/settings`

### S3.2 — Saved Spots + Collections
- Saved spots page at `/saved`: 2-column grid, sort by recent/score/neighborhood, optimistic unsave
- Collections system: full CRUD API, `collections` + `collection_venues` tables
- Public collection support (is_public flag)
- API: `GET /api/saved`, full `/api/collections/` CRUD suite

### S3.3 — Share System
- `ShareSheet` bottom sheet component: copy link, Twitter, WhatsApp, native share
- `shares` table with referral code + platform tracking
- `POST /api/shares`: logs shares with auto-generated referral codes
- #SoNeyece hashtag auto-appended
- Slide-up/fade-in animations in globals.css

### S3.4 — Gamification
- `gamification.ts`: pure logic for streaks, achievements, tiers
- 6 achievements: First Neyece, Explorer, Scout, Insider, Tastemaker, Legend
- 4 tiers: Regular → Scout (50pts) → Tastemaker (200pts) → Legend (500pts)
- Streak tracking with ISO week logic
- `Gamification` profile component with streak counter, tier badge, progress bar, achievements grid
- `StreakBadge` on discover feed header
- API: `GET /api/gamification`

---

## New DB Tables (Phase 3)

| Migration | Tables |
|-----------|--------|
| 00004 | users.avatar_url |
| 00005 | users.username, users.profile_public |
| 00006 | collections, collection_venues |
| 00007 | shares |
| 00008 | streaks, achievements |

---

## API Routes (27 total)

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
  GET  /api/profile
  POST /api/profile/drift
  PATCH /api/profile/settings

Saved + Collections:
  GET  /api/saved
  GET/POST /api/collections
  GET/PATCH/DELETE /api/collections/:id
  POST/DELETE /api/collections/:id/venues

Shares:
  POST /api/shares

Gamification:
  GET  /api/gamification

Waitlist:
  POST /api/waitlist
```

---

## What's Next (Phase 4: Launch)

5 sessions across 3 sprints. See `plan/phase-4/` for details.

| Sprint | Sessions | What |
|--------|----------|------|
| S4.1 QA + Performance | 2 | Lighthouse audit, bundle size, loading states, error boundaries |
| S4.2 Waitlist Onboarding | 2 | Email flows, waitlist → user conversion, welcome sequence |
| S4.3 Go Live | 1 | Production deploy, monitoring, ProductHunt prep |

### Key pre-launch tasks
1. **Connect real Supabase** — swap MOCK_VENUES/MOCK_SCORES with real DB queries
2. **Run migrations** — 8 migration files ready to apply
3. **Set env vars** — ANTHROPIC_API_KEY for AI insights
4. **Seed real venues** — Google Places API + Foursquare for NYC
5. **Performance audit** — Lighthouse, bundle analysis, image optimization
6. **Error boundaries** — wrap all client components
7. **PostHog analytics** — track key events (quiz completion, save, neyece, share)

---

## Build Verification

```bash
npx next build   # 27 routes, all clean
```
