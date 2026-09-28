import type { ExpertisePageContent } from "@/components/(public)/expertises/content";
import { SectionHeading } from "@/components/(public)/home/section-heading";

export function ExpertiseApproachSections({ content }: { content: ExpertisePageContent }) {
  return (
    <section className="expertise-approach-section">
      <div className="expertise-approach-inner">
        <SectionHeading kicker={content.approachKicker} title={content.approachTitle} />
        <p className="expertise-approach-lead">{content.approachLead}</p>
        <ol className="expertise-approach-steps">
          {content.approachSteps.map((step, index) => (
            <li key={index}>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
