import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client (API routes / server components only).
 * Uses the service role key when available so API routes can write
 * search/price-history rows; falls back to the anon key so the app still
 * runs (read-only) before a service key is configured.
 *
 * Never import this from a "use client" component — it would try to bundle
 * the service role key into client JS.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Supabase not configured yet — callers should degrade gracefully
    // (skip persistence) rather than throw, so the app stays usable on
    // mock data alone.
    return null;
  }

  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false } });
  }
  return cached;
}
