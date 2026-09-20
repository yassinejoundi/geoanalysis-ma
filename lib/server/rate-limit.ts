import "server-only";

import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const policies = {
  contact: { limit: 5, windowSeconds: 60 * 60 },
  auth: { limit: 10, windowSeconds: 15 * 60 },
  upload: { limit: 20, windowSeconds: 15 * 60 },
} as const;

export type RateLimitScope = keyof typeof policies;

function clientAddress(request: Request) {
  return request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",", 1)[0].trim() || "unknown";
}

export async function checkRateLimit(request: Request, scope: RateLimitScope, actorId?: string) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Rate limiting is not configured.");

  const policy = policies[scope];
  const hashKey = createHmac("sha256", connectionString)
    .update(scope + ":" + clientAddress(request) + ":" + (actorId ?? "public"))
    .digest("hex");
  const sql = neon(connectionString);
  const rows = await sql`
    WITH cleanup AS (
      DELETE FROM api_rate_limits
      WHERE window_start < now() - interval '24 hours'
    )
    INSERT INTO api_rate_limits (key_hash, window_start, count)
    VALUES (
      ${hashKey},
      to_timestamp(floor(extract(epoch FROM now()) / ${policy.windowSeconds}) * ${policy.windowSeconds}),
      1
    )
    ON CONFLICT (key_hash, window_start)
    DO UPDATE SET count = api_rate_limits.count + 1
    RETURNING count,
      GREATEST(1, ceil(extract(epoch FROM window_start + (${policy.windowSeconds} * interval '1 second') - now()))::int) AS retry_after
  ` as { count: number; retry_after: number }[];

  const result = rows[0];
  if (!result) throw new Error("Rate limiting is unavailable.");
  return {
    allowed: result.count <= policy.limit,
    retryAfter: Math.max(1, result.retry_after),
  };
}
