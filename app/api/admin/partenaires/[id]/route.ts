import { deleteAdminRecord, updateAdminRecord } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { isIdentifier, parsePartnerFields } from "@/lib/server/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const fields = parsePartnerFields(body.value);
  if (!fields) return mutationFailureResponse(400, "Invalid request.");
  try {
    const record = { id, ...fields };
    if (!await updateAdminRecord(access.actor, "partners", id, record)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "partners.update", "success");
    return mutationResponse({ data: record });
  } catch {
    logAdminMutation(request, access.actor, "partners.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  try {
    if (!await deleteAdminRecord(access.actor, "partners", id)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "partners.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "partners.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
