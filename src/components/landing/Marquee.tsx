const items = [
  "That's Neyece",
  "So Neyece",
  "Very Neyece",
  "Stay Neyece",
];

function MarqueeItem({ text }: { text: string }) {
  const parts = text.split("Neyece");
  return (
    <span className="font-display italic text-[1.15rem] text-white px-8 inline-flex items-center gap-4">
      {parts[0]}N<span className="eye">eye</span>ce{parts[1] || ""}
      <span className="text-yellow not-italic text-[1.5rem]">✦</span>
    </span>
  );
}

export default function Marquee() {
  // Duplicate items 3x for seamless loop
  const allItems = [...items, ...items, ...items];

  return (
    <div className="bg-coral border-y-2 border-ink py-3.5 overflow-hidden whitespace-nowrap mt-12">
      <div className="inline-flex animate-marquee-scroll">
        {allItems.map((item, i) => (
          <MarqueeItem key={i} text={item} />
        ))}
      </div>
    </div>
  );
}
