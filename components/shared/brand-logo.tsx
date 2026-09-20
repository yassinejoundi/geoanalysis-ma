import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <Link
      className={`brand-logo-link${compact ? " brand-logo-link-compact" : ""}`}
      href={`/${locale}`}
      aria-label={`GEOANALYSIS — ${locale === "fr" ? "Accueil" : "Home"}`}>
      <Image
        className="site-brand-image"
        src="/geoanalysis-logo.png"
        width={46}
        height={46}
        alt=""
        priority={!compact}
      />
      <span className="site-brand-name">
        GEO<span>ANALYSIS</span>
      </span>
    </Link>
  );
}
