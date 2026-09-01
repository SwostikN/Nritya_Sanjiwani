import LoginForm from "@/components/admin/LoginForm";
import { supabaseConfigured } from "@/lib/supabase/admin";

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const ready = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <div className="adm__login">
      <div className="adm__loginbox">
        <div className="adm__brand" style={{ padding: 0, border: 0, marginBottom: 22 }}>
          <b>Nritya Sanjiwani</b>
          <span>Admin</span>
        </div>

        {!ready ? (
          <div className="adm__note">
            <b>Not connected yet</b>
            The Supabase keys are missing. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then restart the server.
          </div>
        ) : (
          <>
            {e === "noprofile" ? (
              <div className="adm__note" style={{ marginBottom: 18 }}>
                <b>No access</b>
                That account signed in but has no staff profile. An administrator needs to add you.
              </div>
            ) : null}
            <LoginForm />
          </>
        )}
        {ready && !supabaseConfigured() ? (
          <p className="help" style={{ marginTop: 18 }}>
            Note: the secret key is not set, so form submissions are not being saved to the database yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
