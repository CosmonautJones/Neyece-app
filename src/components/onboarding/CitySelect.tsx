import { launchCities } from "@/lib/quiz-data";

interface CitySelectProps {
  selected: string;
  onSelect: (cityId: string) => void;
}

export default function CitySelect({ selected, onSelect }: CitySelectProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">📍</div>
      <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-tight text-ink mb-2">
        Where are you exploring?
      </h2>
      <p className="text-base text-brown font-bold mb-8 font-body">
        We&apos;re live in these cities (more coming soon)
      </p>
      <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
        {launchCities.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelect(city.id)}
            className={`p-4 border-2 border-ink rounded-2xl font-body font-extrabold text-sm cursor-pointer transition-all duration-200 shadow-brutal-sm select-none ${
              selected === city.id
                ? "bg-coral text-white -translate-x-0.5 -translate-y-0.5 shadow-brutal scale-105"
                : "bg-white text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal"
            }`}
          >
            <span className="text-2xl block mb-1">{city.emoji}</span>
            {city.label}
          </button>
        ))}
      </div>
    </div>
  );
}
