/* ============================================================
   Supabase write path for the public forms. Uses the service-role
   key, so this module must only ever be imported from server code
   (the API routes) — never from a "use client" component.
   ============================================================ */
import { createClient } from "@supabase/supabase-js";
import type { Kind } from "./submissions";

const TABLES: Record<Kind, string> = {
  partner:    "partner_enquiries",
  apply:      "applications",
  newsletter: "newsletter_subscribers",
};

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function saveToSupabase(
  kind: Kind,
  row: { id: string; created_at: string; payload: Record<string, unknown> }
) {
  const { error } = await admin()
    .from(TABLES[kind])
    .insert({ id: row.id, created_at: row.created_at, ...row.payload });
  if (error) throw new Error(`${TABLES[kind]}: ${error.message}`);
}
