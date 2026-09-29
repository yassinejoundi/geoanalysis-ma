import { contactPageCopy } from "./content";
import { SocialLinks } from "@/components/site/social-links";
import type { adminSettings } from "@/lib/content/admin";
import type { Locale } from "@/lib/i18n";

type ContactSettings = Pick<typeof adminSettings, "address" | "email" | "phone" | "hours" | "linkedin" | "facebook" | "instagram">;

export function ContactDetailsSection({ locale, settings }: { locale: Locale; settings: ContactSettings }) {
  const copy = contactPageCopy[locale];
  const phoneHref = settings.phone.replace(/[^\d+]/g, "");
  const mapQuery = encodeURIComponent(settings.address);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
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
  ];

  return (
    <aside
      className="contact-details"
      aria-label={locale === "fr" ? "Coordonnées" : "Contact details"}>
      <p className="contact-panel-kicker">02 / {copy.detailsKicker}</p>
      <h2>{copy.detailsTitle}</h2>
      <div className="contact-map">
        <iframe
          src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
          title={locale === "fr" ? `Carte de ${settings.address}` : `Map of ${settings.address}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="contact-map-caption">
        <span>{settings.address}</span>
        <a href={mapLink} target="_blank" rel="noopener noreferrer">
          {copy.googleMapsLabel}
        </a>
      </p>
      <dl className="contact-details-list">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
      <SocialLinks
        locale={locale}
        settings={settings}
        className="contact-social-links"
      />
    </aside>
  );
}
