import type { adminSettings } from "@/lib/content/admin";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

type BrandSettings = Pick<typeof adminSettings, "siteName" | "logo" | "logoInverse">;

export function BrandLogo({
  locale,
  settings,
  compact = false,
  white = false,
}: {
  locale: Locale;
  settings: BrandSettings;
  compact?: boolean;
  white?: boolean;
}) {
  return (
    <Link
      className={`brand-logo-link${compact ? " brand-logo-link-compact" : ""}`}
      href={`/${locale}`}
      aria-label={`${settings.siteName} — ${locale === "fr" ? "Accueil" : "Home"}`}>
      <Image
        className="site-brand-image"
        src={white ? settings.logoInverse : settings.logo}
        width={1873}
        height={840}
        alt=""
        priority={!compact}
      />
    </Link>
  );
}
