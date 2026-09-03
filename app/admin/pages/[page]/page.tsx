import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { byKey } from "@/lib/schema";
import { pageByKey, pagesForCollection, fieldsFor, togglesFor, defaultsFor } from "@/lib/pages";
import Sidebar from "@/components/admin/Sidebar";
import PageSettingsForm from "@/components/admin/PageSettingsForm";

export const dynamic = "force-dynamic";

/* One public page, opened up: every section it is built from, in
   the order a visitor meets them, plus the text and switches that
   belong to this page and nowhere else. */
export default async function PageHub({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const def = pageByKey(page);
  if (!def) notFound();

  const staff = await requireStaff();
  const isAdmin = staff.role === "admin";

  /* only the sections this person is allowed to touch — an editor
     seeing a locked row would just be a dead end */
  const sections = def.sections
    .map((k) => byKey(k))
    .filter((c) => c && c.roles.includes(staff.role))
    .map((c) => c!);

  const keys = sections.map((c) => c.key);
  const sb = await supabaseServer();
  const [rows, apps, enq, site, flags] = await Promise.all([
    keys.length
      ? sb.from("collections").select("collection,published").in("collection", keys)
      : Promise.resolve({ data: [] as { collection: string; published: boolean }[] }),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    isAdmin ? sb.from("site_settings").select("value").eq("key", "site").maybeSingle()
            : Promise.resolve({ data: null }),
    isAdmin ? sb.from("site_settings").select("value").eq("key", "sections").maybeSingle()
            : Promise.resolve({ data: null }),
  ]);

  const tally = new Map<string, { total: number; live: number }>();
  for (const r of (rows.data ?? []) as { collection: string; published: boolean }[]) {
    const t = tally.get(r.collection) ?? { total: 0, live: 0 };
    t.total += 1;
    if (r.published !== false) t.live += 1;
    tally.set(r.collection, t);
  }

  /* the link switch reads as a different decision from hiding a
     section, so it gets its own wording rather than the raw label */
  const linkToggle = def.linkToggle ? togglesFor([def.linkToggle])[0] : undefined;
  const toggles = isAdmin
    ? [...togglesFor(def.toggles),
       ...(linkToggle ? [{ ...linkToggle, label: `Link to ${def.label} from the site` }] : [])]
    : [];
  const fields = isAdmin ? fieldsFor(def.settings) : [];

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name}
               counts={{ applications: apps.count ?? 0, enquiries: enq.count ?? 0 }} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <span className="adm__crumb">Pages</span>
            <h1 className="adm__h1">{def.label}</h1>
            <p className="adm__sub">{def.blurb}</p>
          </div>
          <a className="b b--ghost b--sm" href={def.path} target="_blank" rel="noreferrer">View page ↗</a>
        </div>

        {sections.length ? (
          <>
            <h2 className="adm__h2">What this page is made of</h2>
            <p className="help" style={{ margin: "0 0 14px" }}>
              Listed in the order they appear as you scroll down the page.
            </p>
            <div className="adm__sections">
              {sections.map((c, i) => {
                const t = tally.get(c.key) ?? { total: 0, live: 0 };
                const also = pagesForCollection(c.key).filter((p) => p.key !== def.key);
                return (
                  <Link key={c.key} href={`/admin/content/${c.key}`} className="adm__sec">
                    <span className="adm__sec-n">{i + 1}</span>
                    <span className="adm__sec-body">
                      <b>{c.label}</b>
                      <span className="adm__meta">{c.blurb}</span>
                      {c.groupBy ? (
                        <span className="adm__meta">Each one is filed under a {c.groupBy.label.toLowerCase()}.</span>
                      ) : null}
                      {also.length ? (
                        <span className="adm__meta">Also shown on {also.map((p) => p.label).join(" and ")}.</span>
                      ) : null}
                    </span>
                    <span className="adm__sec-n adm__sec-count">
                      {t.total === 0 ? "None yet"
                        : t.live === t.total ? `${t.total} item${t.total === 1 ? "" : "s"}`
                        : `${t.live} of ${t.total} showing`}
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        ) : null}

        {fields.length || toggles.length ? (
          <div style={{ marginTop: sections.length ? 34 : 0 }}>
            <h2 className="adm__h2">Settings for this page</h2>
            <PageSettingsForm
              fields={fields}
              /* the shipped words stand behind anything never saved, so
                 editing one field cannot post the rest of the section blank */
              values={{ ...defaultsFor(def.settings), ...((site?.data?.value ?? {}) as Record<string, string>) }}
              toggles={toggles}
              sections={(flags?.data?.value ?? {}) as Record<string, boolean>}
              textTitle={def.settingsTitle}
              textHelp={def.settingsHelp}
              toggleTitle={def.toggles.length ? "Sections you can switch off" : "Whether the site links here"}
              toggleHelp={def.toggles.length
                ? "Switching a section off hides it from visitors. Nothing is deleted — switch it back on and it returns."
                : "Untick this and the site stops linking to the page. Nothing is deleted, and anyone with the address can still reach it."}
            />
          </div>
        ) : null}

        {sections.length === 0 && !fields.length && !toggles.length ? (
          <div className="adm__card adm__empty">
            There is nothing on this page for you to change. Ask an administrator if something here needs editing.
          </div>
        ) : null}

        {def.fixed ? (
          <div className="adm__note" style={{ marginTop: 26 }}>
            <b>Not editable here</b>
            {def.fixed}
          </div>
        ) : null}
      </main>
    </div>
  );
}
