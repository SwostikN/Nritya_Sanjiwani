"use client";
import { useState, useTransition } from "react";
import type { CollectionDef } from "@/lib/schema";
import Field from "./Field";
import { saveItem, deleteItem, togglePublished, reorder } from "@/app/admin/actions";

export interface Row { id: string; sort: number; published: boolean; data: Record<string, unknown> }

export default function CollectionEditor(
  { def, rows, groupOptions }: { def: CollectionDef; rows: Row[]; groupOptions?: string[] }
) {
  const [items, setItems] = useState(rows);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const [dragId, setDragId] = useState<string | null>(null);

  const fields = def.groupBy
    ? [{ key: def.groupBy.key, label: def.groupBy.label, type: "select" as const, options: groupOptions ?? [], required: true }, ...def.fields]
    : def.fields;

  function openNew() { setDraft({}); setEditing("new"); setErr(""); }
  function openEdit(r: Row) { setDraft({ ...r.data }); setEditing(r.id); setErr(""); }

  function save() {
    setErr("");
    start(async () => {
      const res = await saveItem(def.key, editing === "new" ? null : editing, draft);
      if (res.error) { setErr(res.error); return; }
      setEditing(null);
      location.reload();
    });
  }

  function remove(r: Row) {
    const name = String(r.data[def.titleField] ?? "this item");
    if (!confirm(`Delete “${name}”?\n\nThis removes it from the website. It cannot be undone.`)) return;
    start(async () => {
      const res = await deleteItem(def.key, r.id);
      if (res.error) { setErr(res.error); return; }
      setItems((xs) => xs.filter((x) => x.id !== r.id));
    });
  }

  function toggle(r: Row) {
    start(async () => {
      await togglePublished(r.id, !r.published);
      setItems((xs) => xs.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)));
    });
  }

  function drop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...items];
    const from = next.findIndex((x) => x.id === dragId);
    const to = next.findIndex((x) => x.id === targetId);
    next.splice(to, 0, next.splice(from, 1)[0]);
    setItems(next);
    setDragId(null);
    start(async () => { await reorder(next.map((x) => x.id)); });
  }

  return (
    <>
      <div className="adm__row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <span className="help">{items.length} item{items.length === 1 ? "" : "s"} · drag to reorder</span>
        <button className="b" onClick={openNew}>Add {def.label.replace(/s$/, "").toLowerCase()}</button>
      </div>

      {err ? <p className="adm__err" style={{ marginBottom: 12 }}>{err}</p> : null}

      {editing ? (
        <div className="adm__card" style={{ borderColor: "var(--accent)" }}>
          <h3 style={{ margin: "0 0 14px", fontFamily: "var(--display)", fontSize: "1.15rem" }}>
            {editing === "new" ? `New ${def.label.replace(/s$/, "").toLowerCase()}` : "Editing"}
          </h3>
          {fields.map((f) => (
            <Field key={f.key} f={f as never} value={draft[f.key]}
                   onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
          ))}
          <div className="adm__row" style={{ gap: 8, marginTop: 4 }}>
            <button className="b" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save"}</button>
            <button className="b b--ghost" onClick={() => setEditing(null)} disabled={pending}>Cancel</button>
          </div>
        </div>
      ) : null}

      {items.length === 0 && !editing ? (
        <div className="adm__card adm__empty">Nothing here yet. Add the first one.</div>
      ) : null}

      {items.map((r) => (
        <div key={r.id}
             className={"adm__item" + (r.published ? "" : " is-hidden")}
             draggable
             onDragStart={() => setDragId(r.id)}
             onDragOver={(e) => e.preventDefault()}
             onDrop={() => drop(r.id)}>
          <div className="adm__handle" title="Drag to reorder">⠿</div>
          <div className="adm__row" style={{ gap: 12, minWidth: 0 }}>
            {typeof r.data.img === "string" && r.data.img ? <img className="adm__thumb" src={r.data.img} alt="" /> : null}
            {typeof r.data.logo === "string" && r.data.logo ? <img className="adm__thumb" src={r.data.logo} alt="" /> : null}
            <div style={{ minWidth: 0 }}>
              <div className="adm__title">{String(r.data[def.titleField] ?? "(untitled)")}</div>
              <div className="adm__meta">
                {def.groupBy && r.data[def.groupBy.key] ? `${r.data[def.groupBy.key]} · ` : ""}
                {!r.published ? "Hidden from the site" : "Live"}
              </div>
            </div>
          </div>
          <div className="adm__row" style={{ gap: 6 }}>
            <button className="b b--ghost b--sm" onClick={() => toggle(r)} disabled={pending}>
              {r.published ? "Hide" : "Show"}
            </button>
            <button className="b b--ghost b--sm" onClick={() => openEdit(r)}>Edit</button>
            <button className="b b--danger b--sm" onClick={() => remove(r)} disabled={pending}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}
