import SectionKicker from "./SectionKicker";

const steps = [
  {
    num: "01",
    emoji: "🧠",
    title: "Your Vibe Fingerprint",
    desc: 'We don\'t ask "what cuisine?" We ask "what\'s your ideal Saturday?" AI builds a taste profile that gets smarter every time you go out.',
    badge: "So Neyece",
    bg: "bg-white",
  },
  {
    num: "02",
    emoji: "👥",
    title: "Human + AI Curation",
    desc: "Local tastemakers drop real intel — not just stars, but the inside scoop. AI matches those gems to exactly the right people.",
    badge: "Very Neyece",
    bg: "bg-warm",
  },
  {
    num: "03",
    emoji: "🕵️",
    title: "Discover First",
    desc: "Find the next great spot before it blows up. Be the friend who always knows where to go — before it gets a line around the block.",
    badge: "Stay Neyece",
    bg: "bg-soft",
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-16 md:py-20" id="how">
      <div className="text-center mb-14">
        <SectionKicker emoji="⚡" text="How it works" color="green" />
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight mt-4">
          Three things no other
          <br />
          app does.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`${step.bg} border-2 border-ink rounded-[20px] p-7 shadow-brutal relative overflow-hidden transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover`}
          >
            <span className="absolute top-4 right-5 font-display text-[3.5rem] font-bold text-black/[0.06] leading-none">
              {step.num}
            </span>
            <span className="text-[2.5rem] block mb-4">{step.emoji}</span>
            <div className="font-display text-[1.25rem] font-bold mb-2.5">{step.title}</div>
            <div className="text-[0.88rem] leading-relaxed text-brown font-semibold">
              {step.desc}
            </div>
            <span className="inline-block mt-4 bg-yellow border-[1.5px] border-ink rounded-full px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.06em] uppercase">
              {step.badge.replace("Neyece", "N")}
              <span className="eye-solid">eye</span>ce
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
