/* ============================================================
   PAGE MAP

   The admin used to list all twenty-odd collections in one flat
   column, which left an editor guessing which list fed which
   page. This file groups them the way the site is actually read:
   one entry per public page, holding the sections that page is
   built from, in the order a visitor meets them.

   `sections` are collection keys from lib/schema.ts, `settings`
   are keys from SETTINGS_FIELDS, `toggles` from
   TOGGLEABLE_SECTIONS. Nothing is duplicated by hand — the
   labels and help text still come from the schema, so this stays
   a map, not a second copy of the truth.
   ============================================================ */
import { COLLECTIONS, SETTINGS_FIELDS, TOGGLEABLE_SECTIONS, type Field } from "./schema";

export interface SitePageDef {
  key: string;
  /* what the admin calls it. Mostly the public title, but the home
     page is "Landing page" — nobody looking for it types "home". */
  label: string;
  blurb: string;
  /* the public URL, so every screen can offer "view this page" */
  path: string;
  /* collection keys, top-to-bottom in the order they render */
  sections: string[];
  settings: string[];
  /* sections *inside* this page that can be switched off */
  toggles: string[];
  /* the switch that decides whether the site links to this page
     at all — kept apart from `toggles` because it reads as a
     different kind of decision */
  linkToggle?: string;
  /* what on this page is written into the code rather than the
     database — the honest answer to "why can't I find this bit?" */
  fixed?: string;
}

export const SITE_PAGES: SitePageDef[] = [
  {
    key: "home", label: "Landing page", path: "/",
    blurb: "The first page a visitor sees.",
    sections: ["marquee", "pillars", "method", "stats", "phases", "stories", "partner_types", "take_part"],
    settings: [],
    toggles: ["home_stories", "home_reflection", "home_partners"],
    fixed: "The headline, the opening question and the closing invitation are written into the page itself. " +
           "The teaser for Our Journey and the partner strip are drawn from those pages — edit them there.",
  },
  {
    key: "story", label: "Our Story", path: "/story",
    blurb: "How the initiative began, told in numbered chapters.",
    sections: ["chapters"], settings: [], toggles: [],
    fixed: "The title and the opening paragraph are written into the page itself.",
  },
  {
    key: "program", label: "The Program", path: "/program",
    blurb: "What the twelve to sixteen weeks actually involve.",
    sections: ["program_blocks"], settings: [], toggles: [],
    fixed: "The title and the opening paragraph are written into the page itself. " +
           "The three phases shown here are the ones on the landing page.",
  },
  {
    key: "gallery", label: "Gallery", path: "/gallery",
    blurb: "Pictures, grouped into sections.",
    sections: ["gallery_groups", "gallery_items"], settings: [],
    toggles: [], linkToggle: "nav_gallery",
    fixed: "Add the sections first — an image has to be filed under one.",
  },
  {
    key: "journal", label: "Journal", path: "/journal",
    blurb: "Essays and notebook entries.",
    sections: ["journal"], settings: [],
    toggles: [], linkToggle: "nav_journal",
  },
  {
    key: "reflection", label: "Our Journey", path: "/reflection",
    blurb: "The record of what has already happened, year by year.",
    sections: ["reflection_years", "reflection_stats", "reflection_events", "reflection_lessons",
               "partner_groups", "partners"],
    settings: ["reflectionLede", "reflectionNote"],
    toggles: [], linkToggle: "nav_reflection",
    fixed: "Add a year first — figures, events and lessons are all filed under one.",
  },
  {
    key: "partner", label: "Partner With Us", path: "/partner",
    blurb: "The case for working together, and the enquiry form.",
    sections: ["partner_types", "partner_groups", "partners", "interests"],
    settings: ["partnersLede", "partnersNote"],
    toggles: [],
  },
  {
    key: "support", label: "Support", path: "/support",
    blurb: "What a donation pays for and the ways to give.",
    sections: ["support_items", "support_models"], settings: [],
    toggles: [], linkToggle: "nav_support",
  },
  {
    key: "apply", label: "Join the Journey", path: "/apply",
    blurb: "The application form.",
    sections: [], settings: ["minAge"],
    toggles: [], linkToggle: "nav_apply",
    fixed: "The questions on the form are fixed — changing them means changing what is stored, " +
           "so ask a developer.",
  },
  {
    key: "contact", label: "Contact", path: "/contact",
    blurb: "How to reach the team.",
    sections: [], settings: ["email", "phone"], toggles: [],
    fixed: "The social links shown here come from Site-wide details.",
  },
];

/* Everything that is not owned by a single page: the header, the
   footer, and which pages are linked from them at all. */
export const GLOBAL_SETTINGS = ["email", "phone", "crisis", "instagram", "facebook", "youtube"];
export const GLOBAL_TOGGLES  = ["nav_journal", "nav_gallery", "nav_reflection", "nav_support", "nav_apply"];

export const pageByKey = (k: string) => SITE_PAGES.find((p) => p.key === k);

/* Which pages a collection feeds. Several feed two — the partner
   wall is on both Partner and Our Journey — so this returns a
   list and the screens say so rather than pretending otherwise. */
export const pagesForCollection = (key: string) =>
  SITE_PAGES.filter((p) => p.sections.includes(key));

/* The pages this person can actually change something on. An
   editor only has the journal and the gallery, so they should not
   be handed a column of eight pages they will be refused from. */
export function pagesForRole(role: "admin" | "editor"): SitePageDef[] {
  if (role === "admin") return SITE_PAGES;
  const mine = new Set(COLLECTIONS.filter((c) => c.roles.includes(role)).map((c) => c.key));
  return SITE_PAGES.filter((p) => p.sections.some((s) => mine.has(s)));
}

const settingByKey = (k: string) => SETTINGS_FIELDS.find((f) => f.key === k);
const toggleByKey  = (k: string) => TOGGLEABLE_SECTIONS.find((t) => t.key === k);

export const fieldsFor  = (keys: string[]): Field[] =>
  keys.map(settingByKey).filter((f): f is Field => Boolean(f));
export const togglesFor = (keys: string[]) =>
  keys.map(toggleByKey).filter((t): t is { key: string; label: string; where: string } => Boolean(t));

/* Used on the site-wide screen to point at the page-level text
   rather than leaving an admin to hunt for it. */
export const pagesWithOwnText = () =>
  SITE_PAGES.filter((p) => p.settings.length > 0);
