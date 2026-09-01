"use client";
import { useMemo, useState, useTransition } from "react";
import { setSubmissionStatus, deleteSubmission } from "@/app/admin/actions";

const fmt = (v: unknown) =>
  v === null || v === undefined || v === "" ? "—" : typeof v === "boolean" ? (v ? "yes" : "no") : String(v);

function toCSV(rows: Record<string, unknown>[], columns: string[]) {
  const head = ["received", ...columns, "status"];
  const esc = (s: unknown) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((r) =>
    [new Date(String(r.created_at)).toISOString(), ...columns.map((c) => r[c]), r.status].map(esc).join(","));
  return [head.map(esc).join(","), ...body].join("\n");
}

export default function SubmissionList({ table, kind, rows, columns, statuses, canManage }: {
  table: string; kind: string; rows: Record<string, unknown>[];
  columns: string[]; statuses: string[]; canManage: boolean;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [pending, start] = useTransition();

  const shown = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  function download() {
    const blob = new Blob([toCSV(shown, columns)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!rows.length)
    return <div className="adm__card adm__empty">Nothing yet. Submissions from the site land here.</div>;

  return (
    <>
      <div className="adm__row" style={{ justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div className="adm__row" style={{ gap: 8 }}>
          {statuses.length ? (
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "auto" }}>
              <option value="all">All ({rows.length})</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s} ({rows.filter((r) => r.status === s).length})</option>
              ))}
            </select>
          ) : null}
        </div>
        <button className="b b--ghost b--sm" onClick={download}>Download CSV ({shown.length})</button>
      </div>

      {shown.map((r) => {
        const id = String(r.id);
        const isOpen = open === id;
        return (
          <div className="adm__card" key={id} style={{ padding: 0 }}>
            <div className="adm__row" style={{ justifyContent: "space-between", padding: "14px 18px", cursor: "pointer", gap: 12 }}
                 onClick={() => setOpen(isOpen ? null : id)}>
              <div style={{ minWidth: 0 }}>
                <div className="adm__title">{fmt(r[columns[0]])}</div>
                <div className="adm__meta">
                  {new Date(String(r.created_at)).toLocaleString("en-GB",
                    { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {r.org ? ` · ${r.org}` : ""}
                </div>
              </div>
              <div className="adm__row" style={{ gap: 10 }}>
                {r.status ? (
                  <span className={"adm__tag " + (r.status === "new" ? "adm__tag--new" : "adm__tag--ok")}>{String(r.status)}</span>
                ) : null}
                <span style={{ color: "var(--muted)" }}>{isOpen ? "▾" : "▸"}</span>
              </div>
            </div>

            {isOpen ? (
              <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--adm-line)" }}>
                <table style={{ marginTop: 12 }}>
                  <tbody>
                    {columns.map((c) => (
                      <tr key={c}>
                        <th style={{ width: 190, paddingTop: 12, borderBottom: "1px solid var(--adm-line)" }}>
                          {c.replace(/_/g, " ")}
                        </th>
                        <td style={{ whiteSpace: "pre-wrap" }}>{fmt(r[c])}</td>
                      </tr>
                    ))}
                    {"consent_data" in r ? (
                      <>
                        <tr><th style={{ paddingTop: 12 }}>data consent</th><td>{fmt(r.consent_data)}</td></tr>
                        <tr><th style={{ paddingTop: 12 }}>photo / story consent</th>
                            <td>{fmt(r.consent_media)}
                              {!r.consent_media ? <span className="help">Do not publish this person&rsquo;s image or story.</span> : null}
                            </td></tr>
                        <tr><th style={{ paddingTop: 12 }}>delete after</th><td>{fmt(r.delete_after)}</td></tr>
                      </>
                    ) : null}
                  </tbody>
                </table>

                {canManage && statuses.length ? (
                  <div className="adm__row" style={{ gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                    {statuses.map((s) => (
                      <button key={s} className={"b b--sm" + (r.status === s ? "" : " b--ghost")} disabled={pending}
                              onClick={() => start(async () => { await setSubmissionStatus(table, id, s); location.reload(); })}>
                        {s}
                      </button>
                    ))}
                    <button className="b b--danger b--sm" disabled={pending}
                            onClick={() => {
                              if (!confirm("Delete this permanently? This cannot be undone.")) return;
                              start(async () => { await deleteSubmission(table, id); location.reload(); });
                            }}>Delete</button>
                  </div>
                ) : null}
                {!canManage ? <p className="help" style={{ marginTop: 14 }}>Administrators can change status and delete.</p> : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
