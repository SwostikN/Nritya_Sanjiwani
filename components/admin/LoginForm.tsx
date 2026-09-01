"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: String(fd.get("email")), password: String(fd.get("password")),
    });
    if (error) { setErr(error.message); setBusy(false); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label><span>Email</span><input type="email" name="email" autoComplete="username" required /></label>
      <label><span>Password</span><input type="password" name="password" autoComplete="current-password" required /></label>
      {err ? <p className="adm__err">{err}</p> : null}
      <button className="b" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
