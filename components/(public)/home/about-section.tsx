import Link from "next/link";
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
      <div>
        <SectionHeading
          kicker={content.aboutKicker}
          title={content.aboutTitle}
        />
        <Link className="home-text-link" href={`/${locale}/bureau`}>
          {content.discover} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div>
        <p className="home-about-lead">{content.about}</p>
        <p className="home-body-copy">{content.about2}</p>
        <ul className="home-pillars">
          {content.pillars.map(([title, body]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
