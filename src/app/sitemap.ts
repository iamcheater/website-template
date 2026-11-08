import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { SITEMAP_PATHNAMES } from "@/lib/constants";
import { absoluteUrl, localeAlternates } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHNAMES.flatMap((pathname) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(pathname, locale),
      alternates: { languages: localeAlternates(pathname) },
    })),
  );
}
