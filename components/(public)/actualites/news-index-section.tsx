import { EditorialCard } from "@/components/site/editorial-card";
import type { EditorialEntry } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";

export function NewsIndexSection({
  entries,
  locale,
}: {
  entries: EditorialEntry[];
  locale: Locale;
}) {
  return (
    <section className="editorial-index-section">
      <div className="editorial-index-grid editorial-index-grid-news">
        {entries.map((entry) => (
          <EditorialCard
            key={entry.id}
            entry={entry}
            locale={locale}
            kind="actualites"
          />
        ))}
      </div>
    </section>
  );
}
