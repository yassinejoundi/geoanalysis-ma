import { deleteAdminRecord, getAdminRecord, updateAdminRecord } from "@/lib/server/data/admin";
import { adminMutationAccess, logAdminMutation, mutationFailureResponse, mutationResponse, readMutationJson } from "@/lib/server/api";
import { hasOnlyKeys, isIdentifier, isRecord, parseEditorialFields } from "@/lib/server/validation";
import { currentPublicationDate } from "@/lib/server/publication-date";
import { projectSlug } from "@/lib/content/projects";

type RouteContext = { params: Promise<{ id: string }> };
const keys = ["state", "category", "tags", "date", "title", "content", "seoTitle", "seoDescription", "image", "files", "author", "resources"] as const;

export async function PATCH(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  const body = await readMutationJson(request);
  if ("response" in body) return body.response;
  if (!isRecord(body.value) || !hasOnlyKeys(body.value, keys)) return mutationFailureResponse(400, "Invalid request.");
  try {
    const current = await getAdminRecord<Record<string, unknown>>(access.actor, "news", id);
    if (!current) return mutationFailureResponse(404, "Record not found.");
    const currentFields = Object.fromEntries(keys.map((key) => [key, current[key] ?? (key === "files" || key === "resources" ? [] : "")]));
    const fields = parseEditorialFields({ ...currentFields, ...body.value }, "news");
    if (!fields || (fields.state === "published" && !fields.author)) return mutationFailureResponse(400, "Invalid request.");
    const published = fields.state === "published";
    const wasPublished = current.state === "published";
    const slug = typeof current.slug === "string" && /^[a-z0-9][a-z0-9-]{0,119}$/.test(current.slug)
      ? current.slug
      : projectSlug(fields.title.fr, id);
    const record = {
      ...current,
      id,
      ...fields,
      date: published ? wasPublished && typeof current.date === "string" && current.date ? current.date : currentPublicationDate() : "",
      slug,
      publishedAt: published ? wasPublished && typeof current.publishedAt === "string" ? current.publishedAt : currentPublicationDate() : null,
    };
    if (!await updateAdminRecord(access.actor, "news", id, record)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "news.update", "success");
    return mutationResponse({ data: record });
  } catch {
    logAdminMutation(request, access.actor, "news.update", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await adminMutationAccess(request);
  if ("response" in access) return access.response;
  const { id } = await context.params;
  if (!isIdentifier(id)) return mutationFailureResponse(400, "Invalid record ID.");
  try {
    if (!await deleteAdminRecord(access.actor, "news", id)) return mutationFailureResponse(404, "Record not found.");
    logAdminMutation(request, access.actor, "news.delete", "success");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    logAdminMutation(request, access.actor, "news.delete", "failure");
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
