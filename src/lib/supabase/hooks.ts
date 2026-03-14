"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { createAuthClient } from "./client";
import { supabase } from "./client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * React hook that returns a Supabase client authenticated with the current
 * Clerk session. Falls back to the public anon client if no session exists.
 *
 * Usage:
 *   const { client, isAuthenticated } = useSupabase();
 *   const { data } = await client.from("saved_spots").select("*");
 */
export function useSupabase(): {
  client: SupabaseClient<Database>;
  getAuthClient: () => Promise<SupabaseClient<Database>>;
  isAuthenticated: boolean;
} {
  const { getToken, isSignedIn } = useAuth();

  const getAuthClient = useCallback(async () => {
    const token = await getToken({ template: "supabase" });
    if (!token) return supabase;
    return createAuthClient(token);
  }, [getToken]);

  // For synchronous access, return the public client.
  // For RLS-protected queries, use getAuthClient().
  const client = useMemo(() => supabase, []);

  return {
    client,
    getAuthClient,
    isAuthenticated: !!isSignedIn,
  };
}
