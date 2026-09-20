import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { isLocale, locales } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <a className="skip-link" href="#contenu-principal">
        {lang === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SiteHeader locale={lang} />
      <div className="site-content" id="contenu-principal" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter locale={lang} />
    </>
  );
}
