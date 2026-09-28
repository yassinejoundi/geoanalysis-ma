import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

const transparentLogoUrl =
  "https://res.cloudinary.com/d7qa2cop/image/upload/v1790632682/geoanalysis/logo/geoanalysis-logo-transparent.png";
const whiteLogoUrl =
  "https://res.cloudinary.com/d7qa2cop/image/upload/v1790632336/geoanalysis/logo/geoanalysis-logo-white.png";

export function BrandLogo({
  locale,
  compact = false,
  white = false,
}: {
  locale: Locale;
  compact?: boolean;
  white?: boolean;
}) {
  return (
    <Link
      className={`brand-logo-link${compact ? " brand-logo-link-compact" : ""}`}
      href={`/${locale}`}
      aria-label={`GEOANALYSIS — ${locale === "fr" ? "Accueil" : "Home"}`}>
      <Image
        className="site-brand-image"
        src={white ? whiteLogoUrl : transparentLogoUrl}
        width={1873}
        height={840}
        alt=""
        priority={!compact}
      />
    </Link>
  );
}
