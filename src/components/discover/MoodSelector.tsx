"use client";

const MOOD_EMOJI: Record<string, string> = {
  All: "✨",
  Chill: "😌",
  Lively: "🎉",
  "Date Night": "💕",
  "Late Night": "🌙",
  Outdoors: "🌿",
  Creative: "🎨",
};

interface MoodSelectorProps {
  moods: string[];
  selected: string;
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ moods, selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {moods.map((mood) => {
        const active = mood === selected;
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onSelect(mood)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border-2 border-ink text-sm font-body font-extrabold transition-all duration-200 select-none ${
              active
                ? "bg-coral text-white shadow-brutal-sm -translate-x-0.5 -translate-y-0.5"
                : "bg-white text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm"
            }`}
          >
            <span className="mr-1">{MOOD_EMOJI[mood] ?? "✨"}</span>
            {mood}
          </button>
        );
      })}
    </div>
  );
}
