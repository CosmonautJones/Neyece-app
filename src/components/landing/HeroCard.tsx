import NeyeceLogo from "./NeyeceLogo";

export default function HeroCard() {
  return (
    <div className="hidden md:block bg-white border-2 border-ink rounded-[28px] overflow-hidden shadow-brutal-lg">
      {/* Card image area */}
      <div className="h-[200px] bg-gradient-to-br from-[#ffb347] via-coral to-[#c94040] relative overflow-hidden">
        <span className="absolute text-[5rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg z-[1]">
          🍷
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3.5 right-3.5 bg-yellow border-2 border-ink rounded-full px-3 py-1 text-[0.7rem] font-extrabold text-ink z-[2]">
          ✦ 94 <NeyeceLogo />
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex gap-1.5 mb-2.5 flex-wrap">
          <span className="bg-coral text-white border-coral border-[1.5px] rounded-full px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.04em]">
            🔥 Trending
          </span>
          <span className="bg-soft border-[1.5px] border-ink rounded-full px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.04em] text-brown">
            Hidden
          </span>
          <span className="bg-soft border-[1.5px] border-ink rounded-full px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.04em] text-brown">
            Candlelit
          </span>
        </div>
        <div className="font-display text-[1.3rem] font-bold mb-1 leading-tight">
          The Lower Room
        </div>
        <div className="text-[0.78rem] text-muted font-bold mb-3.5">
          Wine Bar · West Village · 0.4 mi away
        </div>
        <div className="bg-warm rounded-xl p-3 text-[0.8rem] leading-relaxed text-brown border-[1.5px] border-[#eedad0] mb-3.5">
          <strong className="text-coral">
            Why it&apos;s <NeyeceLogo /> for you:
          </strong>{" "}
          You love cozy, low-lit spots with great drinks and no attitude. This place has all three —
          plus a hidden entrance. 🕯
        </div>
        <button className="w-full bg-ink text-white rounded-xl py-3 font-body text-[0.82rem] font-extrabold tracking-[0.04em] cursor-default">
          That&apos;s N<span className="eye-solid">eye</span>ce ✦
        </button>
      </div>
    </div>
  );
}
