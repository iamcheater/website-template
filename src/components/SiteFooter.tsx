import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__rights">
          {t("footer.rights", { siteName: t("brand.name") })}
        </p>
      </div>
    </footer>
  );
}
