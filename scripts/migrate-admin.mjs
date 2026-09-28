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
import { articles as publicArticles, expertises as publicExpertises, news as publicNews } from "../lib/content/site.ts";
import { expertiseDetails } from "../lib/content/expertise-details.ts";
import { realisationMissions } from "../components/(public)/realisations/content.ts";
import { homeContent } from "../components/(public)/home/content.ts";

const contentTables = {
  expertises: "cms_expertises",
  projects: "cms_realisations",
  articles: "cms_articles",
  news: "cms_actualites",
};

const publicExpertiseRecords = publicExpertises.map((expertise) => ({
  ...expertise,
  state: "published",
  short: expertise.summary,
  subServices: expertise.subServices.map((service, index) => ({
    id: `${expertise.id}-service-${index + 1}`,
    state: "published",
    name: service.name,
    short: service.summary,
  })),
  publicDetails: expertiseDetails[expertise.id],
}));

const publicArticleRecords = publicArticles.map((article) => ({
  ...article,
  state: "published",
  tags: [],
  date: article.dateISO ?? article.date.fr,
  content: Object.fromEntries(Object.entries(article.body).map(([locale, paragraphs]) => [locale, paragraphs.join("\n\n")])),
  seoTitle: article.title,
  seoDescription: article.teaser,
}));

const publicNewsRecords = publicNews.map((item) => ({
  ...item,
  state: "published",
  tags: [],
  date: item.dateISO ?? item.date.fr,
  content: Object.fromEntries(Object.entries(item.body).map(([locale, paragraphs]) => [locale, paragraphs.join("\n\n")])),
  seoTitle: item.title,
  seoDescription: item.teaser,
}));

const publicProjectRecords = realisationMissions.map((mission) => ({
  ...mission,
  state: "published",
  expertiseId: mission.id === "eau" ? "water" : "mining",
  subServiceId: "",
  location: "Non précisé",
  date: "Non précisée",
  context: mission.description,
  methodology: { fr: "", en: "" },
  results: { fr: "", en: "" },
  seoTitle: mission.title,
  seoDescription: mission.description,
  gallery: [],
}));

const legacySeedRows = {
  expertises: adminExpertises,
  projects: adminProjects.map((project) => ({ ...project, context: { fr: "", en: "" }, methodology: { fr: "", en: "" }, results: { fr: "", en: "" }, seoTitle: { ...project.title }, seoDescription: { fr: "", en: "" }, gallery: [] })),
  articles: adminArticles.map((item) => ({ ...item, content: { fr: "", en: "" }, seoTitle: { ...item.title }, seoDescription: { fr: "", en: "" } })),
  news: adminNews.map((item) => ({ ...item, content: { fr: "", en: "" }, seoTitle: { ...item.title }, seoDescription: { fr: "", en: "" } })),
};

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
      collection text NOT NULL CHECK (collection IN ('expertises', 'projects', 'articles', 'news', 'team', 'partners', 'messages', 'media', 'home', 'settings')),
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
    CREATE TABLE IF NOT EXISTS cms_team_members (
      id text PRIMARY KEY,
      record jsonb NOT NULL,
      position integer NOT NULL DEFAULT 0,
      image_url text,
      updated_by text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE cms_team_members ADD COLUMN IF NOT EXISTS image_url text`;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_home_content (
      id text PRIMARY KEY CHECK (id IN ('fr', 'en')),
      record jsonb NOT NULL,
      position integer NOT NULL DEFAULT 0,
      updated_by text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_bureau_content (
      id text PRIMARY KEY CHECK (id IN ('fr', 'en')),
      record jsonb NOT NULL,
      position integer NOT NULL DEFAULT 0,
      updated_by text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  for (const table of Object.values(contentTables)) {
    await sql`
      CREATE TABLE IF NOT EXISTS ${sql.unsafe(table)} (
        id text PRIMARY KEY,
        record jsonb NOT NULL,
        position integer NOT NULL DEFAULT 0,
        updated_by text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  }
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
    CREATE UNIQUE INDEX IF NOT EXISTS cms_expertises_slug_unique
    ON cms_expertises ((record->>'slug'))
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

  const teamTableMigration = "003_team_members_table";
  const teamTableMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${teamTableMigration}`;
  if (teamTableMigrationApplied.length === 0) {
    await sql`
      INSERT INTO cms_team_members (id, record, position, updated_by, created_at, updated_at)
      SELECT id, record, position, updated_by, created_at, updated_at
      FROM cms_records
      WHERE collection = 'team'
      ON CONFLICT (id) DO NOTHING
    `;

    const updatedTeam = JSON.stringify(adminTeam);
    await sql`
      INSERT INTO cms_team_members (id, record, position, updated_by)
      SELECT seed.value->>'id', seed.value, (seed.value->>'order')::integer - 1, 'system'
      FROM jsonb_array_elements(${updatedTeam}::jsonb) AS seed(value)
      WHERE NOT EXISTS (SELECT 1 FROM cms_records WHERE collection = 'team')
        AND NOT EXISTS (
          SELECT 1
          FROM cms_team_members AS existing
          WHERE NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(${updatedTeam}::jsonb) AS desired(value)
            WHERE desired.value->>'id' = existing.id
              AND desired.value = existing.record
          )
        )
      ON CONFLICT (id) DO NOTHING
    `;

    // Rollback after new writes: sync this table into cms_records before restoring the old data layer.
    await sql`INSERT INTO cms_migrations (version) VALUES (${teamTableMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  const contentTableMigration = "004_public_content_tables_v1";
  const contentTableMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${contentTableMigration}`;
  if (contentTableMigrationApplied.length === 0) {
    const collections = [
      ["expertises", contentTables.expertises, legacySeedRows.expertises, publicExpertiseRecords],
      ["projects", contentTables.projects, legacySeedRows.projects, publicProjectRecords],
      ["articles", contentTables.articles, legacySeedRows.articles, publicArticleRecords],
      ["news", contentTables.news, legacySeedRows.news, publicNewsRecords],
    ];

    for (const [collection, table, fixtures, records] of collections) {
      await sql`
        INSERT INTO ${sql.unsafe(table)} (id, record, position, updated_by, created_at, updated_at)
        SELECT legacy.id, legacy.record, legacy.position, legacy.updated_by, legacy.created_at, legacy.updated_at
        FROM cms_records AS legacy
        WHERE legacy.collection = ${collection}
          AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(${JSON.stringify(fixtures)}::jsonb) AS fixture(value)
            WHERE fixture.value->>'id' = legacy.id AND fixture.value = legacy.record
          )
        ON CONFLICT (id) DO NOTHING
      `;

      for (const [position, record] of records.entries()) {
        const payload = JSON.stringify(record);
        await sql`
          INSERT INTO ${sql.unsafe(table)} (id, record, position, updated_by)
          VALUES (${String(record.id)}, ${payload}::jsonb, ${position}, 'system')
          ON CONFLICT DO NOTHING
        `;
      }
    }

    await sql`INSERT INTO cms_migrations (version) VALUES (${contentTableMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  const homeContentMigration = "005_home_page_content_v1";
  const homeContentMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${homeContentMigration}`;
  if (homeContentMigrationApplied.length === 0) {
    for (const locale of ["fr", "en"]) {
      const payload = JSON.stringify({ locale, content: homeContent[locale] });
      await sql`
        INSERT INTO cms_home_content (id, record, position, updated_by)
        VALUES (${locale}, ${payload}::jsonb, 0, 'system')
        ON CONFLICT (id) DO NOTHING
      `;
    }
    await sql`INSERT INTO cms_migrations (version) VALUES (${homeContentMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  const teamImageMigration = "006_team_member_images";
  const teamImageMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${teamImageMigration}`;
  if (teamImageMigrationApplied.length === 0) {
    await sql`
      UPDATE cms_team_members
      SET image_url = record->>'image'
      WHERE image_url IS NULL AND record ? 'image'
    `;
    // Roll back by copying image_url into record.image, then dropping image_url.
    await sql`INSERT INTO cms_migrations (version) VALUES (${teamImageMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  const partnerLinksMigration = "007_partner_official_urls";
  const partnerLinksMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${partnerLinksMigration}`;
  if (partnerLinksMigrationApplied.length === 0) {
    await sql`
      UPDATE cms_records
      SET record = jsonb_set(record, '{url}', to_jsonb(CASE id
            WHEN 'pa2' THEN 'https://abht.ma/'
            WHEN 'pa4' THEN 'https://fdim-mine.com/'
          END), true),
          updated_by = 'system',
          updated_at = now()
      WHERE collection = 'partners'
        AND ((id = 'pa2' AND record->>'url' IN ('abh-tensift.ma', 'http://abh-tensift.ma/', 'https://abh-tensift.ma/'))
          OR (id = 'pa4' AND record->>'url' IN ('fdim.ma', 'http://fdim.ma/', 'https://fdim.ma/')))
    `;
    // Roll back by setting pa2 to abh-tensift.ma and pa4 to fdim.ma, then removing this marker.
    await sql`INSERT INTO cms_migrations (version) VALUES (${partnerLinksMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  const partnerCanonicalUrlsMigration = "008_partner_canonical_urls";
  const partnerCanonicalUrlsMigrationApplied = await sql`SELECT version FROM cms_migrations WHERE version = ${partnerCanonicalUrlsMigration}`;
  if (partnerCanonicalUrlsMigrationApplied.length === 0) {
    await sql`
      UPDATE cms_records
      SET record = jsonb_set(record, '{url}', to_jsonb(CASE id
            WHEN 'pa1' THEN 'https://www.onhym.com/fr'
            WHEN 'pa3' THEN 'https://www.uca.ma/fr'
            WHEN 'pa5' THEN 'https://www.clustersolaire.ma/'
            WHEN 'pa6' THEN 'https://www.cnrst.ma/fr/'
          END), true),
          updated_by = 'system',
          updated_at = now()
      WHERE collection = 'partners'
        AND ((id = 'pa1' AND record->>'url' IN ('onhym.com', 'https://onhym.com/'))
          OR (id = 'pa3' AND record->>'url' IN ('uca.ma', 'https://uca.ma/'))
          OR (id = 'pa5' AND record->>'url' IN ('clustersolaire.ma', 'https://clustersolaire.ma/'))
          OR (id = 'pa6' AND record->>'url' IN ('cnrst.ma', 'https://cnrst.ma/')))
    `;
    // Roll back by restoring each original bare domain, then removing this marker.
    await sql`INSERT INTO cms_migrations (version) VALUES (${partnerCanonicalUrlsMigration}) ON CONFLICT (version) DO NOTHING`;
  }

  console.log("Admin data schema is ready.");
} catch {
  console.error("Admin data migration failed. Database details were not logged.");
  process.exitCode = 1;
}
