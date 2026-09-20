import { designSystemCopy } from "./content";
import type { Locale } from "@/lib/i18n";

const colors = [
  ["--brand", "brand"],
  ["--brand-hover", "brand-hover"],
  ["--foreground", "foreground"],
  ["--muted", "muted"],
  ["--background", "background"],
  ["--surface-soft", "surface-soft"],
  ["--surface", "surface"],
  ["--surface-green", "surface-green"],
] as const;

const spacing = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export function DesignSystemSections({ locale }: { locale: Locale }) {
  const copy = designSystemCopy[locale];
  const samples = [
    "design-system-type-display",
    "design-system-type-heading",
    "design-system-type-subheading",
    "design-system-type-body",
    "design-system-type-label",
  ];

  return (
    <div className="design-system-sections">
      <section
        className="design-system-section"
        aria-labelledby="design-system-colors">
        <h2 id="design-system-colors">{copy.colors}</h2>
        <div className="design-system-color-grid">
          {colors.map(([token, className], index) => (
            <article className="design-system-color-card" key={token}>
              <div
                className={`design-system-color-swatch design-system-color-${className}`}
                aria-hidden="true"
              />
              <div className="design-system-color-copy">
                <h3>{copy.colorNames[index]}</h3>
                <p className="design-system-token">{token}</p>
                <p>{copy.colorUses[index]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="design-system-section"
        aria-labelledby="design-system-typography">
        <h2 id="design-system-typography">{copy.typography}</h2>
        <div className="design-system-type-list">
          {copy.typeSamples.map((sample, index) => (
            <div className="design-system-type-specimen" key={samples[index]}>
              <p className="design-system-specimen-label">
                {copy.typeLabels[index]}
              </p>
              <p className={samples[index]}>{sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="design-system-section"
        aria-labelledby="design-system-buttons">
        <h2 id="design-system-buttons">{copy.buttons}</h2>
        <div className="design-system-button-list">
          {copy.buttonLabels.map((label, index) => (
            <span
              className={`design-system-button design-system-button-${index}`}
              key={label}>
              {label}
            </span>
          ))}
        </div>
      </section>

      <section
        className="design-system-section"
        aria-labelledby="design-system-spacing">
        <h2 id="design-system-spacing">{copy.spacing}</h2>
        <div className="design-system-spacing-list">
          {copy.spacingLabels.map((label, index) => (
            <div className="design-system-spacing-card" key={label}>
              <span
                className={`design-system-spacing-bar design-system-spacing-bar-${spacing[index]}`}
                aria-hidden="true"
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="design-system-grid-description">{copy.gridDescription}</p>
      </section>
    </div>
  );
}
