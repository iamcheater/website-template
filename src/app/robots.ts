import type { MetadataRoute } from "next";
import {
  ROBOTS_ALL_USER_AGENTS,
  ROBOTS_ALLOW_ALL,
  ROBOTS_DISALLOWED,
  SITEMAP_FILE,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: ROBOTS_ALL_USER_AGENTS,
      allow: ROBOTS_ALLOW_ALL,
      disallow: ROBOTS_DISALLOWED,
    },
    sitemap: new URL(SITEMAP_FILE, SITE_URL).toString(),
  };
}
