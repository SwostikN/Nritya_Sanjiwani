# Nritya Sanjiwani

Next.js port of `nritya-sanjiwani-v2.html`. The public site is a
verbatim port — the stylesheet is the original `<style>` block
unchanged, and every page renders an identical DOM (verified by
diffing the rendered class-attribute sequence and text stream of all
ten pages against the original file).

## What changed from the single-file version

- **Real routes** instead of the `#/story` hash router, so each page
  carries its own `<title>` and description (PRD §15).
  `data-go="story"` still works everywhere — `components/NavRoot.tsx`
  intercepts it and pushes the route, which is why the markup could
  stay byte-identical.
- **The three forms actually submit.** They POST to `/api/partner`,
  `/api/apply` and `/api/newsletter`, which validate server-side,
  drop honeypot hits, keep only the fields listed in PRD §11, and
  persist through `lib/submissions.ts`.

## Running

    npm install
    npm run dev

## Where the content lives

`lib/content.ts` — ported from the constants at the bottom of the v2
HTML. Every export here becomes a database table when the admin panel
lands; the components read the same shapes either way.

## Where submissions go

`lib/submissions.ts` is the single write path. With no Supabase
environment set it appends to `.submissions/*.jsonl` so the flow is
testable locally. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
(see `.env.example`) and it writes to Postgres instead — nothing above
that file changes.

## Not done yet

- Supabase schema, admin panel, image uploads, auth and roles
- Privacy policy page + a retention rule for stored applications
- Real photography, real contact details, real Looking Back content
