/* ============================================================
   COLLECTION SCHEMAS

   One definition per editable list. The admin builds its forms
   from these, so adding a field here adds it to the editor —
   there is no separate form to keep in sync.

   `roles` decides who may edit: volunteers (editor) get journal
   and gallery; everything else is admin-only. This mirrors the
   RLS policies in supabase/migrations/0001_init.sql — the UI
   hides what the database would refuse anyway.
   ============================================================ */

import { HOME_ABOUT } from "./content";

export type FieldType = "text" | "textarea" | "image" | "number" | "boolean" | "select" | "devanagari" | "zoom";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  options?: string[];
  rows?: number;
  /* settings only: the words the site shows when nobody has saved
     this yet. The editor is filled with them, so a form can never
     be saved blank by an admin who came to change something else. */
  def?: string;
  /* settings only: required, but only once another field is filled —
     alt text is required by a picture, not by an empty slot */
  requiredWith?: string;
  /* zoom only: the field holding the picture this one sizes, so the
     control can show the real thing rather than an abstract number */
  previewFrom?: string;
}

export interface CollectionDef {
  key: string;
  label: string;
  blurb: string;
  /* which page the reader sees this on — shown in the admin so an editor
     knows what they are about to change */
  shownOn: string;
  titleField: string;
  roles: ("admin" | "editor")[];
  fields: Field[];
  /* collections that belong to a parent row (reflection years, gallery groups) */
  groupBy?: { collection: string; key: string; label: string };
}

const T  = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "text", ...extra });
const TA = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "textarea", rows: 4, ...extra });
const DV = (key: string, label = "Devanagari label"): Field =>
  ({ key, label, type: "devanagari", help: "Shown in the accent script beside the English." });
const IMG = (key = "img", label = "Image"): Field => ({ key, label, type: "image" });
const ALT = (key = "alt"): Field =>
  ({ key, label: "Alt text", type: "text", required: true, help: "Describe the picture for someone who cannot see it. Required." });

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "journal", label: "Journal", blurb: "Essays and notebook entries.",
    shownOn: "Journal page", titleField: "title", roles: ["admin", "editor"],
    fields: [
      T("title", "Title", { required: true }),
      T("meta", "Kind", { help: 'e.g. "Essay" or "Notebook"' }),
      TA("dek", "Standfirst", { help: "The line under the title." }),
      IMG(), ALT(),
    ],
  },
  {
    key: "gallery_years", label: "Gallery — years", blurb: "One entry per year. Each one becomes its own gallery page.",
    shownOn: "Gallery", titleField: "year", roles: ["admin", "editor"],
    fields: [
      T("year", "Year", { required: true,
        help: 'Just the year — e.g. "2025". Adding one here creates the page at /gallery/2025 and puts the year in the header menu.' }),
      DV("deva"),
      T("title", "Headline", { help: "Optional. Shown under the year." }),
      TA("summary", "Opening paragraph", { rows: 4, help: "Optional." }),
      { key: "consent", label: "Contains participant portraits", type: "boolean",
        help: "A reminder, not a switch: nothing showing a participant publishes without signed consent." },
    ],
  },
  {
    key: "gallery_items", label: "Gallery images", blurb: "The pictures, filed under a year.",
    shownOn: "Gallery", titleField: "cap", roles: ["admin", "editor"],
    groupBy: { collection: "gallery_years", key: "year", label: "Year" },
    fields: [
      IMG(), ALT(), T("cap", "Caption"),
      T("section", "Sub-heading", { help: 'Optional. Groups pictures within the year — e.g. "Movement", ' +
                                          '"Performance". Leave every picture blank and the year is one plain grid.' }),
      { key: "r", label: "Shape", type: "select", options: ["r-4x5", "r-3x2", "r-16x9", "r-1x1"],
        help: "The page lays landscape pictures out two across and upright ones three across, on its own." },
      { key: "slot", label: "Placeholder instead of a photo", type: "boolean",
        help: 'Shows the "pending consent" tile rather than an image.' },
    ],
  },
  {
    key: "method", label: "The method", blurb: "The three steps on the home page.",
    shownOn: "Home", titleField: "title", roles: ["admin"],
    fields: [T("n", "Number", { help: 'e.g. "01"' }), T("title", "Title", { required: true }), DV("deva"),
             TA("body", "Body"), IMG(), ALT()],
  },
  {
    key: "phases", label: "Programme phases", blurb: "The three phases, on the home page.",
    shownOn: "Home", titleField: "title", roles: ["admin"],
    fields: [T("tag", "Label", { help: 'e.g. "Phase 01"' }), T("title", "Title", { required: true }),
             DV("deva"), TA("body", "Body"), IMG(), ALT()],
  },
  {
    key: "stats", label: "Programme figures", blurb: "The counted figures in the dark band.",
    shownOn: "Home", titleField: "l", roles: ["admin"],
    fields: [T("f", "Figure", { required: true, help: 'e.g. "15–20" or "Feb 2027"' }), T("l", "Label", { required: true })],
  },
  {
    key: "pillars", label: "Practices", blurb: "The six practice tags.",
    shownOn: "Home", titleField: "label", roles: ["admin"],
    fields: [T("label", "Practice", { required: true })],
  },
  {
    key: "take_part", label: "Ways to take part", blurb: "The volunteer roles.",
    shownOn: "Home", titleField: "role", roles: ["admin"],
    fields: [T("role", "Role", { required: true }), DV("deva"), TA("body", "What it involves"),
             T("ask", "What it asks", { help: 'e.g. "A few hours, most weeks"' })],
  },
  {
    key: "stories", label: "Stories", blurb: "What participants said, in their own words.",
    shownOn: "Home", titleField: "name", roles: ["admin"],
    fields: [
      TA("quote", "What they said", { rows: 5, required: true,
         help: "Their words, not a summary of them. Quote marks are added for you." }),
      T("name", "Who said it", { help: 'A first name is enough. Leave blank and it reads "Anonymous".' }),
      T("role", "Who they are", { help: 'e.g. "Participant, 2025 cohort". Optional.' }),
      DV("deva"),
      { key: "consent", label: "Signed consent is on file", type: "boolean",
        help: "Nothing here reaches the site until this is ticked, however the row is otherwise set." },
    ],
  },
  {
    key: "team", label: "The team", blurb: "The people behind the initiative.",
    shownOn: "Our Team", titleField: "name", roles: ["admin"],
    fields: [
      T("name", "Name", { required: true }),
      T("role", "Role", { help: 'e.g. "Artistic direction". Shown above the name.' }),
      DV("deva"),
      TA("bio", "Short bio", { rows: 5 }),
      IMG("img", "Portrait"), ALT(),
      { key: "slot", label: "Placeholder instead of a portrait", type: "boolean",
        help: 'Shows the "pending" tile. Use it for a role that is filled but not yet announced.' },
    ],
  },
  {
    key: "partner_types", label: "Kinds of partner", blurb: "The three partner cards.",
    shownOn: "Home and Partner", titleField: "title", roles: ["admin"],
    fields: [T("title", "Title", { required: true }), TA("body", "Body"), T("cta", "Link text"),
             { key: "go", label: "Links to", type: "select", options: ["partner", "support", "apply", "contact", "program"] }],
  },
  {
    key: "chapters", label: "Story chapters", blurb: "The numbered chapters.",
    shownOn: "Our Story", titleField: "title", roles: ["admin"],
    fields: [T("n", "Number"), T("title", "Title", { required: true }), TA("body", "Body", { rows: 6 })],
  },
  {
    key: "program_blocks", label: "Programme details", blurb: "The detail cards.",
    shownOn: "The Program", titleField: "title", roles: ["admin"],
    fields: [T("tag", "Label"), T("title", "Title", { required: true }), TA("body", "Body")],
  },
  {
    key: "support_items", label: "What support covers", blurb: "The tags on the support page.",
    shownOn: "Support", titleField: "label", roles: ["admin"],
    fields: [T("label", "Item", { required: true })],
  },
  {
    key: "support_models", label: "Ways to support", blurb: "The support cards.",
    shownOn: "Support", titleField: "title", roles: ["admin"],
    fields: [T("title", "Title", { required: true }), TA("body", "Body")],
  },
  {
    key: "interests", label: "Enquiry reasons", blurb: "The dropdown on the partner form.",
    shownOn: "Partner form", titleField: "label", roles: ["admin"],
    fields: [T("label", "Option", { required: true })],
  },
  {
    key: "partner_groups", label: "Partner groups", blurb: "The headings on the partner wall.",
    shownOn: "Partner and Our Journey", titleField: "label", roles: ["admin"],
    fields: [T("label", "Group name", { required: true })],
  },
  {
    key: "partners", label: "Partners", blurb: "The organisations named on the wall.",
    shownOn: "Partner and Our Journey", titleField: "name", roles: ["admin"],
    groupBy: { collection: "partner_groups", key: "group", label: "Group" },
    fields: [T("name", "Name", { required: true }), T("role", "What they do"),
             IMG("logo", "Logo"), T("url", "Website", { help: "Optional. Opens in a new tab." }),
             { key: "scale", label: "Size inside the box", type: "zoom", previewFrom: "logo" }],
  },
  {
    key: "marquee", label: "Scrolling strip", blurb: "The word pairs in the moving band.",
    shownOn: "Home", titleField: "en", roles: ["admin"],
    fields: [T("en", "English", { required: true }), DV("ne", "Nepali")],
  },
  {
    key: "reflection_years", label: "Our Journey — years", blurb: "One entry per year. Each one becomes its own page.",
    shownOn: "Our Journey", titleField: "year", roles: ["admin"],
    fields: [T("year", "Year", { required: true,
               help: 'Just the year — e.g. "2025". Adding one here creates the page at /reflection/2025 and puts the year in the header menu. Put the month on the events below.' }),
             DV("deva"), T("title", "Headline"),
             TA("summary", "Summary", { rows: 5 })],
  },
  {
    key: "reflection_stats", label: "Our Journey — figures", blurb: "The counted figures for a year.",
    shownOn: "Our Journey", titleField: "l", roles: ["admin"],
    groupBy: { collection: "reflection_years", key: "year", label: "Year" },
    fields: [T("f", "Figure", { required: true }), T("l", "Label", { required: true })],
  },
  {
    key: "reflection_events", label: "Our Journey — events", blurb: "What actually happened, in order.",
    shownOn: "Our Journey", titleField: "title", roles: ["admin"],
    groupBy: { collection: "reflection_years", key: "year", label: "Year" },
    fields: [T("when", "When", { required: true, help: 'The month and year — e.g. "December 2025".' }), T("where", "Where"),
             T("tag", "Kind", { help: 'e.g. "Workshop", "Performance"' }),
             T("title", "Title", { required: true }), TA("body", "What happened", { rows: 5 }),
             IMG(), ALT()],
  },
  {
    key: "reflection_lessons", label: "Our Journey — what we learned", blurb: "The lessons from a year.",
    shownOn: "Our Journey", titleField: "title", roles: ["admin"],
    groupBy: { collection: "reflection_years", key: "year", label: "Year" },
    fields: [T("n", "Number"), T("title", "Title", { required: true }), TA("body", "Body", { rows: 5 })],
  },
];

export const byKey = (k: string) => COLLECTIONS.find((c) => c.key === k);

export const forRole = (role: "admin" | "editor") =>
  COLLECTIONS.filter((c) => c.roles.includes(role));

/* ---------- singletons, edited on the Settings screen ---------- */
export const SETTINGS_FIELDS: Field[] = [
  T("email", "Contact email", { help: "Shown on the Contact page and in the footer." }),
  T("phone", "Phone"),
  T("minAge", "Minimum age", { help: "Shown on the application form. Leave blank to hide the line." }),
  T("crisis", "Mental-health support line",
    { help: "Shown in the footer for visitors who need help this site does not provide. Use a real, local service." }),
  T("instagram", "Instagram URL"),
  T("facebook", "Facebook URL"),
  T("youtube", "YouTube URL"),
  TA("reflectionLede", "Our Journey — opening paragraph", { rows: 3 }),
  TA("reflectionNote", "Our Journey — note on what appears", { rows: 3 }),
  TA("partnersLede", "Partner wall — opening paragraph", { rows: 3 }),
  TA("partnersNote", "Partner wall — note", { rows: 3 }),

  /* The "What is Nritya Sanjiwani" block on the landing page — the
     picture, the words beside it, and where the link goes. `def` is
     the copy the site shipped with, so the form opens showing what
     is on screen rather than eight empty boxes. */
  T("homeAboutEyebrow", "Small label above the heading", { def: HOME_ABOUT.eyebrow }),
  T("homeAboutTitle",   "Heading",   { def: HOME_ABOUT.title }),
  TA("homeAboutBody",   "Paragraph", { rows: 4, def: HOME_ABOUT.body }),
  T("homeAboutCta",     "Link text",
    { def: HOME_ABOUT.cta, help: "The link under the practice tags. Leave it blank and there is no link." }),
  { key: "homeAboutGo", label: "Where that link goes", type: "select",
    options: ["story", "team", "program", "reflection", "gallery", "journal", "partner", "support", "apply"],
    def: HOME_ABOUT.go },
  { key: "homeAboutImg", label: "Picture", type: "image", def: HOME_ABOUT.img,
    help: "Shown beside the words. Remove it and the words run the full width." },
  T("homeAboutAlt", "Alt text",
    { def: HOME_ABOUT.alt, requiredWith: "homeAboutImg",
      help: "Describe the picture for someone who cannot see it. Required whenever there is a picture." }),
  T("homeAboutCap", "Caption on the picture", { def: HOME_ABOUT.cap }),
];

/* Sections an editor can hide without deleting anything —
   the Release 1 / Release 2 split in PRD §1. */
export const TOGGLEABLE_SECTIONS: { key: string; label: string; where: string }[] = [
  { key: "home_stories",    label: "Stories (consent-gated)", where: "Home" },
  { key: "home_reflection", label: "Our Journey teaser",     where: "Home" },
  { key: "home_partners",   label: "Partner strip",           where: "Home" },
  { key: "nav_journal",     label: "Journal",                 where: "Navigation and footer" },
  { key: "nav_gallery",     label: "Gallery",                 where: "Navigation and footer" },
  { key: "nav_reflection",  label: "Our Journey",            where: "Navigation and footer" },
  { key: "nav_support",     label: "Support",                 where: "Footer" },
  { key: "nav_apply",       label: "Join the Journey",        where: "Footer" },
];
