"use client";

import { useState, useEffect, useCallback } from "react";
import type { Venue } from "@/lib/supabase/types";
import { MOODS, MOCK_VENUES, MOCK_SCORES } from "@/lib/mock-data";
import VenueCard from "./VenueCard";
import VenueListItem from "./VenueListItem";
import MoodSelector from "./MoodSelector";
import { VenueCardSkeleton, VenueListItemSkeleton } from "./Skeleton";

interface DiscoverFeedProps {
  venues: Venue[];
  userName: string | null;
  city: string | null;
}

interface VenuesResponse {
  venues: Venue[];
  total: number;
  hasMore: boolean;
}

export default function DiscoverFeed({ venues: initialVenues, userName, city }: DiscoverFeedProps) {
  const [mood, setMood] = useState("All");
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [useMock, setUseMock] = useState(true);

  const fetchVenues = useCallback(
    async (selectedMood: string, newOffset: number, append: boolean) => {
      if (!city) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          city,
          limit: "20",
          offset: String(newOffset),
        });
        if (selectedMood !== "All") params.set("mood", selectedMood);

        const res = await fetch(`/api/venues?${params}`);
        if (!res.ok) throw new Error("API error");

        const data: VenuesResponse = await res.json();

        if (data.venues.length > 0) {
          setUseMock(false);
          setVenues(append ? (prev) => [...prev, ...data.venues] : data.venues);
          setHasMore(data.hasMore);
          setOffset(newOffset + data.venues.length);
        } else if (!append) {
          // API returned empty — could be no Supabase connection yet, fall back to mock
          setUseMock(true);
        }
      } catch {
        // API not available — stay on mock data
        setUseMock(true);
      } finally {
        setLoading(false);
      }
    },
    [city]
  );

  // Try API on mount
  useEffect(() => {
    fetchVenues("All", 0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle mood change
  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
    setOffset(0);
    if (!useMock) {
      fetchVenues(newMood, 0, false);
    }
  };

  // Mock-mode filtering
  const displayVenues = useMock ? filterMockByMood(initialVenues, mood) : venues;

  // Split into featured (score >= 85) and nearby
  const featured = displayVenues
    .filter((v) => (MOCK_SCORES[v.id] ?? 0) >= 85)
    .sort((a, b) => (MOCK_SCORES[b.id] ?? 0) - (MOCK_SCORES[a.id] ?? 0));

  const nearby = displayVenues
    .filter((v) => (MOCK_SCORES[v.id] ?? 0) < 85 || !MOCK_SCORES[v.id])
    .sort((a, b) => (a.neighborhood ?? "").localeCompare(b.neighborhood ?? ""));

  const cityLabel = city ? city.charAt(0).toUpperCase() + city.slice(1) : "your city";

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
        <MoodSelector moods={MOODS} selected={mood} onSelect={handleMoodChange} />
      </div>

      {/* Featured section */}
      <section className="mb-6">
        <div className="px-5 mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold text-ink">For You Tonight</h2>
          <span className="font-body text-xs text-muted">
            {loading ? "..." : `${featured.length} spots`}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {loading && venues.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <VenueCardSkeleton key={i} featured />
              ))
            : featured.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  score={MOCK_SCORES[venue.id]}
                  featured
                />
              ))}
        </div>
      </section>

      {/* Nearby Gems */}
      <section className="px-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Nearby Gems</h2>
          <span className="font-body text-xs text-muted">
            {loading ? "..." : `${nearby.length} spots`}
          </span>
        </div>

        {loading && venues.length === 0 ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <VenueListItemSkeleton key={i} />
            ))}
          </div>
        ) : nearby.length > 0 ? (
          <div className="flex flex-col gap-3">
            {nearby.map((venue) => (
              <VenueListItem key={venue.id} venue={venue} score={MOCK_SCORES[venue.id]} />
            ))}
            {hasMore && !useMock && (
              <button
                type="button"
                onClick={() => fetchVenues(mood, offset, true)}
                disabled={loading}
                className="mt-2 py-3 bg-white border-2 border-ink rounded-xl font-body font-bold text-sm text-ink shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            )}
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

// ---------------------------------------------------------------------------
// Mock-mode mood filter (same logic as before, client-side)
// ---------------------------------------------------------------------------

import { MOOD_TAG_MAP } from "@/lib/mock-data";

function filterMockByMood(venues: Venue[], mood: string): Venue[] {
  const tagFilter = MOOD_TAG_MAP[mood] ?? [];
  if (tagFilter.length === 0) return venues;
  return venues.filter((v) => {
    const tags = (v.vibe_tags as string[]) ?? [];
    return tagFilter.some((t) => tags.includes(t));
  });
}
