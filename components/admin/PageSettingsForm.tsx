"use client";
/* ============================================================
   The words and switches that belong to one page, edited on that
   page's screen. It posts only the keys it was given — the server
   merges them — so the Contact screen saving an email address
   cannot wipe the Our Journey paragraphs it never showed.
   ============================================================ */
import { useState, useTransition } from "react";
import type { Field as F } from "@/lib/schema";
import Field from "./Field";
import { saveSettings, saveSections } from "@/app/admin/actions";

export interface Toggle { key: string; label: string; where: string }

export default function PageSettingsForm({
  fields = [], values = {}, toggles = [], sections = {},
  textTitle = "Text on this page", textHelp,
  toggleTitle = "Sections you can switch off", toggleHelp,
}: {
  fields?: F[];
  values?: Record<string, string>;
  toggles?: Toggle[];
  sections?: Record<string, boolean>;
  textTitle?: string; textHelp?: string;
  toggleTitle?: string; toggleHelp?: string;
}) {
  const [v, setV] = useState<Record<string, unknown>>(values);
  const [s, setS] = useState<Record<string, boolean>>(sections);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  function save() {
    setErr(""); setMsg("");
    start(async () => {
      if (fields.length) {
        const patch = Object.fromEntries(fields.map((f) => [f.key, v[f.key] ?? ""]));
        const r = await saveSettings(patch);
        if (r.error) { setErr(r.error); return; }
      }
      if (toggles.length) {
        const patch = Object.fromEntries(toggles.map((t) => [t.key, s[t.key] !== false]));
        const r = await saveSections(patch);
        if (r.error) { setErr(r.error); return; }
      }
      setMsg("Saved. The site is updated.");
    });
  }

  if (!fields.length && !toggles.length) return null;

  return (
    <>
      {fields.length ? (
        <div className="adm__card">
          <h3 className="adm__h3">{textTitle}</h3>
          <p className="help" style={{ marginBottom: 18 }}>
            {textHelp ?? "Leave a field blank and it disappears from the site rather than showing an empty row."}
          </p>
          {fields.map((f) => (
            <Field key={f.key} f={f} value={v[f.key]} onChange={(x) => setV((o) => ({ ...o, [f.key]: x }))} />
          ))}
        </div>
      ) : null}

      {toggles.length ? (
        <div className="adm__card">
          <h3 className="adm__h3">{toggleTitle}</h3>
          <p className="help" style={{ marginBottom: 16 }}>
            {toggleHelp ?? "Switching a section off hides it from visitors. Nothing is deleted — switch it back on and it returns."}
          </p>
          {toggles.map((t) => (
            <label className="chk" key={t.key} style={{ marginBottom: 10 }}>
              <input type="checkbox" checked={s[t.key] !== false}
                     onChange={(e) => setS((o) => ({ ...o, [t.key]: e.target.checked }))} />
              <span style={{ all: "unset" }}>
                <b style={{ fontWeight: 600 }}>{t.label}</b>
                <span className="help">{t.where}</span>
              </span>
            </label>
          ))}
        </div>
      ) : null}

      {err ? <p className="adm__err">{err}</p> : null}
      {msg ? <p className="adm__ok">{msg}</p> : null}
      <button className="b" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
    </>
  );
}
