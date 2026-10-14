import { sendApiForm } from "@/lib/api-client";
import type { ArticleFileAttachment, EditorialFileCollection } from "@/lib/content/article-document";

export async function uploadArticleFileToCloudinary(file: File, collection: EditorialFileCollection = "articles") {
  const form = new FormData();
  form.append("file", file);
  form.append("collection", collection);
  return sendApiForm<ArticleFileAttachment>("/api/admin/editorial-files", form);
}
