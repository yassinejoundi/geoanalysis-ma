import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { createAuthClient } from "@neondatabase/auth";

try {
  if (!process.env.NEON_AUTH_BASE_URL) process.loadEnvFile(".env.local");
} catch {
  // A deployment or CI environment may provide the auth URL directly.
}

const email = "abdelouahed@geoanalysis.ma";
const credentialPath = ".env.admin-credentials";

if (!process.env.NEON_AUTH_BASE_URL) {
  console.error("Set NEON_AUTH_BASE_URL in .env.local before creating the admin account.");
  process.exit(1);
}

if (existsSync(credentialPath)) {
  console.error("The ignored admin credentials file already exists; account creation was skipped.");
  process.exit(1);
}

const password = randomBytes(36).toString("base64url");
const auth = createAuthClient(process.env.NEON_AUTH_BASE_URL);

try {
  const { data, error } = await auth.signUp.email({ email, password, name: "Abdelouahed" });
  if (error) {
    const code = typeof error.code === "string" && /^[A-Z0-9_-]{1,60}$/i.test(error.code) ? error.code : "provider-rejected";
    const status = Number.isInteger(error.status) ? error.status : 0;
    throw new Error(`provider:${status}:${code}`);
  }
  if (!data?.user) throw new Error("provider:missing-user");

  writeFileSync(
    credentialPath,
    "ADMIN_EMAIL=" + email + "\nADMIN_PASSWORD=" + password + "\n",
    { encoding: "utf8", flag: "wx", mode: 0o600 },
  );
  console.log("Admin account created. Login credentials saved to the ignored project file.");
} catch (error) {
  const safeName = error && typeof error === "object" && typeof error.name === "string" && /^[A-Za-z]{1,40}$/.test(error.name) ? error.name : "UnknownError";
  const safeStatus = error && typeof error === "object" && Number.isInteger(error.status) ? error.status : 0;
  const code = error && typeof error === "object" && typeof error.code === "string" && /^[A-Za-z0-9_-]{1,60}$/.test(error.code) ? error.code : "no-code";
  const reason = error instanceof Error && /^provider:(?:\d+:[A-Za-z0-9_-]+|missing-user)$/.test(error.message) ? error.message : `${safeName}:${safeStatus}:${code}`;
  console.error("Admin account creation failed (" + reason + "). Provider payload and credentials were not logged.");
  process.exitCode = 1;
}
