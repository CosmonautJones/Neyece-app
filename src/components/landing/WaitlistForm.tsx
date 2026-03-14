"use client";

import { useState } from "react";
import NeyeceLogo from "./NeyeceLogo";

export default function WaitlistForm({
  buttonText = "Get Early Access",
  variant = "hero",
}: {
  buttonText?: string;
  variant?: "hero" | "cta";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">(
    "idle"
  );

  const shadowClass = variant === "cta" ? "shadow-[5px_5px_0_#1e1206]" : "shadow-brutal";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 409) {
        setStatus("duplicate");
      } else if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-display italic text-xl text-coral">
        You&apos;re in! Something <NeyeceLogo /> is on its way 🎉
      </p>
    );
  }

  if (status === "duplicate") {
    return (
      <p className="font-display italic text-xl text-coral">
        You&apos;re already on the list! Stay <NeyeceLogo /> 🎉
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex max-w-[440px] border-2 border-ink rounded-2xl overflow-hidden ${shadowClass} bg-white`}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 border-none px-5 py-4 font-body text-[0.9rem] font-semibold text-ink bg-transparent outline-none placeholder:text-[#c4a882]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-coral text-white border-none border-l-2 border-l-ink font-body text-[0.78rem] font-extrabold tracking-[0.06em] uppercase px-5 py-4 cursor-pointer transition-colors hover:bg-coral-light whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "..." : buttonText}
      </button>
    </form>
  );
}
