import type { HomeContent } from "./content";
import { SectionHeading } from "./section-heading";
import { SiteRichText } from "@/components/site/site-rich-text";

export function ProcessSection({ content }: { content: HomeContent }) {
  return (
    <section className="home-section home-process">
      <SectionHeading
        kicker={content.methodKicker}
        title={content.methodTitle}
      />
      <ol className="home-steps">
        {content.steps.map(([number, title, body], index) => (
          <li key={index}>
            <span>{number}</span>
            <h3>{title}</h3>
            <SiteRichText className="home-step-description" value={body} />
          </li>
        ))}
      </ol>
    </section>
  );
}
