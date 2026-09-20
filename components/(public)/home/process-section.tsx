import type { HomeContent } from "./content";
import { SectionHeading } from "./section-heading";

export function ProcessSection({ content }: { content: HomeContent }) {
  return (
    <section className="home-section home-process">
      <SectionHeading
        kicker={content.methodKicker}
        title={content.methodTitle}
      />
      <ol className="home-steps">
        {content.steps.map(([number, title, body]) => (
          <li key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
