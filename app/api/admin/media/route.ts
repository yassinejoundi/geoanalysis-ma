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
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("multipart/form-data;")) return mutationFailureResponse(415, "Multipart form data required.");
  try {
    const limited = await limitedResponse(request, "upload", access.actor.id);
    if (limited) return limited;
    const bounded = await readBoundedBody(request, MAX_MULTIPART_BYTES);
    if (!bounded.ok) return mutationFailureResponse(bounded.status, "Invalid request.");
    const bodyBytes = new ArrayBuffer(bounded.bytes.byteLength);
    new Uint8Array(bodyBytes).set(bounded.bytes);
    let form: FormData;
    try {
      form = await new Request(request.url, { method: "POST", headers: { "Content-Type": contentType }, body: bodyBytes }).formData();
    } catch {
      return mutationFailureResponse(400, "Invalid request.");
    }
    const file = form.get("file");
    if (!(file instanceof File) || [...form.keys()].some((key) => key !== "file")) return mutationFailureResponse(400, "Invalid request.");
    const result = await storeMedia(file, access.actor.id);
    if ("error" in result) return mutationFailureResponse(result.error === "too-large" ? 413 : 415, "Unsupported file.");
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
