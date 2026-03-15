import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByClerkId, recordSignal } from "@/lib/supabase/queries";
import { z } from "zod";

const signalSchema = z.object({
  venueId: z.string().uuid(),
  signalType: z.enum(["save", "unsave", "neyece", "view", "share"]),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = signalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await recordSignal(supabase, user.id, parsed.data.venueId, parsed.data.signalType);

  return NextResponse.json({ ok: true });
}
