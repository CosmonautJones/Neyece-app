import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  getUserByClerkId,
  getUserSignals,
  getStreak,
  upsertStreak,
  getAchievements,
  unlockAchievement,
} from "@/lib/supabase/queries";
import type { UserSignal, Streak, Achievement } from "@/lib/supabase/types";
import {
  checkAchievements,
  updateStreak,
  computePoints,
  getCurrentTier,
  getNextTier,
  ACHIEVEMENTS,
} from "@/lib/gamification";

/**
 * GET /api/gamification
 *
 * Returns streak, achievements, tier, and points for the current user.
 * Also checks for new achievements and updates streak.
 */
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

  // Fetch signals for counts
  const { signals: rawSignals } = await getUserSignals(supabase, user.id);
  const signals = rawSignals as unknown as UserSignal[];
  const counts = {
    views: signals.filter((s) => s.signal_type === "view").length,
    neyeces: signals.filter((s) => s.signal_type === "neyece").length,
    saves: signals.filter((s) => s.signal_type === "save").length,
    shares: signals.filter((s) => s.signal_type === "share").length,
  };

  // Update streak (user is active this week by visiting)
  const { streak: rawStreak } = await getStreak(supabase, user.id);
  const existingStreak = rawStreak as Streak | null;

  const streakUpdate = updateStreak(
    existingStreak?.current_streak ?? 0,
    existingStreak?.longest_streak ?? 0,
    existingStreak?.last_active_week ?? null
  );

  await upsertStreak(supabase, {
    user_id: user.id,
    ...streakUpdate,
    updated_at: new Date().toISOString(),
  });

  // Check achievements
  const { achievements: rawAch } = await getAchievements(supabase, user.id);
  const existingTypes = new Set(
    (rawAch as unknown as Achievement[]).map((a) => a.achievement_type)
  );
  const newlyUnlocked = checkAchievements(counts, streakUpdate.current_streak, existingTypes);

  // Unlock new achievements
  for (const type of newlyUnlocked) {
    await unlockAchievement(supabase, user.id, type);
    existingTypes.add(type);
  }

  // Compute tier
  const points = computePoints(counts, streakUpdate.longest_streak);
  const tier = getCurrentTier(points);
  const nextTier = getNextTier(points);

  return NextResponse.json({
    streak: {
      current: streakUpdate.current_streak,
      longest: streakUpdate.longest_streak,
    },
    achievements: ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: existingTypes.has(a.type),
    })),
    newlyUnlocked,
    tier: { name: tier.name, emoji: tier.emoji, color: tier.color },
    nextTier: nextTier
      ? { name: nextTier.name, pointsNeeded: nextTier.minPoints - points }
      : null,
    points,
  });
}
