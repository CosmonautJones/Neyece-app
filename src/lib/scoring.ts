/**
 * Neyece Score — Pure scoring math.
 *
 * Score = 50% Vibe Match + 20% Freshness + 20% Mood Alignment + 10% Social Signal
 * All functions are pure (no DB calls) and operate on the same 18-dim vector
 * space defined in fingerprint.ts.
 */

import { DIMENSIONS, VECTOR_LENGTH } from "./fingerprint";

// ---------------------------------------------------------------------------
// Shared tag → dimension index map
// ---------------------------------------------------------------------------

export const VIBE_TAG_INDEX: Record<string, number> = Object.fromEntries(
  DIMENSIONS.map((tag, i) => [tag, i])
);

// ---------------------------------------------------------------------------
// Vector conversion
// ---------------------------------------------------------------------------

/**
 * Convert a venue's vibe_tags array into an 18-dim vector in the same space
 * as user fingerprint vectors. Tags not in the vocabulary are ignored.
 */
export function venueTagsToVector(vibeTags: string[]): number[] {
  const vec = new Array<number>(VECTOR_LENGTH).fill(0);
  for (const tag of vibeTags) {
    const idx = VIBE_TAG_INDEX[tag];
    if (idx !== undefined) vec[idx] = 1;
  }
  return vec;
}

// ---------------------------------------------------------------------------
// Cosine similarity
// ---------------------------------------------------------------------------

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 0;
  return dot / denom;
}

// ---------------------------------------------------------------------------
// Score components
// ---------------------------------------------------------------------------

/** Vibe Match: cosine similarity mapped to 0-100. */
export function computeVibeMatch(userVec: number[], venueVec: number[]): number {
  const sim = cosineSimilarity(userVec, venueVec);
  // Cosine sim ranges -1 to 1; map to 0-100
  return Math.round(((sim + 1) / 2) * 100);
}

/** Freshness: unsaved venues score higher. */
export function computeFreshness(isSaved: boolean): number {
  return isSaved ? 40 : 100;
}

/** Mood Alignment: how well venue tags overlap with the current mood's tag set. */
export function computeMoodAlignment(
  currentMood: string | null,
  venueVec: number[],
  moodTagMap: Record<string, string[]>
): number {
  if (!currentMood || currentMood === "All") return 50; // neutral

  const moodTags = moodTagMap[currentMood] ?? [];
  if (moodTags.length === 0) return 50;

  let matches = 0;
  for (const tag of moodTags) {
    const idx = VIBE_TAG_INDEX[tag];
    if (idx !== undefined && venueVec[idx] > 0) matches++;
  }

  return Math.round((matches / moodTags.length) * 100);
}

/** Social Signal: normalized save + neyece counts. */
export function computeSocialSignal(saveCount: number, neyeceCount: number): number {
  return Math.min(saveCount * 5 + neyeceCount * 10, 100);
}

// ---------------------------------------------------------------------------
// Full Neyece Score
// ---------------------------------------------------------------------------

export interface ScoreInputs {
  userVector: number[];
  venueVector: number[];
  isSaved: boolean;
  currentMood: string | null;
  moodTagMap: Record<string, string[]>;
  saveCount: number;
  neyeceCount: number;
}

/**
 * Compute the full Neyece Score (0-100).
 *
 * Weights: Vibe 50% | Freshness 20% | Mood 20% | Social 10%
 */
export function computeNeyeceScore(inputs: ScoreInputs): number {
  const vibe = computeVibeMatch(inputs.userVector, inputs.venueVector);
  const fresh = computeFreshness(inputs.isSaved);
  const mood = computeMoodAlignment(inputs.currentMood, inputs.venueVector, inputs.moodTagMap);
  const social = computeSocialSignal(inputs.saveCount, inputs.neyeceCount);

  const raw = 0.5 * vibe + 0.2 * fresh + 0.2 * mood + 0.1 * social;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

// ---------------------------------------------------------------------------
// Quick sanity test (run with: npx tsx src/lib/scoring.ts)
// ---------------------------------------------------------------------------

if (typeof process !== "undefined" && process.argv[1]?.endsWith("scoring.ts")) {
  const user = [1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // chill, lively, cozy, trendy
  const venue = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]; // chill, cozy, local
  const sim = cosineSimilarity(user, venue);
  const score = computeNeyeceScore({
    userVector: user,
    venueVector: venue,
    isSaved: false,
    currentMood: "Chill",
    moodTagMap: { Chill: ["chill", "cozy", "intimate"] },
    saveCount: 3,
    neyeceCount: 1,
  });
  console.log(`Cosine sim: ${sim.toFixed(3)}, Score: ${score}`);
  // Expected: high sim (~0.577), score in 70-85 range
}
