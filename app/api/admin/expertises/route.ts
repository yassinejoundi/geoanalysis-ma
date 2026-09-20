import { randomUUID } from "node:crypto";
import { adminMutationAccess, isUniqueConflict, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { createAdminRecord, listAdminRecords, reorderAdminRecords, updateAdminRecord } from "@/lib/server/data/admin";
import { hasOnlyKeys, isIdentifier, isRecord, parseExpertiseFields, parseSubServiceFields } from "@/lib/server/validation";
import type { AdminExpertise, AdminSubService } from "@/lib/content/admin";

export async function POST(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const value = body.value;

  try {
    if (isRecord(value) && value.kind === "subService") {
      if (!hasOnlyKeys(value, ["kind", "expertiseId", "state", "name", "short"]) || !isIdentifier(String(value.expertiseId ?? ""))) {
        return mutationFailureResponse(400, "Invalid request.");
      }
      const fields = parseSubServiceFields({ state: value.state, name: value.name, short: value.short });
      if (!fields?.state || !fields.name || !fields.short) return mutationFailureResponse(400, "Invalid request.");
      const parent = await listAdminRecords<AdminExpertise>(access.actor, "expertises");
      const expertise = parent.find((item) => item.id === value.expertiseId);
      if (!expertise) return mutationFailureResponse(404, "Record not found.");
      const subService: AdminSubService = { id: "service-" + randomUUID(), ...fields } as AdminSubService;
      const updated = { ...expertise, subServices: [...expertise.subServices, subService] };
      if (!await updateAdminRecord(access.actor, "expertises", expertise.id, updated)) return mutationFailureResponse(404, "Record not found.");
      logAdminMutation(request, access.actor, "expertises.subservice.create", "success");
      return mutationResponse({ data: updated }, 201);
    }

    const fields = parseExpertiseFields(value);
    if (!fields?.state || !fields.slug || !fields.name || !fields.short) return mutationFailureResponse(400, "Invalid request.");
    const current = await listAdminRecords<AdminExpertise>(access.actor, "expertises");
    if (current.some((item) => item.slug === fields.slug)) return mutationFailureResponse(409, "A record with this value already exists.");
    const record: AdminExpertise = { id: "expertise-" + randomUUID(), ...fields, subServices: [] } as AdminExpertise;
    if (!await createAdminRecord(access.actor, "expertises", record.id, record, current.length)) {
      return mutationFailureResponse(409, "A record with this value already exists.");
    }
    logAdminMutation(request, access.actor, "expertises.create", "success");
    return mutationResponse({ data: record }, 201);
  } catch (error) {
    logAdminMutation(request, access.actor, "expertises.create", "failure");
    if (isUniqueConflict(error)) return mutationFailureResponse(409, "A record with this value already exists.");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function PATCH(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, ["order"]) || !Array.isArray(body.value.order) || body.value.order.some((id) => typeof id !== "string" || !isIdentifier(id))) {
    return mutationFailureResponse(400, "Invalid request.");
  }

  try {
    const updated = await reorderAdminRecords(access.actor, "expertises", body.value.order as string[]);
    if (!updated) return mutationFailureResponse(409, "The records have changed. Reload and try again.");
    logAdminMutation(request, access.actor, "expertises.reorder", "success");
    return mutationResponse({ data: { accepted: true } });
  } catch {
    logAdminMutation(request, access.actor, "expertises.reorder", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
