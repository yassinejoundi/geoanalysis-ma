import { randomUUID } from "node:crypto";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { createAdminRecord, reorderAdminRecords } from "@/lib/server/data/admin";
import { hasOnlyKeys, isIdentifier, isRecord, parseTeamFields } from "@/lib/server/validation";

export async function POST(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const fields = parseTeamFields(body.value);
  if (!fields) return mutationFailureResponse(400, "Invalid request.");
  try {
    const record = { id: "team-" + randomUUID(), ...fields };
    if (!await createAdminRecord(access.actor, "team", record.id, record, fields.order - 1)) return mutationFailureResponse(409, "A record with this value already exists.");
    logAdminMutation(request, access.actor, "team.create", "success");
    return mutationResponse({ data: record }, 201);
  } catch {
    logAdminMutation(request, access.actor, "team.create", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function PATCH(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, ["order"]) || !Array.isArray(body.value.order) || body.value.order.length > 100 || body.value.order.some((id) => typeof id !== "string" || !isIdentifier(id))) return mutationFailureResponse(400, "Invalid request.");
  try {
    if (!await reorderAdminRecords(access.actor, "team", body.value.order as string[])) return mutationFailureResponse(409, "The records have changed. Reload and try again.");
    logAdminMutation(request, access.actor, "team.reorder", "success");
    return mutationResponse({ data: { accepted: true } });
  } catch {
    logAdminMutation(request, access.actor, "team.reorder", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
