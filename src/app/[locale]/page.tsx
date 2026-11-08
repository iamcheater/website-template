import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PATHNAMES } from "@/lib/constants";
import { pageAlternates } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: pageAlternates(PATHNAMES.HOME, await getLocale()) };
}

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <section className="section">
      <div className="container">
        <h1>{t("title")}</h1>
        <p className="lead">{t("description")}</p>
      </div>
    </section>
  );
}
