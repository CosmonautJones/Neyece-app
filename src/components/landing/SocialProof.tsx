import SectionKicker from "./SectionKicker";
import NeyeceLogo from "./NeyeceLogo";

const testimonials = [
  {
    quote: (
      <>
        Found a wine bar 3 blocks away I&apos;d walked past 200 times. Went twice that week.{" "}
        <span className="text-coral italic">
          That&apos;s <NeyeceLogo />.
        </span>
      </>
    ),
    by: "Beta user, Brooklyn NY",
    bg: "bg-white",
  },
  {
    quote: (
      <>
        Recommended a tiny ramen spot I&apos;d never heard of. Everything it told me about the vibe
        was right.{" "}
        <span className="text-coral italic">
          So <NeyeceLogo />.
        </span>
      </>
    ),
    by: "Beta user, Chicago IL",
    bg: "bg-soft",
  },
  {
    quote: (
      <>
        My friends don&apos;t get how I always know the best spot. I&apos;m not telling them.{" "}
        <span className="text-coral italic">
          Stay <NeyeceLogo />.
        </span>
      </>
    ),
    by: "Beta user, Los Angeles CA",
    bg: "bg-warm",
  },
];

export default function SocialProof() {
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-16 md:py-20">
      <div className="text-center mb-12">
        <SectionKicker emoji="💬" text="Early users say" color="coral" />
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight mt-4">
          Already saying it.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`${t.bg} border-2 border-ink rounded-[20px] p-6 shadow-brutal transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover`}
          >
            <div className="text-[1rem] mb-3">⭐⭐⭐⭐⭐</div>
            <p className="text-[0.9rem] leading-relaxed font-bold text-ink mb-4">
              &quot;{t.quote}&quot;
            </p>
            <div className="text-[0.7rem] font-extrabold tracking-[0.08em] uppercase text-muted">
              — {t.by}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
