import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByClerkId, getVenueById, getVibeProfile } from "@/lib/supabase/queries";
import type { Venue, VibeProfile } from "@/lib/supabase/types";
import { venueTagsToVector } from "@/lib/scoring";
import {
  generateInsight,
  templateInsight,
  extractTopVibes,
  findMatchedDimensions,
} from "@/lib/insights";
import { MOCK_SCORES } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: { venueId: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { venue: rawVenue } = await getVenueById(supabase, params.venueId);
  const venue = rawVenue as Venue | null;
  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  const { profile } = await getVibeProfile(supabase, user.id);
  const vibeProfile = profile as VibeProfile | null;

  const venueTags = (venue.vibe_tags as string[]) ?? [];
  const venueVector = venueTagsToVector(venueTags);
  const userVector = (vibeProfile?.fingerprint_vector as number[]) ?? [];
  const score = MOCK_SCORES[venue.id] ?? 0; // TODO: use real score

  const ctx = {
    venueName: venue.name,
    venueCategory: venue.category,
    venueNeighborhood: venue.neighborhood,
    venueTags,
    userTopVibes: userVector.length > 0 ? extractTopVibes(userVector) : [],
    matchedDimensions:
      userVector.length > 0 ? findMatchedDimensions(userVector, venueVector) : [],
    score,
  };

  // If no API key, return template immediately
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { insight: templateInsight(ctx), source: "template" as const },
      { headers: { "Cache-Control": "private, max-age=3600" } }
    );
  }

  const insight = await generateInsight(ctx);
  const source = insight === templateInsight(ctx) ? "template" : "ai";

  return NextResponse.json(
    { insight, source },
    { headers: { "Cache-Control": "private, max-age=3600" } }
  );
}
