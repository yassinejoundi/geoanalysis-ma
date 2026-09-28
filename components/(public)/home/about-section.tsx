import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { SectionHeading } from "./section-heading";

export function AboutSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  return (
    <section className="home-about home-section">
      <div className="home-about-copy">
        <SectionHeading
          kicker={content.aboutKicker}
          title={content.aboutTitle}
        />
        <p className="home-about-lead">{content.about}</p>
        <p className="home-body-copy">{content.about2}</p>
        <Link className="home-text-link" href={`/${locale}/bureau`}>
          {content.discover} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <figure className="home-about-visual">
        <Image
          src={content.aboutImage}
          alt={content.aboutImageAlt}
          fill
          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1360px) 48vw, 640px"
        />
        <figcaption>
          <span>{content.aboutImageCaption}</span>
          <span>{content.aboutImageLocation}</span>
        </figcaption>
      </figure>
    </section>
  );
}
