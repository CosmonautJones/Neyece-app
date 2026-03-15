"use client";

import { useState } from "react";
import type { User } from "@/lib/supabase/types";

interface ProfileSettingsProps {
  user: User;
  onUpdate: (updates: { username?: string; profile_public?: boolean }) => Promise<{ error?: string }>;
  onSignOut: () => void;
}

export default function ProfileSettings({ user, onUpdate, onSignOut }: ProfileSettingsProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [isPublic, setIsPublic] = useState(user.profile_public);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);

  const handleSaveUsername = async () => {
    if (!username.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const slug = username.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const result = await onUpdate({ username: slug });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setUsername(slug);
      setEditingUsername(false);
      setTimeout(() => setSuccess(false), 2000);
    }
    setSaving(false);
  };

  const handleTogglePublic = async () => {
    const newVal = !isPublic;
    setIsPublic(newVal);
    await onUpdate({ profile_public: newVal });
  };

  const profileUrl = user.username
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${user.username}`
    : null;

  return (
    <div className="px-5 mb-5">
      <h2 className="font-display text-lg font-bold text-ink mb-3">Settings</h2>
      <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal-sm overflow-hidden">
        {/* Username */}
        <div className="px-4 py-3.5 border-b border-ink/10">
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-sm text-ink font-bold">Username</span>
            {!editingUsername && (
              <button
                type="button"
                onClick={() => setEditingUsername(true)}
                className="font-body text-xs text-coral font-bold"
              >
                {user.username ? "Change" : "Set"}
              </button>
            )}
          </div>
          {editingUsername ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="your-username"
                className="flex-1 font-body text-sm bg-cream border-2 border-ink rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              <button
                type="button"
                onClick={handleSaveUsername}
                disabled={saving}
                className="px-3 py-1.5 bg-coral text-white font-body text-xs font-bold rounded-xl border-2 border-ink disabled:opacity-50"
              >
                {saving ? "..." : "Save"}
              </button>
            </div>
          ) : (
            <p className="font-body text-xs text-muted">
              {user.username ? `@${user.username}` : "Not set"}
            </p>
          )}
          {error && <p className="font-body text-xs text-red-500 mt-1">{error}</p>}
          {success && <p className="font-body text-xs text-green-600 mt-1">Saved!</p>}
        </div>

        {/* Public profile toggle */}
        <div className="px-4 py-3.5 border-b border-ink/10 flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-ink font-bold">Public Profile</p>
            <p className="font-body text-xs text-muted">
              {isPublic && profileUrl ? "Shareable link active" : "Only you can see your profile"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleTogglePublic}
            disabled={!user.username}
            className={`relative w-11 h-6 rounded-full transition-colors border-2 border-ink ${
              isPublic ? "bg-coral" : "bg-cream"
            } ${!user.username ? "opacity-40" : ""}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white border border-ink transition-transform ${
                isPublic ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Profile link */}
        {isPublic && profileUrl && (
          <div className="px-4 py-3 border-b border-ink/10 bg-cream/50">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(profileUrl);
              }}
              className="font-body text-xs text-coral font-bold truncate block w-full text-left"
            >
              📋 {profileUrl}
            </button>
          </div>
        )}

        {/* Sign out */}
        <button
          type="button"
          onClick={onSignOut}
          className="w-full px-4 py-3.5 text-left font-body text-sm text-ink hover:bg-cream transition-colors flex items-center gap-3 border-b border-ink/10"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>

        {/* Feedback */}
        <a
          href="mailto:hello@neyece.com"
          className="w-full px-4 py-3.5 text-left font-body text-sm text-muted hover:bg-cream transition-colors flex items-center gap-3 block"
        >
          <span>💬</span>
          <span>Send Feedback</span>
        </a>
      </div>
    </div>
  );
}
