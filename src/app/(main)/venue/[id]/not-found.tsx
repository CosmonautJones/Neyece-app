import Link from "next/link";

export default function VenueNotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h1 className="font-display text-2xl font-bold text-ink mb-2">
          Spot not found
        </h1>
        <p className="font-body text-muted mb-6">
          This venue doesn't exist or may have been removed.
        </p>
        <Link
          href="/discover"
          className="inline-block px-6 py-3 bg-coral text-white border-2 border-ink rounded-xl font-body font-bold shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover transition-all"
        >
          Back to Discover
        </Link>
      </div>
    </div>
  );
}
