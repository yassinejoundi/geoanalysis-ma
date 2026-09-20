import { getAdminRecord, updateAdminRecord } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { hasOnlyKeys, isRecord, parseSettingsFields } from "@/lib/server/validation";

const keys = ["siteName", "languages", "phone", "email", "address", "hours", "linkedin", "seoTitle", "seoDescription"] as const;

export async function PATCH(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, keys)) return mutationFailureResponse(400, "Invalid request.");
  const updates = parseSettingsFields(body.value);
  if (!updates) return mutationFailureResponse(400, "Invalid request.");
  try {
    const current = await getAdminRecord<Record<string, unknown>>(access.actor, "settings", "site");
    if (!current) return mutationFailureResponse(404, "Record not found.");
    const record = { ...current, ...updates };
    if (!await updateAdminRecord(access.actor, "settings", "site", record)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "settings.update", "success");
    return mutationResponse({ data: record });
  } catch {
    logAdminMutation(request, access.actor, "settings.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
