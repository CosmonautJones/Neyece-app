import NeyeceLogo from "./NeyeceLogo";
import HeroCard from "./HeroCard";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <div className="px-6 md:px-12 pt-12 md:pt-20 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-[1fr_420px] gap-12 items-center max-w-[1200px] mx-auto relative">
      {/* Floating stickers */}
      <span className="hidden md:block absolute top-[10%] right-[44%] text-[2rem] animate-float pointer-events-none">
        ✨
      </span>
      <span className="hidden md:block absolute top-[60%] left-[8%] text-[1.5rem] animate-float pointer-events-none [animation-delay:1.5s]">
        🗺
      </span>
      <span className="hidden md:block absolute bottom-[15%] right-[10%] text-[1.8rem] animate-float pointer-events-none [animation-delay:0.8s]">
        🍜
      </span>

      {/* Left side */}
      <div>
        <div className="inline-flex items-center gap-2 bg-yellow border-2 border-ink rounded-full px-4 py-1.5 text-[0.75rem] font-extrabold tracking-[0.08em] uppercase mb-7 shadow-brutal-sm">
          🔥 Now taking early access
        </div>
        <h1 className="font-display text-[clamp(3.5rem,7vw,6rem)] font-bold leading-none tracking-tight mb-6">
          Find spots
          <br />
          that are
          <br />
          <span className="italic text-coral wavy">actually</span>
          <br />
          <em>you.</em>
        </h1>
        <p className="text-[1.1rem] leading-relaxed text-brown max-w-[500px] mb-9">
          <NeyeceLogo /> learns your taste and finds the places that match your vibe — not the
          crowd&apos;s. Hidden gems, local icons, and spots that make you go{" "}
          <strong>
            &quot;that&apos;s so <NeyeceLogo />.&quot;
          </strong>{" "}
          🙌
        </p>

        <WaitlistForm buttonText="Get Early Access" variant="hero" />
        <p className="text-[0.75rem] text-muted mt-3.5 font-bold">
          ✦ No spam. <span className="text-green">100% free</span> during beta.
        </p>
      </div>

      {/* Right side — venue card */}
      <HeroCard />
    </div>
  );
}
