/* ============================================================
   Submission alerts.

   The email carries the whole submission so it can be read and
   acted on from a phone without opening the admin.

   That is a deliberate trade. An application holds personal data
   given to a well-being programme, and email spreads: it is
   forwarded, synced to devices, backed up, and kept long after
   the row here has passed its delete_after date. Set
   NOTIFY_INCLUDE_DETAILS=false to go back to a bare "something
   arrived" alert with only a link, and the data stays in one
   place.

   A failure here must never fail the submission — the person has
   already typed their answers and pressed send.
   ============================================================ */
import type { Kind } from "./submissions";

const LABEL: Record<Kind, { what: string; where: string; urgency: string }> = {
  apply: {
    what: "New application to join the programme",
    where: "/admin/submissions/applications",
    urgency: "The site tells applicants they will hear back within two weeks.",
  },
  partner: {
    what: "New partnership enquiry",
    where: "/admin/submissions/enquiries",
    urgency: "The site promises a reply within five working days.",
  },
  newsletter: {
    what: "New newsletter subscriber",
    where: "/admin/submissions/subscribers",
    urgency: "",
  },
};

/* field key -> how it should read in the email */
const FIELD: Record<string, string> = {
  name: "Name", age: "Age", contact: "Phone or email", community: "Community or organisation",
  experience: "Previous dance experience", access: "Accessibility requirements",
  why: "Why they want to take part",
  org: "Organisation", email: "Email", phone: "Phone", interest: "Interested in", message: "Message",
  consentData: "Consent to store their details", consentMedia: "Consent to photos and story",
};

const ORDER = ["name", "age", "contact", "org", "email", "phone", "community", "interest",
               "experience", "access", "why", "message", "consentData", "consentMedia"];

const yesNo = (v: unknown) => (v === true ? "Yes" : v === false ? "No" : String(v ?? ""));

function rows(payload: Record<string, unknown>) {
  const keys = ORDER.filter((k) => k in payload).concat(
    Object.keys(payload).filter((k) => !ORDER.includes(k))
  );
  return keys
    .map((k) => {
      const raw = payload[k];
      const val = typeof raw === "boolean" ? yesNo(raw) : String(raw ?? "").trim();
      return val ? { label: FIELD[k] ?? k, value: val } : null;
    })
    .filter(Boolean) as { label: string; value: string }[];
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function build(kind: Kind, payload: Record<string, unknown>, siteUrl: string, withDetails: boolean) {
  const l = LABEL[kind];
  const link = `${siteUrl}${l.where}`;
  const who = String(payload.name ?? payload.email ?? "").trim();
  const subject = who ? `${l.what}: ${who}` : `${l.what} · Nritya Sanjiwani`;

  if (!withDetails) {
    return {
      subject,
      text: `${l.what} has arrived.\n\nRead it in the admin:\n${link}\n\n${l.urgency}\n`,
      html: `<p>${esc(l.what)} has arrived.</p><p><a href="${link}">Read it in the admin</a></p><p>${esc(l.urgency)}</p>`,
    };
  }

  const r = rows(payload);

  const text =
    `${l.what}\n${"=".repeat(l.what.length)}\n\n` +
    r.map(({ label, value }) => `${label}:\n  ${value.replace(/\n/g, "\n  ")}`).join("\n\n") +
    `\n\n---\nOpen in the admin: ${link}\n` +
    (l.urgency ? `${l.urgency}\n` : "") +
    (kind === "apply" && payload.consentMedia !== true
      ? `\nNOTE: they did NOT consent to photos or their story being published.\n`
      : "");

  const html =
    `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#241710;max-width:620px">` +
    `<h2 style="font-size:19px;margin:0 0 18px;font-weight:600">${esc(l.what)}</h2>` +
    `<table style="width:100%;border-collapse:collapse;margin-bottom:22px">` +
    r.map(({ label, value }) =>
      `<tr>` +
      `<td style="padding:9px 14px 9px 0;border-bottom:1px solid #E6DCC9;color:#8A7867;font-size:12px;` +
      `text-transform:uppercase;letter-spacing:.08em;font-weight:700;white-space:nowrap;vertical-align:top">${esc(label)}</td>` +
      `<td style="padding:9px 0;border-bottom:1px solid #E6DCC9;white-space:pre-wrap">${esc(value)}</td>` +
      `</tr>`).join("") +
    `</table>` +
    (kind === "apply" && payload.consentMedia !== true
      ? `<p style="margin:0 0 18px;padding:11px 14px;background:#FBEDE6;border-left:3px solid #9C3B22;font-size:14px">` +
        `They did <strong>not</strong> consent to photos or their story being published.</p>`
      : "") +
    `<p style="margin:0 0 14px"><a href="${link}" style="display:inline-block;padding:.7em 1.3em;background:#241710;` +
    `color:#FBF6EC;border-radius:999px;text-decoration:none;font-weight:600">Open in the admin</a></p>` +
    (l.urgency ? `<p style="margin:0;color:#5A4A3C;font-size:13px">${esc(l.urgency)}</p>` : "") +
    `</div>`;

  return { subject, text, html };
}

export async function notifySubmission(kind: Kind, payload: Record<string, unknown> = {}) {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.NOTIFY_EMAIL || "").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.NOTIFY_FROM || "Nritya Sanjiwani <onboarding@resend.dev>";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const withDetails = process.env.NOTIFY_INCLUDE_DETAILS !== "false";

  if (!key || !to.length) {
    console.warn(`[notify] ${kind} received but no alert sent (RESEND_API_KEY or NOTIFY_EMAIL not set)`);
    return { sent: false, reason: "not configured" };
  }

  const { subject, text, html } = build(kind, payload, siteUrl, withDetails);
  /* replying to the alert should reach the person who wrote in */
  const replyTo = typeof payload.email === "string" && payload.email.includes("@")
    ? payload.email
    : typeof payload.contact === "string" && payload.contact.includes("@")
      ? payload.contact
      : undefined;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
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
