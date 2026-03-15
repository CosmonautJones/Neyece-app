/**
 * Gamification — Streaks, Achievements, and Tiers.
 */

// ---------------------------------------------------------------------------
// Achievement definitions
// ---------------------------------------------------------------------------

export interface AchievementDef {
  type: string;
  name: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { type: "first_neyece", name: "First Neyece", description: 'First "That\'s Neyece" tap', emoji: "👁️" },
  { type: "explorer", name: "Explorer", description: "Viewed 10 venues", emoji: "🔍" },
  { type: "scout", name: "Scout", description: "Saved 10 venues", emoji: "📌" },
  { type: "insider", name: "Insider", description: "Shared 5 venues", emoji: "📤" },
  { type: "tastemaker", name: "Tastemaker", description: "5-week streak", emoji: "🔥" },
  { type: "legend", name: "Legend", description: "20-week streak + 50 saves + 20 shares", emoji: "👑" },
];

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map((a) => [a.type, a]));

// ---------------------------------------------------------------------------
// Achievement check
// ---------------------------------------------------------------------------

export interface SignalCounts {
  views: number;
  neyeces: number;
  saves: number;
  shares: number;
}

export function checkAchievements(
  counts: SignalCounts,
  currentStreak: number,
  existingAchievements: Set<string>
): string[] {
  const newlyUnlocked: string[] = [];

  const check = (type: string, condition: boolean) => {
    if (condition && !existingAchievements.has(type)) {
      newlyUnlocked.push(type);
    }
  };

  check("first_neyece", counts.neyeces >= 1);
  check("explorer", counts.views >= 10);
  check("scout", counts.saves >= 10);
  check("insider", counts.shares >= 5);
  check("tastemaker", currentStreak >= 5);
  check("legend", currentStreak >= 20 && counts.saves >= 50 && counts.shares >= 20);

  return newlyUnlocked;
}

// ---------------------------------------------------------------------------
// Tier system
// ---------------------------------------------------------------------------

export interface TierDef {
  name: string;
  minPoints: number;
  emoji: string;
  color: string;
}

export const TIERS: TierDef[] = [
  { name: "Regular", minPoints: 0, emoji: "🌱", color: "text-muted" },
  { name: "Scout", minPoints: 50, emoji: "🔍", color: "text-green-600" },
  { name: "Tastemaker", minPoints: 200, emoji: "🔥", color: "text-coral" },
  { name: "Legend", minPoints: 500, emoji: "👑", color: "text-yellow-600" },
];

// Points: saves=2, shares=3, streaks=5/week
export function computePoints(counts: SignalCounts, totalStreakWeeks: number): number {
  return counts.saves * 2 + counts.shares * 3 + totalStreakWeeks * 5;
}

export function getCurrentTier(points: number): TierDef {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) return TIERS[i];
  }
  return TIERS[0];
}

export function getNextTier(points: number): TierDef | null {
  const current = getCurrentTier(points);
  const idx = TIERS.indexOf(current);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

// ---------------------------------------------------------------------------
// Streak logic
// ---------------------------------------------------------------------------

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getPreviousWeek(isoWeek: string): string {
  const [year, weekStr] = isoWeek.split("-W");
  const weekNum = parseInt(weekStr, 10);
  if (weekNum > 1) {
    return `${year}-W${String(weekNum - 1).padStart(2, "0")}`;
  }
  // First week → go to last week of previous year (approximate)
  return `${parseInt(year, 10) - 1}-W52`;
}

export interface StreakUpdate {
  current_streak: number;
  longest_streak: number;
  last_active_week: string;
}

/**
 * Given the current streak state and the fact that the user was active this week,
 * compute the new streak values.
 */
export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveWeek: string | null
): StreakUpdate {
  const thisWeek = getISOWeek(new Date());

  // Already active this week — no change
  if (lastActiveWeek === thisWeek) {
    return { current_streak: currentStreak, longest_streak: longestStreak, last_active_week: thisWeek };
  }

  // Consecutive week — extend streak
  const prevWeek = getPreviousWeek(thisWeek);
  if (lastActiveWeek === prevWeek) {
    const newStreak = currentStreak + 1;
    return {
      current_streak: newStreak,
      longest_streak: Math.max(longestStreak, newStreak),
      last_active_week: thisWeek,
    };
  }

  // Streak broken — reset to 1
  return {
    current_streak: 1,
    longest_streak: Math.max(longestStreak, 1),
    last_active_week: thisWeek,
  };
}
