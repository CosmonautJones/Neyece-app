import type { QuizAnswers } from "./quiz-data";

/**
 * All vibe dimensions used in the fingerprint vector.
 * Order matters — this defines the vector index for each trait.
 */
const DIMENSIONS = [
  // energy (4)
  "chill",
  "lively",
  "rowdy",
  "intimate",
  // setting (4)
  "rooftop",
  "hidden",
  "outdoor",
  "cozy",
  // vibes (6)
  "trendy",
  "classic",
  "artsy",
  "local",
  "upscale",
  "casual",
  // dealbreakers (4) — stored as negative signals
  "loud",
  "no-reservations",
  "far-transit",
  "expensive",
] as const;

export const VECTOR_LENGTH = DIMENSIONS.length;

/**
 * Convert quiz answers into a fingerprint vector.
 *
 * Positive traits (energy, setting, vibes) get +1.
 * Dealbreakers get -1 (penalize matching venues).
 * Unselected dimensions stay 0.
 */
export function generateFingerprintVector(answers: QuizAnswers): number[] {
  const vector = new Array<number>(VECTOR_LENGTH).fill(0);

  const positive = [...answers.energy, ...answers.setting, ...answers.vibes];
  for (const trait of positive) {
    const idx = DIMENSIONS.indexOf(trait as (typeof DIMENSIONS)[number]);
    if (idx !== -1) vector[idx] = 1;
  }

  for (const trait of answers.dealbreakers) {
    const idx = DIMENSIONS.indexOf(trait as (typeof DIMENSIONS)[number]);
    if (idx !== -1) vector[idx] = -1;
  }

  return vector;
}
