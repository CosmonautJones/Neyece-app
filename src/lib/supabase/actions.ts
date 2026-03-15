"use server";

import { auth } from "@clerk/nextjs/server";
import { createAuthServerClient, createServerClient } from "./server";
import { getUserByClerkId, upsertVibeProfile, saveSpot, unsaveSpot, updateUser } from "./queries";
import type { Json, User } from "./types";

/**
 * Get the current user's database record.
 * Returns null if not signed in or user not found.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createAuthServerClient();
  if (!supabase) return null;

  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const { user } = await getUserByClerkId(supabase, clerkId);
  return user;
}

/**
 * Update the current user's profile (name, city, etc.).
 */
export async function updateCurrentUser(updates: { name?: string; city?: string; avatar_url?: string }) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createAuthServerClient();
  if (!supabase) return { error: "Not authenticated" };

  const { user: updated, error } = await updateUser(supabase, user.id, updates);
  if (error) return { error: error.message };
  return { user: updated };
}

/**
 * Save or update the current user's vibe profile (quiz answers + fingerprint vector).
 */
export async function saveVibeProfile(answers: Json, fingerprintVector: number[]) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createAuthServerClient();
  if (!supabase) return { error: "Not authenticated" };

  const { profile, error } = await upsertVibeProfile(supabase, {
    user_id: user.id,
    answers,
    fingerprint_vector: fingerprintVector,
  });

  if (error) return { error: error.message };

  // Mark user as onboarded
  await updateUser(supabase, user.id, { onboarded: true });

  return { profile };
}

/**
 * Toggle a saved spot for the current user.
 * Returns the new saved state.
 */
export async function toggleSavedSpot(venueId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createAuthServerClient();
  if (!supabase) return { error: "Not authenticated" };

  // Check if already saved
  const { data: existing } = await supabase
    .from("saved_spots")
    .select("id")
    .eq("user_id", user.id)
    .eq("venue_id", venueId)
    .maybeSingle();

  if (existing) {
    const { error } = await unsaveSpot(supabase, user.id, venueId);
    if (error) return { error: error.message };
    return { saved: false };
  } else {
    const { error } = await saveSpot(supabase, user.id, venueId);
    if (error) return { error: error.message };
    return { saved: true };
  }
}
