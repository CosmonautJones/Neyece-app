import NeyeceLogo from "./NeyeceLogo";
import SectionKicker from "./SectionKicker";
import WaitlistForm from "./WaitlistForm";

export default function BottomCta() {
  return (
    <div className="text-center px-6 md:px-12 py-20 md:py-24" id="cta">
      <span className="text-[4rem] block mb-5 animate-bounce">🎉</span>
      <div className="mb-5">
        <SectionKicker emoji="✦" text="Early access" color="default" />
      </div>
      <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight tracking-tight mb-4">
        Be first.
        <br />
        Be{" "}
        <em className="text-coral">
          <NeyeceLogo />.
        </em>
      </h2>
      <p className="text-[1.1rem] text-brown font-bold mb-12 italic font-display">
        Join the waitlist. Help us build the thing your city deserves.
      </p>
      <div className="flex justify-center">
        <WaitlistForm buttonText="Join Waitlist 🎉" variant="cta" />
      </div>
    </div>
  );
}
