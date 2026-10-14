import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { basename } from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { MAX_ARTICLE_FILE_BYTES, validateArticleFile, validateMediaFile } from "@/lib/server/validation";
import type { AdminMediaFolder } from "@/lib/media";
import type { EditorialFileCollection } from "@/lib/content/article-document";

async function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Media storage is not configured.");

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  const serverDate = (await fetch("https://api.cloudinary.com/", {
    method: "HEAD",
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })).headers.get("date");
  const timestamp = Math.floor(Date.parse(serverDate ?? "") / 1000);
  if (!Number.isFinite(timestamp)) throw new Error("Media storage time is unavailable.");
  return timestamp;
}

export async function storeMedia(file: File, actorId: string, folder?: AdminMediaFolder) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const validation = validateMediaFile(file, bytes);
  if (validation !== "valid") return { error: validation } as const;

  const timestamp = await configureCloudinary();
  const actorFolder = createHash("sha256").update(actorId).digest("hex").slice(0, 16);
  const publicId = randomUUID();
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";

  const uploaded = await new Promise<{ secure_url: string; bytes: number; format: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder ? `geoanalysis/${folder}` : "geoanalysis/" + actorFolder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
        unique_filename: false,
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif", "pdf"],
        timestamp,
      },
      (error, result) => {
        if (error || !result) reject(new Error("Media storage failed."));
        else resolve({ secure_url: result.secure_url, bytes: result.bytes, format: result.format });
      },
    );
    stream.end(Buffer.from(bytes));
  });

  return {
    media: {
      id: "media-" + publicId,
      name: basename(file.name.replaceAll("\\", "/")).slice(0, 180),
      kind: uploaded.format.toUpperCase(),
      size: uploaded.bytes,
      url: uploaded.secure_url,
    },
  } as const;
}

export async function storeEditorialFile(file: File, collection: EditorialFileCollection) {
  if (file.size > MAX_ARTICLE_FILE_BYTES) return { error: "too-large" } as const;
  if (!file.name || file.name.length > 180) return { error: "unsupported" } as const;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const validation = validateArticleFile(file, bytes);
  if (typeof validation !== "object") return { error: validation } as const;

  const timestamp = await configureCloudinary();
  const originalName = basename(file.name.replaceAll("\\", "/")).slice(0, 180);
  const uploadName = originalName.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/_+/g, "_");
  const extension = `.${validation.format.toLowerCase()}`;
  const uploadFilename = `${uploadName.replace(/\.[^.]*$/, "").slice(0, 180 - extension.length) || "article-file"}${extension}`;
  const uploaded = await new Promise<{ secure_url: string; bytes: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `geoanalysis/${collection}/files`,
        filename: uploadFilename,
        resource_type: "raw",
        overwrite: false,
        use_filename: true,
        unique_filename: true,
        allowed_formats: ["pdf", "docx", "xlsx", "csv"],
        timestamp,
      },
      (error, result) => {
        if (error || !result) reject(new Error("Article file upload failed."));
        else resolve({ secure_url: result.secure_url, bytes: result.bytes });
      },
    );
    stream.end(Buffer.from(bytes));
  });

  return {
    file: {
      id: `${collection === "articles" ? "article" : collection === "actualites" ? "news" : "project"}-file-` + randomUUID(),
      name: originalName,
      kind: validation.format,
      size: uploaded.bytes,
      url: uploaded.secure_url,
    },
  } as const;
}

export async function storeArticleFile(file: File) {
  return storeEditorialFile(file, "articles");
}
