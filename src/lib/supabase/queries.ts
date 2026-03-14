import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, User, Venue, VibeProfile, NeyeceScore, SavedSpot } from "./types";

type Client = SupabaseClient<Database>;

// ============================================================
// USERS
// ============================================================

export async function getUserByClerkId(client: Client, clerkId: string) {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();
  return { user: data as User | null, error };
}

export async function getUserById(client: Client, id: string) {
  const { data, error } = await client.from("users").select("*").eq("id", id).single();
  return { user: data as User | null, error };
}

export async function upsertUser(
  client: Client,
  user: Database["public"]["Tables"]["users"]["Insert"]
) {
  const { data, error } = await client
    .from("users")
    .upsert(user, { onConflict: "clerk_id" })
    .select()
    .single();
  return { user: data, error };
}

export async function updateUser(
  client: Client,
  id: string,
  updates: Database["public"]["Tables"]["users"]["Update"]
) {
  const { data, error } = await client.from("users").update(updates).eq("id", id).select().single();
  return { user: data, error };
}

// ============================================================
// VENUES
// ============================================================

export async function getVenueById(client: Client, id: string) {
  const { data, error } = await client.from("venues").select("*").eq("id", id).single();
  return { venue: data, error };
}

export async function getVenuesByCity(client: Client, city: string) {
  const { data, error } = await client.from("venues").select("*").eq("city", city);
  return { venues: data ?? [], error };
}

export async function getVenuesByNeighborhood(
  client: Client,
  city: string,
  neighborhood: string
) {
  const { data, error } = await client
    .from("venues")
    .select("*")
    .eq("city", city)
    .eq("neighborhood", neighborhood);
  return { venues: data ?? [], error };
}

export async function getVenuesByCategory(client: Client, city: string, category: string) {
  const { data, error } = await client
    .from("venues")
    .select("*")
    .eq("city", city)
    .eq("category", category);
  return { venues: data ?? [], error };
}

export interface VenueQueryOptions {
  city: string;
  vibeTags?: string[];
  limit?: number;
  offset?: number;
}

export async function getVenuesFeed(client: Client, options: VenueQueryOptions) {
  const { city, vibeTags, limit = 20, offset = 0 } = options;

  let query = client
    .from("venues")
    .select("*", { count: "exact" })
    .eq("city", city)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Filter by vibe tags if provided (venue must contain at least one matching tag)
  if (vibeTags && vibeTags.length > 0) {
    query = query.overlaps("vibe_tags", vibeTags);
  }

  const { data, error, count } = await query;
  return { venues: data ?? [], count: count ?? 0, error };
}

export async function searchVenues(client: Client, city: string, query: string) {
  const { data, error } = await client
    .from("venues")
    .select("*")
    .eq("city", city)
    .ilike("name", `%${query}%`);
  return { venues: data ?? [], error };
}

export async function upsertVenue(
  client: Client,
  venue: Database["public"]["Tables"]["venues"]["Insert"]
) {
  const { data, error } = await client
    .from("venues")
    .upsert(venue, { onConflict: "google_place_id" })
    .select()
    .single();
  return { venue: data, error };
}

// ============================================================
// VIBE PROFILES
// ============================================================

export async function getVibeProfile(client: Client, userId: string) {
  const { data, error } = await client
    .from("vibe_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { profile: data, error };
}

export async function upsertVibeProfile(
  client: Client,
  profile: Database["public"]["Tables"]["vibe_profiles"]["Insert"]
) {
  const { data, error } = await client
    .from("vibe_profiles")
    .upsert(profile, { onConflict: "user_id" })
    .select()
    .single();
  return { profile: data, error };
}

// ============================================================
// NEYECE SCORES
// ============================================================

export async function getScoresForUser(
  client: Client,
  userId: string,
  options?: { minScore?: number; limit?: number }
) {
  let query = client
    .from("neyece_scores")
    .select("*, venues(*)")
    .eq("user_id", userId)
    .order("score", { ascending: false });

  if (options?.minScore) {
    query = query.gte("score", options.minScore);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { scores: data ?? [], error };
}

export async function getScoreForVenue(client: Client, userId: string, venueId: string) {
  const { data, error } = await client
    .from("neyece_scores")
    .select("*")
    .eq("user_id", userId)
    .eq("venue_id", venueId)
    .single();
  return { score: data, error };
}

export async function upsertScore(
  client: Client,
  score: Database["public"]["Tables"]["neyece_scores"]["Insert"]
) {
  const { data, error } = await client
    .from("neyece_scores")
    .upsert(score, { onConflict: "venue_id,user_id" })
    .select()
    .single();
  return { score: data, error };
}

/**
 * Get featured venues (score 85-100) for a user.
 */
export async function getFeaturedVenues(client: Client, userId: string) {
  return getScoresForUser(client, userId, { minScore: 85 });
}

/**
 * Get nearby gems (score 70-84) for a user.
 */
export async function getNearbyGems(client: Client, userId: string) {
  const { data, error } = await client
    .from("neyece_scores")
    .select("*, venues(*)")
    .eq("user_id", userId)
    .gte("score", 70)
    .lt("score", 85)
    .order("score", { ascending: false });
  return { scores: data ?? [], error };
}

// ============================================================
// SAVED SPOTS
// ============================================================

export async function getSavedSpots(client: Client, userId: string) {
  const { data, error } = await client
    .from("saved_spots")
    .select("*, venues(*)")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });
  return { spots: data ?? [], error };
}

export async function isSpotSaved(client: Client, userId: string, venueId: string) {
  const { data, error } = await client
    .from("saved_spots")
    .select("id")
    .eq("user_id", userId)
    .eq("venue_id", venueId)
    .maybeSingle();
  return { saved: !!data, error };
}

export async function saveSpot(
  client: Client,
  userId: string,
  venueId: string,
  notes?: string
) {
  const { data, error } = await client
    .from("saved_spots")
    .insert({ user_id: userId, venue_id: venueId, notes: notes ?? null })
    .select()
    .single();
  return { spot: data, error };
}

export async function unsaveSpot(client: Client, userId: string, venueId: string) {
  const { error } = await client
    .from("saved_spots")
    .delete()
    .eq("user_id", userId)
    .eq("venue_id", venueId);
  return { error };
}

// ============================================================
// WAITLIST
// ============================================================

export async function addToWaitlist(client: Client, email: string, city?: string) {
  const { data, error } = await client
    .from("waitlist")
    .insert({ email, city: city ?? null })
    .select()
    .single();
  return { entry: data, error };
}

export async function getWaitlistCount(client: Client) {
  const { count, error } = await client
    .from("waitlist")
    .select("*", { count: "exact", head: true });
  return { count: count ?? 0, error };
}
