import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { fieldsFor, togglesFor, GLOBAL_SETTINGS, GLOBAL_TOGGLES, pagesWithOwnText } from "@/lib/pages";
import Sidebar from "@/components/admin/Sidebar";
import PageSettingsForm from "@/components/admin/PageSettingsForm";

export const dynamic = "force-dynamic";

/* What is true of every page: the header, the footer, and which
   pages are linked from them. Anything that belongs to one page
   in particular now lives on that page's screen, so this ends
   with a signpost rather than a second copy. */
export default async function Settings() {
  const staff = await requireAdmin();
  const sb = await supabaseServer();
  const [{ data: site }, { data: sections }, apps, enq] = await Promise.all([
    sb.from("site_settings").select("value").eq("key", "site").maybeSingle(),
    sb.from("site_settings").select("value").eq("key", "sections").maybeSingle(),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name} counts={{ applications: apps.count ?? 0, enquiries: enq.count ?? 0 }} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <span className="adm__crumb">Everywhere</span>
            <h1 className="adm__h1">Site-wide details</h1>
            <p className="adm__sub">The contact details and links that show on every page, and which pages the site links to.</p>
          </div>
        </div>

        <PageSettingsForm
          fields={fieldsFor(GLOBAL_SETTINGS)}
          values={(site?.value ?? {}) as Record<string, string>}
          toggles={togglesFor(GLOBAL_TOGGLES)}
          sections={(sections?.value ?? {}) as Record<string, boolean>}
          textTitle="Contact details and links"
          textHelp="These appear in the footer of every page. Leave a field blank and its row disappears rather than showing empty."
          toggleTitle="Pages the site links to"
          toggleHelp="Untick a page and it stops being linked from the navigation and footer. Nothing is deleted, and anyone with the address can still reach it — use this to launch with less and turn pages on as they are ready."
        />

        <div className="adm__card" style={{ marginTop: 26 }}>
          <h3 className="adm__h3">Looking for the words on a particular page?</h3>
          <p className="help" style={{ marginBottom: 14 }}>
            Text that belongs to one page is edited on that page&rsquo;s screen.
          </p>
          {pagesWithOwnText().map((p) => (
            <div key={p.key} className="adm__pointer">
              <Link href={`/admin/pages/${p.key}`}>{p.label}</Link>
              <span className="adm__meta">{p.settings.length} field{p.settings.length === 1 ? "" : "s"}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
