"use client";

import { BrandLogo } from "@/components/shared/brand-logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  MobileNavigation,
  NavigationLinks,
  type NavigationItem,
} from "@/components/site/site-navigation";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const labels = {
  fr: [
    "Accueil",
    "Le Bureau",
    "Nos Expertises",
    "Réalisations",
    "Méthodes & Technologies",
    "Actualités",
    "Articles",
    "Contact",
  ],
  en: [
    "Home",
    "The Firm",
    "Expertise",
    "Projects",
    "Methods & Technology",
    "News",
    "Articles",
    "Contact",
  ],
} as const;
const paths = [
  "",
  "/bureau",
  "/expertises",
  "/realisations",
  "/methodes-technologies",
  "/actualites",
  "/articles",
  "/contact",
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    document.getElementById("contenu-principal")?.focus();
  }, [pathname]);

  return (
    <SiteHeaderContent
      key={pathname}
      locale={locale}
      pathname={pathname}
    />
  );
}

function SiteHeaderContent({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const items: NavigationItem[] = paths.map((path, index) => ({
    href: `/${locale}${path}`,
    label: labels[locale][index],
  }));

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      triggerRef.current?.focus();
    } else {
      setOpen(true);
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandLogo locale={locale} />
        <nav
          className="desktop-navigation"
          aria-label={
            locale === "fr" ? "Navigation principale" : "Main navigation"
          }>
          <NavigationLinks items={items} pathname={pathname} />
        </nav>
        <div className="site-header-actions">
          <LanguageSwitcher locale={locale} />
          <Link className="desktop-contact-action" href={`/${locale}/contact`}>
            {locale === "fr" ? "Nous contacter" : "Contact us"}
          </Link>
          <button
            ref={triggerRef}
            className="menu-trigger"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={
              locale === "fr"
                ? `${open ? "Fermer" : "Ouvrir"} le menu`
                : `${open ? "Close" : "Open"} menu`
            }
            onClick={toggleMenu}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileNavigation
        locale={locale}
        items={items}
        open={open}
        pathname={pathname}
        onNavigate={() => setOpen(false)}
      />
    </header>
  );
}
