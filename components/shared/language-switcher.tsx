"use client";

import { articles, expertises, news, projects } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";

const detailRoutes = [
  ["expertises", expertises],
  ["realisations", projects],
  ["actualites", news],
  ["articles", articles],
] as const;

function localeHref(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  segments[0] = locale;

  if (segments.length === 3) {
    const route = detailRoutes.find(([name]) => name === segments[1]);
    const record = route?.[1].find(({ slug }) => slug === segments[2]);
    if (record) segments[2] = record.slug;
  }

  return `/${segments.join("/")}`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <nav className="language-switcher" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
      {(["fr", "en"] as const).map((code) => (
        <Link key={code} href={localeHref(pathname, code)} hrefLang={code} lang={code} aria-current={locale === code ? "page" : undefined}>
          {code.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
