/* ============================================================
   Seeds the database from lib/content.ts — the content that is
   currently hard-coded into the site. Run once, after the schema
   migration:

       npx tsx scripts/seed.ts

   Safe to re-run: it clears and rewrites the collections it owns,
   so it will not duplicate rows. It does NOT touch submissions,
   media or users.
   ============================================================ */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import { createClient } from "@supabase/supabase-js";
import * as C from "../lib/content";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("\nMissing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Put them in .env.local, then run this again.\n");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

type Item = Record<string, unknown>;

async function put(collection: string, items: Item[]) {
  await sb.from("collections").delete().eq("collection", collection);
  if (!items.length) { console.log(`  ${collection.padEnd(20)} 0`); return; }
  const rows = items.map((data, sort) => ({ collection, sort, data, published: true }));
  const { error } = await sb.from("collections").insert(rows);
  if (error) { console.error(`  ${collection}: ${error.message}`); process.exit(1); }
  console.log(`  ${collection.padEnd(20)} ${items.length}`);
}

async function main() {
  console.log("\nSeeding content…\n");

  await put("marquee",        C.MARQUEE.map(([en, ne]) => ({ en, ne })));
  await put("pillars",        C.PILLARS.map((label) => ({ label })));
  await put("method",         C.METHOD as unknown as Item[]);
  await put("stats",          C.STATS as unknown as Item[]);
  await put("phases",         C.PHASES as unknown as Item[]);
  await put("partner_types",  C.PARTNER_TYPES as unknown as Item[]);
  await put("take_part",      C.TAKE_PART as unknown as Item[]);
  await put("chapters",       C.CHAPTERS as unknown as Item[]);
  await put("program_blocks", C.PROGRAM_BLOCKS as unknown as Item[]);
  await put("journal",        C.JOURNAL as unknown as Item[]);
  await put("interests",      C.INTERESTS.map((label) => ({ label })));
  await put("support_items",  C.SUPPORT_ITEMS.map((label) => ({ label })));
  await put("support_models", C.SUPPORT_MODELS as unknown as Item[]);

  await put("gallery_groups", C.GALLERY.map((g) => ({ title: g.title, deva: g.deva, cols: String(g.cols), consent: !!g.consent })));
  await put("gallery_items",  C.GALLERY.flatMap((g) => g.items.map((i) => ({ group: g.title, ...i }))));

  await put("partner_groups", C.PARTNERS.groups.map((g) => ({ label: g.label })));
  await put("partners",       C.PARTNERS.groups.flatMap((g) => g.items.map((p) => ({ group: g.label, ...p }))));

  await put("reflection_years",   C.REFLECTION.years.map((y) => ({ year: y.year, deva: y.deva, title: y.title, summary: y.summary })));
  await put("reflection_stats",   C.REFLECTION.years.flatMap((y) => (y.stats   ?? []).map((s) => ({ year: y.year, ...s }))));
  await put("reflection_events",  C.REFLECTION.years.flatMap((y) => (y.events  ?? []).map((e) => ({ year: y.year, ...e }))));
  await put("reflection_lessons", C.REFLECTION.years.flatMap((y) => (y.learned ?? []).map((l) => ({ year: y.year, ...l }))));

  const settings = {
    email: C.SITE.email, phone: C.SITE.phone, minAge: C.SITE.minAge, crisis: C.SITE.crisis,
    instagram: C.SITE.social.Instagram ?? "",
    facebook:  C.SITE.social.Facebook  ?? "",
    youtube:   C.SITE.social.YouTube   ?? "",
    reflectionLede: C.REFLECTION.lede, reflectionNote: C.REFLECTION.note,
    partnersLede:   C.PARTNERS.lede,   partnersNote:   C.PARTNERS.note,
  };
  const { error } = await sb.from("site_settings").upsert({ key: "site", value: settings });
  if (error) { console.error(`  settings: ${error.message}`); process.exit(1); }
  console.log(`  ${"site_settings".padEnd(20)} ok`);

  console.log("\nDone. Everything on the site is now editable in the admin.\n");
}

main();
