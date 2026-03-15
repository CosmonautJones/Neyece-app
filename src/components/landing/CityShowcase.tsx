const cities = ["New York", "Los Angeles", "Chicago", "Miami"];

export default function CityShowcase() {
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-16 md:py-20" id="cities">
      <div className="bg-ink rounded-[32px] p-10 md:p-16 text-center border-2 border-ink shadow-brutal-coral">
        <div className="inline-flex items-center gap-2 bg-coral text-white border-2 border-white/30 rounded-full px-4 py-1 text-[0.7rem] font-extrabold tracking-[0.1em] uppercase shadow-brutal-sm mb-4">
          📍 Launching in
        </div>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight text-white mb-10">
          Coming to your <em className="text-yellow">city.</em>
        </h2>
        <div className="flex justify-center flex-wrap gap-3">
          {cities.map((city) => (
            <div
              key={city}
              className="bg-white/[0.08] border-2 border-white/15 rounded-full px-7 py-3 font-display text-[1.2rem] italic font-bold text-white/90 transition-all hover:bg-coral/20 hover:border-coral"
            >
              {city}
            </div>
          ))}
          <div className="bg-yellow border-2 border-yellow rounded-full px-7 py-3 font-body text-[0.75rem] font-extrabold tracking-[0.1em] uppercase text-ink self-center">
            + More soon
          </div>
        </div>
      </div>
    </div>
  );
}
