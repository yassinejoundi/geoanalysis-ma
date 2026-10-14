import { sendApiForm } from "@/lib/api-client";
import type { ArticleFileAttachment } from "@/lib/content/article-document";

export async function uploadArticleFileToCloudinary(file: File) {
  const form = new FormData();
  form.append("file", file);
  return sendApiForm<ArticleFileAttachment>("/api/admin/articles/files", form);
}
