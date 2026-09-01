import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

export type Role = "admin" | "editor";
export interface Staff { id: string; email: string; name: string; role: Role }

/* The single gate for every admin screen. Returns the signed-in
   staff member, or redirects to the login page. */
export async function requireStaff(): Promise<Staff> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await sb.from("profiles").select("role, name, email").eq("id", user.id).single();
  if (!profile) redirect("/admin/login?e=noprofile");

  return {
    id: user.id,
    email: profile.email || user.email || "",
    name: profile.name || "",
    role: (profile.role as Role) || "editor",
  };
}

export async function requireAdmin(): Promise<Staff> {
  const staff = await requireStaff();
  if (staff.role !== "admin") redirect("/admin?e=forbidden");
  return staff;
}
