import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ScrollReveal } from "@/components/site/scroll-reveal";
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
      <ScrollReveal />
      <div className="site-content" id="contenu-principal" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter locale={lang} />
      <a
        className="whatsapp-float"
        href="https://wa.me/212524000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          lang === "fr"
            ? "Contacter GEOANALYSIS sur WhatsApp"
            : "Contact GEOANALYSIS on WhatsApp"
        }>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path
            d="M20 11.4a8 8 0 0 1-11.8 7L4 19.5l1.1-4A8 8 0 1 1 20 11.4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8.7 8.4c.2-.4.5-.5.8-.5h.4c.1 0 .3 0 .4.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.4.8 1.1 1.5 1.9 1.9.2.1.4.1.5 0l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .3-.1 1.1-.8 1.6-.5.4-1.2.5-2 .2-1.2-.4-2.5-1.2-3.6-2.3s-1.8-2.3-2.1-3.4c-.2-.8 0-1.4.3-1.7Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </>
  );
}
