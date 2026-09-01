"use client";
import { useState, useTransition } from "react";
import { setUserRole } from "@/app/admin/actions";

interface P { id: string; email: string | null; name: string | null; role: "admin" | "editor"; created_at: string }

export default function UserList({ people, meId }: { people: P[]; meId: string }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  return (
    <>
      {err ? <p className="adm__err" style={{ marginBottom: 10 }}>{err}</p> : null}
      <div className="adm__card adm__wrapx" style={{ padding: "6px 6px 0" }}>
        <table>
          <thead><tr><th>Person</th><th>Role</th><th>Since</th><th></th></tr></thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="adm__title">{p.name || p.email || "—"}</div>
                  {p.name && p.email ? <div className="adm__meta">{p.email}</div> : null}
                  {p.id === meId ? <div className="adm__meta">This is you.</div> : null}
                </td>
                <td>
                  <span className={"adm__tag " + (p.role === "admin" ? "adm__tag--new" : "adm__tag--ok")}>
                    {p.role === "admin" ? "Administrator" : "Editor"}
                  </span>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td>
                  {p.id === meId ? (
                    <span className="help">—</span>
                  ) : (
                    <button className="b b--ghost b--sm" disabled={pending}
                            onClick={() => start(async () => {
                              const res = await setUserRole(p.id, p.role === "admin" ? "editor" : "admin");
                              if (res.error) { setErr(res.error); return; }
                              location.reload();
                            })}>
                      Make {p.role === "admin" ? "editor" : "administrator"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="help" style={{ marginTop: 12 }}>
        Editors can change the journal and the gallery, and read submissions. Administrators can change
        everything, including deleting content and managing people.
      </p>
    </>
  );
}
