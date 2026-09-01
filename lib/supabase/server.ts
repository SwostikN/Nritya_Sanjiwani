import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* Server-side client carrying the signed-in user's session.
   Every query it makes is subject to RLS — this is what the admin
   screens use, so a volunteer literally cannot read a row the
   policies forbid, no matter what the UI does. */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          try { list.forEach(({ name, value, options }) => store.set(name, value, options)); }
          catch { /* called from a Server Component; middleware refreshes instead */ }
        },
      },
    }
  );
}
