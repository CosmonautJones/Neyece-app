function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-ink/10 rounded-lg ${className ?? ""}`} />;
}

export function VenueCardSkeleton({ featured }: { featured?: boolean }) {
  return (
    <div
      className={`flex-shrink-0 bg-white border-2 border-ink/20 rounded-2xl overflow-hidden ${
        featured ? "w-72" : "w-60"
      }`}
    >
      <Pulse className={`w-full ${featured ? "h-40" : "h-32"} rounded-none`} />
      <div className="p-3">
        <Pulse className="h-4 w-3/4 mb-2" />
        <Pulse className="h-3 w-1/2 mb-3" />
        <div className="flex gap-1">
          <Pulse className="h-5 w-16 rounded-full" />
          <Pulse className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function VenueListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-white border-2 border-ink/20 rounded-xl p-3">
      <Pulse className="flex-shrink-0 w-14 h-14 rounded-lg" />
      <div className="flex-1">
        <Pulse className="h-4 w-3/4 mb-2" />
        <Pulse className="h-3 w-1/2" />
      </div>
      <Pulse className="flex-shrink-0 w-9 h-9 rounded-full" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="pb-24">
      {/* Header skeleton */}
      <div className="px-5 pt-6 pb-4">
        <Pulse className="h-3 w-32 mb-2" />
        <Pulse className="h-7 w-48" />
      </div>

      {/* Mood selector skeleton */}
      <div className="px-5 mb-5 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Pulse key={i} className="h-9 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Featured section skeleton */}
      <div className="mb-6">
        <div className="px-5 mb-3">
          <Pulse className="h-5 w-36" />
        </div>
        <div className="flex gap-3 px-5 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <VenueCardSkeleton key={i} featured />
          ))}
        </div>
      </div>

      {/* Nearby section skeleton */}
      <div className="px-5">
        <Pulse className="h-5 w-28 mb-3" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <VenueListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
