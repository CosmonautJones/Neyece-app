import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Public Supabase client (anon key, no user context).
 * Good for public reads (venues, waitlist insert).
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Create an authenticated Supabase client using a Clerk session token.
 * This client respects RLS policies — the JWT's `sub` claim maps to clerk_id.
 *
 * Usage (client component):
 *   const token = await getToken({ template: "supabase" });
 *   const client = createAuthClient(token);
 */
export function createAuthClient(token: string): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
