import { NextResponse } from "next/server";
import { saveSubmission, type Kind } from "./submissions";
import { notifySubmission } from "./notify";

/* Shared handler for the three public forms. Server-side validation
   mirrors the client rules (PRD §12: validate on both sides), the
   honeypot is checked here, and nothing beyond the fields listed in
   PRD §11 is persisted — anything extra is dropped, not stored. */
export function makeHandler(kind: Kind, allowed: string[], required: string[]) {
  return async function POST(req: Request) {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Malformed request." }, { status: 400 });
    }

    /* honeypot — a bot fills every field it sees */
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 200 }); // look successful, store nothing
    }

    const missing = required.filter((k) => {
      const v = body[k];
      return v === undefined || v === null || (typeof v === "string" && !v.trim()) || v === false;
    });
    if (missing.length)
      return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 422 });

    if (typeof body.email === "string" && body.email && !/^\S+@\S+\.\S+$/.test(body.email))
      return NextResponse.json({ error: "Invalid email." }, { status: 422 });

    /* data minimisation — keep only the declared fields */
    const clean: Record<string, unknown> = {};
    for (const k of allowed) if (k in body) clean[k] = body[k];

    try {
      const id = await saveSubmission(kind, clean);
      /* The submission is already safe in the database. Alerting is
         best-effort from here — awaited so serverless does not kill it
         mid-flight, but never allowed to turn a saved submission into
         an error the visitor sees. */
      await notifySubmission(kind, clean).catch(() => {});
      return NextResponse.json({ ok: true, id });
    } catch (err) {
      console.error(`[${kind}] save failed`, err);
      return NextResponse.json({ error: "Could not save." }, { status: 500 });
    }
  };
}
