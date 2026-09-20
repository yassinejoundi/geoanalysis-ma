import { firmContentBlocks } from "@/lib/content/firm";
import { localize, type Locale } from "@/lib/i18n";

export function OverviewSection({ locale, imageLabel }: { locale: Locale; imageLabel: string }) {
  const ariaLabel = locale === "fr" ? "Présentation du bureau" : "About the firm";
  return <section className="firm-overview" aria-label={ariaLabel}><div className="firm-image-placeholder" aria-hidden="true">{imageLabel}</div><div className="firm-content-blocks">{firmContentBlocks.map((block) => <article className="firm-content-block" key={block.title.fr}><h2>{localize(block.title, locale)}</h2><p>{localize(block.description, locale)}</p></article>)}</div></section>;
}
