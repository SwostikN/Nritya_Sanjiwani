"use client";
import { useState, useTransition } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { saveMediaMeta, deleteMedia } from "@/app/admin/actions";

interface Item { id: string; path: string; alt: string; caption: string | null; credit: string | null; bytes: number | null }

export default function MediaLibrary({ items, base, canDelete }:
  { items: Item[]; base: string; canDelete: boolean }) {
  const [edit, setEdit] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  async function upload(file: File) {
    const alt = window.prompt("Describe this picture for someone who cannot see it.\n\nRequired.");
    if (alt === null) return;
    if (!alt.trim()) { setErr("Alt text is required."); return; }
    setBusy(true); setErr("");
    const sb = supabaseBrowser();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase()}`;
    const up = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000" });
    if (up.error) { setErr(up.error.message); setBusy(false); return; }
    const ins = await sb.from("media").insert({ path, alt: alt.trim(), bytes: file.size, mime: file.type });
    if (ins.error) { setErr(ins.error.message); setBusy(false); return; }
    location.reload();
  }

  return (
    <>
      <div className="adm__card">
        <label style={{ margin: 0 }}>
          <span>Upload an image</span>
          <input type="file" accept="image/*" disabled={busy}
                 onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          <span className="help">You will be asked for alt text before it saves.</span>
        </label>
        {busy ? <p className="help">Uploading…</p> : null}
        {err ? <p className="adm__err">{err}</p> : null}
      </div>

      {!items.length ? <div className="adm__card adm__empty">No images yet.</div> : null}

      {items.map((m) => (
        <div className="adm__card" key={m.id}>
          <div className="adm__row" style={{ gap: 16, alignItems: "flex-start" }}>
            <img src={base + m.path} alt={m.alt}
                 style={{ width: 120, height: 92, objectFit: "cover", borderRadius: 8, flex: "none" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {edit === m.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  start(async () => {
                    const res = await saveMediaMeta(m.id, String(fd.get("alt")), String(fd.get("caption")), String(fd.get("credit")));
                    if (res.error) { setErr(res.error); return; }
                    location.reload();
                  });
                }}>
                  <label><span>Alt text <span className="req">*</span></span>
                    <input type="text" name="alt" defaultValue={m.alt} required /></label>
                  <label><span>Caption</span><input type="text" name="caption" defaultValue={m.caption ?? ""} /></label>
                  <label><span>Credit</span><input type="text" name="credit" defaultValue={m.credit ?? ""} /></label>
                  <div className="adm__row" style={{ gap: 8 }}>
                    <button className="b b--sm" disabled={pending}>Save</button>
                    <button type="button" className="b b--ghost b--sm" onClick={() => setEdit(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="adm__title">{m.alt}</div>
                  <div className="adm__meta">
                    {m.caption ? m.caption + " · " : ""}
                    {m.bytes ? `${Math.round(m.bytes / 1024)} KB` : ""}
                  </div>
                  <div className="adm__row" style={{ gap: 6, marginTop: 10 }}>
                    <button className="b b--ghost b--sm" onClick={() => setEdit(m.id)}>Edit details</button>
                    <button className="b b--ghost b--sm"
                            onClick={() => navigator.clipboard.writeText(base + m.path)}>Copy URL</button>
                    {canDelete ? (
                      <button className="b b--danger b--sm" disabled={pending}
                              onClick={() => {
                                if (!confirm("Delete this image?\n\nAnywhere it is used on the site will break.")) return;
                                start(async () => { await deleteMedia(m.id, m.path); location.reload(); });
                              }}>Delete</button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
