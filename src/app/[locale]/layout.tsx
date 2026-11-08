import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locale as segmentLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MAIN_CONTENT_ID } from "@/components/constants";
import { routing } from "@/i18n/routing";
import { OPEN_GRAPH_TYPE } from "@/lib/constants";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site-url";
import "@/styles/main.scss";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    metadataBase: SITE_URL,
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: OPEN_GRAPH_TYPE,
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await segmentLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("a11y");

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <NextIntlClientProvider>
          <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
            {t("skipToContent")}
          </a>
          <SiteHeader />
          <main id={MAIN_CONTENT_ID} className="site-main">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
