import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { getVenuesFeed } from "@/lib/supabase/queries";
import { MOOD_TAG_MAP } from "@/lib/mock-data";

const querySchema = z.object({
  city: z.string().min(1),
  mood: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = querySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { city, mood, limit, offset } = parsed.data;

  // Map mood to vibe tags
  const vibeTags = mood && mood !== "All" ? MOOD_TAG_MAP[mood] : undefined;

  const supabase = createServerClient();
  const { venues, count, error } = await getVenuesFeed(supabase, {
    city,
    vibeTags,
    limit,
    offset,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
  }

  return NextResponse.json({
    venues,
    total: count,
    limit,
    offset,
    hasMore: offset + limit < count,
  });
}
