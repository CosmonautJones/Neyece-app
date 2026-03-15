import NeyeceLogo from "./NeyeceLogo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-cream border-b-2 border-ink px-6 md:px-12 py-4 flex justify-between items-center">
      <NeyeceLogo className="font-display text-[1.6rem] font-bold italic text-coral tracking-tight" />
      <div className="flex items-center gap-3">
        <a
          href="#how"
          className="hidden md:inline-block text-[0.8rem] font-bold tracking-[0.04em] text-brown px-4 py-2 rounded-full border-2 border-transparent transition-all hover:border-ink"
        >
          How it works
        </a>
        <a
          href="#cities"
          className="hidden md:inline-block text-[0.8rem] font-bold tracking-[0.04em] text-brown px-4 py-2 rounded-full border-2 border-transparent transition-all hover:border-ink"
        >
          Cities
        </a>
        <a
          href="#cta"
          className="bg-coral text-white rounded-full text-[0.8rem] font-extrabold tracking-[0.04em] px-5 py-2.5 border-2 border-ink shadow-brutal-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#1e1206]"
        >
          Join Waitlist 🎉
        </a>
      </div>
    </nav>
  );
}
