"use client";

import { useState, useEffect } from "react";

interface VibeInsightProps {
  venueId: string;
  fallbackInsight: string;
}

export default function VibeInsight({ venueId, fallbackInsight }: VibeInsightProps) {
  const [insight, setInsight] = useState(fallbackInsight);
  const [source, setSource] = useState<"template" | "ai">("template");
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchInsight() {
      try {
        const res = await fetch(`/api/insights/${venueId}`);
        if (!res.ok || cancelled) return;

        const data = await res.json();
        if (cancelled) return;

        if (data.insight && data.insight !== fallbackInsight) {
          setTransitioning(true);
          // Brief fade transition
          setTimeout(() => {
            if (!cancelled) {
              setInsight(data.insight);
              setSource(data.source);
              setTransitioning(false);
            }
          }, 200);
        }
      } catch {
        // Keep fallback — never show an error
      }
    }

    fetchInsight();
    return () => {
      cancelled = true;
    };
  }, [venueId, fallbackInsight]);

  return (
    <div className="bg-gradient-to-br from-coral/10 to-yellow/10 border-2 border-coral/30 rounded-2xl p-4">
      <p className="font-body text-xs text-coral font-bold uppercase tracking-wide mb-1.5">
        Why this is Neyece for you
      </p>
      <p
        className={`font-body text-ink text-sm leading-relaxed transition-opacity duration-200 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {insight}
      </p>
      {source === "ai" && (
        <p className="font-body text-[10px] text-muted mt-2">Powered by Neyece AI</p>
      )}
    </div>
  );
}
