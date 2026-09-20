import { randomUUID } from "node:crypto";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { createAdminRecord, listAdminRecords } from "@/lib/server/data/admin";
import { parseEditorialFields } from "@/lib/server/validation";

export async function POST(request: Request) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  const fields = parseEditorialFields(body.value, "articles");
  if (!fields) return mutationFailureResponse(400, "Invalid request.");
  try {
    const current = await listAdminRecords(access.actor, "articles");
    const record = { id: "article-" + randomUUID(), ...fields };
    if (!await createAdminRecord(access.actor, "articles", record.id, record, current.length)) return mutationFailureResponse(409, "A record with this value already exists.");
    logAdminMutation(request, access.actor, "articles.create", "success");
    return mutationResponse({ data: record }, 201);
  } catch {
    logAdminMutation(request, access.actor, "articles.create", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
