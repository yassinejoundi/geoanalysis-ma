import { ArticleRichText } from "@/components/site/article-rich-text";
import { parseArticleDocument } from "@/lib/content/article-document";

export function SiteRichText({ value, className = "" }: { value: string; className?: string }) {
  return (
    <div className={`site-rich-content${className ? ` ${className}` : ""}`}>
      <ArticleRichText document={parseArticleDocument(value)} />
    </div>
  );
}
