import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByClerkId, getVibeProfile, getUserSignals } from "@/lib/supabase/queries";
import type { VibeProfile, UserSignal } from "@/lib/supabase/types";

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

  // Fetch vibe profile
  const { profile } = await getVibeProfile(supabase, user.id);
  const vibeProfile = profile as VibeProfile | null;

  // Fetch signal counts for stats
  const { signals: rawSignals } = await getUserSignals(supabase, user.id);
  const signals = rawSignals as unknown as UserSignal[];

  const stats = {
    views: signals.filter((s) => s.signal_type === "view").length,
    neyeces: signals.filter((s) => s.signal_type === "neyece").length,
    saves: signals.filter((s) => s.signal_type === "save").length,
    shares: signals.filter((s) => s.signal_type === "share").length,
  };

  return NextResponse.json({
    fingerprintVector: vibeProfile?.fingerprint_vector ?? null,
    stats,
  });
}
