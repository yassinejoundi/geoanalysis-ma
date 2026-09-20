import { randomUUID } from "node:crypto";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { createAdminRecord, listAdminRecords, validateProjectReferences } from "@/lib/server/data/admin";
import { parseProjectFields } from "@/lib/server/validation";

export async function POST(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const fields = parseProjectFields(body.value);
  if (!fields) return mutationFailureResponse(400, "Invalid request.");

  try {
    if (!await validateProjectReferences(access.actor, fields.expertiseId, fields.subServiceId, fields.gallery.map((image) => image.id))) return mutationFailureResponse(422, "An expertise, service, or media item is unavailable.");
    const current = await listAdminRecords(access.actor, "projects");
    const record = { id: "project-" + randomUUID(), ...fields };
    if (!await createAdminRecord(access.actor, "projects", record.id, record, current.length)) {
      return mutationFailureResponse(409, "A record with this value already exists.");
    }
    logAdminMutation(request, access.actor, "projects.create", "success");
    return mutationResponse({ data: record }, 201);
  } catch {
    logAdminMutation(request, access.actor, "projects.create", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
