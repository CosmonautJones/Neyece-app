import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  getUserByClerkId,
  getVibeProfile,
  getUserSignals,
  upsertVibeProfile,
  invalidateUserScores,
  getVenueById,
} from "@/lib/supabase/queries";
import type { VibeProfile, Venue, UserSignal } from "@/lib/supabase/types";
import { computeVectorDrift, shouldUpdateProfile } from "@/lib/vibe-learner";

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch current profile
  const { profile: rawProfile } = await getVibeProfile(supabase, user.id);
  const profile = rawProfile as VibeProfile | null;
  if (!profile?.fingerprint_vector) {
    return NextResponse.json({ error: "No vibe profile" }, { status: 400 });
  }

  // Fetch signals since last profile update
  const { signals: rawSignals } = await getUserSignals(supabase, user.id, {
    since: profile.updated_at,
  });
  const signals = rawSignals as unknown as UserSignal[];

  // Check if update is warranted
  if (!shouldUpdateProfile(profile.updated_at, signals.length)) {
    return NextResponse.json({ updated: false, reason: "not enough signals" });
  }

  // Fetch venue data for each signal
  const venueCache = new Map<string, string[]>();
  const signalData = [];

  for (const signal of signals) {
    let tags = venueCache.get(signal.venue_id);
    if (!tags) {
      const { venue: rawVenue } = await getVenueById(supabase, signal.venue_id);
      const venue = rawVenue as Venue | null;
      tags = (venue?.vibe_tags as string[]) ?? [];
      venueCache.set(signal.venue_id, tags);
    }
    signalData.push({
      venueVibeTags: tags,
      signalType: signal.signal_type,
    });
  }

  // Compute drift
  const newVector = computeVectorDrift(
    profile.fingerprint_vector as number[],
    signalData
  );

  // Count shifted dimensions
  const oldVec = profile.fingerprint_vector as number[];
  let shifted = 0;
  for (let i = 0; i < newVector.length; i++) {
    if (Math.abs(newVector[i] - oldVec[i]) > 0.001) shifted++;
  }

  // Save updated vector
  await upsertVibeProfile(supabase, {
    user_id: user.id,
    fingerprint_vector: newVector,
    updated_at: new Date().toISOString(),
  });

  // Invalidate cached scores
  await invalidateUserScores(supabase, user.id);

  return NextResponse.json({ updated: true, dimensions_shifted: shifted });
}
