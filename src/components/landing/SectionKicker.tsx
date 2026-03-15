const colorMap = {
  green: "bg-green",
  orange: "bg-orange",
  yellow: "bg-yellow",
  coral: "bg-coral text-white",
  default: "bg-green",
} as const;

export default function SectionKicker({
  emoji,
  text,
  color = "default",
}: {
  emoji: string;
  text: string;
  color?: keyof typeof colorMap;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 ${colorMap[color]} border-2 border-ink rounded-full px-4 py-1 text-[0.7rem] font-extrabold tracking-[0.1em] uppercase shadow-brutal-sm text-ink`}
    >
      {emoji} {text}
    </div>
  );
}
