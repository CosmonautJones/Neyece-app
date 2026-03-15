#!/usr/bin/env tsx
/**
 * Seed venues from Google Places API (New) into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-venues.ts              # seed all cities
 *   npx tsx scripts/seed-venues.ts --city nyc   # seed one city
 *   npx tsx scripts/seed-venues.ts --dry-run    # preview without inserting
 *
 * Required env vars (in .env.local):
 *   GOOGLE_PLACES_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { CATEGORIES, CITIES, type CityConfig } from "./venue-taxonomy";
import { autoTagVenue } from "./vibe-tags";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const MAX_RESULTS_PER_QUERY = 20; // Google Places max per request
const RATE_LIMIT_MS = 1100; // ~55 QPM, safely under 60 QPM limit
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.types",
  "places.priceLevel",
  "places.editorialSummary",
  "places.photos",
  "places.regularOpeningHours",
  "places.googleMapsUri",
].join(",");

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const cityFlag = args.indexOf("--city");
const targetCityId = cityFlag !== -1 ? args[cityFlag + 1] : null;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  types?: string[];
  priceLevel?:
    | "PRICE_LEVEL_FREE"
    | "PRICE_LEVEL_INEXPENSIVE"
    | "PRICE_LEVEL_MODERATE"
    | "PRICE_LEVEL_EXPENSIVE"
    | "PRICE_LEVEL_VERY_EXPENSIVE";
  editorialSummary?: { text: string };
  photos?: { name: string }[];
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  googleMapsUri?: string;
}

interface VenueInsert {
  name: string;
  neighborhood: string | null;
  city: string;
  lat: number | null;
  lng: number | null;
  category: string | null;
  google_place_id: string;
  description: string | null;
  image_url: string | null;
  price_level: number | null;
  hours: string[] | null;
  vibe_tags: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parsePriceLevel(pl?: string): number | null {
  const map: Record<string, number> = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return pl ? (map[pl] ?? null) : null;
}

function photoUrl(photoName: string): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${GOOGLE_API_KEY}`;
}

function extractNeighborhood(address: string, neighborhoodQuery: string): string | null {
  // Try to use the neighborhood from the query (e.g. "SoHo, Manhattan" → "SoHo")
  const hood = neighborhoodQuery.split(",")[0].trim();
  if (hood) return hood;
  // Fallback: second part of address (usually neighborhood/city)
  const parts = address.split(",");
  return parts.length > 1 ? parts[1].trim() : null;
}

// ---------------------------------------------------------------------------
// Google Places API
// ---------------------------------------------------------------------------

async function searchPlaces(
  query: string,
  category: string,
  neighborhood: string,
  city: CityConfig
): Promise<VenueInsert[]> {
  const textQuery = `${query} in ${neighborhood}`;

  const res = await fetch(PLACES_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: MAX_RESULTS_PER_QUERY,
      languageCode: "en",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ API error for "${textQuery}": ${res.status} ${err}`);
    return [];
  }

  const data = await res.json();
  const places: PlaceResult[] = data.places ?? [];

  return places.map((p) => {
    const name = p.displayName?.text ?? "Unknown";
    const description = p.editorialSummary?.text ?? null;
    const price_level = parsePriceLevel(p.priceLevel);
    const vibe_tags = autoTagVenue({ name, category, description, price_level });

    return {
      name,
      neighborhood: extractNeighborhood(p.formattedAddress ?? "", neighborhood),
      city: city.id,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
      category,
      google_place_id: p.id,
      description,
      image_url: p.photos?.[0] ? photoUrl(p.photos[0].name) : null,
      price_level,
      hours: p.regularOpeningHours?.weekdayDescriptions ?? null,
      vibe_tags,
    };
  });
}

// ---------------------------------------------------------------------------
// Supabase upsert
// ---------------------------------------------------------------------------

async function upsertVenues(venues: VenueInsert[]): Promise<number> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Fetch existing place IDs for dedup count
  const placeIds = venues.map((v) => v.google_place_id);
  const { data: existing } = await supabase
    .from("venues")
    .select("google_place_id")
    .in("google_place_id", placeIds);
  const existingIds = new Set((existing ?? []).map((e) => e.google_place_id));

  const { error } = await supabase
    .from("venues")
    .upsert(venues, { onConflict: "google_place_id" });

  if (error) {
    console.error("  ✗ Supabase upsert error:", error.message);
    return 0;
  }

  const newCount = venues.filter((v) => !existingIds.has(v.google_place_id)).length;
  return newCount;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seedCity(city: CityConfig): Promise<number> {
  console.log(`\n🏙  Seeding ${city.label} (${city.id})...`);
  let totalNew = 0;
  let totalFetched = 0;

  for (const cat of CATEGORIES) {
    for (const hood of city.neighborhoods) {
      const venues = await searchPlaces(cat.query, cat.id, hood, city);
      totalFetched += venues.length;

      if (venues.length > 0) {
        if (dryRun) {
          console.log(`  [dry-run] ${cat.id} × ${hood.split(",")[0]}: ${venues.length} venues`);
          totalNew += venues.length;
        } else {
          const newCount = await upsertVenues(venues);
          totalNew += newCount;
          const label = hood.split(",")[0];
          console.log(
            `  ✓ ${cat.id} × ${label}: ${venues.length} found, ${newCount} new`
          );
        }
      }

      // Rate limit between API calls
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`  → ${city.label} done: ${totalFetched} fetched, ${totalNew} new`);
  return totalNew;
}

async function main() {
  console.log("🌱 Neyece Venue Seeder");
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);

  if (!dryRun && (!GOOGLE_API_KEY || !SUPABASE_URL || !SUPABASE_KEY)) {
    console.error("\n✗ Missing required env vars. Set in .env.local:");
    console.error("  GOOGLE_PLACES_API_KEY");
    console.error("  NEXT_PUBLIC_SUPABASE_URL");
    console.error("  SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  if (!GOOGLE_API_KEY) {
    console.error("\n✗ Missing GOOGLE_PLACES_API_KEY");
    process.exit(1);
  }

  const cities = targetCityId
    ? CITIES.filter((c) => c.id === targetCityId)
    : CITIES;

  if (cities.length === 0) {
    console.error(`\n✗ Unknown city: ${targetCityId}`);
    console.error(`  Available: ${CITIES.map((c) => c.id).join(", ")}`);
    process.exit(1);
  }

  let grandTotal = 0;
  for (const city of cities) {
    grandTotal += await seedCity(city);
  }

  console.log(`\n✅ Done! ${grandTotal} new venues seeded.`);

  if (!dryRun) {
    // Print count per city
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    for (const city of cities) {
      const { count } = await supabase
        .from("venues")
        .select("*", { count: "exact", head: true })
        .eq("city", city.id);
      console.log(`   ${city.label}: ${count ?? 0} total venues`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
