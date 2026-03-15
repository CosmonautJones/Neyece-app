import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByClerkId, getSavedSpots, getScoresForUser } from "@/lib/supabase/queries";
import type { SavedSpot, Venue, NeyeceScore } from "@/lib/supabase/types";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch saved spots with venue data
  const { spots: rawSpots } = await getSavedSpots(supabase, user.id);

  // Fetch cached scores for this user
  const { scores: rawScores } = await getScoresForUser(supabase, user.id);
  const scoreMap = new Map(
    (rawScores as unknown as Array<NeyeceScore & { venues: Venue }>).map(
      (s) => [s.venue_id, s.score]
    )
  );

  // Shape the response
  const spots = (rawSpots as unknown as Array<SavedSpot & { venues: Venue }>).map((raw) => ({
    spot: {
      id: raw.id,
      user_id: raw.user_id,
      venue_id: raw.venue_id,
      notes: raw.notes,
      saved_at: raw.saved_at,
    },
    venue: raw.venues,
    score: scoreMap.get(raw.venue_id) ?? null,
  }));

  return NextResponse.json({ spots });
}
