import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHNAMES } from "@/lib/constants";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function SiteHeader() {
  const t = await getTranslations("brand");

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href={PATHNAMES.HOME} className="site-header__brand">
          {t("name")}
        </Link>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
