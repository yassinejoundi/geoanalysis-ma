import { adminMutationAccess, limitedResponse, logAdminMutation, mutationFailureResponse, mutationResponse } from "@/lib/server/api";
import { createAdminRecord, listAdminRecords } from "@/lib/server/data/admin";
import { readBoundedBody, isSameOrigin } from "@/lib/server/http";
import { MAX_MEDIA_BYTES, isIdentifier } from "@/lib/server/validation";
import { storeMedia } from "@/lib/server/cloudinary";

const MAX_MULTIPART_BYTES = MAX_MEDIA_BYTES + 16 * 1024;

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
      ? "L’image dépasse la limite de téléversement."
      : "Le fichier image n’a pas pu être lu. Réessayez.");
    const bodyBytes = new ArrayBuffer(bounded.bytes.byteLength);
    new Uint8Array(bodyBytes).set(bounded.bytes);
    let form: FormData;
    try {
      form = await new Request(request.url, { method: "POST", headers: { "Content-Type": contentType }, body: bodyBytes }).formData();
    } catch {
      return mutationFailureResponse(400, "Les données du fichier image sont invalides.");
    }
    const file = form.get("file");
    const folder = form.get("folder");
    if (!(file instanceof File) || (folder !== null && folder !== "home" && folder !== "bureau") ||
      [...form.keys()].some((key) => key !== "file" && key !== "folder")) {
      return mutationFailureResponse(400, "Le fichier ou son dossier de destination est invalide.");
    }
    const result = await storeMedia(file, access.actor.id, folder === "home" || folder === "bureau" ? folder : "default");
    if ("error" in result) return mutationFailureResponse(
      result.error === "too-large" ? 413 : 415,
      result.error === "too-large" ? "L’image dépasse la limite de 4 Mo après conversion." : "Choisissez une image JPEG, PNG ou WebP valide.",
    );
    if (!isIdentifier(result.media.id)) return mutationFailureResponse(503, "The request could not be processed.");
    const records = await listAdminRecords(access.actor, "media");
    if (!await createAdminRecord(access.actor, "media", result.media.id, { ...result.media, ownerId: access.actor.id }, records.length)) return mutationFailureResponse(409, "A record with this value already exists.");
    logAdminMutation(request, access.actor, "media.upload", "success");
    return mutationResponse({ data: result.media }, 201);
  } catch {
    logAdminMutation(request, access.actor, "media.upload", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
