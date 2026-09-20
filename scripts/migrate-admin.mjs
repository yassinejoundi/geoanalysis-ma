import { neon } from "@neondatabase/serverless";
import {
  adminArticles,
  adminExpertises,
  adminMedia,
  adminMessages,
  adminNews,
  adminPartners,
  adminProjects,
  adminSettings,
  adminTeam,
} from "../lib/content/admin.ts";

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "test") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // The deployment environment may inject DATABASE_URL directly.
  }
}

if (!process.env.DATABASE_URL) {
  console.error("Set DATABASE_URL before applying the admin data migration.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
try {
  await sql`
    CREATE TABLE IF NOT EXISTS cms_records (
      collection text NOT NULL CHECK (collection IN ('expertises', 'projects', 'articles', 'news', 'team', 'partners', 'messages', 'media', 'settings')),
      id text NOT NULL,
      record jsonb NOT NULL,
      position integer NOT NULL DEFAULT 0,
      updated_by text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (collection, id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS cms_expertise_slug_unique
    ON cms_records ((record->>'slug'))
    WHERE collection = 'expertises'
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS api_rate_limits (
      key_hash text NOT NULL,
      window_start timestamptz NOT NULL,
      count integer NOT NULL DEFAULT 0,
      PRIMARY KEY (key_hash, window_start)
    )
  `;

  const migration = "001_admin_seed_v1";
  const applied = await sql`SELECT version FROM cms_migrations WHERE version = ${migration}`;
  if (applied.length === 0) {
    const seedGroups = [
      ["expertises", adminExpertises],
      ["projects", adminProjects.map((project) => ({ ...project, context: { fr: "", en: "" }, methodology: { fr: "", en: "" }, results: { fr: "", en: "" }, seoTitle: { ...project.title }, seoDescription: { fr: "", en: "" }, gallery: [] }))],
      ["articles", adminArticles.map((item) => ({ ...item, content: { fr: "", en: "" }, seoTitle: { ...item.title }, seoDescription: { fr: "", en: "" } }))],
      ["news", adminNews.map((item) => ({ ...item, content: { fr: "", en: "" }, seoTitle: { ...item.title }, seoDescription: { fr: "", en: "" } }))],
      ["team", adminTeam],
      ["partners", adminPartners],
      ["messages", adminMessages],
      ["media", adminMedia.map((record, index) => ({ ...record, id: "fixture-" + index }))],
      ["settings", [{ id: "site", ...adminSettings }]],
    ];

    for (const [collection, records] of seedGroups) {
      for (const [position, record] of records.entries()) {
        const id = String(record.id);
        const payload = JSON.stringify(record);
        await sql`
          INSERT INTO cms_records (collection, id, record, position, updated_by)
          VALUES (${collection}, ${id}, ${payload}::jsonb, ${position}, 'system')
          ON CONFLICT (collection, id) DO NOTHING
        `;
      }
    }

    await sql`INSERT INTO cms_migrations (version) VALUES (${migration}) ON CONFLICT (version) DO NOTHING`;
  }

  console.log("Admin data schema is ready.");
} catch {
  console.error("Admin data migration failed. Database details were not logged.");
  process.exitCode = 1;
}
