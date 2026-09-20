export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localize<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale];
}

export function localizedHref(locale: Locale, path = ""): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || `/${locale}`;
}
