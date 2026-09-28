import type { Metadata } from "next";
import { ContactDetailsSection } from "@/components/(public)/contact/contact-details-section";
import { ContactForm } from "@/components/(public)/contact/contact-form";
import { contactPageCopy } from "@/components/(public)/contact/content";
import { isLocale } from "@/lib/i18n";
import { getPublicSettings } from "@/lib/server/data/admin";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: contactPageCopy[lang].title,
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
  const settings = await getPublicSettings();

  return (
    <main className="contact-page">
      <header className="contact-intro" aria-labelledby="contact-title">
        <div className="contact-intro-inner">
          <div className="contact-intro-copy">
            <p className="contact-kicker">{copy.kicker}</p>
            <h1 id="contact-title">{copy.title}</h1>
            <p className="contact-intro-description">{copy.description}</p>
          </div>
          <div className="contact-intro-visual" aria-hidden="true">
            <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-10 245C75 207 81 166 145 173C206 180 216 232 282 218C356 202 354 128 424 132C468 135 491 160 520 145" />
              <path d="M-12 218C66 184 94 140 149 148C207 156 222 205 282 192C342 180 365 105 425 107C467 108 493 131 519 116" />
              <path d="M-14 190C65 158 105 114 154 122C209 131 227 177 284 166C338 156 377 81 428 82C470 82 494 103 519 89" />
              <path d="M-14 161C64 131 114 88 158 97C211 106 233 150 287 139C336 129 387 58 432 58C471 58 495 76 519 63" />
              <path d="M-12 132C65 104 123 63 163 71C214 81 240 122 291 112C337 103 398 35 437 34C472 33 495 49 519 37" />
              <path d="M-7 104C70 77 133 39 169 47C218 57 247 94 297 85C342 77 408 12 441 10C474 8 497 22 519 11" />
              <path d="M-2 76C78 50 144 16 176 23C224 33 257 67 304 59C348 52 419-11 447-14C479-17 499-5 520-14" />
              <circle cx="326" cy="138" r="58" />
              <circle cx="326" cy="138" r="36" />
              <circle cx="326" cy="138" r="7" />
              <path d="M326 66V100M326 176V210M254 138H288M364 138H398" />
            </svg>
            <span className="contact-visual-label">{copy.visualLabel}</span>
          </div>
        </div>
      </header>
      <section className="contact-layout" aria-label={copy.title}>
        <div className="contact-form-panel">
          <header className="contact-panel-heading">
            <p className="contact-panel-kicker">01 / {copy.formKicker}</p>
            <h2 id="contact-form-title">{copy.formTitle}</h2>
            <p>{copy.formDescription}</p>
          </header>
          <ContactForm locale={lang} />
        </div>
        <ContactDetailsSection locale={lang} settings={settings} />
      </section>
    </main>
  );
}
