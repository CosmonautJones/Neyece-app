interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-muted font-body">
          Step {current + 1} of {total}
        </span>
        <span className="text-sm font-bold text-muted font-body">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="w-full h-3 bg-cream-dark rounded-full border-2 border-ink overflow-hidden">
        <div
          className="h-full bg-coral rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
