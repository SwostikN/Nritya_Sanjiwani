"use client";
import { useState, useTransition } from "react";
import { SETTINGS_FIELDS, TOGGLEABLE_SECTIONS } from "@/lib/schema";
import Field from "./Field";
import { saveSettings, saveSections } from "@/app/admin/actions";

export default function SettingsForm(
  { values, sections }: { values: Record<string, string>; sections: Record<string, boolean> }
) {
  const [v, setV] = useState<Record<string, unknown>>(values);
  const [s, setS] = useState<Record<string, boolean>>(sections);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  function save() {
    setErr(""); setMsg("");
    start(async () => {
      const a = await saveSettings(v);
      const b = await saveSections(s);
      if (a.error || b.error) { setErr(a.error || b.error || ""); return; }
      setMsg("Saved. The site is updated.");
    });
  }

  return (
    <>
      <div className="adm__card">
        <h3 style={{ margin: "0 0 4px", fontFamily: "var(--display)", fontSize: "1.15rem" }}>Contact and standing text</h3>
        <p className="help" style={{ marginBottom: 18 }}>
          Blank fields simply disappear from the site rather than showing an empty row.
        </p>
        {SETTINGS_FIELDS.map((f) => (
          <Field key={f.key} f={f} value={v[f.key]} onChange={(x) => setV((o) => ({ ...o, [f.key]: x }))} />
        ))}
      </div>

      <div className="adm__card">
        <h3 style={{ margin: "0 0 4px", fontFamily: "var(--display)", fontSize: "1.15rem" }}>Sections</h3>
        <p className="help" style={{ marginBottom: 16 }}>
          Switch a section off to hide it from the public site without deleting anything. Use this to
          launch with less and turn things on as they are ready.
        </p>
        {TOGGLEABLE_SECTIONS.map((sec) => (
          <label className="chk" key={sec.key} style={{ marginBottom: 10 }}>
            <input type="checkbox" checked={s[sec.key] !== false}
                   onChange={(e) => setS((o) => ({ ...o, [sec.key]: e.target.checked }))} />
            <span style={{ all: "unset" }}>
              <b style={{ fontWeight: 600 }}>{sec.label}</b>
              <span className="help">{sec.where}</span>
            </span>
          </label>
        ))}
      </div>

      {err ? <p className="adm__err">{err}</p> : null}
      {msg ? <p className="adm__ok">{msg}</p> : null}
      <button className="b" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
    </>
  );
}
