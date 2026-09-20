import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { basename } from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { validateMediaFile } from "@/lib/server/validation";

export async function storeMedia(file: File, actorId: string) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const validation = validateMediaFile(file, bytes);
  if (validation !== "valid") return { error: validation } as const;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Media storage is not configured.");

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  const actorFolder = createHash("sha256").update(actorId).digest("hex").slice(0, 16);
  const publicId = randomUUID();
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";

  const uploaded = await new Promise<{ secure_url: string; bytes: number; format: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "geoanalysis/" + actorFolder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
        unique_filename: false,
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif", "pdf"],
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
