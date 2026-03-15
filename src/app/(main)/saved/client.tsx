"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Venue, SavedSpot } from "@/lib/supabase/types";

type SortOption = "recent" | "score" | "neighborhood";

interface SavedVenue {
  spot: SavedSpot;
  venue: Venue;
  score: number | null;
}

interface SavedPageClientProps {
  userId: string;
}

export default function SavedPageClient({ userId }: SavedPageClientProps) {
  const [spots, setSpots] = useState<SavedVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("recent");

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          setSpots(data.spots);
        }
      } catch {
        // Show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  const handleUnsave = async (venueId: string) => {
    setSpots((prev) => prev.filter((s) => s.venue.id !== venueId));
    try {
      await fetch(`/api/venues/${venueId}/save`, { method: "DELETE" });
    } catch {
      // Revert would be complex — keep optimistic for now
    }
  };

  const sorted = [...spots].sort((a, b) => {
    switch (sort) {
      case "score":
        return (b.score ?? 0) - (a.score ?? 0);
      case "neighborhood":
        return (a.venue.neighborhood ?? "").localeCompare(b.venue.neighborhood ?? "");
      default: // recent
        return new Date(b.spot.saved_at).getTime() - new Date(a.spot.saved_at).getTime();
    }
  });

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Saved Spots</h1>
        <p className="font-body text-sm text-muted mt-0.5">
          {loading ? "..." : `${spots.length} spot${spots.length !== 1 ? "s" : ""}`}
        </p>
      </header>

      {/* Sort */}
      {spots.length > 0 && (
        <div className="px-5 mb-4 flex gap-2">
          {(["recent", "score", "neighborhood"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSort(opt)}
              className={`px-3 py-1.5 rounded-full border-2 font-body text-xs font-bold transition-all ${
                sort === opt
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink border-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm"
              }`}
            >
              {opt === "recent" ? "Recent" : opt === "score" ? "Top Score" : "Neighborhood"}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="px-5 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm h-48 animate-pulse" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="px-5 grid grid-cols-2 gap-3">
          {sorted.map(({ spot, venue, score }) => (
            <div
              key={spot.id}
              className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm overflow-hidden group relative"
            >
              {/* Unsave button */}
              <button
                type="button"
                onClick={() => handleUnsave(venue.id)}
                className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 border border-ink rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Unsave"
              >
                ✕
              </button>

              <Link href={`/venue/${venue.id}`}>
                {/* Image */}
                <div className="h-24 bg-gradient-to-br from-coral/20 to-yellow/20 flex items-center justify-center">
                  {venue.image_url ? (
                    <img
                      src={venue.image_url}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">
                      {venue.category === "bar"
                        ? "🍸"
                        : venue.category === "restaurant"
                        ? "🍽️"
                        : venue.category === "cafe"
                        ? "☕"
                        : "📍"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-display text-sm font-bold text-ink leading-tight truncate flex-1">
                      {venue.name}
                    </h3>
                    {score !== null && (
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                        score >= 90
                          ? "bg-yellow/20 text-yellow-700 border-yellow/50"
                          : score >= 80
                          ? "bg-coral/10 text-coral border-coral/30"
                          : "bg-cream text-muted border-ink/10"
                      }`}>
                        {score}
                      </span>
                    )}
                  </div>
                  {venue.neighborhood && (
                    <p className="font-body text-[11px] text-muted mt-0.5 truncate">
                      {venue.neighborhood}
                    </p>
                  )}
                  <p className="font-body text-[10px] text-muted/60 mt-1">
                    Saved {new Date(spot.saved_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5">
          <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal p-8 text-center">
            <span className="text-4xl block mb-3">❤️</span>
            <p className="font-display font-bold text-ink text-lg mb-1">No saved spots yet</p>
            <p className="font-body text-muted text-sm mb-4">
              Find spots you love and save them here.
            </p>
            <Link
              href="/discover"
              className="inline-block bg-coral text-white font-body font-bold text-sm px-6 py-2.5 rounded-xl border-2 border-ink shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all"
            >
              Explore Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
