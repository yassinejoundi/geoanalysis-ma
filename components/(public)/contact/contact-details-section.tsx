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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16150.283655086854!2d-8.053126842386856!3d31.683676685614206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafeb0073fed14b%3A0x81d2e6ae6e89d670!2sGeoanalysis%20engineering%20office!5e0!3m2!1sen!2sma!4v1789988217249!5m2!1sen!2sma"
          title={copy.mapLabel}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
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
