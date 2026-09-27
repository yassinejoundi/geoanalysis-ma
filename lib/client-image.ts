const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_WEBP_BYTES = 4 * 1024 * 1024;
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function encodeWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Conversion WebP impossible."));
    }, "image/webp", quality);
  });
}

export async function compressImageToWebp(file: File) {
  if (!supportedTypes.has(file.type)) throw new Error("Choisissez une image JPEG, PNG ou WebP.");
  if (file.size > MAX_SOURCE_BYTES) throw new Error("Image source supérieure à 20 Mo.");

  const bitmap = await createImageBitmap(file);
  if (bitmap.width * bitmap.height > 30_000_000) {
    bitmap.close();
    throw new Error("Image trop grande. Réduisez ses dimensions avant l’envoi.");
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Conversion image indisponible.");
    context.drawImage(bitmap, 0, 0);

    let blob: Blob | null = null;
    for (const quality of [0.94, 0.9, 0.86]) {
      blob = await encodeWebp(canvas, quality);
      if (blob.type !== "image/webp") throw new Error("WebP n’est pas pris en charge par ce navigateur.");
      if (blob.size <= MAX_WEBP_BYTES) break;
    }
    canvas.width = 0;
    canvas.height = 0;
    if (!blob || blob.size > MAX_WEBP_BYTES) throw new Error("Image supérieure à 4 Mo après compression.");

    const baseName = file.name.replace(/\\/g, "/").split("/").pop()?.replace(/\.[^.]+$/, "") ?? "image";
    const safeName = baseName.replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(0, 160) || "image";
    return new File([blob], `${safeName}.webp`, { type: "image/webp", lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}
