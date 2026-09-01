import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const staff = await requireStaff();
  const sb = await supabaseServer();

  const [apps, enq, subs, recentApps, recentEnq] = await Promise.all([
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("newsletter_subscribers").select("id", { count: "exact", head: true }).is("unsubscribed_at", null),
    sb.from("applications").select("id,name,created_at,status").order("created_at", { ascending: false }).limit(5),
    sb.from("partner_enquiries").select("id,name,org,created_at,status").order("created_at", { ascending: false }).limit(5),
  ]);

  const counts = { applications: apps.count ?? 0, enquiries: enq.count ?? 0 };

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name} counts={counts} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <h1 className="adm__h1">Overview</h1>
            <p className="adm__sub">
              {staff.role === "admin"
                ? "You can change anything on the site from here."
                : "You can edit the journal and the gallery, and read what people send in."}
            </p>
          </div>
        </div>

        {e === "forbidden" ? (
          <div className="adm__note" style={{ marginBottom: 20 }}>
            <b>Not your permission level</b>
            That screen is for administrators. Ask one to make the change, or to upgrade your account.
          </div>
        ) : null}

        <div className="adm__grid" style={{ marginBottom: 30 }}>
          {[
            ["Applications waiting", counts.applications, "/admin/submissions/applications"],
            ["Partnership enquiries waiting", counts.enquiries, "/admin/submissions/enquiries"],
            ["Newsletter subscribers", subs.count ?? 0, "/admin/submissions/subscribers"],
          ].map(([label, n, href]) => (
            <Link key={String(label)} href={String(href)} className="adm__card" style={{ textDecoration: "none", display: "block" }}>
              <div style={{ fontFamily: "var(--display)", fontSize: "2.1rem", lineHeight: 1 }}>{n as number}</div>
              <div className="adm__meta" style={{ marginTop: ".5em" }}>{label as string}</div>
            </Link>
          ))}
        </div>

        <h2 className="adm__h1" style={{ fontSize: "1.15rem", marginBottom: 12 }}>Latest applications</h2>
        {(recentApps.data ?? []).length === 0 ? (
          <div className="adm__card adm__empty">Nothing yet. Applications from the site land here.</div>
        ) : (
          <div className="adm__card adm__wrapx" style={{ padding: "6px 6px 0" }}>
            <table>
              <thead><tr><th>Name</th><th>Received</th><th>Status</th></tr></thead>
              <tbody>
                {(recentApps.data ?? []).map((r) => (
                  <tr key={r.id}>
                    <td><Link href="/admin/submissions/applications">{r.name}</Link></td>
                    <td>{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td><span className={"adm__tag " + (r.status === "new" ? "adm__tag--new" : "adm__tag--ok")}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="adm__h1" style={{ fontSize: "1.15rem", margin: "26px 0 12px" }}>Latest partnership enquiries</h2>
        {(recentEnq.data ?? []).length === 0 ? (
          <div className="adm__card adm__empty">Nothing yet.</div>
        ) : (
          <div className="adm__card adm__wrapx" style={{ padding: "6px 6px 0" }}>
            <table>
              <thead><tr><th>Name</th><th>Organisation</th><th>Received</th><th>Status</th></tr></thead>
              <tbody>
                {(recentEnq.data ?? []).map((r) => (
                  <tr key={r.id}>
                    <td><Link href="/admin/submissions/enquiries">{r.name}</Link></td>
                    <td>{r.org || "—"}</td>
                    <td>{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td><span className={"adm__tag " + (r.status === "new" ? "adm__tag--new" : "adm__tag--ok")}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
