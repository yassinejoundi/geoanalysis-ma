import "server-only";

import { randomUUID } from "node:crypto";
import { requireAdmin, type AdminActor } from "@/lib/server/auth";
import { errorResponse, isSameOrigin, readJsonBody, tooManyRequestsResponse } from "@/lib/server/http";
import { checkRateLimit, type RateLimitScope } from "@/lib/server/rate-limit";

export async function adminMutationAccess(request: Request) {
  const actor = await requireAdmin();
  if (actor instanceof Response) return { response: actor };
  if (!isSameOrigin(request)) return { response: errorResponse(403, "Same-origin request required.") };
  return { actor };
}

export async function readMutationJson(request: Request, maxBytes = 64 * 1024) {
  const result = await readJsonBody(request, maxBytes);
  if (!result.ok) return { response: errorResponse(result.status, result.status === 415 ? "JSON content required." : "Invalid request.") };
  return { value: result.value };
}

export async function limitedResponse(request: Request, scope: RateLimitScope, actorId?: string) {
  const result = await checkRateLimit(request, scope, actorId);
  if (result.allowed) return null;
  return tooManyRequestsResponse(result.retryAfter);
}

export function mutationResponse(body: unknown, status = 200, extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return Response.json(body, { status, headers });
}

export function mutationFailureResponse(status: number, error: string) {
  return mutationResponse({ error }, status);
}

export function isUniqueConflict(error: unknown) {
  return !!error && typeof error === "object" && "code" in error && error.code === "23505";
}

export function noStore(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export function logAdminMutation(request: Request, actor: AdminActor, action: string, result: "success" | "failure") {
  const suppliedId = request.headers.get("x-request-id");
  const requestId = suppliedId && /^[a-zA-Z0-9_-]{1,80}$/.test(suppliedId) ? suppliedId : randomUUID();
  console.info(JSON.stringify({ requestId, actorId: actor.id, action, result }));
}
