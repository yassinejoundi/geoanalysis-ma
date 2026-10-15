"use client";

import { ArticleRichTextEditor } from "@/components/(admin)/editorial/article-rich-text-editor";
import { ArticleRichText } from "@/components/site/article-rich-text";
import { parseArticleDocument } from "@/lib/content/article-document";

export function AdminRichTextField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="admin-field admin-rich-text-field">
      <span id={`${id}-label`}>{label}</span>
      <ArticleRichTextEditor
        value={value}
        onChange={onChange}
        labelId={`${id}-label`}
        helpId={`${id}-help`}
      />
      <span id={`${id}-help`} className="visually-hidden">Texte avec mise en forme, titres, citations et listes.</span>
    </div>
  );
}

export function AdminRichTextPreview({ value, compact = false }: { value: string; compact?: boolean }) {
  return (
    <div className={`admin-rich-text-preview${compact ? " admin-rich-text-preview-compact" : ""}`}>
      <ArticleRichText document={parseArticleDocument(value)} />
    </div>
  );
}
