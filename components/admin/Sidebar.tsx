"use client";
/* ============================================================
   The navigation is grouped the way the site is read: a column of
   pages, not a column of database tables. Picking a page opens
   everything that page is built from. The flat list of twenty
   collections it replaced meant knowing that "pillars" lived on
   the home page before you could find it.
   ============================================================ */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pagesForRole } from "@/lib/pages";

export default function Sidebar({ role, name, counts }:
  { role: "admin" | "editor"; name: string; counts: { applications: number; enquiries: number } }) {
  const path = usePathname();
  const on = (href: string) => path === href || (href !== "/admin" && path.startsWith(href));
  const pages = pagesForRole(role);

  /* Editing a section keeps its page lit in the sidebar, so it is
     always clear which page you are inside. */
  const editing = path.startsWith("/admin/content/") ? path.split("/")[3] : "";
  const pageOn = (key: string) =>
    on(`/admin/pages/${key}`) ||
    (Boolean(editing) && (pages.find((p) => p.key === key)?.sections.includes(editing) ?? false));

  const nav = (href: string, label: React.ReactNode, active = on(href)) => (
    <Link key={href} className={"adm__nav" + (active ? " is-on" : "")} href={href}>{label}</Link>
  );

  /* Three bands, not one column: the brand and the "you" links stay
     put and only the middle scrolls. The whole list is taller than a
     laptop screen, and when it was one scrolling column the bottom of
     it — Images, Site-wide details, People and Sign out — was simply
     below the fold with no scrollbar to say so. */
  return (
    <aside className="adm__side">
      <div className="adm__side-in">
        <div className="adm__brand">
          <b>Nritya Sanjiwani</b>
          <span>{role === "admin" ? "Administrator" : "Editor"}</span>
        </div>

        <nav className="adm__side-list">
          {nav("/admin", "Overview", path === "/admin")}

          <div className="adm__grp">Enquiries</div>
          {nav("/admin/submissions/applications",
            <>Applications {counts.applications > 0 ? <i>{counts.applications} new</i> : null}</>)}
          {nav("/admin/submissions/enquiries",
            <>Partnerships {counts.enquiries > 0 ? <i>{counts.enquiries} new</i> : null}</>)}
          {nav("/admin/submissions/subscribers", "Newsletter")}

          <div className="adm__grp">Pages</div>
          {pages.map((p) => nav(`/admin/pages/${p.key}`, p.label, pageOn(p.key)))}

          <div className="adm__grp">Everywhere</div>
          {nav("/admin/media", "Images")}
          {role === "admin" ? nav("/admin/settings", "Site-wide details") : null}
          {role === "admin" ? nav("/admin/users", "People") : null}
        </nav>

        <div className="adm__side-foot">
          <Link className="adm__nav" href="/" target="_blank">View the site ↗</Link>
          <form action="/admin/logout" method="post">
            <button className="adm__nav" style={{ background: "none", border: 0, width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}>
              Sign out{name ? ` (${name})` : ""}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
