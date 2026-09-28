import { isLocale } from "@/lib/i18n";
import { adminMutationAccess, limitedResponse, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { saveBureauContent } from "@/lib/server/data/admin";
import { hasOnlyKeys, isRecord, parseBureauContentFields } from "@/lib/server/validation";

type RouteContext = { params: Promise<{ locale: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { locale: value } = await params;
  if (!isLocale(value)) return mutationFailureResponse(404, "Content not found.");

  try {
    const limited = await limitedResponse(request, "content", access.actor.id);
    if (limited) return limited;
    const body = await readMutationJson(request, 256 * 1024);
    if ("response" in body) return body.response;
    if (!isRecord(body.value) || !hasOnlyKeys(body.value, ["content"])) {
      return mutationFailureResponse(400, "Invalid request.");
    }
    const content = parseBureauContentFields(body.value.content);
    if (!content) return mutationFailureResponse(400, "Invalid request.");
    await saveBureauContent(access.actor, value, content);
    logAdminMutation(request, access.actor, "bureau.update", "success");
    return mutationResponse({ data: content });
  } catch {
    logAdminMutation(request, access.actor, "bureau.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
