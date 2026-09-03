"use client";
import { useState } from "react";
import { setErr, isEmail } from "@/lib/form";

export default function PartnerForm({ interests }: { interests: string[] }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const name = f.querySelector<HTMLInputElement>("[name=name]")!;
    const mail = f.querySelector<HTMLInputElement>("[name=email]")!;
    setErr(name, name.value.trim() ? "" : "Please tell us your name.");
    setErr(mail, isEmail(mail.value) ? "" : "A valid email so we can reply.");
    if (!name.value.trim() || !isEmail(mail.value)) return;

    setBusy(true);
    setFailed("");
    const body = Object.fromEntries(new FormData(f).entries());
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      /* PRD §12 — an error state that does not lose the user's typed input */
      setFailed("Something went wrong sending that. Your message is still here. Please try again.");
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="thanks">
        <span className="eyebrow deva">धन्यवाद</span>
        <h2 className="h2" style={{ margin: ".5em 0 .5em" }}>Thank you.</h2>
        <p className="body-lg">
          Your message has reached us. Expect a reply from a member of the team within five working days.
        </p>
      </div>
    );

  return (
    <>
      <h2 className="h3" style={{ marginBottom: "1.8rem" }}>Start a conversation</h2>
      <form className="form" id="partnerForm" noValidate onSubmit={onSubmit}>
        <div className="fgrid">
          <label className="field"><span>Name</span><input type="text" name="name" autoComplete="name" /><span className="err"></span></label>
          <label className="field"><span>Organisation</span><input type="text" name="org" autoComplete="organization" /><span className="err"></span></label>
          <label className="field"><span>Email</span><input type="email" name="email" autoComplete="email" /><span className="err"></span></label>
          <label className="field"><span>Phone</span><input type="text" name="phone" autoComplete="tel" /><span className="err"></span></label>
        </div>
        <label className="field"><span>I am interested in</span>
          <select name="interest" defaultValue={interests[0]}>
            {interests.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
        <label className="field"><span>Message</span><textarea name="message" rows={4}></textarea></label>
        {/* honeypot — PRD §12 spam protection, zero page weight */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
               style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
        {failed ? <span className="err" style={{ opacity: 1 }}>{failed}</span> : null}
        <button className="btn" type="submit" style={{ alignSelf: "flex-start" }} disabled={busy}>
          {busy ? "Sending…" : <>Start a Conversation <span className="arw">→</span></>}
        </button>
      </form>
    </>
  );
}
