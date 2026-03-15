"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Venue } from "@/lib/supabase/types";
import { trackSignal } from "@/lib/track-signal";
import VibeInsight from "./VibeInsight";
import ShareSheet from "./ShareSheet";

interface VenueDetailProps {
  venue: Venue;
  score?: number;
  initialSaved?: boolean;
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

const PRICE_LABELS = ["Free", "$", "$$", "$$$", "$$$$"];

function getVibeTagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function VenueDetail({ venue, score, initialSaved = false }: VenueDetailProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [savePending, setSavePending] = useState(false);
  const [neyeceTapped, setNeyeceTapped] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const tags = (venue.vibe_tags as string[]) ?? [];
  const emoji = CATEGORY_EMOJI[venue.category ?? ""] ?? "📍";
  const hours = (venue.hours as string[]) ?? [];

  // Track venue view on mount
  useEffect(() => {
    trackSignal(venue.id, "view");
  }, [venue.id]);

  const handleSave = async () => {
    setSavePending(true);
    const newSaved = !saved;
    setSaved(newSaved); // Optimistic
    trackSignal(venue.id, newSaved ? "save" : "unsave");

    try {
      const res = await fetch(`/api/venues/${venue.id}/save`, {
        method: newSaved ? "POST" : "DELETE",
      });
      if (!res.ok) {
        setSaved(!newSaved); // Revert
      }
    } catch {
      setSaved(!newSaved); // Revert
    } finally {
      setSavePending(false);
    }
  };

  const handleShare = () => {
    trackSignal(venue.id, "share");
    setShareOpen(true);
  };

  const handleNeyece = () => {
    setNeyeceTapped(true);
    trackSignal(venue.id, "neyece");
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Hero */}
      <div className="relative h-56 bg-gradient-to-br from-coral/30 to-yellow/30 flex items-center justify-center">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-7xl">{emoji}</span>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

        {/* Back button */}
        <Link
          href="/discover"
          className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 border-2 border-ink shadow-brutal-sm"
        >
          <span className="text-lg">←</span>
        </Link>

        {/* Score badge */}
        {score !== undefined && (
          <div
            className={`absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-ink shadow-brutal-sm flex items-center justify-center font-body font-extrabold text-base ${
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

        {/* Venue name overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
            {venue.name}
          </h1>
          <p className="font-body text-white/80 text-sm mt-0.5">
            {venue.neighborhood} · {venue.category}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={savePending}
          className={`flex-1 py-3 rounded-xl border-2 border-ink font-body font-bold text-sm shadow-brutal-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal ${
            saved ? "bg-coral text-white" : "bg-white text-ink"
          }`}
        >
          {saved ? "❤️ Saved" : "🤍 Save"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 rounded-xl border-2 border-ink bg-white text-ink font-body font-bold text-sm shadow-brutal-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal"
        >
          📤 Share
        </button>
      </div>

      {/* Vibe tags */}
      {tags.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-cream-dark border border-ink/20 rounded-full text-xs font-body font-bold text-brown"
            >
              {getVibeTagLabel(tag)}
            </span>
          ))}
        </div>
      )}

      {/* Info grid */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-5">
        {venue.category && (
          <InfoCard label="Category" value={venue.category} emoji={emoji} />
        )}
        {venue.price_level !== null && (
          <InfoCard label="Price" value={PRICE_LABELS[venue.price_level] ?? "?"} emoji="💰" />
        )}
        {venue.neighborhood && (
          <InfoCard label="Neighborhood" value={venue.neighborhood} emoji="📍" />
        )}
        {venue.city && (
          <InfoCard label="City" value={venue.city.toUpperCase()} emoji="🏙️" />
        )}
      </div>

      {/* Description */}
      {venue.description && (
        <div className="px-5 mb-5">
          <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-4">
            <p className="font-body text-ink text-sm leading-relaxed">{venue.description}</p>
          </div>
        </div>
      )}

      {/* AI Insight (lazy-loaded, falls back to template) */}
      <div className="px-5 mb-5">
        <VibeInsight
          venueId={venue.id}
          fallbackInsight={`This ${venue.category ?? "spot"} in ${venue.neighborhood ?? "the area"} matches your ${tags[0] ? getVibeTagLabel(tags[0]).toLowerCase() : "vibe"} energy. ${tags.length > 1 ? `Plus it's got ${getVibeTagLabel(tags[1]).toLowerCase()} vibes — right up your alley.` : "Definitely worth checking out."}`}
        />
      </div>

      {/* Hours */}
      {hours.length > 0 && (
        <div className="px-5 mb-5">
          <h3 className="font-display font-bold text-ink text-sm mb-2">Hours</h3>
          <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-4">
            {hours.map((h, i) => (
              <p key={i} className="font-body text-ink text-xs leading-relaxed">
                {h}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* "That's Neyece" CTA */}
      <div className="px-5">
        <button
          type="button"
          onClick={handleNeyece}
          disabled={neyeceTapped}
          className={`w-full py-4 rounded-2xl border-2 border-ink font-display font-bold text-lg shadow-brutal transition-all ${
            neyeceTapped
              ? "bg-yellow text-ink shadow-brutal-sm"
              : "bg-coral text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm"
          }`}
        >
          {neyeceTapped ? "That's So Neyece ✨" : "That's Neyece 🔥"}
        </button>
      </div>

      {/* Share Sheet */}
      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`${venue.name} on Neyece`}
        text={`Just found ${venue.name} on Neyece. That's so Neyece.`}
        url={typeof window !== "undefined" ? `${window.location.origin}/venue/${venue.id}` : ""}
        shareType="venue"
        venueId={venue.id}
      />
    </div>
  );
}

function InfoCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-white border-2 border-ink rounded-xl shadow-brutal-sm p-3 flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      <div>
        <p className="font-body text-muted text-[10px] uppercase tracking-wide">{label}</p>
        <p className="font-body font-bold text-ink text-sm capitalize">{value}</p>
      </div>
    </div>
  );
}
