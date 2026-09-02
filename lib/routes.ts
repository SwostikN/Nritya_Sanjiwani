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
  reflection: "/reflection",
  program:    "/program",
  gallery:    "/gallery",
  journal:    "/journal",
  partner:    "/partner",
  support:    "/support",
  apply:      "/apply",
  contact:    "/contact",
};

export const PATH_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([k, v]) => [v, k])
);

export const pathFor = (key: string) => PAGE_PATHS[key] ?? "/";
export const keyFor  = (path: string) => PATH_KEYS[path] ?? "404";

/* the page titles from titleFor() in the original */
export const PAGE_TITLES: Record<string, string> = {
  story:      "Our Story",
  reflection: "Our Journey",
  program:    "The Program",
  gallery:    "Gallery",
  journal:    "Journal",
  partner:    "Partner With Us",
  support:    "Support",
  apply:      "Join the Journey",
  contact:    "Contact",
  "404":      "Not found",
};

export const titleFor = (key: string) =>
  key === "home"
    ? "Nritya Sanjiwani — Healing Through Kathak"
    : `${PAGE_TITLES[key] ?? key} · Nritya Sanjiwani`;
