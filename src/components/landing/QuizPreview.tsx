"use client";

import { useState } from "react";

const pills = [
  "🕯 Candlelit corner",
  "🌆 Rooftop views",
  "🤫 Only locals know",
  "🎵 Live music",
  "☀️ Natural light",
  "⚡ No wait, no fuss",
  "📖 A spot with a story",
  "🍜 Order what they're known for",
];

const vibeMap = [
  {
    keywords: ["candlelit", "story"],
    result: "You're a hidden gem hunter. Neyece was made for you. 🕯",
  },
  {
    keywords: ["rooftop", "natural"],
    result: "You chase beauty in the setting. We have spots that'll blow you away. 🌆",
  },
  {
    keywords: ["locals", "fuss"],
    result: "You're an insider. You'll be our most powerful scout. 🤫",
  },
  {
    keywords: ["music", "story"],
    result: "You want the full experience. Neyece finds the rooms that give it. 🎵",
  },
];

export default function QuizPreview() {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function getResult(): string {
    if (selected.size === 0) return "";
    const selectedTexts = Array.from(selected).map((i) => pills[i].toLowerCase());
    for (const vibe of vibeMap) {
      if (vibe.keywords.some((k) => selectedTexts.some((t) => t.includes(k)))) {
        return vibe.result;
      }
    }
    return "Your taste is specific. That's exactly why you need Neyece. 🎯";
  }

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-16 md:py-20">
      <div className="text-center bg-yellow rounded-[32px] border-2 border-ink shadow-brutal-lg p-10 md:p-16">
        <div className="inline-flex items-center gap-2 bg-yellow border-2 border-ink rounded-full px-4 py-1 text-[0.7rem] font-extrabold tracking-[0.1em] uppercase shadow-brutal-sm text-ink mb-4">
          🎯 Your vibe check
        </div>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight mb-2">
          Your ideal evening feels like...
        </h2>
        <p className="text-[1rem] text-brown font-bold mb-9">Pick everything that sounds right 👇</p>
        <div className="flex flex-wrap justify-center gap-2.5 max-w-[680px] mx-auto mb-8">
          {pills.map((pill, i) => (
            <button
              key={pill}
              onClick={() => toggle(i)}
              className={`px-5 py-2.5 border-2 border-ink rounded-full text-[0.82rem] font-extrabold cursor-pointer transition-all font-body shadow-brutal-sm ${
                selected.has(i)
                  ? "bg-coral text-white -translate-x-0.5 -translate-y-0.5 shadow-brutal"
                  : "bg-white text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
        <p className="font-display italic text-[1.2rem] text-coral min-h-[32px] font-bold">
          {getResult()}
        </p>
      </div>
    </div>
  );
}
