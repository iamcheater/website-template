"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALES } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="locale-switcher" aria-label={t("label")}>
      <ul className="locale-switcher__list">
        {LOCALES.map((locale) => {
          const isCurrent = locale === currentLocale;

          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                lang={locale}
                hrefLang={locale}
                className={`locale-switcher__link${isCurrent ? " is-active" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {t(`locales.${locale}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
