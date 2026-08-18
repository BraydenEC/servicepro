import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Supabase client factory — deliberately null-safe.

  The obvious implementation calls createClient() at module scope. That throws
  when the environment variables are absent, and because this module is imported
  by a Server Component, the throw happens during `next build` — failing the
  DEPLOYMENT, not just a request. The mock-data fallback in projects.ts would
  never get a chance to run, because the app would never finish building.

  That failure mode is the reason this returns `null` instead of throwing.
  Missing credentials are a supported state here: the app builds, deploys, and
  renders mock data. Credentials are an upgrade, never a requirement.

  Both variables are NEXT_PUBLIC_ because the anon key is designed to be public
  and the `projects` table is guarded by a read-only RLS policy (see
  supabase/schema.sql). The service_role key must never appear here — it
  bypasses row-level security entirely.
*/

// `undefined` = not yet resolved, `null` = resolved to unavailable.
// Distinguishing the two keeps this to one initialization attempt per process.
let cached: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Empty strings count as missing — .env.local ships with the keys present
  // but blank, which would otherwise sail past a simple undefined check and
  // fail later inside createClient with a much less obvious message.
  if (!url?.trim() || !anonKey?.trim()) {
    cached = null;
    return cached;
  }

  try {
    cached = createClient(url, anonKey, {
      auth: {
        // No authentication this sprint. Without these, the client tries to
        // persist and refresh a session that will never exist.
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.warn(
      "[supabase] Client init failed; falling back to mock data.",
      error,
    );
    cached = null;
  }

  return cached;
}

/** True when both credentials are present. Used for log messages, not control flow. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}
