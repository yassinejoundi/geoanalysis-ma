import type { ExpertisePageContent } from "@/components/(public)/expertises/content";
import { SectionHeading } from "@/components/(public)/home/section-heading";
import { SiteRichText } from "@/components/site/site-rich-text";

export function ExpertiseApproachSections({ content }: { content: ExpertisePageContent }) {
  return (
    <section className="expertise-approach-section">
      <div className="expertise-approach-inner">
        <SectionHeading kicker={content.approachKicker} title={content.approachTitle} />
        <SiteRichText className="expertise-approach-lead" value={content.approachLead} />
        <ol className="expertise-approach-steps">
          {content.approachSteps.map((step, index) => (
            <li key={index}>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <SiteRichText className="expertise-step-description" value={step.description} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
