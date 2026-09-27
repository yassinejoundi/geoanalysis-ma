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

const legacyAdminTeam = [
  { id: "t1", order: 1, name: "Dr. S. Benali", role: { fr: "Directeur · Géologue", en: "Director · Geologist" }, bio: { fr: "Vingt ans d’expérience en exploration minière et cartographie structurale au Maroc.", en: "Twenty years in mineral exploration and structural mapping in Morocco." } },
  { id: "t2", order: 2, name: "I. Ouazzani", role: { fr: "Responsable géophysique", en: "Head of geophysics" }, bio: { fr: "Spécialiste des levés magnétiques et de l’inversion multi-méthodes.", en: "Specialist in magnetic surveys and multi-method inversion." } },
  { id: "t3", order: 3, name: "M. El Amrani", role: { fr: "Hydrogéologue senior", en: "Senior hydrogeologist" }, bio: { fr: "Prospection ERT, essais de pompage et modélisation d’aquifères.", en: "ERT prospecting, pumping tests and aquifer modelling." } },
  { id: "t4", order: 4, name: "L. Tazi", role: { fr: "Ingénieure environnement", en: "Environmental engineer" }, bio: { fr: "Études d’impact, états initiaux et plans de gestion environnementale.", en: "Impact studies, baselines and environmental management plans." } },
];

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

  const teamMigration = "002_team_roster_from_archive";
  const teamMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${teamMigration}`;
  if (teamMigrationApplied.length === 0) {
    await sql`
      WITH current_team AS MATERIALIZED (
        SELECT id, record, position
        FROM cms_records
        WHERE collection = 'team'
      ),
      legacy_team AS MATERIALIZED (
        SELECT value->>'id' AS id, value AS record, (value->>'order')::integer - 1 AS position
        FROM jsonb_array_elements(${JSON.stringify(legacyAdminTeam)}::jsonb) AS seed(value)
      ),
      migration_guard AS (
        SELECT
          (SELECT count(*) FROM current_team) = (SELECT count(*) FROM legacy_team)
          AND (
            SELECT count(*)
            FROM current_team AS current
            JOIN legacy_team AS legacy
              ON current.id = legacy.id
             AND current.record = legacy.record
             AND current.position = legacy.position
          ) = (SELECT count(*) FROM legacy_team) AS matches_legacy_seed
      ),
      replacement AS (
        INSERT INTO cms_records (collection, id, record, position, updated_by)
        SELECT 'team', seed.value->>'id', seed.value, (seed.value->>'order')::integer - 1, 'system'
        FROM jsonb_array_elements(${JSON.stringify(adminTeam)}::jsonb) AS seed(value)
        CROSS JOIN migration_guard
        WHERE migration_guard.matches_legacy_seed
        ON CONFLICT (collection, id) DO UPDATE
          SET record = EXCLUDED.record,
              position = EXCLUDED.position,
              updated_by = 'system',
              updated_at = now()
        RETURNING id
      )
      SELECT count(*) FROM replacement
    `;

    // Roll back before later team edits: restore legacyAdminTeam, delete t5-t9, then remove this marker.
    await sql`INSERT INTO cms_migrations (version) VALUES (${teamMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  console.log("Admin data schema is ready.");
} catch {
  console.error("Admin data migration failed. Database details were not logged.");
  process.exitCode = 1;
}
