import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import UserList from "@/components/admin/UserList";

export const dynamic = "force-dynamic";

export default async function Users() {
  const staff = await requireAdmin();
  const sb = await supabaseServer();
  const [{ data: people }, apps, enq] = await Promise.all([
    sb.from("profiles").select("id,email,name,role,created_at").order("created_at"),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name} counts={{ applications: apps.count ?? 0, enquiries: enq.count ?? 0 }} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <h1 className="adm__h1">People</h1>
            <p className="adm__sub">Who can sign in, and what they are allowed to change.</p>
          </div>
        </div>

        <div className="adm__note" style={{ marginBottom: 18 }}>
          <b>Adding someone</b>
          Invite them from the Supabase dashboard under Authentication → Users. They arrive here as an
          <b style={{ display: "inline" }}> editor</b> — able to edit the journal and gallery and read
          submissions, but not to change the rest of the site or delete anything. Promote them below if needed.
        </div>

        <UserList people={(people ?? []) as never} meId={staff.id} />
      </main>
    </div>
  );
}
