import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { byKey } from "@/lib/schema";
import Sidebar from "@/components/admin/Sidebar";
import CollectionEditor, { type Row } from "@/components/admin/CollectionEditor";

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const def = byKey(collection);
  if (!def) notFound();

  const staff = await requireStaff();
  if (!def.roles.includes(staff.role))
    return (
      <div className="adm__shell">
        <Sidebar role={staff.role} name={staff.name} counts={{ applications: 0, enquiries: 0 }} />
        <main className="adm__main">
          <div className="adm__note"><b>Not your permission level</b>
            This section is edited by administrators. You can still edit the journal and the gallery.</div>
        </main>
      </div>
    );

  const sb = await supabaseServer();
  const [{ data: rows }, apps, enq, groups] = await Promise.all([
    sb.from("collections").select("id,sort,published,data").eq("collection", collection).order("sort"),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    def.groupBy
      ? sb.from("collections").select("data").eq("collection", def.groupBy.collection).order("sort")
      : Promise.resolve({ data: null }),
  ]);

  const groupOptions = def.groupBy
    ? (groups.data ?? []).map((g: { data: Record<string, unknown> }) =>
        String(g.data.year ?? g.data.title ?? g.data.label ?? ""))
        .filter(Boolean)
    : undefined;

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name}
               counts={{ applications: apps.count ?? 0, enquiries: enq.count ?? 0 }} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <h1 className="adm__h1">{def.label}</h1>
            <p className="adm__sub">{def.blurb}</p>
            <span className="adm__where">Appears on: {def.shownOn}</span>
          </div>
        </div>
        <CollectionEditor def={def} rows={(rows ?? []) as Row[]} groupOptions={groupOptions} />
      </main>
    </div>
  );
}
