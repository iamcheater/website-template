"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { StatusPage } from "@/components/StatusPage";

interface LocaleErrorProps {
  error: unknown;
  retry: () => void;
}

export default function LocaleError({ error, retry }: LocaleErrorProps) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      title={t("title")}
      description={t("description")}
      action={
        <button type="button" className="button button--primary" onClick={retry}>
          {t("action")}
        </button>
      }
    />
  );
}
