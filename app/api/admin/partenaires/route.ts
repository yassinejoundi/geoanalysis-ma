import { randomUUID } from "node:crypto";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { createAdminRecord, listAdminRecords } from "@/lib/server/data/admin";
import { parsePartnerFields } from "@/lib/server/validation";

export async function POST(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const fields = parsePartnerFields(body.value);
  if (!fields) return mutationFailureResponse(400, "Invalid request.");
  try {
    const record = { id: "partner-" + randomUUID(), ...fields };
    const current = await listAdminRecords(access.actor, "partners");
    if (!await createAdminRecord(access.actor, "partners", record.id, record, current.length)) return mutationFailureResponse(409, "A record with this value already exists.");
    logAdminMutation(request, access.actor, "partners.create", "success");
    return mutationResponse({ data: record }, 201);
  } catch {
    logAdminMutation(request, access.actor, "partners.create", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
