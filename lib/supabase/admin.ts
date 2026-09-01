import { createClient } from "@supabase/supabase-js";

/* Service-role client. Bypasses RLS, so it must never be imported
   from a "use client" file. Used only for writing form submissions
   (the public has no insert policy) and for the retention job. */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const supabaseConfigured = () =>
  Boolean((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY);
