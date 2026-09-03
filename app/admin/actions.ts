"use server";
/* ============================================================
   Every write the admin makes goes through here. These run as the
   signed-in user, not the service role, so RLS is still the final
   word — an editor calling an admin-only action gets refused by
   Postgres even if they bypassed the UI.
   ============================================================ */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { byKey, SETTINGS_FIELDS } from "@/lib/schema";

function refresh() {
  revalidatePath("/", "layout");   // the public site reads this content
  revalidatePath("/admin", "layout");
}

export async function saveItem(collection: string, id: string | null, data: Record<string, unknown>) {
  const staff = await requireStaff();
  const def = byKey(collection);
  if (!def) return { error: "Unknown collection." };
  if (!def.roles.includes(staff.role)) return { error: "You do not have permission to edit this." };

  for (const f of def.fields)
    if (f.required && !String(data[f.key] ?? "").trim())
      return { error: `${f.label} is required.` };

  const sb = await supabaseServer();
  if (id) {
    const { error } = await sb.from("collections")
      .update({ data, updated_at: new Date().toISOString(), updated_by: staff.id }).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data: last } = await sb.from("collections")
      .select("sort").eq("collection", collection).order("sort", { ascending: false }).limit(1).single();
    const { error } = await sb.from("collections")
      .insert({ collection, data, sort: (last?.sort ?? -1) + 1, updated_by: staff.id });
    if (error) return { error: error.message };
  }
  refresh();
  return { ok: true };
}

export async function deleteItem(collection: string, id: string) {
  const staff = await requireStaff();
  const def = byKey(collection);
  if (!def?.roles.includes(staff.role)) return { error: "You do not have permission to delete this." };
  const sb = await supabaseServer();
  const { error } = await sb.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function togglePublished(id: string, published: boolean) {
  await requireStaff();
  const sb = await supabaseServer();
  const { error } = await sb.from("collections").update({ published }).eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function reorder(ids: string[]) {
  await requireStaff();
  const sb = await supabaseServer();
  for (let i = 0; i < ids.length; i++) {
    const { error } = await sb.from("collections").update({ sort: i }).eq("id", ids[i]);
    if (error) return { error: error.message };
  }
  refresh();
  return { ok: true };
}

/* Both of these merge rather than replace. Settings are now edited
   a page at a time, so a form only ever posts the handful of keys
   it showed — writing that object whole would quietly wipe every
   field the editor could not see. */
async function mergeSetting(key: "site" | "sections", patch: Record<string, unknown>) {
  const sb = await supabaseServer();
  const { data: current } = await sb.from("site_settings").select("value").eq("key", key).maybeSingle();
  const value = { ...((current?.value ?? {}) as Record<string, unknown>), ...patch };
  const { error } = await sb.from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function saveSettings(values: Record<string, unknown>) {
  await requireAdmin();
  /* A picture without alt text is the one thing a settings form can
     get wrong that the reader pays for, so it is refused here as well
     as starred in the form. Only checked when both fields were posted
     together — a form that showed neither is not making the claim. */
  for (const f of SETTINGS_FIELDS) {
    if (!f.requiredWith || !(f.key in values) || !(f.requiredWith in values)) continue;
    if (String(values[f.requiredWith] ?? "").trim() && !String(values[f.key] ?? "").trim()) {
      const other = SETTINGS_FIELDS.find((o) => o.key === f.requiredWith);
      return { error: `${f.label} is required whenever there is a ${(other?.label ?? "value").toLowerCase()}.` };
    }
  }
  return mergeSetting("site", values);
}

export async function saveSections(values: Record<string, boolean>) {
  await requireAdmin();
  return mergeSetting("sections", values);
}

export async function setSubmissionStatus(table: string, id: string, status: string, notes?: string) {
  await requireAdmin();
  if (!["applications", "partner_enquiries", "newsletter_subscribers"].includes(table))
    return { error: "Unknown table." };
  const sb = await supabaseServer();
  const patch: Record<string, unknown> = { status };
  if (notes !== undefined) patch.notes = notes;
  const { error } = await sb.from(table).update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteSubmission(table: string, id: string) {
  await requireAdmin();
  if (!["applications", "partner_enquiries", "newsletter_subscribers"].includes(table))
    return { error: "Unknown table." };
  const sb = await supabaseServer();
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function saveMediaMeta(id: string, alt: string, caption: string, credit: string) {
  await requireStaff();
  if (!alt.trim()) return { error: "Alt text is required." };
  const sb = await supabaseServer();
  const { error } = await sb.from("media").update({ alt, caption, credit }).eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function deleteMedia(id: string, path: string) {
  await requireAdmin();
  const sb = await supabaseServer();
  await sb.storage.from("media").remove([path]);
  const { error } = await sb.from("media").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function setUserRole(id: string, role: "admin" | "editor") {
  const me = await requireAdmin();
  if (id === me.id) return { error: "You cannot change your own role." };
  const sb = await supabaseServer();
  const { error } = await sb.from("profiles").update({ role }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}
