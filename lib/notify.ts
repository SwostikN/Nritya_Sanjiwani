/* ============================================================
   Submission alerts.

   Deliberately minimal: the email says WHAT arrived and links to
   the admin. It does not carry the applicant's name, age, contact
   details or answers.

   That is not laziness. An application holds personal data given
   to a well-being programme under an explicit consent checkbox
   that covers reviewing the application — not copying it into
   several inboxes, where it gets forwarded, synced to phones,
   and kept long after the row here is deleted. The alert tells
   you to go and look; the data stays in one place.

   A failure here must never fail the submission — the person has
   already typed their answers and pressed send, and losing that
   because an email provider is down would be the worse outcome.
   ============================================================ */
import type { Kind } from "./submissions";

const LABEL: Record<Kind, { what: string; where: string; urgency: string }> = {
  apply: {
    what: "A new application to join the programme",
    where: "/admin/submissions/applications",
    urgency: "The site tells applicants they will hear back within two weeks.",
  },
  partner: {
    what: "A new partnership enquiry",
    where: "/admin/submissions/enquiries",
    urgency: "The site promises a reply within five working days.",
  },
  newsletter: {
    what: "A new newsletter subscriber",
    where: "/admin/submissions/subscribers",
    urgency: "",
  },
};

function body(kind: Kind, siteUrl: string) {
  const l = LABEL[kind];
  const link = `${siteUrl}${l.where}`;
  return {
    subject: `${l.what} — Nritya Sanjiwani`,
    text:
      `${l.what} has arrived.\n\n` +
      `Open the admin to read it:\n${link}\n\n` +
      (l.urgency ? `${l.urgency}\n\n` : "") +
      `This alert deliberately contains no personal details — they stay in the admin.\n`,
    html:
      `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#241710">` +
      `<p style="margin:0 0 1em">${l.what} has arrived.</p>` +
      `<p style="margin:0 0 1.4em"><a href="${link}" style="display:inline-block;padding:.7em 1.3em;background:#241710;color:#FBF6EC;border-radius:999px;text-decoration:none;font-weight:600">Read it in the admin</a></p>` +
      (l.urgency ? `<p style="margin:0 0 1em;color:#5A4A3C">${l.urgency}</p>` : "") +
      `<p style="margin:0;color:#8A7867;font-size:13px">This alert deliberately contains no personal details — they stay in the admin.</p>` +
      `</div>`,
  };
}

export async function notifySubmission(kind: Kind) {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.NOTIFY_EMAIL || "").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.NOTIFY_FROM || "Nritya Sanjiwani <onboarding@resend.dev>";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  if (!key || !to.length) {
    console.warn(`[notify] ${kind} received but no alert sent (RESEND_API_KEY or NOTIFY_EMAIL not set)`);
    return { sent: false, reason: "not configured" };
  }

  const { subject, text, html } = body(kind, siteUrl);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text, html }),
    });
    if (!res.ok) {
      console.error(`[notify] ${kind} alert failed: ${res.status} ${await res.text()}`);
      return { sent: false, reason: `http ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error(`[notify] ${kind} alert threw`, err);
    return { sent: false, reason: "threw" };
  }
}
