interface OptionPillProps {
  label: string;
  emoji: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionPill({ label, emoji, selected, onClick }: OptionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 border-2 border-ink rounded-full text-sm font-extrabold cursor-pointer transition-all duration-200 font-body shadow-brutal-sm select-none ${
        selected
          ? "bg-coral text-white -translate-x-0.5 -translate-y-0.5 shadow-brutal scale-105"
          : "bg-white text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal"
      }`}
    >
      <span className="mr-1.5">{emoji}</span>
      {label}
    </button>
  );
}
