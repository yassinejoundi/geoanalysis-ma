import type { BureauContent } from "./content";
import { ArticleRichText } from "@/components/site/article-rich-text";
import { parseArticleDocument } from "@/lib/content/article-document";

export function FirmStorySections({ content }: { content: BureauContent }) {
  return (
    <>
      <section
        className="firm-stages-section"
        id="firm-method"
        aria-labelledby="firm-stages-title">
        <div className="firm-story-inner">
          <header className="firm-story-heading">
            <p className="firm-story-eyebrow">{content.methodEyebrow}</p>
            <h2 id="firm-stages-title">{content.methodTitle}</h2>
            <div className="firm-story-lead firm-rich-content"><ArticleRichText document={parseArticleDocument(content.methodLead)} /></div>
          </header>
          <ol className="firm-stage-list">
            {content.stages.map((stage, index) => (
              <li key={index}>
                <span className="firm-story-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{stage.title}</h3>
                <div className="firm-stage-description firm-rich-content"><ArticleRichText document={parseArticleDocument(stage.description)} /></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
