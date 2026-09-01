"use client";
import { useState } from "react";
import { setErr } from "@/lib/form";

const NEED: [string, string][] = [
  ["name", "Please tell us your name."],
  ["age", "Age is required for eligibility."],
  ["contact", "A phone number or email."],
];

export default function ApplyForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [consentErr, setConsentErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    let bad = false;
    NEED.forEach(([n, msg]) => {
      const i = f.querySelector<HTMLInputElement>(`[name=${n}]`)!;
      const empty = !i.value.trim();
      setErr(i, empty ? msg : "");
      if (empty) bad = true;
    });
    const cd = f.querySelector<HTMLInputElement>("[name=consentData]")!;
    setConsentErr(cd.checked ? "" : "Data-storage consent is required to apply.");
    if (!cd.checked) bad = true;
    if (bad) return;

    setBusy(true);
    setFailed("");
    const fd = new FormData(f);
    const body = {
      ...Object.fromEntries(fd.entries()),
      consentData: cd.checked,
      consentMedia: f.querySelector<HTMLInputElement>("[name=consentMedia]")!.checked,
    };
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setFailed("Something went wrong sending that. Your answers are still here — please try again.");
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="thanks">
        <h2 className="h2" style={{ marginBottom: ".5em" }}>Application received.</h2>
        <p className="body-lg">
          We read every application. You will hear from us within two weeks,
          whether or not a place is available in this cohort.
        </p>
      </div>
    );

  return (
    <form className="form" id="applyForm" noValidate onSubmit={onSubmit}>
      <div className="fgrid">
        <label className="field"><span>Name</span><input type="text" name="name" autoComplete="name" /><span className="err"></span></label>
        <label className="field"><span>Age</span><input type="text" name="age" /><span className="err"></span></label>
        <label className="field"><span>Phone or email</span><input type="text" name="contact" /><span className="err"></span></label>
        <label className="field"><span>Community or organisation</span><input type="text" name="community" /><span className="err"></span></label>
        <label className="field"><span>Previous dance experience (none is fine)</span><input type="text" name="experience" /><span className="err"></span></label>
        <label className="field"><span>Accessibility requirements</span><input type="text" name="access" /><span className="err"></span></label>
      </div>
      <label className="field"><span>Why would you like to participate?</span><textarea name="why" rows={4}></textarea></label>
      <div className="consent">
        <span className="consent__t">Consent</span>
        <label className="check"><input type="checkbox" name="consentData" />
          <span>I consent to Nritya Sanjiwani storing the details in this form for the purpose of reviewing my application. <b>Required.</b></span></label>
        <label className="check"><input type="checkbox" name="consentMedia" />
          <span>I consent to photography, video, and publication of my story. Optional — leaving this unticked does not affect my application.</span></label>
        <span className="err" id="consentErr" style={consentErr ? { opacity: 1 } : undefined}>{consentErr}</span>
      </div>
      <div className="note">
        <b>Please note</b>
        Nritya Sanjiwani is an arts-based emotional well-being initiative and does not replace
        professional mental-health treatment or clinical therapy. Professional counsellors are
        involved to support appropriate emotional well-being and guided reflection.
      </div>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
             style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {failed ? <span className="err" style={{ opacity: 1 }}>{failed}</span> : null}
      <button className="btn" type="submit" style={{ alignSelf: "flex-start" }} disabled={busy}>
        {busy ? "Sending…" : <>Submit Application <span className="arw">→</span></>}
      </button>
    </form>
  );
}
