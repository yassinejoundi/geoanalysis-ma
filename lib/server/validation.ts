import type { LocalizedText } from "@/lib/i18n";
import type { HomeContent } from "@/components/(public)/home/content";
import type { BureauContent } from "@/components/(public)/bureau/content";
import type { ExpertisePageContent } from "@/components/(public)/expertises/content";
import type { MessageStatus, PublicationState } from "@/lib/content/admin";

export const MAX_MEDIA_BYTES = 4 * 1024 * 1024;
export const MAX_JSON_BYTES = 64 * 1024;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

export function isIdentifier(value: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(value);
}

export function textField(value: unknown, maxLength: number, required = true): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (normalized.length > maxLength || (required && normalized.length === 0)) return null;
  return normalized;
}

export function localizedText(value: unknown, maxLength: number, required = true): LocalizedText | null {
  if (!isRecord(value) || !hasOnlyKeys(value, ["fr", "en"])) return null;
  const fr = textField(value.fr, maxLength, required);
  const en = textField(value.en, maxLength, required);
  return fr !== null && en !== null ? { fr, en } : null;
}

function isAllowedImageSource(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

function parseEditorialImage(value: unknown) {
  if (value === null) return null;
  if (!isRecord(value) || !hasOnlyKeys(value, ["src", "alt"])) return false;
  const src = textField(value.src, 2048);
  const alt = localizedText(value.alt, 250);
  if (!src || !alt || !isAllowedImageSource(src)) return false;
  return { src, alt };
}

export function publicationState(value: unknown): PublicationState | null {
  return value === "published" || value === "draft" ? value : null;
}

export function messageStatus(value: unknown): MessageStatus | null {
  return value === "new" || value === "contacted" || value === "talking" ||
    value === "quoted" || value === "won" || value === "lost" ? value : null;
}

export function parseContactSubmission(value: unknown) {
  const keys = ["name", "company", "email", "phone", "projectType", "message", "website"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys)) return null;

  const name = textField(value.name, 100);
  const company = textField(value.company, 120, false);
  const email = textField(value.email, 254);
  const phone = textField(value.phone, 40, false);
  const projectType = textField(value.projectType, 20);
  const message = textField(value.message, 5000);
  const website = textField(value.website, 300, false);
  if (!name || company === null || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone === null || !["mining", "impact", "water", "other"].includes(projectType ?? "") ||
    !message || website === null) return null;
  return { name, company, email, phone, projectType, message, website };
}

export function parseExpertiseFields(value: unknown, partial = false) {
  const keys = ["state", "slug", "name", "short"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || (!partial && Object.keys(value).length !== keys.length)) return null;
  const state = value.state === undefined && partial ? undefined : publicationState(value.state);
  const slug = value.slug === undefined && partial ? undefined : textField(value.slug, 100);
  const name = value.name === undefined && partial ? undefined : localizedText(value.name, 100);
  const short = value.short === undefined && partial ? undefined : localizedText(value.short, 700);
  if (state === null || slug === null || name === null || short === null) return null;
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  if (partial && Object.keys(value).length === 0) return null;
  return { ...(state !== undefined ? { state } : {}), ...(slug !== undefined ? { slug } : {}), ...(name ? { name } : {}), ...(short ? { short } : {}) };
}

export function parseSubServiceFields(value: unknown, partial = false) {
  const keys = ["state", "name", "short"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || (!partial && Object.keys(value).length !== keys.length)) return null;
  const state = value.state === undefined && partial ? undefined : publicationState(value.state);
  const name = value.name === undefined && partial ? undefined : localizedText(value.name, 100);
  const short = value.short === undefined && partial ? undefined : localizedText(value.short, 700);
  if (state === null || name === null || short === null || (partial && !Object.keys(value).length)) return null;
  return { ...(state !== undefined ? { state } : {}), ...(name ? { name } : {}), ...(short ? { short } : {}) };
}

export function parseProjectFields(value: unknown) {
  const keys = ["state", "expertiseId", "subServiceId", "location", "date", "title", "context", "methodology", "results", "seoTitle", "seoDescription", "gallery"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || keys.some((key) => !(key in value))) return null;
  const state = publicationState(value.state);
  const expertiseId = textField(value.expertiseId, 80);
  const subServiceId = textField(value.subServiceId, 80, false);
  const location = textField(value.location, 140);
  const date = textField(value.date, 40);
  const title = localizedText(value.title, 160);
  const context = localizedText(value.context, 5000, false);
  const methodology = localizedText(value.methodology, 5000, false);
  const results = localizedText(value.results, 5000, false);
  const seoTitle = localizedText(value.seoTitle, 160, false);
  const seoDescription = localizedText(value.seoDescription, 320, false);
  const gallery = parseProjectGallery(value.gallery);
  if (!state || !expertiseId || !isIdentifier(expertiseId) || subServiceId === null || (subServiceId && !isIdentifier(subServiceId)) || !location || !date || !title || !context || !methodology || !results || !seoTitle || !seoDescription || !gallery) return null;
  return { state, expertiseId, subServiceId, location, date, title, context, methodology, results, seoTitle, seoDescription, gallery };
}

function parseProjectGallery(value: unknown) {
  if (!Array.isArray(value) || value.length > 30) return null;
  const items: { id: string; caption: string; isCover: boolean; url?: string }[] = [];
  for (const item of value) {
    if (!isRecord(item) || !hasOnlyKeys(item, ["id", "caption", "isCover", "url"])) return null;
    const id = textField(item.id, 80);
    const caption = textField(item.caption, 240, false);
    const url = item.url === undefined ? undefined : textField(item.url, 2048);
    if (!id || !isIdentifier(id) || caption === null || typeof item.isCover !== "boolean" ||
      (item.url !== undefined && (!url || !isAllowedImageSource(url)))) return null;
    items.push({ id, caption, isCover: item.isCover, ...(url ? { url } : {}) });
  }
  if (items.filter((item) => item.isCover).length > 1) return null;
  return items;
}

export function parseEditorialFields(value: unknown, kind: "articles" | "news") {
  const requiredKeys = ["state", "category", "tags", "date", "title", "content", "seoTitle", "seoDescription"];
  const keys = [...requiredKeys, "image", ...(kind === "articles" ? ["readingTime"] : [])];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || requiredKeys.some((key) => !(key in value))) return null;
  const state = publicationState(value.state);
  const category = localizedText(value.category, 100);
  const date = textField(value.date, 40);
  const title = localizedText(value.title, 160);
  const content = localizedText(value.content, 20_000, false);
  const seoTitle = localizedText(value.seoTitle, 160, false);
  const seoDescription = localizedText(value.seoDescription, 320, false);
  const image = value.image === undefined ? undefined : parseEditorialImage(value.image);
  const readingTime = kind === "articles" ? textField(value.readingTime, 30) : undefined;
  if (!Array.isArray(value.tags) || value.tags.length > 12 || image === false) return null;
  const tags = value.tags.map((tag) => textField(tag, 30)).filter((tag): tag is string => tag !== null);
  if (tags.length !== value.tags.length || !state || !category || !date || !title || !content || !seoTitle || !seoDescription || (kind === "articles" && !readingTime)) return null;
  return {
    state, category, tags, date, title, content, seoTitle, seoDescription,
    ...(image !== undefined ? { image } : {}),
    ...(readingTime ? { readingTime } : {}),
  };
}

export function parseTeamFields(value: unknown) {
  if (!isRecord(value) || !hasOnlyKeys(value, ["order", "name", "role", "bio", "image"])) return null;
  const order = value.order;
  const name = textField(value.name, 120);
  const role = localizedText(value.role, 120);
  const bio = localizedText(value.bio, 1400);
  const image = value.image === undefined || value.image === null ? value.image : textField(value.image, 2048);
  if (!Number.isInteger(order) || Number(order) < 1 || Number(order) > 100 || !name || !role || !bio ||
    (image !== undefined && image !== null && (!image || !isAllowedImageSource(image)))) return null;
  return { order: Number(order), name, role, bio, ...(image !== undefined ? { image } : {}) };
}

export function parsePartnerFields(value: unknown) {
  if (!isRecord(value) || !hasOnlyKeys(value, ["name", "url"])) return null;
  const name = textField(value.name, 120);
  const url = textField(value.url, 2048);
  if (!name || !url) return null;
  try {
    const parsed = new URL(/^[a-z][a-z\d+.-]*:/i.test(url) ? url : "https://" + url);
    if ((parsed.protocol !== "https:" && parsed.protocol !== "http:") || !parsed.hostname) return null;
    return { name, url: parsed.href };
  } catch {
    return null;
  }
}

export function parseSettingsFields(value: unknown) {
  const keys = ["siteName", "languages", "phone", "email", "address", "hours", "linkedin", "seoTitle", "seoDescription"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || !Object.keys(value).length) return null;
  const result: Record<string, string> = {};
  for (const key of keys) {
    if (!(key in value)) continue;
    const max = key === "seoDescription" ? 320 : key === "linkedin" ? 2048 : key === "address" ? 500 : 180;
    const field = textField(value[key], max);
    if (!field) return null;
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field)) return null;
    if (key === "linkedin" && !parsePartnerFields({ name: "LinkedIn", url: field })) return null;
    result[key] = field;
  }
  return result;
}

export function parseHomeContentFields(
  value: unknown,
  fallbackExpertiseCards?: HomeContent["expertiseCards"],
): HomeContent | null {
  const keys = [
    "title", "description", "kicker", "hero", "sub", "intro", "expertise", "expertiseCta", "talk",
    "expertiseCards",
    "aboutKicker", "aboutTitle", "about", "about2", "discover", "aboutImage", "aboutImageAlt",
    "aboutImageCaption", "aboutImageLocation", "pillars", "expTitle", "expDesc", "methodKicker",
    "methodTitle", "methodItems", "steps", "methods", "methodsTitle", "methodsLink", "projects", "projectsTitle",
    "projectsLink", "news", "articles", "editorialKicker", "editorialTitle", "allNews", "allArticles",
    "newsKicker", "articlesKicker", "editorialLocation", "read", "projectImage",
  ] as const;
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || keys.some((key) => key !== "expertiseCards" && !(key in value))) return null;

  type TextKey = Exclude<(typeof keys)[number], "aboutImage" | "pillars" | "steps" | "methodItems" | "expertiseCards">;
  const text = (key: TextKey, max = 2000) =>
    textField(value[key], max, false);
  const aboutImage = textField(value.aboutImage, 2048);
  const methodItems = parseHomeRows(value.methodItems, 2, 12) as HomeContent["methodItems"] | null;
  const textKeys = keys.filter((key) => key !== "aboutImage" && key !== "pillars" && key !== "steps" && key !== "methodItems" && key !== "expertiseCards") as TextKey[];
  const fields = Object.fromEntries(
    textKeys.map((key) => [key, text(key, key === "title" ? 160 : key === "description" ? 320 : key === "aboutImageAlt" ? 250 : 2000)]),
  );
  const pillars = parseHomeRows(value.pillars, 2, 8) as HomeContent["pillars"] | null;
  const steps = parseHomeRows(value.steps, 3, 12) as HomeContent["steps"] | null;
  const expertiseCards = value.expertiseCards === undefined
    ? fallbackExpertiseCards
    : parseHomeExpertiseCards(value.expertiseCards);
  if (!aboutImage || !isAllowedImageSource(aboutImage) || !methodItems || !pillars || !steps || !expertiseCards ||
    Object.values(fields).some((field) => field === null)) return null;

  return { ...fields, aboutImage, methodItems, pillars, steps, expertiseCards } as HomeContent;
}

function parseHomeExpertiseCards(value: unknown): HomeContent["expertiseCards"] | null {
  const ids = ["mining", "env", "water"] as const;
  if (!Array.isArray(value) || value.length !== ids.length) return null;
  const cards: HomeContent["expertiseCards"] = [];
  for (const card of value) {
    if (!isRecord(card) || !hasOnlyKeys(card, ["id", "name", "summary", "image", "imageAlt", "tags"])) return null;
    const id = card.id;
    const name = textField(card.name, 160);
    const summary = textField(card.summary, 700);
    const image = textField(card.image, 2048);
    const imageAlt = textField(card.imageAlt, 250);
    if (typeof id !== "string" || !ids.includes(id as (typeof ids)[number]) ||
      cards.some((item) => item.id === id) || !name || !summary || !image || !isAllowedImageSource(image) || imageAlt === null ||
      !Array.isArray(card.tags) || card.tags.length !== 3) return null;
    const tags = card.tags.map((tag) => textField(tag, 120));
    if (tags.some((tag) => tag === null)) return null;
    cards.push({ id: id as HomeContent["expertiseCards"][number]["id"], name, summary, image, imageAlt, tags: tags as [string, string, string] });
  }
  return ids.every((id) => cards.some((card) => card.id === id))
    ? ids.map((id) => cards.find((card) => card.id === id)!)
    : null;
}

export function parseBureauContentFields(value: unknown): BureauContent | null {
  const stringKeys = [
    "seoTitle", "seoDescription", "heroKicker", "heroTitle", "heroLead", "heroImage", "heroImageAlt",
    "heroImageLabel", "heroImageCaption", "fieldsLabel", "primaryAction", "secondaryAction", "aboutEyebrow",
    "aboutTitle", "aboutLead", "aboutDetail", "aboutLocation", "aboutGalleryLabel", "teamEyebrow", "teamTitle",
    "partnersEyebrow", "partnersTitle", "methodEyebrow", "methodTitle", "methodLead", "valuesTitle",
  ] as const;
  const keys = [...stringKeys, "domains", "gallery", "stages", "values"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || keys.some((key) => !(key in value))) return null;

  const fields = Object.fromEntries(stringKeys.map((key) => {
    const maxLength = key === "seoTitle" ? 160
      : key === "seoDescription" ? 320
      : key === "heroImageAlt" ? 250
      : key.endsWith("Image") ? 2048
      : key.endsWith("Title") ? 300
      : 2000;
    return [key, textField(value[key], maxLength)];
  }));
  const heroImage = fields.heroImage;
  if (!heroImage || !isAllowedImageSource(heroImage) || Object.values(fields).some((field) => field === null)) return null;

  const domains = parseBureauTextList(value.domains, 8);
  const gallery = parseBureauGallery(value.gallery);
  const stages = parseBureauTextRows(value.stages, 12);
  const values = parseBureauTextRows(value.values, 12);
  if (!domains || !gallery || !stages || !values) return null;

  return { ...fields, heroImage, domains, gallery, stages, values } as BureauContent;
}

export function parseExpertisePageContentFields(value: unknown): ExpertisePageContent | null {
  const stringKeys = [
    "seoTitle", "seoDescription", "heroKicker", "heroTitle", "heroLead", "exploreDomains",
    "contactAction", "heroImage", "photoAlt", "photoCaption", "indexNavLabel",
    "indexSectionKicker", "indexSectionTitle", "indexSectionLead", "approachKicker",
    "approachTitle", "approachLead",
  ] as const;
  const keys = [...stringKeys, "areas", "approachSteps"];
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || keys.some((key) => !(key in value))) return null;

  const fields = Object.fromEntries(stringKeys.map((key) => {
    const maxLength = key === "seoTitle" ? 160
      : key === "seoDescription" ? 320
      : key === "heroImage" ? 2048
      : key === "photoAlt" ? 250
      : key === "heroTitle" || key === "indexSectionTitle" || key === "approachTitle" ? 300
      : 2000;
    return [key, textField(value[key], maxLength)];
  }));
  const heroImage = fields.heroImage;
  const areas = parseExpertiseAreas(value.areas);
  const approachSteps = parseExpertiseApproachSteps(value.approachSteps);
  if (!heroImage || !isAllowedImageSource(heroImage) || Object.values(fields).some((field) => field === null) ||
    !areas || !approachSteps) return null;

  return { ...fields, heroImage, areas, approachSteps } as ExpertisePageContent;
}

function parseExpertiseAreas(value: unknown): ExpertisePageContent["areas"] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) return null;
  const ids = new Set<string>();
  const areas: ExpertisePageContent["areas"] = [];
  for (const area of value) {
    if (!isRecord(area) || !hasOnlyKeys(area, ["id", "number", "title", "summary", "services"])) return null;
    const id = textField(area.id, 80);
    const number = textField(area.number, 12);
    const title = textField(area.title, 200);
    const summary = textField(area.summary, 1200);
    const services = parseExpertiseServices(area.services);
    if (!id || !isIdentifier(id) || ids.has(id) || !number || !title || !summary || !services) return null;
    ids.add(id);
    areas.push({ id, number, title, summary, services });
  }
  return areas;
}

function parseExpertiseServices(value: unknown) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 16) return null;
  const services = value.map((service) => textField(service, 500));
  return services.every((service): service is string => service !== null) ? services : null;
}

function parseExpertiseApproachSteps(value: unknown): ExpertisePageContent["approachSteps"] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 12) return null;
  const steps: ExpertisePageContent["approachSteps"] = [];
  for (const step of value) {
    if (!isRecord(step) || !hasOnlyKeys(step, ["label", "title", "description"])) return null;
    const label = textField(step.label, 200);
    const title = textField(step.title, 300);
    const description = textField(step.description, 2000);
    if (!label || !title || !description) return null;
    steps.push({ label, title, description });
  }
  return steps;
}

function parseBureauTextList(value: unknown, maxRows: number) {
  if (!Array.isArray(value) || value.length < 1 || value.length > maxRows) return null;
  const rows = value.map((row) => textField(row, 300, true));
  return rows.every((row): row is string => row !== null) ? rows : null;
}

function parseBureauTextRows(value: unknown, maxRows: number) {
  if (!Array.isArray(value) || value.length < 1 || value.length > maxRows) return null;
  const rows: { title: string; description: string }[] = [];
  for (const row of value) {
    if (!isRecord(row) || !hasOnlyKeys(row, ["title", "description"])) return null;
    const title = textField(row.title, 300);
    const description = textField(row.description, 2000);
    if (!title || !description) return null;
    rows.push({ title, description });
  }
  return rows;
}

function parseBureauGallery(value: unknown) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) return null;
  const gallery: BureauContent["gallery"] = [];
  for (const photo of value) {
    if (!isRecord(photo) || !hasOnlyKeys(photo, ["src", "alt"])) return null;
    const src = textField(photo.src, 2048);
    const alt = textField(photo.alt, 250);
    if (!src || !alt || !isAllowedImageSource(src)) return null;
    gallery.push({ src, alt });
  }
  return gallery;
}

function parseHomeRows(value: unknown, columns: 2 | 3, maxRows: number) {
  if (!Array.isArray(value) || value.length < 1 || value.length > maxRows) return null;
  const rows: string[][] = [];
  for (const row of value) {
    if (!Array.isArray(row) || row.length !== columns) return null;
    const cells = row.map((cell) => textField(cell, 2000, true));
    if (cells.some((cell) => cell === null)) return null;
    rows.push(cells as string[]);
  }
  return rows as [string, string][] | [string, string, string][];
}

const formats: Record<string, { extension: string[]; magic: (bytes: Uint8Array) => boolean }> = {
  "image/jpeg": {
    extension: ["jpg", "jpeg"],
    magic: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  "image/png": {
    extension: ["png"],
    magic: (bytes) => bytes.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10",
  },
  "image/webp": {
    extension: ["webp"],
    magic: (bytes) => bytes.length >= 12 &&
      String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP",
  },
  "image/gif": {
    extension: ["gif"],
    magic: (bytes) => ["GIF87a", "GIF89a"].includes(String.fromCharCode(...bytes.subarray(0, 6))),
  },
  "image/avif": {
    extension: ["avif"],
    magic: (bytes) => bytes.length >= 12 &&
      String.fromCharCode(...bytes.subarray(4, 8)) === "ftyp" &&
      ["avif", "avis"].includes(String.fromCharCode(...bytes.subarray(8, 12))),
  },
  "application/pdf": {
    extension: ["pdf"],
    magic: (bytes) => String.fromCharCode(...bytes.subarray(0, 5)) === "%PDF-",
  },
};

export function validateMediaFile(file: { name: string; type: string; size: number }, bytes: Uint8Array) {
  if (file.size > MAX_MEDIA_BYTES || bytes.byteLength > MAX_MEDIA_BYTES) return "too-large" as const;
  if (!file.name || file.name.length > 180) return "invalid" as const;
  const format = formats[file.type];
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!format || !format.extension.includes(extension) || !format.magic(bytes)) return "unsupported" as const;
  return "valid" as const;
}
