import { BrandLogo } from "@/components/shared/brand-logo";
import { SocialLinks } from "@/components/site/social-links";
import { expertises } from "@/lib/content/site";
import type { adminSettings } from "@/lib/content/admin";
import { localize, type Locale } from "@/lib/i18n";
import Link from "next/link";

type SiteSettings = Pick<typeof adminSettings, "siteName" | "address" | "logo" | "logoInverse" | "linkedin" | "facebook" | "instagram">;

export function SiteFooter({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const isFrench = locale === "fr";
  const columns = [
    {
      title: isFrench ? "Expertises" : "Expertise",
      links: expertises.map((item) => ({
        label: localize(item.name, locale),
        href: `/${locale}/expertises/${item.slug}`,
      })),
    },
    {
      title: isFrench ? "Bureau" : "Firm",
      links: [
        {
          label: isFrench ? "Le Bureau" : "The Firm",
          href: `/${locale}/bureau`,
        },
        {
          label: isFrench ? "Réalisations" : "Projects",
          href: `/${locale}/realisations`,
        },
      ],
    },
    {
      title: isFrench ? "Ressources" : "Resources",
      links: [
        {
          label: isFrench ? "Actualités" : "News",
          href: `/${locale}/actualites`,
        },
        { label: "Articles", href: `/${locale}/articles` },
        { label: "Contact", href: `/${locale}/contact` },
      ],
    },
  ];

  return (
    <>
      <section
        className="site-conversion"
        aria-labelledby="site-conversion-title">
        <div className="site-conversion-inner">
          <div className="site-conversion-copy">
            <p className="site-conversion-eyebrow">
              {isFrench ? "Démarrer une mission" : "Start a project"}
            </p>
            <h2 id="site-conversion-title">
              {isFrench ? (
                <>
                  Un projet, une problématique
                  <span> de terrain ?</span>
                </>
              ) : (
                <>
                  A project or a problem
                  <span> in the field?</span>
                </>
              )}
            </h2>
            <p className="site-conversion-description">
              {isFrench
                ? "Partagez-nous votre contexte. Nous vous proposons une première lecture technique, une méthode et un cadrage budgétaire."
                : "Share your context. We will provide an initial technical assessment, a proposed method and a budget outline."}
            </p>
          </div>
          <div className="site-conversion-panel">
            <h3
              className="site-conversion-panel-title"
              id="site-conversion-panel-title">
              {isFrench ? "Notre engagement" : "Our commitment"}
            </h3>
            <ul
              className="site-conversion-promises"
              aria-labelledby="site-conversion-panel-title">
              <li>{isFrench ? "Échange confidentiel" : "Confidential discussion"}</li>
              <li>
                {isFrench ? "Réponse sous 5 jours ouvrés" : "Reply within 5 working days"}
              </li>
            </ul>
            <div className="site-conversion-actions">
              <Link href={`/${locale}/contact#contact-form-title`}>
                {isFrench ? "Parler de votre projet" : "Discuss your project"}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href={`/${locale}/expertises`}>
                {isFrench ? "Nos expertises" : "Our expertise"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-grid">
            <div className="site-footer-brand">
              <BrandLogo locale={locale} settings={settings} compact white />
              <p className="site-footer-statement">
                {isFrench
                  ? "Lire le terrain. Éclairer la décision."
                  : "Read the terrain. Inform the decision."}
              </p>
              <p className="site-footer-description">
                {isFrench
                  ? `Bureau d’études en géologie, géophysique et environnement. ${settings.address}.`
                  : `Consulting firm in geology, geophysics and environment. ${settings.address}.`}
              </p>
              <SocialLinks
                locale={locale}
                settings={settings}
                className="site-footer-social-links"
              />
            </div>
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="site-footer-bottom">
            <span>© 2026 {settings.siteName}</span>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
