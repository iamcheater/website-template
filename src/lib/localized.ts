import type { TranslatedText } from "@/api/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const filled = (value: string | undefined): string | undefined =>
  value?.trim() ? value : undefined;

export const pickLocalized = (
  value: TranslatedText | null | undefined,
  locale: Locale,
): string => filled(value?.[locale]) ?? filled(value?.[DEFAULT_LOCALE]) ?? "";
