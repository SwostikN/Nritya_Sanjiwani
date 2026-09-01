"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forRole } from "@/lib/schema";

export default function Sidebar({ role, name, counts }:
  { role: "admin" | "editor"; name: string; counts: { applications: number; enquiries: number } }) {
  const path = usePathname();
  const on = (href: string) => path === href || (href !== "/admin" && path.startsWith(href));
  const cols = forRole(role);

  return (
    <aside className="adm__side">
      <div className="adm__brand">
        <b>Nritya Sanjiwani</b>
        <span>{role === "admin" ? "Administrator" : "Editor"}</span>
      </div>

      <Link className={"adm__nav" + (path === "/admin" ? " is-on" : "")} href="/admin">Overview</Link>

      <div className="adm__grp">Enquiries</div>
      <Link className={"adm__nav" + (on("/admin/submissions/applications") ? " is-on" : "")} href="/admin/submissions/applications">
        Applications {counts.applications > 0 ? <i>{counts.applications} new</i> : null}
      </Link>
      <Link className={"adm__nav" + (on("/admin/submissions/enquiries") ? " is-on" : "")} href="/admin/submissions/enquiries">
        Partnerships {counts.enquiries > 0 ? <i>{counts.enquiries} new</i> : null}
      </Link>
      <Link className={"adm__nav" + (on("/admin/submissions/subscribers") ? " is-on" : "")} href="/admin/submissions/subscribers">
        Newsletter
      </Link>

      <div className="adm__grp">Content</div>
      {cols.map((c) => (
        <Link key={c.key} className={"adm__nav" + (on(`/admin/content/${c.key}`) ? " is-on" : "")}
              href={`/admin/content/${c.key}`}>{c.label}</Link>
      ))}
      <Link className={"adm__nav" + (on("/admin/media") ? " is-on" : "")} href="/admin/media">Images</Link>

      {role === "admin" ? (
        <>
          <div className="adm__grp">Site</div>
          <Link className={"adm__nav" + (on("/admin/settings") ? " is-on" : "")} href="/admin/settings">Details &amp; sections</Link>
          <Link className={"adm__nav" + (on("/admin/users") ? " is-on" : "")} href="/admin/users">People</Link>
        </>
      ) : null}

      <div className="adm__grp">You</div>
      <Link className="adm__nav" href="/" target="_blank">View the site ↗</Link>
      <form action="/admin/logout" method="post">
        <button className="adm__nav" style={{ background: "none", border: 0, width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}>
          Sign out{name ? ` (${name})` : ""}
        </button>
      </form>
    </aside>
  );
}
