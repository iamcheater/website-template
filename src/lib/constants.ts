export const PATHNAMES = {
  HOME: "/",
} as const;

export type Pathname = (typeof PATHNAMES)[keyof typeof PATHNAMES];

export const SITEMAP_PATHNAMES: readonly Pathname[] = Object.values(PATHNAMES);

export const LOCAL_SITE_URL = "http://localhost:3001";

export const X_DEFAULT_HREFLANG = "x-default";

export const ROBOTS_ALLOW_ALL = "/";
export const ROBOTS_DISALLOWED = ["/api/"];
export const ROBOTS_ALL_USER_AGENTS = "*";
export const SITEMAP_FILE = "/sitemap.xml";

export const OPEN_GRAPH_TYPE = "website";
