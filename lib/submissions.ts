/* ============================================================
   SUBMISSIONS — the single write path for everything the public
   forms collect. Today it appends to a local JSONL file so the
   whole flow is testable end to end; the moment SUPABASE_URL and
   SUPABASE_SERVICE_ROLE_KEY are set, it writes to Postgres instead
   and nothing above this file has to change.

   Retention note: applications carry personal data given under an
   explicit consent checkbox. Whatever store is live, applications
   need a retention rule — see the privacy policy work.
   ============================================================ */
import { promises as fs } from "fs";
import path from "path";

export type Kind = "partner" | "apply" | "newsletter";

const LOCAL_DIR = path.join(process.cwd(), ".submissions");

export async function saveSubmission(kind: Kind, payload: Record<string, unknown>) {
  const row = {
    id: crypto.randomUUID(),
    kind,
    created_at: new Date().toISOString(),
    payload,
  };

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { saveToSupabase } = await import("./supabase-submissions");
    await saveToSupabase(kind, row);
    return row.id;
  }

  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.appendFile(path.join(LOCAL_DIR, `${kind}.jsonl`), JSON.stringify(row) + "\n", "utf8");
  return row.id;
}
