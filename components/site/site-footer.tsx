import { BrandLogo } from "@/components/shared/brand-logo";
import { expertises } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";
import Link from "next/link";

export function SiteFooter({ locale }: { locale: Locale }) {
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
          label: isFrench ? "Méthodes & Technologies" : "Methods & Technology",
          href: `/${locale}/methodes-technologies`,
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
                ? "Partagez-nous votre contexte. Sous 5 jours ouvrés, nous vous proposons une première lecture technique, une méthode et un cadrage budgétaire."
                : "Share your context. Within 5 working days, we will provide an initial technical assessment, a method and a budget outline."}
            </p>
            <ul className="site-conversion-promises" aria-label={isFrench ? "Notre engagement" : "Our commitment"}>
              <li>{isFrench ? "Échange confidentiel" : "Confidential discussion"}</li>
              <li>{isFrench ? "Réponse sous 5 jours" : "Reply within 5 days"}</li>
            </ul>
          </div>
          <div className="site-conversion-actions">
            <Link href={`/${locale}/contact`}>
              {isFrench ? "Parler de votre projet" : "Discuss your project"}
            </Link>
            <Link href={`/${locale}/expertises`}>
              {isFrench ? "Nos expertises" : "Our expertise"}
            </Link>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-grid">
            <div className="site-footer-brand">
              <BrandLogo locale={locale} compact />
              <p className="site-footer-statement">
                {isFrench
                  ? "Lire le terrain. Éclairer la décision."
                  : "Read the terrain. Inform the decision."}
              </p>
              <p className="site-footer-description">
                {isFrench
                  ? "Bureau d’études en géologie, géophysique et environnement. Marrakech, Maroc."
                  : "Consulting firm in geology, geophysics and environment. Marrakech, Morocco."}
              </p>
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
            <span>© 2026 GEOANALYSIS · Marrakech, Maroc</span>
            <Link href={`/${locale}/design-system`}>Design System</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
