interface DiscoveryStatsProps {
  stats: {
    views: number;
    neyeces: number;
    saves: number;
    shares: number;
  };
}

const STAT_ITEMS = [
  { key: "views" as const, label: "Discovered", emoji: "🔍" },
  { key: "neyeces" as const, label: "That's Neyece", emoji: "👁️" },
  { key: "saves" as const, label: "Saved", emoji: "❤️" },
  { key: "shares" as const, label: "Shared", emoji: "📤" },
];

export default function DiscoveryStats({ stats }: DiscoveryStatsProps) {
  return (
    <div className="px-5 mb-5">
      <h2 className="font-display text-lg font-bold text-ink mb-3">Discovery Stats</h2>
      <div className="grid grid-cols-2 gap-3">
        {STAT_ITEMS.map((item) => (
          <div
            key={item.key}
            className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-4 text-center"
          >
            <span className="text-2xl block mb-1">{item.emoji}</span>
            <p className="font-display text-2xl font-bold text-ink">
              {stats[item.key]}
            </p>
            <p className="font-body text-xs text-muted mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
