import type { LocalizedText } from "@/lib/i18n";
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
  const items: { id: string; caption: string; isCover: boolean }[] = [];
  for (const item of value) {
    if (!isRecord(item) || !hasOnlyKeys(item, ["id", "caption", "isCover"])) return null;
    const id = textField(item.id, 80);
    const caption = textField(item.caption, 240, false);
    if (!id || !isIdentifier(id) || caption === null || typeof item.isCover !== "boolean") return null;
    items.push({ id, caption, isCover: item.isCover });
  }
  if (items.filter((item) => item.isCover).length > 1) return null;
  return items;
}

export function parseEditorialFields(value: unknown, kind: "articles" | "news") {
  const common = ["state", "category", "tags", "date", "title", "content", "seoTitle", "seoDescription"];
  const keys = kind === "articles" ? [...common, "readingTime"] : common;
  if (!isRecord(value) || !hasOnlyKeys(value, keys) || keys.some((key) => !(key in value))) return null;
  const state = publicationState(value.state);
  const category = localizedText(value.category, 100);
  const date = textField(value.date, 40);
  const title = localizedText(value.title, 160);
  const content = localizedText(value.content, 20_000, false);
  const seoTitle = localizedText(value.seoTitle, 160, false);
  const seoDescription = localizedText(value.seoDescription, 320, false);
  const readingTime = kind === "articles" ? textField(value.readingTime, 30) : undefined;
  if (!Array.isArray(value.tags) || value.tags.length > 12) return null;
  const tags = value.tags.map((tag) => textField(tag, 30)).filter((tag): tag is string => tag !== null);
  if (tags.length !== value.tags.length || !state || !category || !date || !title || !content || !seoTitle || !seoDescription || (kind === "articles" && !readingTime)) return null;
  return { state, category, tags, date, title, content, seoTitle, seoDescription, ...(readingTime ? { readingTime } : {}) };
}

export function parseTeamFields(value: unknown) {
  if (!isRecord(value) || !hasOnlyKeys(value, ["order", "name", "role", "bio"])) return null;
  const order = value.order;
  const name = textField(value.name, 120);
  const role = localizedText(value.role, 120);
  const bio = localizedText(value.bio, 1400);
  if (!Number.isInteger(order) || Number(order) < 1 || Number(order) > 100 || !name || !role || !bio) return null;
  return { order: Number(order), name, role, bio };
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
