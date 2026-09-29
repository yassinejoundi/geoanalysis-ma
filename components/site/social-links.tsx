import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import type { adminSettings } from "@/lib/content/admin";
import type { Locale } from "@/lib/i18n";

type SocialSettings = Pick<typeof adminSettings, "linkedin" | "facebook" | "instagram">;

const profiles = [
  { key: "linkedin", label: "LinkedIn", icon: faLinkedinIn },
  { key: "facebook", label: "Facebook", icon: faFacebookF },
  { key: "instagram", label: "Instagram", icon: faInstagram },
] as const;

export function SocialLinks({
  locale,
  settings,
  className,
}: {
  locale: Locale;
  settings: SocialSettings;
  className: string;
}) {
  const links = profiles.filter(({ key }) => settings[key].trim());
  if (links.length === 0) return null;

  return (
    <nav className={className} aria-label={locale === "fr" ? "Réseaux sociaux" : "Social media"}>
      <ul className="social-links-list">
        {links.map(({ key, label, icon }) => (
          <li key={key}>
            <a className="social-link" href={settings[key]} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <FontAwesomeIcon icon={icon} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
