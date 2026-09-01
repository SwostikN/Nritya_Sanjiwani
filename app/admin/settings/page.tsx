import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

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
            <h1 className="adm__h1">Details &amp; sections</h1>
            <p className="adm__sub">Contact details, the standing paragraphs, and which sections are switched on.</p>
          </div>
        </div>
        <SettingsForm
          values={(site?.value ?? {}) as Record<string, string>}
          sections={(sections?.value ?? {}) as Record<string, boolean>}
        />
      </main>
    </div>
  );
}
