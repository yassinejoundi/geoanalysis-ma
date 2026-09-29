import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";
import { v2 as cloudinary } from "cloudinary";

nextEnv.loadEnvConfig(process.cwd());

const tableFields = [
  { table: "cms_articles", folder: "articles", fields: [["image", "src"]] },
  { table: "cms_actualites", folder: "actualites", fields: [["image", "src"]] },
  { table: "cms_realisations", folder: "realisations", fields: [["image"]] },
  { table: "cms_home_content", folder: "accueil", fields: [["content", "aboutImage"]] },
  { table: "cms_bureau_content", folder: "bureau", fields: [["content", "heroImage"]] },
  { table: "cms_expertise_page_content", folder: "expertises", fields: [["content", "heroImage"]] },
  { table: "cms_expertises", folder: "expertises", fields: [["image", "src"]] },
];
const supportedTables = new Set(tableFields.map(({ table }) => table));

const projectRoot = process.cwd();
const publicRoot = path.resolve(projectRoot, "public");
const manifestDir = path.resolve(projectRoot, "scripts", "media-migration-manifests");

function usage() {
  console.log("Usage: node scripts/migrate-cms-images-to-cloudinary.mjs --apply");
  console.log("       node scripts/migrate-cms-images-to-cloudinary.mjs --rollback <manifest.json>");
}

function getAt(value, keys) {
  return keys.reduce((current, key) => current?.[key], value);
}

function setAt(value, keys, nextValue) {
  let current = value;
  for (const key of keys.slice(0, -1)) current = current[key];
  current[keys.at(-1)] = nextValue;
}

function asRecord(value) {
  return typeof value === "string" ? JSON.parse(value) : structuredClone(value);
}

function localFileFor(url) {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) return null;
  const pathname = decodeURIComponent(url.split(/[?#]/, 1)[0]);
  const file = path.resolve(publicRoot, pathname.slice(1));
  if (!file.startsWith(publicRoot + path.sep)) throw new Error(`Image path escapes public/: ${url}`);
  return file;
}

function updateQuery(txn, change, previousRecord, nextRecord) {
  if (!supportedTables.has(change.table)) throw new Error(`Unsupported CMS table: ${change.table}`);
  const table = txn.unsafe(change.table);
  return txn`WITH updated AS (UPDATE ${table} SET record = ${JSON.stringify(nextRecord)}::jsonb, updated_at = now() WHERE id = ${change.id} AND record = ${JSON.stringify(previousRecord)}::jsonb RETURNING id) SELECT CASE WHEN EXISTS (SELECT 1 FROM updated) THEN 1 ELSE 1 / (SELECT count(*) FROM updated) END AS applied`;
}

async function applyMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!databaseUrl || !cloudName || !apiKey || !apiSecret) {
    throw new Error("Set DATABASE_URL and Cloudinary credentials in .env.local before applying.");
  }

  const sql = neon(databaseUrl);
  const changes = [];
  for (const collection of tableFields) {
    const rows = await sql.query(`SELECT id, record FROM ${collection.table}`);
    for (const row of rows) {
      const record = asRecord(row.record);
      for (const keys of collection.fields) {
        const url = getAt(record, keys);
        const file = localFileFor(url);
        if (!file) continue;
        const relativeFile = path.relative(publicRoot, file).split(path.sep).join("/");
        changes.push({
          table: collection.table,
          id: row.id,
          field: keys,
          source: url,
          file,
          relativeFile,
          folder: `geoanalysis/${collection.folder}`,
          previousRecord: record,
        });
      }
    }
  }

  if (!changes.length) {
    console.log("No local image URLs found in the configured CMS fields.");
    return;
  }

  for (const change of changes) {
    if (!(await stat(change.file)).isFile()) throw new Error(`Missing project image: ${change.relativeFile}`);
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  const response = await fetch("https://api.cloudinary.com/", {
    method: "HEAD",
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  const timestamp = Math.floor(Date.parse(response.headers.get("date") ?? "") / 1000);
  if (!Number.isFinite(timestamp)) throw new Error("Could not read Cloudinary server time.");

  const uploads = new Map();
  for (const change of changes) {
    const key = `${change.folder}/${change.relativeFile}`;
    if (uploads.has(key)) continue;
    const publicId = path.basename(change.relativeFile, path.extname(change.relativeFile));
    const result = await cloudinary.uploader.upload(change.file, {
      folder: change.folder,
      public_id: publicId,
      resource_type: "image",
      overwrite: true,
      unique_filename: false,
      timestamp,
    });
    uploads.set(key, { url: result.secure_url, publicId: result.public_id });
    console.log(`Uploaded ${change.relativeFile} -> ${result.public_id}`);
  }

  const manifest = {
    version: 1,
    createdAt: new Date().toISOString(),
    changes: changes.map(({ table, id, field, source, relativeFile, folder }) => {
      const uploaded = uploads.get(`${folder}/${relativeFile}`);
      return { table, id, field, from: source, to: uploaded.url, file: relativeFile, publicId: uploaded.publicId };
    }),
  };
  await mkdir(manifestDir, { recursive: true });
  const manifestPath = path.join(manifestDir, `cloudinary-cms-images-${new Date().toISOString().slice(0, 10)}.json`);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" }).catch(async (error) => {
    if (error.code !== "EEXIST") throw error;
    const uniquePath = path.join(manifestDir, `cloudinary-cms-images-${Date.now()}.json`);
    await writeFile(uniquePath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
    manifest.path = path.relative(projectRoot, uniquePath);
  });

  const nextRecords = changes.map((change, index) => {
    const nextRecord = structuredClone(change.previousRecord);
    const entry = manifest.changes[index];
    setAt(nextRecord, entry.field, entry.to);
    return { ...change, nextRecord };
  });

  await sql.transaction((txn) => nextRecords.map((change) => updateQuery(txn, change, change.previousRecord, change.nextRecord)), {
    isolationLevel: "Serializable",
  });
  console.log(`Updated ${changes.length} database image references.`);
  console.log(`Rollback manifest: ${manifest.path ?? path.relative(projectRoot, manifestPath)}`);
}

async function rollbackMigration(manifestFile) {
  if (!manifestFile) throw new Error("Provide the migration manifest path after --rollback.");
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env.local before rollback.");
  const manifest = JSON.parse(await readFile(path.resolve(projectRoot, manifestFile), "utf8"));
  if (manifest.version !== 1 || !Array.isArray(manifest.changes)) throw new Error("Unsupported migration manifest.");

  const sql = neon(process.env.DATABASE_URL);
  const reversals = [];
  for (const change of manifest.changes) {
    const rows = await sql.query(`SELECT id, record FROM ${change.table} WHERE id = $1`, [change.id]);
    if (rows.length !== 1) throw new Error(`Cannot roll back ${change.table}/${change.id}: row is missing.`);
    const previousRecord = asRecord(rows[0].record);
    if (getAt(previousRecord, change.field) !== change.to) {
      throw new Error(`Cannot roll back ${change.table}/${change.id}: image URL has changed since migration.`);
    }
    const nextRecord = structuredClone(previousRecord);
    setAt(nextRecord, change.field, change.from);
    reversals.push({ ...change, previousRecord, nextRecord });
  }

  await sql.transaction((txn) => reversals.map((change) => updateQuery(txn, change, change.previousRecord, change.nextRecord)), {
    isolationLevel: "Serializable",
  });
  console.log(`Restored ${reversals.length} database image references. Cloudinary uploads were retained.`);
}

try {
  const [mode, manifestPath] = process.argv.slice(2);
  if (mode === "--apply") await applyMigration();
  else if (mode === "--rollback") await rollbackMigration(manifestPath);
  else {
    usage();
    process.exitCode = 2;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Migration failed.");
  process.exitCode = 1;
}
