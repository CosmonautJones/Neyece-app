/**
 * Client-side fire-and-forget signal tracking.
 *
 * Uses sendBeacon for robustness (survives page navigation).
 * Falls back to fetch. Never blocks UI or surfaces errors.
 */

type SignalType = "save" | "unsave" | "neyece" | "view" | "share";

export function trackSignal(venueId: string, signalType: SignalType): void {
  const body = JSON.stringify({ venueId, signalType });

  // Prefer sendBeacon for view/share signals (survives page nav)
  if (
    typeof navigator !== "undefined" &&
    navigator.sendBeacon &&
    (signalType === "view" || signalType === "share")
  ) {
    navigator.sendBeacon("/api/signals", body);
    return;
  }

  // Fallback: regular fetch, fire-and-forget
  fetch("/api/signals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch(() => {});
}
