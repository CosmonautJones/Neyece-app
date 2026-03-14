"use client";

import { useState, useMemo } from "react";
import type { Venue } from "@/lib/supabase/types";
import { MOODS, MOOD_TAG_MAP, MOCK_SCORES } from "@/lib/mock-data";
import VenueCard from "./VenueCard";
import VenueListItem from "./VenueListItem";
import MoodSelector from "./MoodSelector";

interface DiscoverFeedProps {
  venues: Venue[];
  userName: string | null;
  city: string | null;
}

export default function DiscoverFeed({ venues, userName, city }: DiscoverFeedProps) {
  const [mood, setMood] = useState("All");

  // Filter venues by mood
  const filtered = useMemo(() => {
    const tagFilter = MOOD_TAG_MAP[mood] ?? [];
    if (tagFilter.length === 0) return venues;
    return venues.filter((v) => {
      const tags = (v.vibe_tags as string[]) ?? [];
      return tagFilter.some((t) => tags.includes(t));
    });
  }, [venues, mood]);

  // Split into featured (score >= 85) and nearby
  const featured = filtered
    .filter((v) => (MOCK_SCORES[v.id] ?? 0) >= 85)
    .sort((a, b) => (MOCK_SCORES[b.id] ?? 0) - (MOCK_SCORES[a.id] ?? 0));

  const nearby = filtered
    .filter((v) => (MOCK_SCORES[v.id] ?? 0) < 85 || !MOCK_SCORES[v.id])
    .sort((a, b) => (a.neighborhood ?? "").localeCompare(b.neighborhood ?? ""));

  const cityLabel = city
    ? city.charAt(0).toUpperCase() + city.slice(1)
    : "your city";

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <p className="font-body text-muted text-sm">
          Discovering in <span className="font-bold text-brown">{cityLabel}</span>
        </p>
        <h1 className="font-display text-2xl font-bold text-ink mt-0.5">
          Hey, {userName ?? "friend"} 👋
        </h1>
      </header>

      {/* Mood selector */}
      <div className="px-5 mb-5">
        <MoodSelector moods={MOODS} selected={mood} onSelect={setMood} />
      </div>

      {/* Featured section */}
      {featured.length > 0 && (
        <section className="mb-6">
          <div className="px-5 mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-ink">
              For You Tonight
            </h2>
            <span className="font-body text-xs text-muted">{featured.length} spots</span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {featured.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                score={MOCK_SCORES[venue.id]}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* Nearby Gems */}
      <section className="px-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold text-ink">
            Nearby Gems
          </h2>
          <span className="font-body text-xs text-muted">{nearby.length} spots</span>
        </div>
        {nearby.length > 0 ? (
          <div className="flex flex-col gap-3">
            {nearby.map((venue) => (
              <VenueListItem
                key={venue.id}
                venue={venue}
                score={MOCK_SCORES[venue.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal p-8 text-center">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="font-display font-bold text-ink text-lg mb-1">
              No spots match this mood yet
            </p>
            <p className="font-body text-muted text-sm">
              Try a different vibe or check back soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
