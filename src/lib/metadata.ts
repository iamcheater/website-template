import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import type { Pathname } from "./constants";
import { absoluteUrl, localeAlternates } from "./site-url";

export const pageAlternates = (
  pathname: Pathname,
  locale: Locale,
): Metadata["alternates"] => ({
  canonical: absoluteUrl(pathname, locale),
  languages: localeAlternates(pathname),
});
