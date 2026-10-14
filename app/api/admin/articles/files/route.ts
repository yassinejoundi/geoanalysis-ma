import { adminMutationAccess, limitedResponse, logAdminMutation, mutationFailureResponse, mutationResponse } from "@/lib/server/api";
import { createAdminRecord, listAdminRecords } from "@/lib/server/data/admin";
import { isSameOrigin, readBoundedBody } from "@/lib/server/http";
import { storeArticleFile } from "@/lib/server/cloudinary";
import { MAX_ARTICLE_FILE_BYTES, isIdentifier } from "@/lib/server/validation";

const MAX_MULTIPART_BYTES = MAX_ARTICLE_FILE_BYTES + 16 * 1024;

export async function POST(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  if (!isSameOrigin(request)) return mutationFailureResponse(403, "Same-origin request required.");
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) return mutationFailureResponse(415, "Multipart form data required.");

  try {
    const limited = await limitedResponse(request, "upload", access.actor.id);
    if (limited) return limited;
    const bounded = await readBoundedBody(request, MAX_MULTIPART_BYTES);
    if (!bounded.ok) return mutationFailureResponse(bounded.status, bounded.status === 413
      ? "Le fichier dépasse la limite de téléversement de 15 Mo."
      : "Le fichier n’a pas pu être lu. Réessayez.");
    const bodyBytes = new ArrayBuffer(bounded.bytes.byteLength);
    new Uint8Array(bodyBytes).set(bounded.bytes);
    let form: FormData;
    try {
      form = await new Request(request.url, { method: "POST", headers: { "Content-Type": contentType }, body: bodyBytes }).formData();
    } catch {
      return mutationFailureResponse(400, "Les données du fichier sont invalides.");
    }
    const uploads = form.getAll("file");
    if (uploads.length !== 1 || !(uploads[0] instanceof File) || [...form.keys()].some((key) => key !== "file")) {
      return mutationFailureResponse(400, "Sélectionnez un seul fichier valide.");
    }

    const result = await storeArticleFile(uploads[0]);
    if ("error" in result) return mutationFailureResponse(
      result.error === "too-large" ? 413 : 415,
      result.error === "too-large"
        ? "Le fichier dépasse la limite de 15 Mo."
        : "Choisissez un fichier PDF, DOCX, XLSX ou CSV valide.",
    );
    if (!isIdentifier(result.file.id)) return mutationFailureResponse(503, "The request could not be processed.");
    const records = await listAdminRecords(access.actor, "media");
    if (!await createAdminRecord(access.actor, "media", result.file.id, { ...result.file, ownerId: access.actor.id }, records.length)) {
      return mutationFailureResponse(409, "A record with this value already exists.");
    }
    logAdminMutation(request, access.actor, "article-file.upload", "success");
    return mutationResponse({ data: result.file }, 201);
  } catch {
    logAdminMutation(request, access.actor, "article-file.upload", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
