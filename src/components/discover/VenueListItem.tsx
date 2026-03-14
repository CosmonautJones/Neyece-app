import Link from "next/link";
import type { Venue } from "@/lib/supabase/types";

interface VenueListItemProps {
  venue: Venue;
  score?: number;
}

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

export default function VenueListItem({ venue, score }: VenueListItemProps) {
  const tags = (venue.vibe_tags as string[]) ?? [];
  const topTag = tags[0];

  return (
    <Link href={`/venue/${venue.id}`} className="flex items-center gap-3 bg-white border-2 border-ink rounded-xl shadow-brutal-sm p-3 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal cursor-pointer">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-14 h-14 rounded-lg border-2 border-ink bg-gradient-to-br from-coral/20 to-yellow/20 flex items-center justify-center overflow-hidden">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-2xl">{getEmoji(venue.category)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-ink text-sm leading-tight truncate">
          {venue.name}
        </h3>
        <p className="font-body text-muted text-xs mt-0.5">
          {venue.neighborhood}
          {topTag && (
            <>
              {" · "}
              <span className="text-brown font-bold">{getVibeTagLabel(topTag)}</span>
            </>
          )}
        </p>
      </div>

      {/* Score badge */}
      {score !== undefined && (
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-full border-2 border-ink shadow-brutal-sm flex items-center justify-center font-body font-extrabold text-xs ${
            score >= 85
              ? "bg-coral text-white"
              : score >= 70
                ? "bg-yellow text-ink"
                : "bg-white text-ink"
          }`}
        >
          {score}
        </div>
      )}
    </Link>
  );
}
