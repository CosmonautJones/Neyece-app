# Manual Steps Tracker

> Things that require human action (dashboard logins, DNS config, API keys, etc.)
> Check these off as you complete them. Organized by service.

## Status Legend
- [ ] Not done
- [x] Done

## Priority Order for First E2E Test

To get the full onboarding flow working end-to-end, complete in this order:

1. **Supabase** — create project, run migrations, get keys
2. **Clerk** — create app, get keys, set up webhook
3. **Google Places** — get API key, run `npm run seed:nyc`
4. **Anthropic** — get API key for Claude insights
5. **Vercel** — deploy, add env vars

After these, a user can: sign up → quiz → see discover page with scored venues.

---

## 1. Supabase (Database + pgvector)

### Create the Project

1. Go to [supabase.com](https://supabase.com) and click **Start your project** (sign up with GitHub if you don't have an account)
2. Click **New Project**
3. Fill in:
   - **Name:** `neyece` (or whatever you like)
   - **Database Password:** generate a strong one and **save it somewhere** — you'll need it later
   - **Region:** pick the closest to your users (e.g. `US East` for NYC-first launch)
4. Click **Create new project** — wait ~2 minutes for it to spin up

### Enable pgvector

5. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
6. Paste this and click **Run**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
7. You should see "Success. No rows returned." — that means pgvector is active

### Run the Database Migrations

8. Still in **SQL Editor**, you need to run each migration file in order
9. On your local machine, look in `supabase/migrations/` — the files are numbered (e.g. `001_initial.sql`, `002_...`)
10. Open each file, copy its contents, paste into the SQL Editor, and click **Run** — do them in order
11. After each one you should see "Success" — if you get an error, screenshot it and we'll debug

### Grab Your Keys

12. Go to **Settings** → **API** (left sidebar → gear icon → API)
13. You'll see three values:
    - **Project URL** — looks like `https://abcdefg.supabase.co`
    - **anon (public) key** — starts with `eyJ...` (long JWT)
    - **service_role (secret) key** — also starts with `eyJ...` (different from anon)
14. Open (or create) your `.env.local` file in the project root and add:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
    SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
    ```

### Set Up Clerk JWT Template (for RLS)

> Do this AFTER setting up Clerk (step 2 below), then come back here.

15. In Supabase, go to **SQL Editor** and run:
    ```sql
    CREATE OR REPLACE FUNCTION auth.clerk_user_id()
    RETURNS TEXT AS $$
      SELECT current_setting('request.jwt.claims', true)::json->>'sub';
    $$ LANGUAGE sql STABLE;
    ```
16. In Clerk dashboard (once you have it), go to **JWT Templates** → **New Template**
17. Choose **Supabase** from the list
18. It will auto-generate a template — just make sure the **Signing key** matches your Supabase JWT secret
    - Find your JWT secret in Supabase: **Settings** → **API** → scroll to **JWT Secret**
    - Paste that into Clerk's JWT template signing key field
19. Click **Save**

### Checklist
- [ ] Supabase project created
- [ ] pgvector extension enabled
- [ ] Migrations run (all files in `supabase/migrations/`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- [ ] Clerk JWT template created (do after Clerk setup)

> **Code ready:** Server client (`src/lib/supabase/server.ts`), queries, hooks, and server actions are all built. Just needs the project + keys.

---

## 2. Clerk (Authentication)

### Create the Application

1. Go to [clerk.com](https://clerk.com) and sign up (GitHub sign-in is easiest)
2. Click **Create application**
3. **Application name:** `Neyece`
4. Under **Sign in options**, enable:
   - **Email address** ✅
   - **Google** ✅
   - Turn off anything else (phone, username, etc.)
5. Click **Create application**

### Set Up Google OAuth

6. Clerk gives you a basic Google sign-in out of the box (their shared credentials), which works for development
7. For production, you'll want your own Google OAuth credentials:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a project (or reuse the one from Places API)
   - Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URI: get this from Clerk dashboard → **SSO Connections** → **Google** → it shows the redirect URI to add
   - Copy the **Client ID** and **Client Secret** back into Clerk's Google config
8. For now, Clerk's default Google works fine for dev — you can do step 7 later

### Grab Your Keys

9. In Clerk dashboard, you land on the **API Keys** page (or click it in the left sidebar)
10. You'll see:
    - **Publishable key** — starts with `pk_test_...`
    - **Secret key** — starts with `sk_test_...`
11. Add to your `.env.local`:
    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    ```

### Set Up the Webhook

12. In Clerk dashboard, go to **Webhooks** (left sidebar)
13. Click **Add Endpoint**
14. **Endpoint URL:**
    - For **local dev**: you need a public URL. Run `ngrok http 3000` in a terminal, copy the `https://xxxx.ngrok.io` URL, then use: `https://xxxx.ngrok.io/api/webhooks/clerk`
    - For **production**: `https://your-domain.com/api/webhooks/clerk`
15. Under **Subscribe to events**, check these:
    - `user.created` ✅
    - `user.updated` ✅
    - `user.deleted` ✅
16. Click **Create**
17. On the next page, you'll see a **Signing Secret** — starts with `whsec_...`
18. Add to `.env.local`:
    ```
    CLERK_WEBHOOK_SECRET=whsec_...
    ```

### Checklist
- [ ] Clerk application created
- [ ] Email + Google sign-in enabled
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`
- [ ] `CLERK_SECRET_KEY` in `.env.local`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `SIGN_UP_URL` in `.env.local`
- [ ] Webhook endpoint created with `user.created`, `user.updated`, `user.deleted`
- [ ] `CLERK_WEBHOOK_SECRET` in `.env.local`
- [ ] (Optional) Custom Google OAuth credentials

> **Code ready:** ClerkProvider, middleware, sign-in/sign-up pages, webhook handler all built. Just needs the Clerk app + keys.

---

## 3. Google Places API (Venue Data)

### Create the Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. If you don't have a project yet:
   - Click the project dropdown at the top → **New Project**
   - Name it `neyece` → **Create**
   - Wait a few seconds, then select it from the dropdown
3. You need a billing account (Google gives $200 free credit for new accounts):
   - Go to **Billing** in the left sidebar
   - Click **Link a billing account** or **Create account**
   - Add a payment method (you won't be charged within free tier)

### Enable the Places API

4. Go to **APIs & Services** → **Library** (left sidebar)
5. Search for **Places API (New)**
6. Click on it → click **Enable**
7. Wait a moment for it to activate

### Create an API Key

8. Go to **APIs & Services** → **Credentials**
9. Click **+ Create Credentials** → **API key**
10. A key appears — click **Edit API key** (the pencil icon) to restrict it:
    - Under **API restrictions**, select **Restrict key**
    - Choose **Places API (New)** from the dropdown
    - Click **Save**
11. Copy the key and add to `.env.local`:
    ```
    GOOGLE_PLACES_API_KEY=AIza...your-key...
    ```

### Seed Venues

12. After your Supabase is set up and keys are in `.env.local`, run:
    ```bash
    npm run seed:nyc
    ```
    This fetches ~500+ NYC venues from Google Places, auto-tags them with vibe data, and inserts them into your Supabase `venues` table.
13. Check your Supabase dashboard → **Table Editor** → `venues` table to verify data came in
14. Once NYC looks good, seed all cities:
    ```bash
    npm run seed
    ```

### Checklist
- [ ] Google Cloud project created
- [ ] Billing account linked (free tier is fine)
- [ ] Places API (New) enabled
- [ ] API key created and restricted to Places API
- [ ] `GOOGLE_PLACES_API_KEY` in `.env.local`
- [ ] `npm run seed:nyc` completed successfully
- [ ] Venues visible in Supabase `venues` table
- [ ] (Later) `npm run seed` for all cities

> **Code ready:** Seed script (`scripts/seed-venues.ts`) and vibe tagger (`scripts/vibe-tags.ts`) are built. Auto-tags on ingestion. Just needs API key.

---

## 4. Anthropic / Claude API (Vibe Insights)

### Get Your API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** (left sidebar or settings)
4. Click **Create Key**
5. Name it `neyece` → **Create**
6. **Copy the key immediately** — it won't be shown again
7. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...your-key...
   ```

### Add Credits

8. Go to **Plans & Billing** → add a payment method if needed
9. The Build plan ($5 credit) is enough for development
10. You can set a **monthly spend limit** under billing to avoid surprises

### Checklist
- [ ] Anthropic account created
- [ ] API key generated
- [ ] `ANTHROPIC_API_KEY` in `.env.local`
- [ ] Credits / billing set up

> **Code ready:** Claude insight generation is built. Just needs the key.

---

## 5. Vercel (Hosting + Deployment)

### Connect Your Repo

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New** → **Project**
3. Find `Neyece-app` in the repo list → click **Import**
4. Settings:
   - **Framework Preset:** should auto-detect Next.js ✅
   - **Root Directory:** leave as `.` (default)
   - **Build Command:** leave default (`next build`)
   - **Output Directory:** leave default
5. **Don't deploy yet** — first add your env vars

### Add Environment Variables

6. On the same import page (or go to **Settings** → **Environment Variables** after import)
7. Add every variable from your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   CLERK_WEBHOOK_SECRET
   NEXT_PUBLIC_CLERK_SIGN_IN_URL
   NEXT_PUBLIC_CLERK_SIGN_UP_URL
   GOOGLE_PLACES_API_KEY
   ANTHROPIC_API_KEY
   NEXT_PUBLIC_POSTHOG_KEY        (if you have it)
   NEXT_PUBLIC_POSTHOG_HOST       (if you have it)
   ```
8. For each one: paste the name, paste the value, select **All Environments** (or Production + Preview), click **Add**
9. Now click **Deploy**

### Custom Domain (Optional — Do Later)

10. After first successful deploy, go to **Settings** → **Domains**
11. Click **Add** → type `neyece.com` (or your domain)
12. Vercel gives you DNS records to add:
    - Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
    - Add the **A record** or **CNAME** that Vercel specifies
    - Wait 5–30 minutes for DNS propagation
13. Vercel auto-provisions an SSL certificate

### Checklist
- [ ] GitHub repo connected to Vercel
- [ ] All env vars added to Vercel
- [ ] First deploy successful
- [ ] (Optional) Custom domain configured

> **Code ready:** Next.js build passes. CI workflow in GitHub Actions.

---

## 6. PostHog (Analytics) — Optional for MVP

### Create Your Project

1. Go to [posthog.com](https://posthog.com) and sign up (free tier: 1M events/month)
2. Create a new project → name it `Neyece`
3. Choose **Web** as your platform
4. You'll see a code snippet — ignore the snippet (our code handles initialization)
5. Go to **Settings** → **Project** → find:
   - **Project API Key** — looks like `phc_...`
   - **Host** — usually `https://us.i.posthog.com` or `https://eu.i.posthog.com`
6. Add to `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

### Checklist
- [ ] PostHog project created
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local`
- [ ] `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`

---

## 7. Foursquare API — Optional (Supplemental Venue Data)

1. Go to [developer.foursquare.com](https://developer.foursquare.com)
2. Sign up → create an app
3. Go to your app → **API Keys**
4. Copy the key and add to `.env.local`:
   ```
   FOURSQUARE_API_KEY=fsq3...
   ```

### Checklist
- [ ] Foursquare developer account created
- [ ] `FOURSQUARE_API_KEY` in `.env.local`

---

## 8. Stripe (Future — Phase 4+)

> Not needed yet. When you're ready for payments:

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign up
2. You start in **Test mode** (toggle in the top right) — use test mode for development
3. Go to **Developers** → **API Keys**:
   - Copy **Publishable key** (`pk_test_...`)
   - Copy **Secret key** (`sk_test_...`)
4. Set up a webhook:
   - **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_...`)
5. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Checklist
- [ ] Stripe account created
- [ ] `STRIPE_SECRET_KEY` in `.env.local`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
- [ ] `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

## Your `.env.local` Template

Create this file in the project root (`/Neyece-app/.env.local`). **Never commit this file.**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Places
GOOGLE_PLACES_API_KEY=

# Anthropic (Claude)
ANTHROPIC_API_KEY=

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Foursquare (optional)
FOURSQUARE_API_KEY=

# Stripe (future)
# STRIPE_SECRET_KEY=
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# STRIPE_WEBHOOK_SECRET=
```

---

*Last updated: 2026-03-15 — Expanded with detailed step-by-step walkthroughs*
