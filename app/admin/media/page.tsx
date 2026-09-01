import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function Media() {
  const staff = await requireStaff();
  const sb = await supabaseServer();
  const [{ data: media }, apps, enq] = await Promise.all([
    sb.from("media").select("*").order("created_at", { ascending: false }),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name} counts={{ applications: apps.count ?? 0, enquiries: enq.count ?? 0 }} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <h1 className="adm__h1">Images</h1>
            <p className="adm__sub">Every picture used on the site. Alt text is required on all of them.</p>
          </div>
        </div>
        <div className="adm__note" style={{ marginBottom: 18 }}>
          <b>Before you upload a photograph of a person</b>
          Nothing showing a participant goes on the site without their signed consent. If you are not sure, do not upload it.
        </div>
        <MediaLibrary items={(media ?? []) as never} base={base} canDelete={staff.role === "admin"} />
      </main>
    </div>
  );
}
