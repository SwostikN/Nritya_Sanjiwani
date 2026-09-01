/* ============================================================
   Supabase write path for the public forms. Uses the service-role
   key, so this module must only ever be imported from server code
   (the API routes) — never from a "use client" component.
   ============================================================ */
import { supabaseAdmin } from "./supabase/admin";
import type { Kind } from "./submissions";

const TABLES: Record<Kind, string> = {
  partner:    "partner_enquiries",
  apply:      "applications",
  newsletter: "newsletter_subscribers",
};

/* the forms speak camelCase; the columns are snake_case */
const COLUMN: Record<string, string> = {
  consentData:  "consent_data",
  consentMedia: "consent_media",
};

export async function saveToSupabase(
  kind: Kind,
  row: { id: string; created_at: string; payload: Record<string, unknown> }
) {
  const record: Record<string, unknown> = { id: row.id, created_at: row.created_at };
  for (const [k, v] of Object.entries(row.payload)) record[COLUMN[k] ?? k] = v;

  const { error } = await supabaseAdmin().from(TABLES[kind]).insert(record);

  /* someone subscribing twice is not an error worth showing them */
  if (error && kind === "newsletter" && error.code === "23505") return;
  if (error) throw new Error(`${TABLES[kind]}: ${error.message}`);
}
