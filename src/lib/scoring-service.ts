/**
 * Server-side score computation orchestration.
 *
 * Fetches user vectors, venue data, and saved spots, then delegates to
 * the pure scoring functions in scoring.ts.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Venue, VibeProfile, SavedSpot, NeyeceScore } from "./supabase/types";
import { MOOD_TAG_MAP } from "./mock-data";
import { venueTagsToVector, computeNeyeceScore } from "./scoring";
import {
  getVibeProfile,
  getSavedSpots,
  getScoreForVenue,
  upsertScoresBatch,
} from "./supabase/queries";

type Client = SupabaseClient<Database>;

export interface ScoredVenue {
  venue: Venue;
  score: number;
}

interface ComputeOptions {
  currentMood?: string;
  forceRecompute?: boolean;
}

/**
 * Compute Neyece Scores for all given venues for a user.
 * Caches results in neyece_scores table.
 */
export async function computeScoresForUser(
  client: Client,
  userId: string,
  venues: Venue[],
  options: ComputeOptions = {}
): Promise<ScoredVenue[]> {
  const { currentMood = null } = options;

  // Fetch user's fingerprint vector
  const { profile } = await getVibeProfile(client, userId);
  const vibeProfile = profile as VibeProfile | null;
  if (!vibeProfile?.fingerprint_vector) {
    // No vibe profile → can't score. Return venues with score 0.
    return venues.map((v) => ({ venue: v, score: 0 }));
  }

  const userVector = vibeProfile.fingerprint_vector as number[];

  // Fetch user's saved spots to determine freshness
  const { spots } = await getSavedSpots(client, userId);
  const savedVenueIds = new Set(
    (spots as unknown as SavedSpot[]).map((s) => s.venue_id)
  );

  // Compute scores
  const scoredVenues: ScoredVenue[] = venues.map((venue) => {
    const vibeTags = (venue.vibe_tags as string[]) ?? [];
    const venueVector = venueTagsToVector(vibeTags);

    const score = computeNeyeceScore({
      userVector,
      venueVector,
      isSaved: savedVenueIds.has(venue.id),
      currentMood,
      moodTagMap: MOOD_TAG_MAP,
      saveCount: 0, // TODO: wire in real signal counts in S2.3
      neyeceCount: 0,
    });

    return { venue, score };
  });

  // Cache scores in DB (fire-and-forget, don't block return)
  const scoreRows = scoredVenues.map((sv) => ({
    venue_id: sv.venue.id,
    user_id: userId,
    score: sv.score,
    computed_at: new Date().toISOString(),
  }));
  upsertScoresBatch(client, scoreRows).catch(() => {});

  // Sort by score descending
  scoredVenues.sort((a, b) => b.score - a.score);

  return scoredVenues;
}

/**
 * Get or compute a single venue's score for a user.
 * Checks cache first (24h TTL).
 */
export async function getOrComputeScore(
  client: Client,
  userId: string,
  venue: Venue,
  options: ComputeOptions = {}
): Promise<number> {
  if (!options.forceRecompute) {
    // Check cache
    const { score: cached } = await getScoreForVenue(client, userId, venue.id);
    const cachedScore = cached as NeyeceScore | null;
    if (cachedScore) {
      const age = Date.now() - new Date(cachedScore.computed_at).getTime();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      if (age < TWENTY_FOUR_HOURS) {
        return cachedScore.score;
      }
    }
  }

  // Compute fresh
  const results = await computeScoresForUser(client, userId, [venue], options);
  return results[0]?.score ?? 0;
}
