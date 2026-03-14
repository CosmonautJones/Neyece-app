import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server-side Supabase client with service role key.
 * Bypasses RLS — use only in API routes, webhooks, and cron jobs.
 */
export function createServerClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

/**
 * Server-side Supabase client authenticated as the current Clerk user.
 * Respects RLS policies. Use in Server Components and Server Actions.
 *
 * Returns null if there's no active session.
 */
export async function createAuthServerClient(): Promise<SupabaseClient<Database> | null> {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  if (!token) return null;

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
