"use client";

import { useState } from "react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
  shareType: "venue" | "collection" | "profile";
  venueId?: string;
  collectionId?: string;
}

const SHARE_OPTIONS = [
  { id: "copy", label: "Copy Link", emoji: "📋" },
  { id: "twitter", label: "Twitter", emoji: "🐦" },
  { id: "whatsapp", label: "WhatsApp", emoji: "💬" },
  { id: "native", label: "More...", emoji: "📤" },
] as const;

export default function ShareSheet({
  isOpen,
  onClose,
  title,
  text,
  url,
  shareType,
  venueId,
  collectionId,
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const logShare = async (platform: string) => {
    fetch("/api/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        share_type: shareType,
        venue_id: venueId,
        collection_id: collectionId,
        platform,
      }),
    }).catch(() => {});
  };

  const hashTag = "#SoNeyece";
  const shareText = `${text} ${hashTag}`;

  const handleShare = async (optionId: string) => {
    switch (optionId) {
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        await logShare("clipboard");
        break;

      case "twitter": {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, "_blank");
        await logShare("twitter");
        break;
      }

      case "whatsapp": {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`;
        window.open(waUrl, "_blank");
        await logShare("whatsapp");
        break;
      }

      case "native":
        if (navigator.share) {
          try {
            await navigator.share({ title, text: shareText, url });
            await logShare("native");
          } catch {
            // User cancelled
          }
        }
        break;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-ink rounded-t-3xl animate-slide-up">
        <div className="max-w-md mx-auto px-5 pt-4 pb-8">
          {/* Handle */}
          <div className="w-10 h-1 bg-ink/20 rounded-full mx-auto mb-4" />

          <h3 className="font-display text-lg font-bold text-ink mb-1">Share</h3>
          <p className="font-body text-xs text-muted mb-4 truncate">{title}</p>

          <div className="grid grid-cols-4 gap-3">
            {SHARE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleShare(opt.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-cream transition-colors"
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="font-body text-[10px] text-ink font-bold">
                  {opt.id === "copy" && copied ? "Copied!" : opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
