import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByClerkId } from "@/lib/supabase/queries";
import { z } from "zod";

const shareSchema = z.object({
  share_type: z.enum(["venue", "collection", "profile"]),
  venue_id: z.string().uuid().optional(),
  collection_id: z.string().uuid().optional(),
  platform: z.string().optional(),
});

function generateReferralCode(userId: string): string {
  const short = userId.slice(0, 8);
  const ts = Date.now().toString(36);
  return `${short}-${ts}`;
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = shareSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const referralCode = generateReferralCode(user.id);

  const { error } = await supabase.from("shares").insert({
    user_id: user.id,
    share_type: parsed.data.share_type,
    venue_id: parsed.data.venue_id ?? null,
    collection_id: parsed.data.collection_id ?? null,
    platform: parsed.data.platform ?? null,
    referral_code: referralCode,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to log share" }, { status: 500 });
  }

  return NextResponse.json({ referralCode }, { status: 201 });
}
