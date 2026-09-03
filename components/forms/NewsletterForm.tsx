"use client";
import { useState } from "react";
import { setErr, isEmail } from "@/lib/form";

export default function NewsletterForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const i = f.querySelector<HTMLInputElement>("[name=email]")!;
    if (!isEmail(i.value)) { setErr(i, "Please enter a valid email."); return; }
    setErr(i, "");
    setBusy(true);
    setFailed("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(f).entries())),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setFailed("That didn't send. Please try again.");
      setBusy(false);
    }
  }

  if (sent)
    return <p className="lede" style={{ color: "var(--accent-soft)" }}>Thank you. You&rsquo;re on the list.</p>;

  return (
    <form className="news__form" id="newsForm" noValidate onSubmit={onSubmit}>
      <label className="field"><span>Email</span><input type="email" name="email" autoComplete="email" /><span className="err"></span></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
             style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      <button className="btn btn--light" type="submit" disabled={busy}>{busy ? "…" : "Subscribe"}</button>
      {failed ? <span className="err" style={{ opacity: 1 }}>{failed}</span> : null}
    </form>
  );
}
