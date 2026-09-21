import { contactPageCopy } from "./content";
import type { Locale } from "@/lib/i18n";

export function ContactDetailsSection({ locale }: { locale: Locale }) {
  const copy = contactPageCopy[locale];
  const details = [
    { label: copy.addressLabel, value: copy.address },
    {
      label: copy.emailLabel,
      value: <a href="mailto:contact@geoanalysis.ma">contact@geoanalysis.ma</a>,
    },
    {
      label: copy.phoneLabel,
      value: <a href="tel:+212524000000">+212 5 24 00 00 00</a>,
    },
    { label: copy.hoursLabel, value: copy.hours },
  ];

  return (
    <aside
      className="contact-details"
      aria-label={locale === "fr" ? "Coordonnées" : "Contact details"}>
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps?q=Quartier+Industriel+Sidi+Ghanem%2C+Marrakech+40000%2C+Maroc&output=embed"
          title={copy.mapLabel}
          loading="lazy"
        />
      </div>
      <dl className="contact-details-list">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
