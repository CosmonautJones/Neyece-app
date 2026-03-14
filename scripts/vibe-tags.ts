/**
 * Vibe tag vocabulary and auto-tagging rules.
 *
 * Tags are grouped into 4 dimensions that align with the quiz fingerprint:
 *   Energy (4), Setting (5), Vibe (8), Scene (4) = 21 total tags
 *
 * Each venue gets 3-6 tags assigned by combining:
 *   1. Category defaults (bar → lively, cafe → chill, etc.)
 *   2. Keyword matching against name + description
 *   3. Price level signals (expensive → upscale, free → casual)
 */

export const VIBE_TAGS = {
  energy: ["chill", "lively", "rowdy", "intimate"] as const,
  setting: ["rooftop", "hidden-gem", "outdoor", "cozy", "spacious"] as const,
  vibe: ["trendy", "classic", "artsy", "local", "upscale", "casual", "romantic", "creative"] as const,
  scene: ["date-night", "group-hang", "solo-friendly", "late-night"] as const,
} as const;

export type VibeTag =
  | (typeof VIBE_TAGS.energy)[number]
  | (typeof VIBE_TAGS.setting)[number]
  | (typeof VIBE_TAGS.vibe)[number]
  | (typeof VIBE_TAGS.scene)[number];

export const ALL_TAGS: VibeTag[] = [
  ...VIBE_TAGS.energy,
  ...VIBE_TAGS.setting,
  ...VIBE_TAGS.vibe,
  ...VIBE_TAGS.scene,
];

// ---------------------------------------------------------------------------
// Category → default tags mapping
// ---------------------------------------------------------------------------

const CATEGORY_DEFAULTS: Record<string, VibeTag[]> = {
  restaurant: ["lively", "group-hang"],
  bar: ["lively", "late-night", "group-hang"],
  cafe: ["chill", "cozy", "solo-friendly"],
  park: ["chill", "outdoor", "casual"],
  gallery: ["intimate", "artsy", "creative", "solo-friendly"],
  club: ["rowdy", "lively", "late-night", "group-hang"],
  lounge: ["intimate", "cozy", "date-night"],
  market: ["lively", "casual", "local"],
  bookstore: ["chill", "cozy", "solo-friendly", "creative"],
  rooftop: ["rooftop", "trendy", "date-night"],
};

// ---------------------------------------------------------------------------
// Keyword → tag mapping (matched against name + description)
// ---------------------------------------------------------------------------

const KEYWORD_TAGS: [RegExp, VibeTag][] = [
  // Setting
  [/rooftop|skyline|terrace/i, "rooftop"],
  [/hidden|secret|speakeasy|underground/i, "hidden-gem"],
  [/outdoor|patio|garden|sidewalk|al fresco/i, "outdoor"],
  [/cozy|snug|fireplace|intimate|candle/i, "cozy"],
  [/spacious|large|warehouse|open.?plan/i, "spacious"],

  // Energy
  [/chill|relaxed|mellow|quiet|peaceful/i, "chill"],
  [/buzzing|vibrant|energetic|lively|bustling/i, "lively"],
  [/wild|loud|party|rave|dance floor/i, "rowdy"],
  [/intimate|romantic|candlelit|quiet corner/i, "intimate"],

  // Vibe
  [/trendy|hip|hotspot|new opening|instagrammable/i, "trendy"],
  [/classic|old.?school|iconic|legendary|tradition/i, "classic"],
  [/art|gallery|exhibit|creative|mural/i, "artsy"],
  [/local|neighborhood|family.?owned|community/i, "local"],
  [/upscale|luxur|premium|fine.?dining|michelin/i, "upscale"],
  [/casual|laid.?back|no.?fuss|unpretentious/i, "casual"],
  [/romantic|date|couples|anniversary/i, "romantic"],
  [/creative|innovative|experimental|craft/i, "creative"],

  // Scene
  [/date|romantic|couples/i, "date-night"],
  [/group|party|friends|gather|social/i, "group-hang"],
  [/solo|alone|counter.?seat|bar.?seat|reading/i, "solo-friendly"],
  [/late|night|midnight|after.?hours|2am|3am/i, "late-night"],
];

// ---------------------------------------------------------------------------
// Price level → tag boost
// ---------------------------------------------------------------------------

function priceToTags(priceLevel: number | null): VibeTag[] {
  if (priceLevel === null) return [];
  if (priceLevel >= 3) return ["upscale"];
  if (priceLevel <= 1) return ["casual", "local"];
  return [];
}

// ---------------------------------------------------------------------------
// Auto-tagger
// ---------------------------------------------------------------------------

export interface VenueForTagging {
  name: string;
  category: string | null;
  description: string | null;
  price_level: number | null;
}

/**
 * Auto-assign vibe tags to a venue based on category, keywords, and price.
 * Returns a deduplicated, sorted array of 2-6 tags.
 */
export function autoTagVenue(venue: VenueForTagging): VibeTag[] {
  const tags = new Set<VibeTag>();

  // 1. Category defaults
  if (venue.category && CATEGORY_DEFAULTS[venue.category]) {
    for (const tag of CATEGORY_DEFAULTS[venue.category]) {
      tags.add(tag);
    }
  }

  // 2. Keyword matching on name + description
  const text = `${venue.name} ${venue.description ?? ""}`;
  for (const [pattern, tag] of KEYWORD_TAGS) {
    if (pattern.test(text)) {
      tags.add(tag);
    }
  }

  // 3. Price level signals
  for (const tag of priceToTags(venue.price_level)) {
    tags.add(tag);
  }

  // Ensure at least 2 tags (fall back to category defaults or casual+local)
  if (tags.size < 2) {
    tags.add("casual");
    tags.add("local");
  }

  // Cap at 6 tags
  const result = Array.from(tags).sort();
  return result.slice(0, 6);
}
