import SectionKicker from "./SectionKicker";
import NeyeceLogo from "./NeyeceLogo";

export default function ProblemSolution() {
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-16 md:py-20">
      <div className="bg-soft rounded-[32px] border-2 border-ink shadow-brutal-lg p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
        {/* Left — problem text */}
        <div>
          <SectionKicker emoji="😤" text="The Problem" color="orange" />
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-tight tracking-tight mt-5 mb-5">
            Generic results
            <br />
            that miss the <em className="text-coral">vibe.</em>
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-brown font-semibold">
            Every app gives you what&apos;s popular near you. Sorted by people who aren&apos;t you.{" "}
            <NeyeceLogo /> is the cool friend who knows exactly what you&apos;re into — and never
            steers you wrong. 🎯
          </p>
        </div>

        {/* Right — comparison cards */}
        <div className="flex flex-col gap-3.5">
          <div className="bg-white border-2 border-ink rounded-2xl px-5 py-4 transition-transform hover:translate-x-1">
            <div className="text-[0.62rem] font-extrabold tracking-[0.12em] uppercase mb-1.5 text-[#bbb]">
              😩 Old Way
            </div>
            <div className="text-[0.9rem] font-bold leading-relaxed text-[#bbb] line-through">
              &quot;Best restaurants near you&quot; — 847 places sorted by strangers
            </div>
          </div>
          <div className="bg-white border-2 border-ink rounded-2xl px-5 py-4 transition-transform hover:translate-x-1">
            <div className="text-[0.62rem] font-extrabold tracking-[0.12em] uppercase mb-1.5 text-[#bbb]">
              😩 Old Way
            </div>
            <div className="text-[0.9rem] font-bold leading-relaxed text-[#bbb] line-through">
              Generic filters. No vibe. No energy. No you.
            </div>
          </div>
          <div className="bg-gradient-to-br from-cream to-white border-2 border-coral rounded-2xl px-5 py-4 shadow-[3px_3px_0_#ff6b4a] transition-transform hover:translate-x-1">
            <div className="text-[0.62rem] font-extrabold tracking-[0.12em] uppercase mb-1.5 text-coral">
              ✨ That&apos;s <NeyeceLogo />
            </div>
            <div className="text-[0.9rem] font-bold leading-relaxed text-ink">
              &quot;4 spots picked for you tonight — because we know what you&apos;re in the mood
              for.&quot; 🙌
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
