import type { Locale } from "@/lib/i18n";

const messages = {
  projects: {
    fr: "Aucune réalisation documentée n’est publiée pour le moment.",
    en: "No documented project profiles are published yet.",
  },
  news: {
    fr: "Aucune actualité vérifiée n’est publiée pour le moment.",
    en: "No verified news items are published yet.",
  },
  articles: {
    fr: "Les articles seront publiés ici après validation de leurs sources.",
    en: "Articles will appear here once their sources are verified.",
  },
} as const;

export function PublicContentEmptyState({
  kind,
  locale,
}: {
  kind: keyof typeof messages;
  locale: Locale;
}) {
  return <p className="public-content-empty">{messages[kind][locale]}</p>;
}
