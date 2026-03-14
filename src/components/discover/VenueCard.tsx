import type { Venue } from "@/lib/supabase/types";

interface VenueCardProps {
  venue: Venue;
  score?: number;
  featured?: boolean;
}

/** Category → emoji mapping for placeholder images */
const CATEGORY_EMOJI: Record<string, string> = {
  restaurant: "🍽️",
  bar: "🍸",
  cafe: "☕",
  park: "🌳",
  gallery: "🎨",
  club: "🪩",
  lounge: "🛋️",
  market: "🛒",
  bookstore: "📚",
  rooftop: "🌆",
};

function getEmoji(category: string | null): string {
  return CATEGORY_EMOJI[category ?? ""] ?? "📍";
}

function getVibeTagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function VenueCard({ venue, score, featured }: VenueCardProps) {
  const tags = (venue.vibe_tags as string[]) ?? [];
  const displayTags = tags.slice(0, featured ? 3 : 2);

  return (
    <div
      className={`flex-shrink-0 bg-white border-2 border-ink rounded-2xl shadow-brutal overflow-hidden transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover cursor-pointer ${
        featured ? "w-72" : "w-60"
      }`}
    >
      {/* Image area */}
      <div
        className={`relative bg-gradient-to-br from-coral/20 to-yellow/20 flex items-center justify-center ${
          featured ? "h-40" : "h-32"
        }`}
      >
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className={featured ? "text-5xl" : "text-4xl"}>
            {getEmoji(venue.category)}
          </span>
        )}

        {/* Score badge */}
        {score !== undefined && (
          <div
            className={`absolute top-2 right-2 font-body font-extrabold rounded-full border-2 border-ink shadow-brutal-sm flex items-center justify-center ${
              score >= 85
                ? "bg-coral text-white"
                : score >= 70
                  ? "bg-yellow text-ink"
                  : "bg-white text-ink"
            } ${featured ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs"}`}
          >
            {score}
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-2 left-2 bg-yellow border-2 border-ink rounded-full px-2.5 py-0.5 text-xs font-extrabold font-body shadow-brutal-sm">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display font-bold text-ink text-sm leading-tight truncate">
          {venue.name}
        </h3>
        <p className="font-body text-muted text-xs mt-0.5">
          {venue.neighborhood}
        </p>

        {/* Vibe tag pills */}
        {displayTags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-cream border border-ink/20 rounded-full text-[10px] font-body font-bold text-brown"
              >
                {getVibeTagLabel(tag)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
