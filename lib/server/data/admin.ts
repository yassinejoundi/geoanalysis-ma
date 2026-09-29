import "server-only";

import { neon } from "@neondatabase/serverless";
import { connection } from "next/server";
import { cache } from "react";
import { adminSettings } from "@/lib/content/admin";
import type { ProjectDraft, PublicProject } from "@/lib/content/projects";
import { projectSlug } from "@/lib/content/projects";
import { getAdminAccess, isAllowedAdminEmail, type AdminActor } from "@/lib/server/auth";
import {
  isRecord,
  parseExpertiseFields,
  parseBureauContentFields,
  parseExpertisePageContentFields,
  parseHomeContentFields,
  parsePartnerFields,
  parseProjectFields,
  parseSettingsFields,
  parseTeamFields,
} from "@/lib/server/validation";
import { homeContent, type HomeContent, type HomeContentRecord } from "@/components/(public)/home/content";
import type { BureauContent, BureauContentRecord } from "@/components/(public)/bureau/content";
import type { ExpertisePageContent, ExpertisePageContentRecord } from "@/components/(public)/expertises/content";
import type { Locale } from "@/lib/i18n";

export const adminCollections = [
  "expertises",
  "projects",
  "articles",
  "news",
  "team",
  "partners",
  "messages",
  "media",
  "home",
  "bureau",
  "expertisePage",
  "settings",
] as const;

export type AdminCollection = (typeof adminCollections)[number];

type CmsRow = { id: string; record: unknown; position: number; image_url?: string | null };

export type PublicTeamMember = {
  id: string;
  order: number;
  name: string;
  role: { fr: string; en: string };
  bio: { fr: string; en: string };
  image: string | null;
};

export type PublicPartner = { id: string; name: string; url: string };

const dedicatedTables = {
  expertises: "cms_expertises",
  projects: "cms_realisations",
  articles: "cms_articles",
  news: "cms_actualites",
  team: "cms_team_members",
  home: "cms_home_content",
  bureau: "cms_bureau_content",
  expertisePage: "cms_expertise_page_content",
} as const;

function isDedicatedCollection(collection: AdminCollection): collection is keyof typeof dedicatedTables {
  return Object.prototype.hasOwnProperty.call(dedicatedTables, collection);
}

export async function getAuthorizedAdminRecords<T>(collection: AdminCollection) {
  const access = await getAdminAccess();
  if ("response" in access) return access;
  return { actor: access.actor, records: await listAdminRecords<T>(access.actor, collection) };
}

export async function requireAdminRecords<T>(collection: AdminCollection) {
  const access = await getAdminAccess();
  if ("response" in access) throw new Error("Administrator access required.");
  return listAdminRecords<T>(access.actor, collection);
}

function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Database is not configured.");
  return neon(connectionString);
}

function normalizeProjectRecord(id: string, value: unknown, includeLegacyImage = false): ProjectDraft | null {
  if (!isRecord(value)) return null;
  const emptyText = { fr: "", en: "" };
  const project = parseProjectFields({
    state: value.state,
    expertiseId: value.expertiseId,
    subServiceId: value.subServiceId ?? "",
    location: value.location ?? "",
    date: value.date ?? "",
    title: value.title,
    context: value.context ?? value.description ?? emptyText,
    methodology: value.methodology ?? emptyText,
    results: value.results ?? emptyText,
    seoTitle: value.seoTitle ?? value.title,
    seoDescription: value.seoDescription ?? value.description ?? emptyText,
    gallery: value.gallery ?? [],
  });
  if (!project) return null;
  const slug = typeof value.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)
    ? value.slug
    : projectSlug(project.title.fr, id);
  return {
    id,
    ...project,
    slug,
    ...(includeLegacyImage && typeof value.image === "string" ? { legacyImage: value.image } : {}),
  };
}

function localizedRecordText(value: unknown) {
  if (!isRecord(value) || typeof value.fr !== "string" || typeof value.en !== "string") return null;
  return { fr: value.fr, en: value.en };
}

function publicImageSource(value: unknown) {
  if (typeof value !== "string") return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" ? value : null;
  } catch {
    return null;
  }
}

export const getPublicProjects = cache(async (): Promise<PublicProject[]> => {
  await connection();
  try {
    const sql = getDatabase();
    const [projectResult, expertiseResult] = await Promise.all([
      sql`
        SELECT id, record
        FROM cms_realisations
        WHERE record->>'state' = 'published'
        ORDER BY position ASC, created_at ASC, id ASC
      `,
      sql`
        SELECT id, record
        FROM cms_expertises
        ORDER BY position ASC, created_at ASC, id ASC
      `,
    ]);
    const projectRows = projectResult as CmsRow[];
    const expertiseRows = expertiseResult as CmsRow[];
    const expertiseNames = new Map<string, { fr: string; en: string }>();
    for (const { id, record } of expertiseRows) {
      if (!isRecord(record)) continue;
      const expertise = parseExpertiseFields({
        state: record.state,
        slug: record.slug,
        name: record.name,
        short: record.short,
      });
      if (expertise?.state === "published" && expertise.name) expertiseNames.set(id, expertise.name);
    }

    return projectRows.flatMap(({ id, record }) => {
      if (!isRecord(record)) return [];
      const project = normalizeProjectRecord(id, record);
      if (!project || project.state !== "published") return [];
      const domain = localizedRecordText(record.domain) ?? expertiseNames.get(project.expertiseId) ?? {
        fr: "Réalisation",
        en: "Project",
      };
      const gallery = project.gallery.filter((image) => image.url);
      if (gallery.length === 0) {
        const legacyImage = publicImageSource(record.image);
        if (legacyImage) {
          gallery.push({
            id: `${id}-cover`,
            url: legacyImage,
            caption: localizedRecordText(record.alt)?.fr ?? project.title.fr,
            isCover: true,
          });
        }
      }
      return [{
        ...project,
        slug: project.slug ?? projectSlug(project.title.fr, id),
        domain,
        teaser: project.context,
        gallery,
        coverImage: gallery.find((image) => image.isCover)?.url ?? gallery[0]?.url,
      }];
    });
  } catch {
    return [];
  }
});

export async function getPublicProjectBySlug(slug: string) {
  return (await getPublicProjects()).find((project) => project.slug === slug) ?? null;
}

export async function getPublicHomeContent(locale: Locale): Promise<HomeContent | null> {
  await connection();
  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT record FROM cms_home_content WHERE id = ${locale} LIMIT 1
    ` as { record: unknown }[];
    const record = rows[0]?.record as Partial<HomeContentRecord> | undefined;
    if (record?.locale !== locale) return null;
    return parseHomeContentFields(record.content, homeContent[locale].expertiseCards);
  } catch {
    return null;
  }
}

export async function getPublicBureauContent(locale: Locale): Promise<BureauContent | null> {
  await connection();
  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT record FROM cms_bureau_content WHERE id = ${locale} LIMIT 1
    ` as { record: unknown }[];
    const record = rows[0]?.record as Partial<BureauContentRecord> | undefined;
    if (record?.locale !== locale) return null;
    return parseBureauContentFields(record.content);
  } catch {
    return null;
  }
}

export async function getPublicExpertisePageContent(locale: Locale): Promise<ExpertisePageContent | null> {
  await connection();
  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT record FROM cms_expertise_page_content WHERE id = ${locale} LIMIT 1
    ` as { record: unknown }[];
    const record = rows[0]?.record as Partial<ExpertisePageContentRecord> | undefined;
    if (record?.locale !== locale) return null;
    return parseExpertisePageContentFields(record.content);
  } catch {
    return null;
  }
}

export const getPublicSettings = cache(async () => {
  await connection();
  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT record FROM cms_records WHERE collection = 'settings' AND id = 'site' LIMIT 1
    ` as { record: unknown }[];
    if (!isRecord(rows[0]?.record)) return adminSettings;
    const settings = { ...rows[0].record };
    delete settings.id;
    return { ...adminSettings, ...parseSettingsFields(settings) };
  } catch {
    return adminSettings;
  }
});

export async function getPublicFirmDirectory(): Promise<{
  team: PublicTeamMember[];
  partners: PublicPartner[];
}> {
  await connection();
  try {
    const sql = getDatabase();
    const [teamResult, partnerResult] = await Promise.all([
      sql`
        SELECT id, record, position, image_url
        FROM cms_team_members
        ORDER BY position ASC, created_at ASC, id ASC
      `,
      sql`
        SELECT id, record, position
        FROM cms_records
        WHERE collection = 'partners'
        ORDER BY position ASC, created_at ASC, id ASC
      `,
    ]);
    const teamRows = teamResult as CmsRow[];
    const partnerRows = partnerResult as CmsRow[];

    const team = teamRows.flatMap(({ id, record, image_url }) => {
      if (!isRecord(record)) return [];
      const fields = parseTeamFields({
        order: record.order,
        name: record.name,
        role: record.role,
        bio: record.bio,
        image: image_url ?? record.image ?? null,
      });
      return fields ? [{ id, ...fields, image: fields.image ?? null }] : [];
    });
    const partners = partnerRows.flatMap(({ id, record }) => {
      if (!isRecord(record)) return [];
      const fields = parsePartnerFields({ name: record.name, url: record.url });
      return fields ? [{ id, ...fields }] : [];
    });

    return { team, partners };
  } catch {
    return { team: [], partners: [] };
  }
}

function authorize(actor: AdminActor) {
  if (!actor.id || !isAllowedAdminEmail(actor.email)) {
    throw new Error("Administrator access required.");
  }
}

export async function saveHomeContent(
  actor: AdminActor,
  locale: Locale,
  content: HomeContent,
) {
  authorize(actor);
  const sql = getDatabase();
  const record = JSON.stringify({ locale, content } satisfies HomeContentRecord);
  await sql`
    INSERT INTO cms_home_content (id, record, position, updated_by)
    VALUES (${locale}, ${record}::jsonb, 0, ${actor.id})
    ON CONFLICT (id) DO UPDATE
    SET record = EXCLUDED.record, updated_by = EXCLUDED.updated_by, updated_at = now()
  `;
}

export async function saveBureauContent(
  actor: AdminActor,
  locale: Locale,
  content: BureauContent,
) {
  authorize(actor);
  const sql = getDatabase();
  const record = JSON.stringify({ locale, content } satisfies BureauContentRecord);
  await sql`
    INSERT INTO cms_bureau_content (id, record, position, updated_by)
    VALUES (${locale}, ${record}::jsonb, 0, ${actor.id})
    ON CONFLICT (id) DO UPDATE
    SET record = EXCLUDED.record, updated_by = EXCLUDED.updated_by, updated_at = now()
  `;
}

export async function saveExpertisePageContent(
  actor: AdminActor,
  locale: Locale,
  content: ExpertisePageContent,
) {
  authorize(actor);
  const sql = getDatabase();
  const record = JSON.stringify({ locale, content } satisfies ExpertisePageContentRecord);
  await sql`
    INSERT INTO cms_expertise_page_content (id, record, position, updated_by)
    VALUES (${locale}, ${record}::jsonb, 0, ${actor.id})
    ON CONFLICT (id) DO UPDATE
    SET record = EXCLUDED.record, updated_by = EXCLUDED.updated_by, updated_at = now()
  `;
}

export async function listAdminRecords<T>(actor: AdminActor, collection: AdminCollection) {
  authorize(actor);
  const sql = getDatabase();
  const rows = collection === "team"
    ? await sql`
        SELECT id, record, position, image_url
        FROM cms_team_members
        ORDER BY position ASC, created_at ASC, id ASC
      ` as CmsRow[]
    : isDedicatedCollection(collection)
    ? await sql`
        SELECT id, record, position
        FROM ${sql.unsafe(dedicatedTables[collection])}
        ORDER BY position ASC, created_at ASC, id ASC
      ` as CmsRow[]
    : await sql`
        SELECT id, record, position
        FROM cms_records
        WHERE collection = ${collection}
        ORDER BY position ASC, created_at ASC, id ASC
      ` as CmsRow[];
  return rows.map(({ id, record, image_url }) => {
    if (collection === "projects") {
      return (normalizeProjectRecord(id, record, true) ?? record) as T;
    }
    if (collection === "team" && isRecord(record)) {
      return { ...record, image: image_url ?? record.image ?? null } as T;
    }
    if (collection === "media" && record && typeof record === "object") {
      const safeRecord = Object.fromEntries(Object.entries(record).filter(([key]) => key !== "ownerId"));
      return safeRecord as T;
    }
    return record as T;
  });
}

export async function validateProjectReferences(actor: AdminActor, expertiseId: string, subServiceId: string, mediaIds: string[]) {
  authorize(actor);
  const expertises = await listAdminRecords<import("@/lib/content/admin").AdminExpertise>(actor, "expertises");
  const expertise = expertises.find((item) => item.id === expertiseId);
  if (!expertise || (subServiceId && !expertise.subServices.some((item) => item.id === subServiceId))) return false;
  if (new Set(mediaIds).size !== mediaIds.length) return false;
  if (!mediaIds.length) return true;

  const sql = getDatabase();
  const rows = await sql`
    SELECT count(DISTINCT cms.id)::int AS count
    FROM cms_records AS cms
    JOIN jsonb_array_elements_text(${JSON.stringify(mediaIds)}::jsonb) AS requested(id)
      ON requested.id = cms.id
    WHERE cms.collection = 'media' AND cms.record->>'ownerId' = ${actor.id}
  ` as { count: number }[];
  return rows[0]?.count === mediaIds.length;
}

export async function getAdminRecord<T>(actor: AdminActor, collection: AdminCollection, id: string) {
  authorize(actor);
  const sql = getDatabase();
  const rows = collection === "team"
    ? await sql`
        SELECT id, record, position, image_url
        FROM cms_team_members
        WHERE id = ${id}
        LIMIT 1
      ` as CmsRow[]
    : isDedicatedCollection(collection)
    ? await sql`
        SELECT id, record, position
        FROM ${sql.unsafe(dedicatedTables[collection])}
        WHERE id = ${id}
        LIMIT 1
      ` as CmsRow[]
    : await sql`
        SELECT id, record, position
        FROM cms_records
        WHERE collection = ${collection} AND id = ${id}
        LIMIT 1
      ` as CmsRow[];
  if (!rows[0]) return null;
  if (collection === "team" && isRecord(rows[0].record)) {
    return { ...rows[0].record, image: rows[0].image_url ?? rows[0].record.image ?? null } as T;
  }
  return rows[0].record as T;
}

export async function createAdminRecord(
  actor: AdminActor,
  collection: AdminCollection,
  id: string,
  record: unknown,
  position = 0,
) {
  authorize(actor);
  const sql = getDatabase();
  const recordJson = JSON.stringify(record);
  const rows = collection === "team" && isRecord(record)
    ? await sql`
        INSERT INTO cms_team_members (id, record, position, image_url, updated_by)
        VALUES (${id}, ${recordJson}::jsonb, ${position}, ${typeof record.image === "string" ? record.image : null}, ${actor.id})
        ON CONFLICT DO NOTHING
        RETURNING id
      ` as { id: string }[]
    : isDedicatedCollection(collection)
    ? await sql`
        INSERT INTO ${sql.unsafe(dedicatedTables[collection])} (id, record, position, updated_by)
        VALUES (${id}, ${recordJson}::jsonb, ${position}, ${actor.id})
        ON CONFLICT DO NOTHING
        RETURNING id
      ` as { id: string }[]
    : await sql`
        INSERT INTO cms_records (collection, id, record, position, updated_by)
        VALUES (${collection}, ${id}, ${recordJson}::jsonb, ${position}, ${actor.id})
        ON CONFLICT DO NOTHING
        RETURNING id
      ` as { id: string }[];
  return rows.length === 1;
}

export async function updateAdminRecord(
  actor: AdminActor,
  collection: AdminCollection,
  id: string,
  record: unknown,
  position?: number,
) {
  authorize(actor);
  const sql = getDatabase();
  const recordJson = JSON.stringify(record);
  const rows = collection === "team" && isRecord(record)
    ? await sql`
        UPDATE cms_team_members
        SET record = ${recordJson}::jsonb,
            image_url = CASE WHEN ${"image" in record} THEN ${typeof record.image === "string" ? record.image : null} ELSE image_url END,
            position = COALESCE(${position ?? null}, position),
            updated_by = ${actor.id},
            updated_at = now()
        WHERE id = ${id}
        RETURNING id
      ` as { id: string }[]
    : isDedicatedCollection(collection)
    ? await sql`
        UPDATE ${sql.unsafe(dedicatedTables[collection])}
        SET record = ${recordJson}::jsonb,
            position = COALESCE(${position ?? null}, position),
            updated_by = ${actor.id},
            updated_at = now()
        WHERE id = ${id}
        RETURNING id
      ` as { id: string }[]
    : await sql`
        UPDATE cms_records
        SET record = ${recordJson}::jsonb,
            position = COALESCE(${position ?? null}, position),
            updated_by = ${actor.id},
            updated_at = now()
        WHERE collection = ${collection} AND id = ${id}
        RETURNING id
      ` as { id: string }[];
  return rows.length === 1;
}

export async function deleteAdminRecord(actor: AdminActor, collection: AdminCollection, id: string) {
  authorize(actor);
  const sql = getDatabase();
  const rows = isDedicatedCollection(collection)
    ? await sql`
        DELETE FROM ${sql.unsafe(dedicatedTables[collection])}
        WHERE id = ${id}
        RETURNING id
      ` as { id: string }[]
    : await sql`
        DELETE FROM cms_records
        WHERE collection = ${collection} AND id = ${id}
        RETURNING id
      ` as { id: string }[];
  return rows.length === 1;
}

export async function reorderAdminRecords(actor: AdminActor, collection: AdminCollection, ids: string[]) {
  authorize(actor);
  const sql = getDatabase();
  const ordering = JSON.stringify(ids.map((id, position) => ({ id, position })));
  const rows = isDedicatedCollection(collection)
    ? await sql`
        WITH desired AS (
          SELECT id, position
          FROM jsonb_to_recordset(${ordering}::jsonb) AS item(id text, position integer)
        ), valid AS (
          SELECT
            count(*) AS desired_count,
            count(DISTINCT desired.id) AS distinct_count,
            (SELECT count(*) FROM ${sql.unsafe(dedicatedTables[collection])}) AS current_count,
            count(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM ${sql.unsafe(dedicatedTables[collection])} AS existing WHERE existing.id = desired.id
            )) AS matched_count
          FROM desired
        )
        UPDATE ${sql.unsafe(dedicatedTables[collection])} AS record
        SET position = desired.position,
            record = CASE WHEN ${collection} = 'team'
              THEN jsonb_set(record.record, '{order}', to_jsonb(desired.position + 1), true)
              ELSE record.record
            END,
            updated_by = ${actor.id}, updated_at = now()
        FROM desired, valid
        WHERE record.id = desired.id
          AND valid.desired_count = valid.distinct_count
          AND valid.desired_count = valid.current_count
          AND valid.matched_count = valid.desired_count
        RETURNING record.id
      ` as { id: string }[]
    : await sql`
        WITH desired AS (
          SELECT id, position
          FROM jsonb_to_recordset(${ordering}::jsonb) AS item(id text, position integer)
        ), valid AS (
          SELECT
            count(*) AS desired_count,
            count(DISTINCT desired.id) AS distinct_count,
            (SELECT count(*) FROM cms_records WHERE collection = ${collection}) AS current_count,
            count(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM cms_records AS existing
              WHERE existing.collection = ${collection} AND existing.id = desired.id
            )) AS matched_count
          FROM desired
        )
        UPDATE cms_records AS record
        SET position = desired.position,
            updated_by = ${actor.id}, updated_at = now()
        FROM desired, valid
        WHERE record.collection = ${collection}
          AND record.id = desired.id
          AND valid.desired_count = valid.distinct_count
          AND valid.desired_count = valid.current_count
          AND valid.matched_count = valid.desired_count
        RETURNING record.id
      ` as { id: string }[];
  return rows.length === ids.length;
}

export async function saveContactMessage(record: unknown) {
  const sql = getDatabase();
  const value = record as { id: string };
  const recordJson = JSON.stringify(record);
  await sql`
    INSERT INTO cms_records (collection, id, record, position, updated_by)
    VALUES ('messages', ${value.id}, ${recordJson}::jsonb, 0, 'contact-form')
  `;
}
