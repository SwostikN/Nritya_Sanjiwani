/* ============================================================
   ROUTES — the v2 file used a hash router (#/story). This maps
   the same page keys onto real Next.js paths, so `data-go="story"`
   keeps working everywhere in the ported markup while the URL
   becomes /story — crawlable, and able to carry its own <title>,
   description and OG image (PRD §15 SEO).
   ============================================================ */
export const PAGE_PATHS: Record<string, string> = {
  home:       "/",
  story:      "/story",
  team:       "/team",
  reflection: "/reflection",
  program:    "/program",
  gallery:    "/gallery",
  journal:    "/journal",
  partner:    "/partner",
  support:    "/support",
  apply:      "/apply",
};

export const PATH_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([k, v]) => [v, k])
);

export const pathFor = (key: string) => PAGE_PATHS[key] ?? "/";

/* Our Journey and the Gallery are one page per year — /reflection/2025,
   /gallery/2025 — so a path may sit one segment under the page it
   belongs to. Falling back to the parent segment is what keeps the
   header lit and the title right on a year page. */
export const keyFor = (path: string) => {
  if (PATH_KEYS[path]) return PATH_KEYS[path];
  const parent = path.slice(0, path.lastIndexOf("/"));
  return PATH_KEYS[parent || "/"] ?? "404";
};

/* the address of one year of a year-wise page */
export const yearPath = (key: string, year: string) =>
  `${pathFor(key)}/${encodeURIComponent(String(year).trim())}`;

/* the page titles from titleFor() in the original */
export const PAGE_TITLES: Record<string, string> = {
  story:      "Our Story",
  team:       "Our Team",
  reflection: "Our Journey",
  program:    "The Program",
  gallery:    "Gallery",
  journal:    "Journal",
  partner:    "Partner With Us",
  support:    "Support",
  apply:      "Join the Journey",
  "404":      "Not found",
};

export const titleFor = (key: string) =>
  key === "home"
    ? "Nritya Sanjiwani — Healing Through Kathak"
    : `${PAGE_TITLES[key] ?? key} · Nritya Sanjiwani`;
