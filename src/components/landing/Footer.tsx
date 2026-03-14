import NeyeceLogo from "./NeyeceLogo";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60 px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-3 text-[0.8rem] font-bold">
      <NeyeceLogo className="font-display italic text-[1.3rem] text-coral" />
      <div className="text-yellow italic font-display">
        &quot;That&apos;s <NeyeceLogo className="text-yellow" />.&quot;
      </div>
      <div>
        © 2026 <NeyeceLogo /> · All rights reserved
      </div>
    </footer>
  );
}
