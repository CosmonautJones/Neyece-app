"use client";

import { useState, useEffect } from "react";

interface GamificationData {
  streak: { current: number; longest: number };
  achievements: Array<{
    type: string;
    name: string;
    description: string;
    emoji: string;
    unlocked: boolean;
  }>;
  newlyUnlocked: string[];
  tier: { name: string; emoji: string; color: string };
  nextTier: { name: string; pointsNeeded: number } | null;
  points: number;
}

export default function Gamification() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/gamification");
        if (res.ok) setData(await res.json());
      } catch {
        // Non-critical
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  if (loading) {
    return (
      <div className="px-5 mb-5">
        <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-5 h-32 animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  const progressPct = data.nextTier
    ? Math.min(100, Math.round(((data.points) / (data.points + data.nextTier.pointsNeeded)) * 100))
    : 100;

  return (
    <>
      {/* Streak + Tier */}
      <div className="px-5 mb-5">
        <h2 className="font-display text-lg font-bold text-ink mb-3">Your Status</h2>
        <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Streak */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-display text-xl font-bold text-ink">
                  {data.streak.current}
                </p>
                <p className="font-body text-[10px] text-muted">
                  week streak
                </p>
              </div>
            </div>

            {/* Tier badge */}
            <div className="flex items-center gap-2 bg-cream rounded-full px-3 py-1.5 border border-ink/10">
              <span className="text-lg">{data.tier.emoji}</span>
              <span className={`font-body text-sm font-bold ${data.tier.color}`}>
                {data.tier.name}
              </span>
            </div>
          </div>

          {/* Progress to next tier */}
          {data.nextTier && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-[10px] text-muted">
                  {data.points} pts
                </span>
                <span className="font-body text-[10px] text-muted">
                  {data.nextTier.name} ({data.nextTier.pointsNeeded} pts to go)
                </span>
              </div>
              <div className="bg-cream rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-coral to-yellow rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Longest streak */}
          <div className="mt-3 pt-3 border-t border-ink/10 flex justify-between">
            <span className="font-body text-xs text-muted">Longest streak</span>
            <span className="font-body text-xs font-bold text-ink">{data.streak.longest} weeks</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-5 mb-5">
        <h2 className="font-display text-lg font-bold text-ink mb-3">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {data.achievements.map((a) => (
            <div
              key={a.type}
              className={`bg-white border-2 rounded-2xl p-3 text-center transition-all ${
                a.unlocked
                  ? "border-ink shadow-brutal-sm"
                  : "border-ink/20 opacity-40"
              }`}
            >
              <span className="text-2xl block mb-1">
                {a.unlocked ? a.emoji : "🔒"}
              </span>
              <p className="font-display text-xs font-bold text-ink leading-tight">
                {a.name}
              </p>
              <p className="font-body text-[9px] text-muted mt-0.5">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
