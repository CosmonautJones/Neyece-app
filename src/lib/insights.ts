/**
 * AI Insight Generation — Personalized "Why this is Neyece for you" text.
 *
 * Uses Claude API with a warm, playful brand voice. Falls back to a
 * template if the API is unavailable.
 */

import Anthropic from "@anthropic-ai/sdk";
import { DIMENSIONS } from "./fingerprint";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InsightContext {
  venueName: string;
  venueCategory: string | null;
  venueNeighborhood: string | null;
  venueTags: string[];
  userTopVibes: string[];
  matchedDimensions: string[];
  score: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Top 3-4 highest-valued dimensions from a fingerprint vector. */
export function extractTopVibes(vector: number[]): string[] {
  return vector
    .map((val, i) => ({ tag: DIMENSIONS[i], val }))
    .filter((d) => d.val > 0)
    .sort((a, b) => b.val - a.val)
    .slice(0, 4)
    .map((d) => d.tag);
}

/** Dimensions where both user and venue vectors are positive. */
export function findMatchedDimensions(
  userVector: number[],
  venueVector: number[]
): string[] {
  const matched: string[] = [];
  for (let i = 0; i < userVector.length; i++) {
    if (userVector[i] > 0 && venueVector[i] > 0) {
      matched.push(DIMENSIONS[i]);
    }
  }
  return matched;
}

function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Template fallback (same logic as the Phase 1 placeholder)
// ---------------------------------------------------------------------------

export function templateInsight(ctx: InsightContext): string {
  const category = ctx.venueCategory ?? "spot";
  const neighborhood = ctx.venueNeighborhood ?? "the area";
  const topVibe = ctx.venueTags[0] ? formatTag(ctx.venueTags[0]).toLowerCase() : "vibe";
  const secondVibe = ctx.venueTags[1] ? formatTag(ctx.venueTags[1]).toLowerCase() : null;

  const base = `This ${category} in ${neighborhood} matches your ${topVibe} energy.`;
  const extra = secondVibe
    ? ` Plus it's got ${secondVibe} vibes — right up your alley.`
    : " Definitely worth checking out.";

  return base + extra;
}

// ---------------------------------------------------------------------------
// AI-powered insight generation
// ---------------------------------------------------------------------------

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

export async function generateInsight(ctx: InsightContext): Promise<string> {
  const client = getClient();
  if (!client) return templateInsight(ctx);

  try {
    const userVibes = ctx.userTopVibes.map(formatTag).join(", ");
    const matched = ctx.matchedDimensions.map(formatTag).join(", ");
    const venueTags = ctx.venueTags.map(formatTag).join(", ");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 100,
      system:
        "You are a warm, playful local friend who knows this person's taste. " +
        "In 1-2 sentences, explain why this specific venue matches their vibe. " +
        "Be specific about the overlap. Never be corporate or generic. " +
        "Sound like a cool friend texting — warm, casual, confident.",
      messages: [
        {
          role: "user",
          content:
            `Venue: ${ctx.venueName} (${ctx.venueCategory ?? "spot"} in ${ctx.venueNeighborhood ?? "the area"})\n` +
            `Venue vibes: ${venueTags}\n` +
            `User's top vibes: ${userVibes}\n` +
            `Matching dimensions: ${matched}\n` +
            `Neyece Score: ${ctx.score}/100\n\n` +
            `Write a 1-2 sentence insight for why this venue is Neyece for this user.`,
        },
      ],
    });

    const text = message.content[0];
    if (text.type === "text" && text.text.trim()) {
      return text.text.trim();
    }
    return templateInsight(ctx);
  } catch {
    return templateInsight(ctx);
  }
}
