import "server-only";

import { neon } from "@neondatabase/serverless";
import { getAdminAccess, isAllowedAdminEmail, type AdminActor } from "@/lib/server/auth";

export const adminCollections = [
  "expertises",
  "projects",
  "articles",
  "news",
  "team",
  "partners",
  "messages",
  "media",
  "settings",
] as const;

export type AdminCollection = (typeof adminCollections)[number];

type CmsRow = { id: string; record: unknown; position: number };

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

function authorize(actor: AdminActor) {
  if (!actor.id || !isAllowedAdminEmail(actor.email)) {
    throw new Error("Administrator access required.");
  }
}

export async function listAdminRecords<T>(actor: AdminActor, collection: AdminCollection) {
  authorize(actor);
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, record, position
    FROM cms_records
    WHERE collection = ${collection}
    ORDER BY position ASC, created_at ASC, id ASC
  ` as CmsRow[];
  return rows.map(({ record }) => {
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
  const rows = await sql`
    SELECT id, record, position
    FROM cms_records
    WHERE collection = ${collection} AND id = ${id}
    LIMIT 1
  ` as CmsRow[];
  return rows[0] ? (rows[0].record as T) : null;
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
  const rows = await sql`
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
  const rows = await sql`
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
  const rows = await sql`
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
  const rows = await sql`
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
        record = CASE WHEN ${collection} = 'team'
          THEN jsonb_set(record.record, '{order}', to_jsonb(desired.position + 1), true)
          ELSE record.record
        END,
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
