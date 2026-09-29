import type { PublicationState } from "@/lib/content/admin";
import type { LocalizedText } from "@/lib/i18n";

export type ProjectImage = {
  id: string;
  caption: string;
  isCover: boolean;
  url?: string;
};

export type ProjectDraft = {
  id: string;
  slug?: string;
  state: PublicationState;
  expertiseId: string;
  subServiceId: string;
  location: string;
  date: string;
  title: LocalizedText;
  context: LocalizedText;
  methodology: LocalizedText;
  results: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  gallery: ProjectImage[];
  legacyImage?: string;
};

export type PublicProject = ProjectDraft & {
  slug: string;
  domain: LocalizedText;
  teaser: LocalizedText;
  coverImage?: string;
};

export function projectSlug(title: string, id: string) {
  const readable = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "projet";
  return `${readable}-${id.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
}
