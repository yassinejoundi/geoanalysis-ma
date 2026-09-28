import Link from "next/link";
import Image from "next/image";
import { expertises } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";
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
          {content.expertiseCards.map((item, index) => {
            const expertise = expertises.find(({ id }) => id === item.id)!;
            return (
              <Link
                className="home-expertise-card"
                href={`/${locale}/expertises/${expertise.slug}`}
                key={item.id}>
                <span className="home-expertise-image">
                  <Image
                    alt={item.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 760px) calc(50vw - 30px), (max-width: 1200px) calc((92vw - 40px) / 3), (max-width: 1360px) calc((100vw - 136px) / 3), 408px"
                    src={item.image}
                  />
                </span>
                <span className="home-card-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                <span className="home-tags">
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex}>{tag}</span>
                  ))}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
