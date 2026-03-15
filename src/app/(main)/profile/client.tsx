"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import type { User } from "@/lib/supabase/types";
import { ProfileHeader, VibeSummary, DiscoveryStats, ProfileSettings, Gamification } from "@/components/profile";
import { updateCurrentUser } from "@/lib/supabase/actions";

interface ProfilePageClientProps {
  user: User;
}

interface ProfileData {
  fingerprintVector: number[] | null;
  stats: { views: number; neyeces: number; saves: number; shares: number };
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // Non-critical — show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  const handleSave = async (updates: { name: string; city: string }) => {
    await updateCurrentUser(updates);
    router.refresh();
  };

  const handleSettingsUpdate = async (updates: { username?: string; profile_public?: boolean }) => {
    const res = await fetch("/api/profile/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const data = await res.json();
      return { error: data.error ?? "Failed to update" };
    }
    router.refresh();
    return {};
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="pb-24">
      <ProfileHeader user={user} onSave={handleSave} />

      {loading ? (
        <div className="px-5 space-y-4">
          <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-5">
            <div className="h-4 bg-cream rounded w-1/3 mb-4 animate-pulse" />
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-16 bg-cream rounded-full animate-pulse" />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-2.5 bg-cream rounded-full animate-pulse" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm p-4 h-24 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <VibeSummary fingerprintVector={data?.fingerprintVector ?? null} />
          <DiscoveryStats
            stats={data?.stats ?? { views: 0, neyeces: 0, saves: 0, shares: 0 }}
          />
          <Gamification />
        </>
      )}

      <ProfileSettings
        user={user}
        onUpdate={handleSettingsUpdate}
        onSignOut={handleSignOut}
      />

      <div className="px-5 py-6 text-center">
        <p className="font-display text-sm text-muted italic">Stay Neyece</p>
      </div>
    </div>
  );
}
