import { deleteAdminRecord, getAdminRecord, updateAdminRecord } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { hasOnlyKeys, isIdentifier, isRecord, parseEditorialFields } from "@/lib/server/validation";

type RouteContext = { params: Promise<{ id: string }> };
const keys = ["state", "category", "tags", "date", "title", "content", "seoTitle", "seoDescription", "readingTime"] as const;

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, keys)) return mutationFailureResponse(400, "Invalid request.");
  try {
    const current = await getAdminRecord<Record<string, unknown>>(access.actor, "articles", id);
    if (!current) return mutationFailureResponse(404, "Record not found.");
    const fields = parseEditorialFields({ ...current, ...body.value }, "articles");
    if (!fields) return mutationFailureResponse(400, "Invalid request.");
    const record = { id, ...fields };
    if (!await updateAdminRecord(access.actor, "articles", id, record)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "articles.update", "success");
    return mutationResponse({ data: record });
  } catch {
    logAdminMutation(request, access.actor, "articles.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  try {
    if (!await deleteAdminRecord(access.actor, "articles", id)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "articles.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "articles.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
