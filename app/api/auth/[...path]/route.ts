import { getAuth } from "@/lib/server/auth";
import { mutationFailureResponse, limitedResponse, noStore } from "@/lib/server/api";
import { hasOnlyKeys, isRecord, MAX_JSON_BYTES, textField } from "@/lib/server/validation";
import { isSameOrigin, readJsonBody } from "@/lib/server/http";

type AuthContext = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: AuthContext) {
  const { path } = await context.params;
  if (path.join("/") !== "get-session") return mutationFailureResponse(404, "Not found.");
  return noStore(await getAuth().handler().GET(request, context));
}

export async function POST(request: Request, context: AuthContext) {
  if (!isSameOrigin(request)) return mutationFailureResponse(403, "Same-origin request required.");
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return mutationFailureResponse(415, "JSON content required.");
  }

  try {
    const limited = await limitedResponse(request, "auth");
    if (limited) return limited;

    const body = await readJsonBody(request.clone(), MAX_JSON_BYTES);
    if (!body.ok) return mutationFailureResponse(body.status, "Invalid request.");
    const { path } = await context.params;
    const endpoint = path.join("/");
    if (endpoint === "sign-in/email") {
      if (!isRecord(body.value) || !hasOnlyKeys(body.value, ["email", "password", "rememberMe"])) return mutationFailureResponse(400, "Invalid request.");
      const email = textField(body.value.email, 254);
      const password = body.value.password;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || password.length < 1 || password.length > 128 || (body.value.rememberMe !== undefined && typeof body.value.rememberMe !== "boolean")) return mutationFailureResponse(400, "Invalid request.");
    } else if (endpoint === "sign-out") {
      if (!isRecord(body.value) || !hasOnlyKeys(body.value, [])) return mutationFailureResponse(400, "Invalid request.");
    } else {
      return mutationFailureResponse(404, "Not found.");
    }

    return noStore(await getAuth().handler().POST(request, context));
  } catch {
    return mutationFailureResponse(503, "Authentication is temporarily unavailable.");
  }
}
