import type { MetadataRoute } from "next";
import { articles, expertises, news } from "@/lib/content/site";
import { locales } from "@/lib/i18n";
import { getPublicProjects } from "@/lib/server/data/admin";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoanalysis.ma").replace(/\/$/, "");

function localizedEntries(path: string, priority: number): MetadataRoute.Sitemap {
  const urlFor = (locale: (typeof locales)[number]) =>
    `${siteUrl}/${locale}${path ? `/${path}` : ""}`;
  const languages = Object.fromEntries(locales.map((locale) => [locale, urlFor(locale)]));

  return locales.map((locale) => ({
    url: urlFor(locale),
    alternates: { languages },
    changeFrequency: "weekly",
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublicProjects();
  const pages = [
    ...["", "articles", "actualites", "realisations", "expertises", "bureau", "contact"].map(
      (path) => ({ path, priority: path ? 0.7 : 1 }),
    ),
    ...articles.map(({ slug }) => ({ path: `articles/${slug}`, priority: 0.6 })),
    ...news.map(({ slug }) => ({ path: `actualites/${slug}`, priority: 0.6 })),
    ...expertises.map(({ slug }) => ({ path: `expertises/${slug}`, priority: 0.6 })),
    ...projects.map(({ slug }) => ({ path: `realisations/${slug}`, priority: 0.6 })),
  ];

  return pages.flatMap(({ path, priority }) => localizedEntries(path, priority));
}
