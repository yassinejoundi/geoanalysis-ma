import { deleteAdminRecord, getAdminRecord, updateAdminRecord } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { hasOnlyKeys, isIdentifier, isRecord, messageStatus } from "@/lib/server/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, ["status"])) return mutationFailureResponse(400, "Invalid request.");
  const status = messageStatus(body.value.status);
  if (!status) return mutationFailureResponse(400, "Invalid request.");
  try {
    const current = await getAdminRecord<Record<string, unknown>>(access.actor, "messages", id);
    if (!current) return mutationFailureResponse(404, "Record not found.");
    const record = { ...current, status };
    if (!await updateAdminRecord(access.actor, "messages", id, record)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "messages.update", "success");
    return mutationResponse({ data: { id, status } });
  } catch {
    logAdminMutation(request, access.actor, "messages.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  try {
    if (!await deleteAdminRecord(access.actor, "messages", id)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "messages.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "messages.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
