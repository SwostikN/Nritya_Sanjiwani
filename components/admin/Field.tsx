"use client";
import type { Field as F } from "@/lib/schema";
import ImagePicker from "./ImagePicker";

export default function Field({ f, value, onChange }:
  { f: F; value: unknown; onChange: (v: unknown) => void }) {
  const v = value ?? "";

  const label = (
    <span>
      {f.label}{f.required ? <span className="req"> *</span> : null}
    </span>
  );

  if (f.type === "boolean")
    return (
      <label className="chk">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span style={{ all: "unset" }}>
          {f.label}
          {f.help ? <span className="help">{f.help}</span> : null}
        </span>
      </label>
    );

  if (f.type === "image")
    return (
      <label>
        {label}
        <ImagePicker value={String(v)} onChange={onChange} />
        {f.help ? <span className="help">{f.help}</span> : null}
      </label>
    );

  if (f.type === "select")
    return (
      <label>
        {label}
        <select value={String(v)} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {f.help ? <span className="help">{f.help}</span> : null}
      </label>
    );

  if (f.type === "textarea")
    return (
      <label>
        {label}
        <textarea rows={f.rows ?? 4} value={String(v)} onChange={(e) => onChange(e.target.value)} />
        {f.help ? <span className="help">{f.help}</span> : null}
      </label>
    );

  return (
    <label>
      {label}
      <input
        type={f.type === "number" ? "number" : "text"}
        value={String(v)}
        onChange={(e) => onChange(e.target.value)}
        style={f.type === "devanagari" ? { fontFamily: "var(--deva)", fontSize: "1.05rem" } : undefined}
      />
      {f.help ? <span className="help">{f.help}</span> : null}
    </label>
  );
}
