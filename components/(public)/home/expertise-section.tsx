import Link from "next/link";
import Image from "next/image";
import { expertises } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { SectionHeading } from "./section-heading";

export function ExpertiseSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  return (
    <section className="home-band">
      <div className="home-section-inner">
        <SectionHeading kicker={content.expertise} title={content.expTitle} />
        <p className="home-section-lead">{content.expDesc}</p>
        <div className="home-expertise-grid">
          {expertises.map((item) => (
            <Link
              className="home-expertise-card"
              href={`/${locale}/expertises/${item.slug}`}
              key={item.id}>
              <span className="home-expertise-image">
                <Image
                  alt={localize(item.image.alt, locale)}
                  fill
                  loading="lazy"
                  sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 760px) calc(50vw - 30px), (max-width: 1200px) calc((92vw - 40px) / 3), (max-width: 1360px) calc((100vw - 136px) / 3), 408px"
                  src={item.image.src}
                />
              </span>
              <span className="home-card-number">{item.number}</span>
              <h3>{localize(item.name, locale)}</h3>
              <p>{localize(item.summary, locale)}</p>
              <span className="home-tags">
                {item.subServices.slice(0, 3).map((service) => (
                  <span key={service.name.fr}>
                    {localize(service.name, locale)}
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
