"use client";

import { useState } from "react";
import type { User } from "@/lib/supabase/types";

interface ProfileHeaderProps {
  user: User;
  onSave: (updates: { name: string; city: string }) => Promise<void>;
}

export default function ProfileHeader({ user, onSave }: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    await onSave({ name: name.trim(), city: city.trim().toLowerCase() });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="px-5 pt-6 pb-5">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
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
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
                className="font-display text-xl font-bold text-ink bg-cream border-2 border-ink rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                className="font-body text-sm text-brown bg-cream border-2 border-ink rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
          ) : (
            <>
              <h1 className="font-display text-xl font-bold text-ink truncate">
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
            </>
          )}
        </div>
      </div>

      {/* Edit / Save buttons */}
      <div className="mt-4 flex gap-2">
        {editing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-coral text-white font-body font-bold text-sm py-2.5 rounded-xl border-2 border-ink shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(user.name ?? "");
                setCity(user.city ?? "");
              }}
              className="px-4 bg-white text-ink font-body font-bold text-sm py-2.5 rounded-xl border-2 border-ink shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex-1 bg-white text-ink font-body font-bold text-sm py-2.5 rounded-xl border-2 border-ink shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
