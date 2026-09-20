import { adminMutationAccess, isUniqueConflict, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { deleteAdminRecord, getAdminRecord, listAdminRecords, updateAdminRecord } from "@/lib/server/data/admin";
import { hasOnlyKeys, isIdentifier, isRecord, parseExpertiseFields, parseSubServiceFields } from "@/lib/server/validation";
import type { AdminExpertise } from "@/lib/content/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value)) return mutationFailureResponse(400, "Invalid request.");

  try {
    const root = await getAdminRecord<AdminExpertise>(access.actor, "expertises", id);
    if (root && hasOnlyKeys(body.value, ["subServiceOrder"]) && Array.isArray(body.value.subServiceOrder)) {
      const ids = body.value.subServiceOrder;
      if (ids.some((value) => typeof value !== "string" || !isIdentifier(value))) return mutationFailureResponse(400, "Invalid request.");
      const children = root.subServices;
      if (ids.length !== children.length || new Set(ids).size !== children.length || children.some((child) => !ids.includes(child.id))) {
        return mutationFailureResponse(409, "The records have changed. Reload and try again.");
      }
      const updated = { ...root, subServices: ids.map((childId) => children.find((child) => child.id === childId)!) };
      if (!await updateAdminRecord(access.actor, "expertises", id, updated)) return mutationFailureResponse(404, "Record not found.");
      logAdminMutation(request, access.actor, "expertises.subservice.reorder", "success");
      return mutationResponse({ data: updated });
    }

    if (root) {
      const fields = parseExpertiseFields(body.value, true);
      if (!fields) return mutationFailureResponse(400, "Invalid request.");
      if (fields.slug && (await listAdminRecords<AdminExpertise>(access.actor, "expertises")).some((item) => item.id !== id && item.slug === fields.slug)) {
        return mutationFailureResponse(409, "A record with this value already exists.");
      }
      const updated = { ...root, ...fields };
      if (!await updateAdminRecord(access.actor, "expertises", id, updated)) return mutationFailureResponse(404, "Record not found.");
      logAdminMutation(request, access.actor, "expertises.update", "success");
      return mutationResponse({ data: updated });
    }

    const parents = await listAdminRecords<AdminExpertise>(access.actor, "expertises");
    const parent = parents.find((item) => item.subServices.some((child) => child.id === id));
    if (!parent) return mutationFailureResponse(404, "Record not found.");
    const fields = parseSubServiceFields(body.value, true);
    if (!fields) return mutationFailureResponse(400, "Invalid request.");
    const updated = {
      ...parent,
      subServices: parent.subServices.map((child) => child.id === id ? { ...child, ...fields } : child),
    };
    if (!await updateAdminRecord(access.actor, "expertises", parent.id, updated)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "expertises.subservice.update", "success");
    return mutationResponse({ data: updated });
  } catch (error) {
    logAdminMutation(request, access.actor, "expertises.update", "failure");
    if (isUniqueConflict(error)) return mutationFailureResponse(409, "A record with this value already exists.");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");

  try {
    const root = await getAdminRecord<AdminExpertise>(access.actor, "expertises", id);
    if (root) {
      const projects = await listAdminRecords<{ expertiseId: string }>(access.actor, "projects");
      if (projects.some((project) => project.expertiseId === id)) return mutationFailureResponse(409, "This record is still in use.");
      if (!await deleteAdminRecord(access.actor, "expertises", id)) return mutationFailureResponse(404, "Record not found.");
    } else {
      const parents = await listAdminRecords<AdminExpertise>(access.actor, "expertises");
      const parent = parents.find((item) => item.subServices.some((child) => child.id === id));
      if (!parent) return mutationFailureResponse(404, "Record not found.");
      const projects = await listAdminRecords<{ subServiceId: string }>(access.actor, "projects");
      if (projects.some((project) => project.subServiceId === id)) return mutationFailureResponse(409, "This record is still in use.");
      const updated = { ...parent, subServices: parent.subServices.filter((child) => child.id !== id) };
      if (!await updateAdminRecord(access.actor, "expertises", parent.id, updated)) return mutationFailureResponse(404, "Record not found.");
    }
    logAdminMutation(request, access.actor, "expertises.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "expertises.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
