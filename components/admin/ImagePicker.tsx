"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface Item { id: string; path: string; alt: string; url: string }

/* Picks from the image library, or uploads a new one. Alt text is
   collected at upload time because the database rejects a row
   without it (PRD §14). */
export default function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const sb = supabaseBrowser();
    const { data } = await sb.from("media").select("id,path,alt").order("created_at", { ascending: false }).limit(120);
    setItems((data ?? []).map((m) => ({
      ...m, url: sb.storage.from("media").getPublicUrl(m.path).data.publicUrl,
    })));
  }
  useEffect(() => { if (open) load(); }, [open]);

  async function upload(file: File) {
    const alt = window.prompt(
      "Describe this picture for someone who cannot see it.\n\nThis is required — it is what a screen reader announces."
    );
    if (alt === null) return;
    if (!alt.trim()) { setErr("Alt text is required."); return; }

    setBusy(true); setErr("");
    const sb = supabaseBrowser();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase()}`;
    const up = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000" });
    if (up.error) { setErr(up.error.message); setBusy(false); return; }

    const ins = await sb.from("media").insert({ path, alt: alt.trim(), bytes: file.size, mime: file.type });
    if (ins.error) { setErr(ins.error.message); setBusy(false); return; }

    onChange(sb.storage.from("media").getPublicUrl(path).data.publicUrl);
    setBusy(false); setOpen(false);
  }

  return (
    <div>
      <div className="adm__row" style={{ marginBottom: 8 }}>
        {value ? <img className="adm__thumb" src={value} alt="" /> : <div className="adm__thumb" />}
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL, or choose one" />
      </div>
      <div className="adm__row" style={{ gap: 8 }}>
        <button type="button" className="b b--ghost b--sm" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Choose or upload"}
        </button>
        {value ? <button type="button" className="b b--ghost b--sm" onClick={() => onChange("")}>Remove</button> : null}
      </div>

      {open ? (
        <div className="adm__card" style={{ marginTop: 10 }}>
          <label style={{ marginBottom: 10 }}>
            <span>Upload a new image</span>
            <input type="file" accept="image/*" disabled={busy}
                   onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
            <span className="help">You will be asked for alt text. It is required.</span>
          </label>
          {err ? <p className="adm__err">{err}</p> : null}
          {busy ? <p className="help">Uploading…</p> : null}

          {items.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(88px,1fr))", gap: 8, marginTop: 12 }}>
              {items.map((m) => (
                <button key={m.id} type="button" title={m.alt}
                        onClick={() => { onChange(m.url); setOpen(false); }}
                        style={{ padding: 0, border: "1px solid var(--adm-line)", borderRadius: 7, overflow: "hidden", cursor: "pointer", background: "none" }}>
                  <img src={m.url} alt={m.alt} style={{ width: "100%", height: 78, objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          ) : <p className="help" style={{ marginTop: 10 }}>No images uploaded yet.</p>}
        </div>
      ) : null}
    </div>
  );
}
