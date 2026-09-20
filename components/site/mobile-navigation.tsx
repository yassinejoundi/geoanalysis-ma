import type { Locale } from "@/lib/i18n";
import Link from "next/link";

export interface NavigationItem {
  href: string;
  label: string;
}

function isActive(pathname: string, href: string) {
  return pathname === href || (href.split("/").length > 2 && pathname.startsWith(`${href}/`));
}

export function MobileNavigation({ locale, items, open, pathname, onNavigate }: { locale: Locale; items: NavigationItem[]; open: boolean; pathname: string; onNavigate: () => void }) {
  if (!open) return null;

  return (
    <nav className="mobile-navigation" id="mobile-navigation" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onNavigate={onNavigate}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <Link className="mobile-contact-action" href={`/${locale}/contact`} onNavigate={onNavigate}>
        {locale === "fr" ? "Parler de votre projet" : "Discuss your project"}
      </Link>
    </nav>
  );
}

export { isActive };
