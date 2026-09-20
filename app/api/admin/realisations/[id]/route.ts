import { deleteAdminRecord, getAdminRecord, updateAdminRecord, validateProjectReferences } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { hasOnlyKeys, isIdentifier, isRecord, parseProjectFields } from "@/lib/server/validation";

type RouteContext = { params: Promise<{ id: string }> };
const fields = ["state", "expertiseId", "subServiceId", "location", "date", "title", "context", "methodology", "results", "seoTitle", "seoDescription", "gallery"] as const;

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, fields)) return mutationFailureResponse(400, "Invalid request.");

  try {
    const current = await getAdminRecord<Record<string, unknown>>(access.actor, "projects", id);
    if (!current) return mutationFailureResponse(404, "Record not found.");
    const candidate = { ...current, ...body.value };
    const parsed = parseProjectFields(candidate);
    if (!parsed) return mutationFailureResponse(400, "Invalid request.");
    if (!await validateProjectReferences(access.actor, parsed.expertiseId, parsed.subServiceId, parsed.gallery.map((image) => image.id))) return mutationFailureResponse(422, "An expertise, service, or media item is unavailable.");
    if (!await updateAdminRecord(access.actor, "projects", id, { id, ...parsed })) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "projects.update", "success");
    return mutationResponse({ data: { id, ...parsed } });
  } catch {
    logAdminMutation(request, access.actor, "projects.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  try {
    if (!await deleteAdminRecord(access.actor, "projects", id)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "projects.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "projects.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
