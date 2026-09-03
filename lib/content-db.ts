/* ============================================================
   Reads the site's content from Supabase and reassembles it into
   exactly the shapes the components already expect, so the page
   code did not have to change when the CMS arrived.

   If Supabase is not configured, or holds no content at all (before
   the seed runs), it falls back to lib/content.ts. That means the
   site is never blank — a half-migrated database still renders.

   The fallback is all-or-nothing, and deliberately so. Once the
   database holds anything, it answers for every collection, so a
   list whose rows have all been hidden in the admin renders as
   nothing rather than reverting to the hard-coded copy below.
   ============================================================ */
import { createClient } from "@supabase/supabase-js";
import { yearPath } from "./routes";
import * as fallback from "./content";
import type {
  GalleryYear, JournalItem, MethodItem, PhaseItem, StatItem, PartnerType,
  TakePartItem, Chapter, ProgramBlock, SupportModel, PartnersData, ReflectionData,
  NavItem, PartnerItem, TimelineEvent, LearnedItem, ReflectionYear, StoryItem,
  TeamMember, NavNode, NavChild, HomeAbout,
} from "./content";

interface Row { data: Record<string, any>; sort: number }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function load(): Promise<{ rows: Record<string, Row[]>; live: boolean; settings: Record<string, any>; sections: Record<string, boolean> }> {
  if (!url || !key) return { rows: {}, live: false, settings: {}, sections: {} };
  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const [{ data: content }, { data: settings }] = await Promise.all([
      sb.from("collections").select("collection,data,sort").eq("published", true).order("sort"),
      sb.from("site_settings").select("key,value"),
    ]);
    const rows: Record<string, Row[]> = {};
    for (const r of content ?? []) (rows[r.collection] ||= []).push({ data: r.data, sort: r.sort });
    const byKey = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));
    /* Has the database taken over from lib/content.ts?

       We cannot answer that per collection: the row policy is
       `published or is_staff()`, so a hidden row is invisible to the
       publishable key — "every row hidden" and "never seeded" arrive
       here as the same empty list. So the question is asked once, of
       the whole database. The seed writes the `site` settings row,
       and settings are world-readable, so its presence survives an
       editor hiding every row on the site. Content rows count too,
       for a database filled in through the admin instead of seeded. */
    const live = Boolean(byKey.site) || (content?.length ?? 0) > 0;
    return { rows, live, settings: byKey.site ?? {}, sections: byKey.sections ?? {} };
  } catch {
    return { rows: {}, live: false, settings: {}, sections: {} };
  }
}

export interface SiteContent {
  SITE: typeof fallback.SITE;
  FOOTER_NAV: NavItem[]; MARQUEE: NavItem[];
  PILLARS: string[]; METHOD: MethodItem[]; STATS: StatItem[]; PHASES: PhaseItem[];
  PARTNER_TYPES: PartnerType[]; TAKE_PART: TakePartItem[]; CHAPTERS: Chapter[];
  PROGRAM_BLOCKS: ProgramBlock[]; GALLERY: GalleryYear[]; JOURNAL: JournalItem[];
  INTERESTS: string[]; SUPPORT_ITEMS: string[]; SUPPORT_MODELS: SupportModel[];
  REFLECTION: ReflectionData; PARTNERS: PartnersData; STORIES: StoryItem[];
  TEAM: TeamMember[]; HEADER_NAV: NavNode[]; HOME_ABOUT: HomeAbout;
  sections: Record<string, boolean>;
}

export async function getContent(): Promise<SiteContent> {
  const { rows, live, settings, sections } = await load();

  /* Once the database is live it is the only source of truth. A
     collection whose rows are every one of them hidden renders
     nothing, because that is what the editor asked for — reaching for
     the hard-coded list at that moment is how hidden practices kept
     turning up on the home page. The fallback belongs to a database
     that has not been seeded yet, so a half-built site is never blank. */
  const pick = <T,>(name: string, fb: T[]): T[] =>
    live ? ((rows[name] ?? []).map((r) => r.data) as T[]) : fb;
  const labels = (name: string, fb: string[]): string[] =>
    live ? (rows[name] ?? []).map((r) => r.data.label as string) : fb;

  /* gallery: one row per year, and the year carries its pictures */
  const galleryYears = live
    ? (rows.gallery_years ?? []).map((y): GalleryYear => ({
        year: String(y.data.year), deva: y.data.deva, title: y.data.title,
        summary: y.data.summary, consent: !!y.data.consent,
        items: (rows.gallery_items ?? [])
          .filter((i) => String(i.data.year) === String(y.data.year))
          .map((i) => ({ img: i.data.img, cap: i.data.cap, alt: i.data.alt, r: i.data.r,
                         section: i.data.section || undefined, slot: !!i.data.slot })),
      }))
    : fallback.GALLERY;

  /* partners: groups carry their organisations */
  const partnerGroups = live
    ? (rows.partner_groups ?? []).map((g) => ({
        label: g.data.label as string,
        items: (rows.partners ?? [])
          .filter((p) => p.data.group === g.data.label)
          .map((p): PartnerItem => ({ name: p.data.name, role: p.data.role, logo: p.data.logo, url: p.data.url })),
      }))
    : fallback.PARTNERS.groups;

  /* our journey: years carry their figures, events and lessons */
  const years: ReflectionYear[] = live
    ? (rows.reflection_years ?? []).map((y) => ({
        year: y.data.year, deva: y.data.deva, title: y.data.title, summary: y.data.summary,
        stats:  (rows.reflection_stats  ?? []).filter((r) => r.data.year === y.data.year)
                  .map((r): StatItem => ({ f: r.data.f, l: r.data.l })),
        events: (rows.reflection_events ?? []).filter((r) => r.data.year === y.data.year)
                  .map((r): TimelineEvent => ({ when: r.data.when, where: r.data.where, tag: r.data.tag,
                                                title: r.data.title, body: r.data.body, img: r.data.img, alt: r.data.alt })),
        learned:(rows.reflection_lessons ?? []).filter((r) => r.data.year === y.data.year)
                  .map((r): LearnedItem => ({ n: r.data.n, title: r.data.title, body: r.data.body })),
      }))
    : fallback.REFLECTION.years;

  /* stories: a second gate on top of `published`. A story only
     reaches a visitor once someone has ticked that the signed
     consent exists — that is the promise the section makes. */
  const stories: StoryItem[] = (rows.stories ?? [])
    .map((r) => r.data as StoryItem)
    .filter((s) => s.consent === true && Boolean(s.quote));

  /* the "What is Nritya Sanjiwani" block. `??`, not `||`: a field
     cleared in the admin should take that line off the page, not
     bring back the words shipped in the code. `go` is the exception —
     a link still has to lead somewhere. */
  const homeAbout: HomeAbout = {
    eyebrow: settings.homeAboutEyebrow ?? fallback.HOME_ABOUT.eyebrow,
    title:   settings.homeAboutTitle   ?? fallback.HOME_ABOUT.title,
    body:    settings.homeAboutBody    ?? fallback.HOME_ABOUT.body,
    cta:     settings.homeAboutCta     ?? fallback.HOME_ABOUT.cta,
    go:      settings.homeAboutGo      || fallback.HOME_ABOUT.go,
    img:     settings.homeAboutImg     ?? fallback.HOME_ABOUT.img,
    alt:     settings.homeAboutAlt     ?? fallback.HOME_ABOUT.alt,
    cap:     settings.homeAboutCap     ?? fallback.HOME_ABOUT.cap,
  };

  const social: Record<string, string> = {};
  if (settings.instagram) social.Instagram = settings.instagram;
  if (settings.facebook)  social.Facebook  = settings.facebook;
  if (settings.youtube)   social.YouTube   = settings.youtube;

  return {
    SITE: {
      email:  settings.email  ?? fallback.SITE.email,
      phone:  settings.phone  ?? fallback.SITE.phone,
      minAge: settings.minAge ?? fallback.SITE.minAge,
      crisis: settings.crisis ?? fallback.SITE.crisis,
      social,
    },
    HEADER_NAV: fallback.HEADER_NAV,
    FOOTER_NAV: fallback.FOOTER_NAV,
    HOME_ABOUT: homeAbout,
    MARQUEE: live ? (rows.marquee ?? []).map((m) => [m.data.en, m.data.ne] as NavItem) : fallback.MARQUEE,
    PILLARS:       labels("pillars",       fallback.PILLARS),
    INTERESTS:     labels("interests",     fallback.INTERESTS),
    SUPPORT_ITEMS: labels("support_items", fallback.SUPPORT_ITEMS),
    METHOD:         pick<MethodItem>("method", fallback.METHOD),
    STATS:          pick<StatItem>("stats", fallback.STATS),
    PHASES:         pick<PhaseItem>("phases", fallback.PHASES),
    PARTNER_TYPES:  pick<PartnerType>("partner_types", fallback.PARTNER_TYPES),
    TAKE_PART:      pick<TakePartItem>("take_part", fallback.TAKE_PART),
    CHAPTERS:       pick<Chapter>("chapters", fallback.CHAPTERS),
    PROGRAM_BLOCKS: pick<ProgramBlock>("program_blocks", fallback.PROGRAM_BLOCKS),
    JOURNAL:        pick<JournalItem>("journal", fallback.JOURNAL),
    SUPPORT_MODELS: pick<SupportModel>("support_models", fallback.SUPPORT_MODELS),
    STORIES: stories,
    TEAM:           pick<TeamMember>("team", fallback.TEAM),
    GALLERY: galleryYears,
    PARTNERS: {
      lede: settings.partnersLede ?? fallback.PARTNERS.lede,
      note: settings.partnersNote ?? fallback.PARTNERS.note,
      groups: partnerGroups,
    },
    REFLECTION: {
      lede: settings.reflectionLede ?? fallback.REFLECTION.lede,
      note: settings.reflectionNote ?? fallback.REFLECTION.note,
      years,
    },
    sections,
  };
}

/* a section is on unless it has been explicitly switched off */
export const on = (sections: Record<string, boolean>, key: string) => sections[key] !== false;

/* Which switch, if any, decides whether a nav entry is offered. The
   page itself stays reachable by address — switching it off only
   stops the header and footer pointing at it. */
const NAV_TOGGLE: Record<string, string> = {
  journal:    "nav_journal",
  gallery:    "nav_gallery",
  reflection: "nav_reflection",
  support:    "nav_support",
  apply:      "nav_apply",
};

export const visibleNav = (sections: Record<string, boolean>, items: NavItem[]): NavItem[] =>
  items.filter(([, key]) => !NAV_TOGGLE[key] || on(sections, NAV_TOGGLE[key]));

/* ------------------------------------------------------------------
   The header tree, resolved.

   Our Journey and the Gallery are one page per year, and which years
   exist is content. So the menu is finished here, against the same
   rows the pages render from — add a year in the admin and it appears
   in the header, gets an address, and becomes a page, with nothing to
   change in the code.

   There is no "all years" entry above the list: each year is its own
   page now, and an index of an index is just another click.
   ------------------------------------------------------------------ */
/* newest first: someone opening the menu wants this year, not the first one */
export const byYearDesc = (a: string, b: string) => b.localeCompare(a, undefined, { numeric: true });

export const journeyYears = (c: SiteContent) =>
  c.REFLECTION.years.map((y) => String(y.year)).filter(Boolean).sort(byYearDesc);
export const galleryYears = (c: SiteContent) =>
  c.GALLERY.map((g) => String(g.year)).filter(Boolean).sort(byYearDesc);

export function headerNav(sections: Record<string, boolean>, content: SiteContent): NavNode[] {
  /* the years, captioned so they read as an archive rather than as more
     pages of the same kind as the one above them */
  const withHead = (list: NavChild[], head: string) =>
    list.map((c, i) => (i === 0 ? { ...c, head } : c));

  const dynamic: Record<string, NavChild[]> = {
    reflectionYears: withHead(
      journeyYears(content).map((y) => ({ label: y, key: "reflection", href: yearPath("reflection", y) })),
      "The record"),
    galleryYears: galleryYears(content).map((y) => ({ label: y, key: "gallery", href: yearPath("gallery", y) })),
  };

  return content.HEADER_NAV
    .map((node): NavNode => {
      /* static entries first, then whatever years exist — each still
         answering to its own visibility switch */
      const children = [...(node.children ?? []), ...(node.dynamic ? dynamic[node.dynamic] : [])]
        .filter((c) => !NAV_TOGGLE[c.key] || on(sections, NAV_TOGGLE[c.key]));

      if (children.length > 1) return { ...node, children };

      /* One entry is not a menu. A group that was written as a group
         dissolves back into its surviving member — "The Journey" with
         its years switched off is just The Program, and should say so.
         A node that was only ever a list of years keeps its own name. */
      if (children.length === 1) {
        const only = children[0];
        return node.children?.length
          ? { ...node, label: only.label, key: only.key, children: undefined, href: only.href }
          : { ...node, children: undefined, href: only.href };
      }
      return { ...node, children: undefined, empty: Boolean(node.dynamic) };
    })
    .filter((node) => !node.empty)
    .filter((node) => !NAV_TOGGLE[node.key] || on(sections, NAV_TOGGLE[node.key]));
}
