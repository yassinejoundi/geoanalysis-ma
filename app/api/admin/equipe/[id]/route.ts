import { deleteAdminRecord, updateAdminRecord } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { isIdentifier, parseTeamFields } from "@/lib/server/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const fields = parseTeamFields(body.value);
  if (!fields) return mutationFailureResponse(400, "Invalid request.");
  try {
    const record = { id, ...fields };
    if (!await updateAdminRecord(access.actor, "team", id, record, fields.order - 1)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "team.update", "success");
    return mutationResponse({ data: record });
  } catch {
    logAdminMutation(request, access.actor, "team.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  try {
    if (!await deleteAdminRecord(access.actor, "team", id)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "team.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "team.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
