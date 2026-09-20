import type { Metadata } from "next";
import { ContactDetailsSection } from "@/components/(public)/contact/contact-details-section";
import { ContactForm } from "@/components/(public)/contact/contact-form";
import { contactPageCopy } from "@/components/(public)/contact/content";
import { PageHero } from "@/components/site/page-hero";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${contactPageCopy[lang].title} | GEOANALYSIS`,
    description: contactPageCopy[lang].description,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = contactPageCopy[lang];

  return (
    <main className="contact-page">
      <PageHero kicker={copy.kicker} title={copy.title} />
      <section className="contact-layout" aria-label={copy.title}>
        <ContactForm locale={lang} />
        <ContactDetailsSection locale={lang} />
      </section>
    </main>
  );
}
