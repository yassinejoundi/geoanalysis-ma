import type { BureauContent } from "./content";
import { ArticleRichText } from "@/components/site/article-rich-text";
import { parseArticleDocument } from "@/lib/content/article-document";

export function ValuesSection({
  content,
  title,
}: {
  content: BureauContent;
  title: string;
}) {
  return (
    <section className="firm-values" aria-labelledby="firm-values-title">
      <div className="firm-values-inner">
        <h2 id="firm-values-title">{title}</h2>
        <ul>
          {content.values.map((value, index) => (
            <li key={index}>
              <span className="firm-value-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{value.title}</h3>
              <div className="firm-value-description firm-rich-content"><ArticleRichText document={parseArticleDocument(value.description)} /></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
