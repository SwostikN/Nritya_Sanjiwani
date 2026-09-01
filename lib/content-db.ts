/* ============================================================
   Reads the site's content from Supabase and reassembles it into
   exactly the shapes the components already expect, so the page
   code did not have to change when the CMS arrived.

   If Supabase is not configured, or a collection is empty (before
   the seed runs), it falls back to lib/content.ts. That means the
   site is never blank — a half-migrated database still renders.
   ============================================================ */
import { createClient } from "@supabase/supabase-js";
import * as fallback from "./content";
import type {
  GalleryGroup, JournalItem, MethodItem, PhaseItem, StatItem, PartnerType,
  TakePartItem, Chapter, ProgramBlock, SupportModel, PartnersData, ReflectionData,
  NavItem, PartnerItem, TimelineEvent, LearnedItem, ReflectionYear,
} from "./content";

interface Row { data: Record<string, any>; sort: number }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function load(): Promise<{ rows: Record<string, Row[]>; settings: Record<string, any>; sections: Record<string, boolean> }> {
  if (!url || !key) return { rows: {}, settings: {}, sections: {} };
  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const [{ data: content }, { data: settings }] = await Promise.all([
      sb.from("collections").select("collection,data,sort").eq("published", true).order("sort"),
      sb.from("site_settings").select("key,value"),
    ]);
    const rows: Record<string, Row[]> = {};
    for (const r of content ?? []) (rows[r.collection] ||= []).push({ data: r.data, sort: r.sort });
    const byKey = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));
    return { rows, settings: byKey.site ?? {}, sections: byKey.sections ?? {} };
  } catch {
    return { rows: {}, settings: {}, sections: {} };
  }
}

const pick = <T,>(rows: Row[] | undefined, fb: T[]): T[] =>
  rows && rows.length ? (rows.map((r) => r.data) as T[]) : fb;

export interface SiteContent {
  SITE: typeof fallback.SITE;
  NAV: NavItem[]; FOOTER_NAV: NavItem[]; MARQUEE: NavItem[];
  PILLARS: string[]; METHOD: MethodItem[]; STATS: StatItem[]; PHASES: PhaseItem[];
  PARTNER_TYPES: PartnerType[]; TAKE_PART: TakePartItem[]; CHAPTERS: Chapter[];
  PROGRAM_BLOCKS: ProgramBlock[]; GALLERY: GalleryGroup[]; JOURNAL: JournalItem[];
  INTERESTS: string[]; SUPPORT_ITEMS: string[]; SUPPORT_MODELS: SupportModel[];
  REFLECTION: ReflectionData; PARTNERS: PartnersData;
  sections: Record<string, boolean>;
}

export async function getContent(): Promise<SiteContent> {
  const { rows, settings, sections } = await load();

  /* gallery: groups carry their images */
  const galleryGroups = rows.gallery_groups?.length
    ? rows.gallery_groups.map((g): GalleryGroup => ({
        title: g.data.title, deva: g.data.deva, cols: Number(g.data.cols) || 3, consent: !!g.data.consent,
        items: (rows.gallery_items ?? [])
          .filter((i) => i.data.group === g.data.title)
          .map((i) => ({ img: i.data.img, cap: i.data.cap, alt: i.data.alt, r: i.data.r, slot: !!i.data.slot })),
      }))
    : fallback.GALLERY;

  /* partners: groups carry their organisations */
  const partnerGroups = rows.partner_groups?.length
    ? rows.partner_groups.map((g) => ({
        label: g.data.label as string,
        items: (rows.partners ?? [])
          .filter((p) => p.data.group === g.data.label)
          .map((p): PartnerItem => ({ name: p.data.name, role: p.data.role, logo: p.data.logo, url: p.data.url })),
      }))
    : fallback.PARTNERS.groups;

  /* looking back: years carry their figures, events and lessons */
  const years: ReflectionYear[] = rows.reflection_years?.length
    ? rows.reflection_years.map((y) => ({
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
      social: Object.keys(social).length ? social : fallback.SITE.social,
    },
    NAV: fallback.NAV,
    FOOTER_NAV: fallback.FOOTER_NAV,
    MARQUEE: rows.marquee?.length ? rows.marquee.map((m) => [m.data.en, m.data.ne] as NavItem) : fallback.MARQUEE,
    PILLARS:       rows.pillars?.length       ? rows.pillars.map((p) => p.data.label as string)       : fallback.PILLARS,
    INTERESTS:     rows.interests?.length     ? rows.interests.map((p) => p.data.label as string)     : fallback.INTERESTS,
    SUPPORT_ITEMS: rows.support_items?.length ? rows.support_items.map((p) => p.data.label as string) : fallback.SUPPORT_ITEMS,
    METHOD:         pick<MethodItem>(rows.method, fallback.METHOD),
    STATS:          pick<StatItem>(rows.stats, fallback.STATS),
    PHASES:         pick<PhaseItem>(rows.phases, fallback.PHASES),
    PARTNER_TYPES:  pick<PartnerType>(rows.partner_types, fallback.PARTNER_TYPES),
    TAKE_PART:      pick<TakePartItem>(rows.take_part, fallback.TAKE_PART),
    CHAPTERS:       pick<Chapter>(rows.chapters, fallback.CHAPTERS),
    PROGRAM_BLOCKS: pick<ProgramBlock>(rows.program_blocks, fallback.PROGRAM_BLOCKS),
    JOURNAL:        pick<JournalItem>(rows.journal, fallback.JOURNAL),
    SUPPORT_MODELS: pick<SupportModel>(rows.support_models, fallback.SUPPORT_MODELS),
    GALLERY: galleryGroups,
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
