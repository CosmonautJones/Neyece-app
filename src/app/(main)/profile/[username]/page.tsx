import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByUsername, getVibeProfile, getUserSignals } from "@/lib/supabase/queries";
import type { User, VibeProfile, UserSignal } from "@/lib/supabase/types";
import { VibeSummary, DiscoveryStats } from "@/components/profile";

interface PublicProfileProps {
  params: { username: string };
}

async function getPublicProfileData(username: string) {
  const supabase = createServerClient();
  const { user: rawUser } = await getUserByUsername(supabase, username);
  const user = rawUser as User | null;
  if (!user) return null;

  const { profile } = await getVibeProfile(supabase, user.id);
  const vibeProfile = profile as VibeProfile | null;

  const { signals: rawSignals } = await getUserSignals(supabase, user.id);
  const signals = rawSignals as unknown as UserSignal[];
  const stats = {
    views: signals.filter((s) => s.signal_type === "view").length,
    neyeces: signals.filter((s) => s.signal_type === "neyece").length,
    saves: signals.filter((s) => s.signal_type === "save").length,
    shares: signals.filter((s) => s.signal_type === "share").length,
  };

  return { user, fingerprintVector: vibeProfile?.fingerprint_vector ?? null, stats };
}

export async function generateMetadata({ params }: PublicProfileProps): Promise<Metadata> {
  const data = await getPublicProfileData(params.username);
  if (!data) return { title: "Profile Not Found" };

  return {
    title: `${data.user.name ?? data.user.username} on Neyece`,
    description: `Check out ${data.user.name ?? data.user.username}'s taste profile on Neyece.`,
    openGraph: {
      title: `${data.user.name ?? data.user.username} on Neyece`,
      description: `Check out their vibe and discover what's Neyece for them.`,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const data = await getPublicProfileData(params.username);
  if (!data) notFound();

  const { user, fingerprintVector, stats } = data;
  const initials = (user.name ?? user.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name ?? "Profile"}
              className="w-20 h-20 rounded-full border-3 border-ink shadow-brutal-sm object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-3 border-ink shadow-brutal-sm bg-gradient-to-br from-coral to-yellow flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-white">{initials}</span>
            </div>
          )}
          <div>
            <h1 className="font-display text-xl font-bold text-ink">
              {user.name ?? "Neyece Explorer"}
            </h1>
            {user.city && (
              <p className="font-body text-sm text-brown mt-0.5">
                📍 {user.city.charAt(0).toUpperCase() + user.city.slice(1)}
              </p>
            )}
            <p className="font-body text-xs text-muted mt-0.5">
              Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      <VibeSummary fingerprintVector={fingerprintVector} />
      <DiscoveryStats stats={stats} />

      {/* Neyece branding */}
      <div className="px-5 py-6 text-center">
        <p className="font-display text-lg font-bold text-ink">
          N<span className="bg-gradient-to-r from-coral to-yellow bg-clip-text text-transparent">eye</span>ce
        </p>
        <p className="font-body text-xs text-muted mt-1">Discover spots that match your vibe</p>
      </div>
    </div>
  );
}
