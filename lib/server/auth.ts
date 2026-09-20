import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";
import { errorResponse } from "@/lib/server/http";

export type AdminActor = { id: string; email: string };

function requiredEnvironmentValue(name: string) {
  const value = process.env[name];
  if (!value) throw new Error("Server authentication is not configured.");
  return value;
}

export function getAuth() {
  return createNeonAuth({
    baseUrl: requiredEnvironmentValue("NEON_AUTH_BASE_URL"),
    cookies: {
      secret: requiredEnvironmentValue("NEON_AUTH_COOKIE_SECRET"),
      sessionDataTtl: 1,
      sameSite: "strict",
    },
    logLevel: "silent",
  });
}

export function isAllowedAdminEmail(email: string) {
  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLocaleLowerCase("en-US"))
    .filter(Boolean);
  return allowedEmails.includes(email.trim().toLocaleLowerCase("en-US"));
}

export async function getAdminAccess(): Promise<
  { actor: AdminActor } | { response: Response }
> {
  try {
    const { data } = await getAuth().getSession();
    const user = data?.user;
    if (!user?.id || !user.email) return { response: errorResponse(401, "Authentication required.") };
    if (!isAllowedAdminEmail(user.email)) return { response: errorResponse(403, "Administrator access required.") };
    return { actor: { id: user.id, email: user.email } };
  } catch {
    return { response: errorResponse(401, "Authentication required.") };
  }
}

export async function requireAdmin() {
  const access = await getAdminAccess();
  return "response" in access ? access.response : access.actor;
}
