import { EditorialCard } from "@/components/site/editorial-card";
import type { EditorialEntry } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";

export function ArticleIndexSection({ entries, locale, readLabel }: { entries: EditorialEntry[]; locale: Locale; readLabel: string }) {
  return (
    <section className="editorial-index-section">
      <div className="editorial-index-grid editorial-index-grid-articles">
        {entries.map((entry) => <EditorialCard key={entry.id} entry={entry} locale={locale} kind="articles" readLabel={readLabel} />)}
      </div>
    </section>
  );
}
