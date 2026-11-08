import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as segmentLocale } from "next/root-params";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

const resolveLocale = (candidate: string | undefined): Locale =>
  hasLocale(LOCALES, candidate) ? candidate : DEFAULT_LOCALE;

export default getRequestConfig(async ({ locale: requested }) => {
  const locale = resolveLocale(requested ?? (await segmentLocale()));

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
