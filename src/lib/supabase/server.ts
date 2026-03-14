import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client with service role key.
 * Bypasses RLS — use only in API routes, webhooks, and server actions.
 */
export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}
