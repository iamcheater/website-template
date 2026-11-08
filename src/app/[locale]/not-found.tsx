import { getTranslations } from "next-intl/server";
import { StatusPage } from "@/components/StatusPage";
import { Link } from "@/i18n/navigation";
import { PATHNAMES } from "@/lib/constants";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <StatusPage
      code={t("code")}
      title={t("title")}
      description={t("description")}
      action={
        <Link href={PATHNAMES.HOME} className="button button--primary">
          {t("action")}
        </Link>
      }
    />
  );
}
