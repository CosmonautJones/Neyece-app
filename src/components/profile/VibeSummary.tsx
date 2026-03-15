import { DIMENSIONS } from "@/lib/fingerprint";

interface VibeSummaryProps {
  fingerprintVector: number[] | null;
}

const TAG_COLORS: Record<string, string> = {
  chill: "bg-blue-100 text-blue-700 border-blue-300",
  lively: "bg-orange-100 text-orange-700 border-orange-300",
  rowdy: "bg-red-100 text-red-700 border-red-300",
  intimate: "bg-pink-100 text-pink-700 border-pink-300",
  rooftop: "bg-sky-100 text-sky-700 border-sky-300",
  hidden: "bg-purple-100 text-purple-700 border-purple-300",
  outdoor: "bg-green-100 text-green-700 border-green-300",
  cozy: "bg-amber-100 text-amber-700 border-amber-300",
  trendy: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
  classic: "bg-stone-100 text-stone-700 border-stone-300",
  artsy: "bg-violet-100 text-violet-700 border-violet-300",
  local: "bg-emerald-100 text-emerald-700 border-emerald-300",
  upscale: "bg-yellow-100 text-yellow-700 border-yellow-300",
  casual: "bg-teal-100 text-teal-700 border-teal-300",
};

const DEFAULT_COLOR = "bg-cream text-brown border-brown/30";

function formatTag(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

export default function VibeSummary({ fingerprintVector }: VibeSummaryProps) {
  if (!fingerprintVector || fingerprintVector.length === 0) {
    return (
      <div className="px-5 mb-5">
        <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-5 text-center">
          <span className="text-3xl block mb-2">🎭</span>
          <p className="font-display font-bold text-ink">No vibe profile yet</p>
          <p className="font-body text-sm text-muted mt-1">Complete the quiz to see your taste profile.</p>
        </div>
      </div>
    );
  }

  // Get top vibes sorted by value
  const vibes = fingerprintVector
    .map((val, i) => ({ tag: DIMENSIONS[i], val }))
    .filter((d) => d.val > 0)
    .sort((a, b) => b.val - a.val)
    .slice(0, 5);

  const maxVal = vibes[0]?.val ?? 1;

  return (
    <div className="px-5 mb-5">
      <h2 className="font-display text-lg font-bold text-ink mb-3">Your Taste Profile</h2>
      <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {vibes.map((v) => (
            <span
              key={v.tag}
              className={`px-3 py-1.5 rounded-full border text-xs font-body font-bold ${
                TAG_COLORS[v.tag] ?? DEFAULT_COLOR
              }`}
            >
              {formatTag(v.tag)}
            </span>
          ))}
        </div>

        {/* Vibe bars */}
        <div className="flex flex-col gap-2.5">
          {vibes.map((v) => {
            const pct = Math.round((v.val / maxVal) * 100);
            return (
              <div key={v.tag} className="flex items-center gap-3">
                <span className="font-body text-xs text-brown w-16 text-right">
                  {formatTag(v.tag)}
                </span>
                <div className="flex-1 bg-cream rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-coral to-yellow rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-body text-[10px] text-muted w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
