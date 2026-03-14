export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <main className="flex max-w-lg flex-col items-center gap-8 text-center">
        <h1 className="font-display text-6xl font-bold tracking-tight text-dark sm:text-7xl">
          Ney<span className="gradient-text">ec</span>e
        </h1>

        <p className="text-xl text-dark-light">
          Discover spots that actually match your vibe.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {["Chill", "Lively", "Date Night", "Late Night", "Outdoors", "Creative"].map((mood) => (
            <span
              key={mood}
              className="rounded-full border-2 border-coral/30 bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-coral hover:bg-coral/10"
            >
              {mood}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105">
          That&apos;s Neyece.
        </div>

        <p className="text-sm text-dark-lighter">Coming soon to NYC, LA, Chicago & Miami</p>
      </main>
    </div>
  );
}
