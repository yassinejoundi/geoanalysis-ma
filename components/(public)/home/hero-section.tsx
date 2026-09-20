import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { HeroRocks } from "./hero-rocks";

export function HeroSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  return (
    <section className="home-hero">
      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <p className="home-kicker">{content.kicker}</p>
          <h1>{content.hero}</h1>
          <p className="home-hero-subtitle">{content.sub}</p>
          <p className="home-lead">{content.intro}</p>
          <div className="home-actions">
            <Link
              className="home-primary-action"
              href={`/${locale}/expertises`}>
              {content.expertise}
            </Link>
            <Link className="home-secondary-action" href={`/${locale}/contact`}>
              {content.talk}
            </Link>
          </div>
        </div>
        <HeroRocks />
        <dl className="home-stats">
          {content.stats.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
