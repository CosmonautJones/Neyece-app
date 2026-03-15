/**
 * Vibe Learning Loop — Shifts a user's fingerprint vector based on
 * accumulated behavioral signals.
 *
 * Signals from saves, "That's Neyece" taps, shares, and views
 * gradually drift the user's vibe vector toward venues they interact
 * with, making the score engine more accurate over time.
 */

import { VECTOR_LENGTH } from "./fingerprint";
import { venueTagsToVector } from "./scoring";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface DriftConfig {
  learnRate: number;
  decayRate: number;
  maxMagnitude: number;
}

export const DEFAULT_DRIFT_CONFIG: DriftConfig = {
  learnRate: 0.05,
  decayRate: 0.01,
  maxMagnitude: 2.0,
};

// ---------------------------------------------------------------------------
// Signal weights
// ---------------------------------------------------------------------------

const SIGNAL_WEIGHTS: Record<string, number> = {
  neyece: 3.0,
  save: 2.0,
  share: 2.0,
  view: 0.5,
  unsave: -0.5,
};

// ---------------------------------------------------------------------------
// Core drift computation
// ---------------------------------------------------------------------------

export interface SignalVenueData {
  venueVibeTags: string[];
  signalType: string;
}

/**
 * Compute a drifted version of the user's fingerprint vector based on
 * accumulated venue signals.
 *
 * Algorithm:
 * 1. For each signal, convert venue tags to a vector and scale by signal weight
 * 2. Sum all weighted venue vectors to get a drift direction
 * 3. Scale by learn rate and add to current vector
 * 4. Apply decay to unreinforced dimensions
 * 5. Clamp to maxMagnitude
 */
export function computeVectorDrift(
  currentVector: number[],
  signals: SignalVenueData[],
  config: DriftConfig = DEFAULT_DRIFT_CONFIG
): number[] {
  if (signals.length === 0) return [...currentVector];

  // Accumulate weighted venue vectors
  const drift = new Array<number>(VECTOR_LENGTH).fill(0);
  const reinforced = new Set<number>();

  for (const signal of signals) {
    const weight = SIGNAL_WEIGHTS[signal.signalType] ?? 0;
    if (weight === 0) continue;

    const venueVec = venueTagsToVector(signal.venueVibeTags);
    for (let i = 0; i < VECTOR_LENGTH; i++) {
      if (venueVec[i] !== 0) {
        drift[i] += venueVec[i] * weight;
        reinforced.add(i);
      }
    }
  }

  // Apply drift to current vector
  const result = [...currentVector];
  for (let i = 0; i < VECTOR_LENGTH; i++) {
    // Add scaled drift
    result[i] += drift[i] * config.learnRate;

    // Decay unreinforced dimensions slightly toward 0
    if (!reinforced.has(i) && result[i] !== 0) {
      const sign = result[i] > 0 ? 1 : -1;
      result[i] -= sign * config.decayRate;
      // Don't overshoot past 0
      if (sign * result[i] < 0) result[i] = 0;
    }

    // Clamp
    result[i] = Math.max(-config.maxMagnitude, Math.min(config.maxMagnitude, result[i]));
  }

  return result;
}

// ---------------------------------------------------------------------------
// Should we update?
// ---------------------------------------------------------------------------

/**
 * Determine if a profile should be updated based on signal count and
 * time since last update.
 */
export function shouldUpdateProfile(
  lastUpdated: string | null,
  signalCount: number
): boolean {
  // Enough signals to warrant an update
  if (signalCount >= 5) return true;

  // At least 1 signal and 24h since last update
  if (signalCount >= 1 && lastUpdated) {
    const age = Date.now() - new Date(lastUpdated).getTime();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (age >= TWENTY_FOUR_HOURS) return true;
  }

  return false;
}
