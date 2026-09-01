# Getting the admin running

Two steps. Both are on the Supabase dashboard for
`falhxpbtrohbxpjsldks` (the `rosikadangi7@gmail.com` account).

## 1. Create the tables

Supabase dashboard → **SQL Editor** → New query.
Paste the whole of `supabase/migrations/0001_init.sql`, press **Run**.

That creates the content tables, the submissions tables, the image
store, and the row-level security policies that stop anyone reading
applications from a browser.

## 2. Add the secret key

Dashboard → **Project Settings → API keys**. Copy the key labelled
**secret** (it starts `sb_secret_`). Paste it into `.env.local`:

    SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

Do not paste this key into chat, a screenshot, or a commit. It can read
and write everything, including every application. `.env.local` is
gitignored.

Then restart the dev server.

## 3. Load the existing content

    npm run seed

This copies everything currently hard-coded in `lib/content.ts` into the
database — every heading, card, phase, journal entry and gallery group —
so the admin has real content to edit rather than empty screens. Safe to
re-run.

## 4. Make yourself an account

Dashboard → **Authentication → Users → Add user**. Use your own email
and a password.

**The first account created becomes the administrator.** Everyone added
after that arrives as an editor, and an administrator can promote them
under *People* in the admin.

Then sign in at http://localhost:3000/admin

## Who can do what

| | Administrator | Editor (volunteers) |
|---|---|---|
| Journal, gallery | ✅ | ✅ |
| Read submissions | ✅ | ✅ |
| Change submission status, delete | ✅ | ❌ |
| All other site content | ✅ | ❌ |
| Contact details, section switches | ✅ | ❌ |
| Manage people | ✅ | ❌ |

This is enforced by row-level security in Postgres, not just by hiding
buttons — an editor cannot reach admin-only data even by calling the API
directly.

## Still to do

- Email alerts when an application arrives (`NOTIFY_EMAIL` is unused)
- A privacy policy page, and a job that actually deletes applications
  past their `delete_after` date
- Real photography, real contact details, the real Looking Back record
- Hosting

---

# Submission alerts

Without this, nothing tells anyone that an application has arrived —
the admin has to be checked by hand. The site promises applicants a
reply within two weeks and partners within five working days, so this
matters more than it looks.

## Switch it on

1. Sign up at **resend.com** (free tier: 100 emails a day, 3,000 a
   month — far more than this site will produce).
2. API Keys → Create → copy it.
3. In `.env.local`:

       RESEND_API_KEY=re_...
       NOTIFY_EMAIL=you@example.com,someone-else@example.com

4. Restart the server. The admin overview will say *"Alerts are on"*
   instead of *"Alerts are off"*.

Until you verify your own domain with Resend, alerts are sent from
`onboarding@resend.dev`, which only delivers to the address that owns
the Resend account. To send to anyone else, add your domain under
Resend → Domains and set `NOTIFY_FROM` to an address on it.

## What the alert says

It says *what* arrived and links to the admin. It deliberately does
**not** include the applicant's name, age, contact details or answers.

Those were given to a well-being programme under a consent checkbox
covering the review of an application — not copying them into several
inboxes, where they get forwarded, synced to phones, and kept long
after the row here has been deleted. The alert tells you to go and
look; the data stays in one place.

## If email breaks

A submission is saved to the database before any alert is attempted,
and an alert failure can never turn a saved submission into an error
the visitor sees. Both paths are tested: with no key configured, and
with a provider returning 401, the submission still saves and the
visitor still gets the thank-you screen. Failures are logged to the
server as `[notify] ...`.
