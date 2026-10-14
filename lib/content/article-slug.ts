export function uniqueArticleSlug(title: string, records: Record<string, unknown>[], exceptId?: string) {
  const base = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 110) || "article";
  const existing = new Set(records
    .filter((record) => record.id !== exceptId)
    .map((record) => typeof record.slug === "string" ? record.slug : ""));
  let slug = base;
  let suffix = 2;
  while (existing.has(slug)) {
    const ending = `-${suffix++}`;
    slug = `${base.slice(0, 120 - ending.length)}${ending}`;
  }
  return slug;
}
