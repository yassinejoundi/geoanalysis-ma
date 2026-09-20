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
      <aside
        className="site-conversion"
        aria-labelledby="site-conversion-title">
        <div className="site-conversion-inner">
          <div>
            <h2 id="site-conversion-title">
              {isFrench
                ? "Un projet, une problématique de terrain ?"
                : "A project or a field problem to solve?"}
            </h2>
            <p>
              {isFrench
                ? "Décrivez votre contexte : nous revenons vers vous avec une proposition méthodologique et un cadrage budgétaire sous 5 jours ouvrés."
                : "Describe your context: we come back within 5 working days with a methodological proposal and a budget outline."}
            </p>
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
      </aside>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-grid">
            <div>
              <BrandLogo locale={locale} compact />
              <p>
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
            <Link href={`/${locale}/design-system`}>Design System ↗</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
