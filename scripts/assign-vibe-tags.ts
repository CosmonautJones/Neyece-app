#!/usr/bin/env tsx
/**
 * Assign vibe tags to all venues in the database.
 *
 * Usage:
 *   npx tsx scripts/assign-vibe-tags.ts              # all venues
 *   npx tsx scripts/assign-vibe-tags.ts --city nyc   # one city
 *   npx tsx scripts/assign-vibe-tags.ts --dry-run    # preview
 *
 * What it does:
 *   1. Fetch all venues (or by city)
 *   2. Auto-assign vibe tags using category, keywords, price signals
 *   3. Update vibe_tags JSONB column on each venue
 *   4. Report stats: tags per venue, tag distribution
 *
 * Required env vars (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { autoTagVenue, ALL_TAGS, type VibeTag } from "./vibe-tags";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const BATCH_SIZE = 50;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const cityFlag = args.indexOf("--city");
const targetCity = cityFlag !== -1 ? args[cityFlag + 1] : null;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🏷  Neyece Vibe Tag Assigner");
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  if (targetCity) console.log(`   City: ${targetCity}`);

  if (!dryRun && (!SUPABASE_URL || !SUPABASE_KEY)) {
    console.error("\n✗ Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Fetch venues
  let query = supabase.from("venues").select("id, name, category, description, price_level, vibe_tags");
  if (targetCity) {
    query = query.eq("city", targetCity);
  }

  const { data: venues, error } = await query;
  if (error) {
    console.error("✗ Failed to fetch venues:", error.message);
    process.exit(1);
  }

  if (!venues || venues.length === 0) {
    console.log("\n  No venues found.");
    return;
  }

  console.log(`\n  Found ${venues.length} venues to tag.\n`);

  // Tag stats
  const tagCounts: Record<string, number> = {};
  for (const t of ALL_TAGS) tagCounts[t] = 0;

  let tagged = 0;
  let updated = 0;

  // Process in batches
  for (let i = 0; i < venues.length; i += BATCH_SIZE) {
    const batch = venues.slice(i, i + BATCH_SIZE);
    const updates: { id: string; vibe_tags: VibeTag[] }[] = [];

    for (const venue of batch) {
      const tags = autoTagVenue({
        name: venue.name,
        category: venue.category,
        description: venue.description,
        price_level: venue.price_level,
      });

      for (const t of tags) tagCounts[t]++;
      tagged++;

      updates.push({ id: venue.id, vibe_tags: tags });

      if (dryRun && tagged <= 10) {
        console.log(`  ${venue.name}: [${tags.join(", ")}]`);
      }
    }

    if (!dryRun) {
      // Batch update via individual updates (Supabase doesn't support bulk update with different values)
      for (const u of updates) {
        const { error: updateErr } = await supabase
          .from("venues")
          .update({ vibe_tags: u.vibe_tags })
          .eq("id", u.id);

        if (updateErr) {
          console.error(`  ✗ Failed to update ${u.id}: ${updateErr.message}`);
        } else {
          updated++;
        }
      }

      const pct = Math.round(((i + batch.length) / venues.length) * 100);
      console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} venues tagged (${pct}%)`);
    }
  }

  // Report
  console.log(`\n📊 Tag Distribution:`);
  const sorted = Object.entries(tagCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  for (const [tag, count] of sorted) {
    const bar = "█".repeat(Math.round((count / tagged) * 30));
    const pct = Math.round((count / tagged) * 100);
    console.log(`  ${tag.padEnd(14)} ${bar} ${count} (${pct}%)`);
  }

  console.log(`\n✅ Done! ${dryRun ? tagged + " would be" : updated} venues tagged.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
