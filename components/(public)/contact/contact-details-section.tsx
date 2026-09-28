import { contactPageCopy } from "./content";
import type { adminSettings } from "@/lib/content/admin";
import type { Locale } from "@/lib/i18n";

type ContactSettings = Pick<typeof adminSettings, "address" | "email" | "phone" | "hours" | "linkedin">;

export function ContactDetailsSection({ locale, settings }: { locale: Locale; settings: ContactSettings }) {
  const copy = contactPageCopy[locale];
  const phoneHref = settings.phone.replace(/[^\d+]/g, "");
  const linkedinHref = /^https?:\/\//i.test(settings.linkedin) ? settings.linkedin : `https://${settings.linkedin}`;
  const details = [
    { label: copy.addressLabel, value: settings.address },
    {
      label: copy.emailLabel,
      value: <a href={`mailto:${settings.email}`}>{settings.email}</a>,
    },
    {
      label: copy.phoneLabel,
      value: <a href={`tel:${phoneHref}`}>{settings.phone}</a>,
    },
    { label: copy.hoursLabel, value: settings.hours },
    { label: copy.linkedinLabel, value: <a href={linkedinHref} target="_blank" rel="noopener noreferrer">LinkedIn</a> },
  ];

  return (
    <aside
      className="contact-details"
      aria-label={locale === "fr" ? "Coordonnées" : "Contact details"}>
      <p className="contact-panel-kicker">02 / {copy.detailsKicker}</p>
      <h2>{copy.detailsTitle}</h2>
      <div className="contact-map">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
          title={locale === "fr" ? `Carte de ${settings.address}` : `Map of ${settings.address}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="contact-map-caption">{settings.address}</p>
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
