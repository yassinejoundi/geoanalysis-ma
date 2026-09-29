import { compressImageToWebp } from "@/lib/client-image";
import { sendApiForm } from "@/lib/api-client";
import type { AdminMediaFolder } from "@/lib/media";

export type UploadedImage = { id: string; name: string; url: string };

export async function uploadImageToCloudinary(file: File, folder?: AdminMediaFolder) {
  const form = new FormData();
  form.append("file", await compressImageToWebp(file));
  if (folder) form.append("folder", folder);
  return sendApiForm<UploadedImage>("/api/admin/media", form);
}
