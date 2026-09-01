import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import SubmissionList from "@/components/admin/SubmissionList";

export const dynamic = "force-dynamic";

const KINDS = {
  applications: {
    table: "applications", label: "Applications",
    blurb: "People asking to take part. Everything here was given under an explicit consent checkbox.",
    columns: ["name", "age", "contact", "community", "experience", "access", "why"],
    statuses: ["new", "reviewing", "accepted", "declined", "archived"],
  },
  enquiries: {
    table: "partner_enquiries", label: "Partnership enquiries",
    blurb: "Organisations and people who want to work with you. The site promises a reply within five working days.",
    columns: ["name", "org", "email", "phone", "interest", "message"],
    statuses: ["new", "read", "replied", "archived"],
  },
  subscribers: {
    table: "newsletter_subscribers", label: "Newsletter",
    blurb: "People who asked for occasional notes from the program.",
    columns: ["email"],
    statuses: [],
  },
} as const;

export default async function Submissions({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const cfg = KINDS[kind as keyof typeof KINDS];
  if (!cfg) notFound();

  const staff = await requireStaff();
  const sb = await supabaseServer();

  const [{ data: rows, error }, apps, enq] = await Promise.all([
    sb.from(cfg.table).select("*").order("created_at", { ascending: false }),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("partner_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <div className="adm__shell">
      <Sidebar role={staff.role} name={staff.name}
               counts={{ applications: apps.count ?? 0, enquiries: enq.count ?? 0 }} />
      <main className="adm__main">
        <div className="adm__head">
          <div>
            <h1 className="adm__h1">{cfg.label}</h1>
            <p className="adm__sub">{cfg.blurb}</p>
          </div>
        </div>

        {kind === "applications" ? (
          <div className="adm__note" style={{ marginBottom: 18 }}>
            <b>Handle with care</b>
            These are real people&rsquo;s names and contact details, given to a well-being programme.
            Do not paste them into other tools. Rows are set to be deleted 24 months after they arrive.
          </div>
        ) : null}

        {error ? (
          <div className="adm__note"><b>Could not load</b>{error.message}</div>
        ) : (
          <SubmissionList
            table={cfg.table}
            kind={kind}
            rows={(rows ?? []) as Record<string, unknown>[]}
            columns={[...cfg.columns]}
            statuses={[...cfg.statuses]}
            canManage={staff.role === "admin"}
          />
        )}
      </main>
    </div>
  );
}
