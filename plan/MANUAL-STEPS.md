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

---

## Vercel

- [ ] Connect GitHub repo to Vercel project
- [ ] Add all `.env.local` vars to Vercel Environment Variables
- [ ] Verify production build deploys successfully
- [ ] Set up custom domain (neyece.com) — DNS A/CNAME records

---

## PostHog

- [ ] Create PostHog project at [posthog.com](https://posthog.com)
- [ ] Add to `.env.local`:
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY`
  - [ ] `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] Install `posthog-js` and initialize in app (code TODO)

---

## Google Places API

- [ ] Create Google Cloud project
- [ ] Enable Places API (New)
- [ ] Create API key with Places API restriction
- [ ] Add to `.env.local`:
  - [ ] `GOOGLE_PLACES_API_KEY`

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

*Last updated: 2026-03-14 — S1.1 Session 1 complete*
