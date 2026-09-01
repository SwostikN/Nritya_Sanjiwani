import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/* Keeps the Supabase session cookie fresh on admin routes. The real
   authorisation happens in requireStaff()/requireAdmin() and, below
   that, in the RLS policies — this only stops sessions expiring
   mid-edit. */
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return res;

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );
  await sb.auth.getUser();
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
