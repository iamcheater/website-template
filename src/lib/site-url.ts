import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";
import { getPathname } from "@/i18n/navigation";
import {
  LOCAL_SITE_URL,
  X_DEFAULT_HREFLANG,
  type Pathname,
} from "./constants";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || LOCAL_SITE_URL,
);

export const absoluteUrl = (pathname: Pathname, locale: Locale): string =>
  new URL(getPathname({ href: pathname, locale }), SITE_URL).toString();

export const localeAlternates = (pathname: Pathname) => ({
  ...Object.fromEntries(
    LOCALES.map((locale) => [locale, absoluteUrl(pathname, locale)]),
  ),
  [X_DEFAULT_HREFLANG]: absoluteUrl(pathname, DEFAULT_LOCALE),
});
