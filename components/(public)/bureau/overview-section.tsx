import Image from "next/image";
import { firmContentBlocks } from "@/lib/content/firm";
import { localize, type Locale } from "@/lib/i18n";

export function OverviewSection({
  locale,
  imageLabel,
}: {
  locale: Locale;
  imageLabel: string;
}) {
  const ariaLabel =
    locale === "fr" ? "Présentation du bureau" : "About the firm";
  const imageAlt =
    locale === "fr"
      ? "Équipe de terrain auprès d’un équipement de forage sur un site géologique"
      : "Field team working beside drilling equipment at a geological site";
  return (
    <section className="firm-overview" aria-label={ariaLabel}>
      <figure className="firm-overview-image">
        <Image
          alt={imageAlt}
          fill
          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1360px) calc((100vw - 96px) / 2), 632px"
          src="/firm-fieldwork.jpg"
        />
        <figcaption>{imageLabel}</figcaption>
      </figure>
      <div className="firm-content-blocks">
        {firmContentBlocks.map((block) => (
          <article className="firm-content-block" key={block.title.fr}>
            <h2>{localize(block.title, locale)}</h2>
            <p>{localize(block.description, locale)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
