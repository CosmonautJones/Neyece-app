# Manual Steps Tracker

> Things that require human action (dashboard logins, DNS config, API keys, etc.)
> Check these off as you complete them. Organized by service.

## Status Legend
- [ ] Not done
- [x] Done

---

## Supabase

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run migrations from `supabase/migrations/` in SQL Editor
- [ ] Enable pgvector extension (`CREATE EXTENSION IF NOT EXISTS vector;`)
- [ ] Add to `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Create Clerk JWT template in Supabase (for RLS with Clerk auth)

> **Code ready:** Server client (`src/lib/supabase/server.ts`), queries, hooks, and server actions are all built. Just needs the project + keys.

---

## Clerk

- [ ] Create Clerk application at [clerk.com](https://clerk.com)
- [ ] Enable sign-in methods: Email + Google OAuth
- [ ] Add to `.env.local`:
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- [ ] Set up webhook endpoint in Clerk dashboard:
  - URL: `https://<your-domain>/api/webhooks/clerk`
  - Events: `user.created`, `user.updated`, `user.deleted`
  - [ ] Copy signing secret → `CLERK_WEBHOOK_SECRET` in `.env.local`
- [ ] For local webhook testing: run `ngrok http 3000` and use ngrok URL

> **Code ready:** ClerkProvider, middleware, sign-in/sign-up pages, webhook handler all built. Just needs the Clerk app + keys.

---

## Vercel

- [ ] Connect GitHub repo to Vercel project
- [ ] Add all `.env.local` vars to Vercel Environment Variables
- [ ] Verify production build deploys successfully
- [ ] Set up custom domain (neyece.com) — DNS A/CNAME records

> **Code ready:** Next.js build passes. CI workflow in GitHub Actions.

---

## Google Places API

- [ ] Create Google Cloud project
- [ ] Enable Places API (New)
- [ ] Create API key with Places API restriction
- [ ] Add to `.env.local`:
  - [ ] `GOOGLE_PLACES_API_KEY`
- [ ] Run venue seed: `npm run seed:nyc` (test NYC first)
- [ ] Run full seed: `npm run seed` (all 4 cities)
- [ ] Verify 500+ venues per city in Supabase

> **Code ready:** Seed script (`scripts/seed-venues.ts`) and vibe tagger (`scripts/vibe-tags.ts`) are built. Auto-tags on ingestion. Just needs API key.

---

## PostHog

- [ ] Create PostHog project at [posthog.com](https://posthog.com)
- [ ] Add to `.env.local`:
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY`
  - [ ] `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] Install `posthog-js` and initialize in app (code TODO)

---

## Foursquare API

- [ ] Create Foursquare developer account
- [ ] Get API key
- [ ] Add to `.env.local`:
  - [ ] `FOURSQUARE_API_KEY`

---

## Anthropic (Claude API)

- [ ] Get API key from [console.anthropic.com](https://console.anthropic.com)
- [ ] Add to `.env.local`:
  - [ ] `ANTHROPIC_API_KEY`

---

## Stripe (Future — Phase 4+)

- [ ] Create Stripe account
- [ ] Add to `.env.local`:
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`

---

## Priority Order for First E2E Test

To get the full onboarding flow working end-to-end, complete in this order:

1. **Supabase** — create project, run migrations, get keys
2. **Clerk** — create app, get keys, set up webhook
3. **Google Places** — get API key, run `npm run seed:nyc`
4. **Vercel** — deploy, add env vars

After these 4, a user can: sign up → quiz → see discover page, with 500+ tagged NYC venues in the DB.

---

*Last updated: 2026-03-14 — S1.2 Session 2 complete*
