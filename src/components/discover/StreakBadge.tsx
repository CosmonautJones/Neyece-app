"use client";

import { useState, useEffect } from "react";

export default function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch("/api/gamification");
        if (res.ok) {
          const data = await res.json();
          if (data.streak?.current > 0) {
            setStreak(data.streak.current);
          }
        }
      } catch {
        // Non-critical
      }
    }
    fetchStreak();
  }, []);

  if (streak === null) return null;

  return (
    <div className="flex items-center gap-1 bg-white border-2 border-ink rounded-full px-2.5 py-1 shadow-brutal-sm">
      <span className="text-sm">🔥</span>
      <span className="font-body text-xs font-bold text-ink">{streak}</span>
    </div>
  );
}
