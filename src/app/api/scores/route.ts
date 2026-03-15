import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import type { Venue } from "@/lib/supabase/types";
import { getUserByClerkId, getVenuesByCity } from "@/lib/supabase/queries";
import { computeScoresForUser } from "@/lib/scoring-service";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const city = req.nextUrl.searchParams.get("city");
  if (!city) {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }

  const mood = req.nextUrl.searchParams.get("mood") ?? undefined;

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { venues } = await getVenuesByCity(supabase, city);
  const scoredVenues = await computeScoresForUser(supabase, user.id, venues as Venue[], {
    currentMood: mood,
  });

  return NextResponse.json({
    scores: scoredVenues.map((sv) => ({
      venue: sv.venue,
      score: sv.score,
    })),
  });
}
