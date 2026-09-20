import assert from "node:assert/strict";
import test from "node:test";
import { contentSecurityPolicy } from "../lib/server/content-security-policy.ts";
import { errorResponse, isSameOrigin, jsonResponse, readJsonBody, tooManyRequestsResponse } from "../lib/server/http.ts";
import { parseContactSubmission, parseExpertiseFields, validateMediaFile } from "../lib/server/validation.ts";

test("static CSP permits Next.js hydration without weakening production eval", () => {
  const production = contentSecurityPolicy(false);
  assert.match(production, /script-src 'self' 'unsafe-inline'/);
  assert.doesNotMatch(production, /nonce-|strict-dynamic|'unsafe-eval'/);
  assert.match(contentSecurityPolicy(true), /'unsafe-eval'/);
});

test("JSON boundary rejects malformed, oversized, and non-JSON requests", async () => {
  const malformed = await readJsonBody(new Request("https://site.test/api", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{",
  }), 8);
  const oversized = await readJsonBody(new Request("https://site.test/api", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: "too long" }),
  }), 8);
  const wrongType = await readJsonBody(new Request("https://site.test/api", {
    method: "POST", headers: { "Content-Type": "text/plain" }, body: "{}",
  }), 8);

  assert.deepEqual(malformed, { ok: false, status: 400 });
  assert.deepEqual(oversized, { ok: false, status: 413 });
  assert.deepEqual(wrongType, { ok: false, status: 415 });
});

test("cookie-authenticated mutations require matching Origin and Host", () => {
  const request = new Request("https://site.test/api/admin", {
    method: "POST", headers: { Origin: "https://site.test", Host: "site.test" },
  });
  const crossOrigin = new Request("https://site.test/api/admin", {
    method: "POST", headers: { Origin: "https://attacker.test", Host: "site.test" },
  });
  const hostMismatch = new Request("https://site.test/api/admin", {
    method: "POST", headers: { Origin: "https://attacker.test", Host: "attacker.test" },
  });
  const missingOrigin = new Request("https://site.test/api/admin", { method: "POST" });

  assert.equal(isSameOrigin(request), true);
  assert.equal(isSameOrigin(crossOrigin), false);
  assert.equal(isSameOrigin(hostMismatch), false);
  assert.equal(isSameOrigin(missingOrigin), false);
});

test("admin response helpers use a generic error shape and no-store status codes", async () => {
  for (const status of [401, 403, 404, 409, 413, 415, 422]) {
    const response = errorResponse(status, "Invalid request.");
    assert.equal(response.status, status);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { error: "Invalid request." });
  }

  const created = jsonResponse({ data: { accepted: true } }, 201);
  assert.equal(created.status, 201);
  assert.equal(created.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await created.json(), { data: { accepted: true } });
  const limited = tooManyRequestsResponse(2.2);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "3");
  assert.equal(limited.headers.get("Cache-Control"), "no-store");
});

test("request parsers reject extra contact and admin fields", () => {
  const contact = {
    name: "Amina", company: "", email: "amina@example.ma", phone: "", projectType: "water",
    message: "Demande d’étude", website: "",
  };
  assert.ok(parseContactSubmission(contact));
  assert.equal(parseContactSubmission({ ...contact, isAdmin: true }), null);
  assert.equal(parseExpertiseFields({ state: "published", slug: "valid-slug", name: { fr: "Titre", en: "Title" }, short: { fr: "Court", en: "Short" }, ownerId: "other" }), null);
});

test("file validation checks declared size, type, extension, and file signature", () => {
  const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(validateMediaFile({ name: "map.png", type: "image/png", size: pngSignature.length }, pngSignature), "valid");
  assert.equal(validateMediaFile({ name: "map.pdf", type: "image/png", size: pngSignature.length }, pngSignature), "unsupported");
  assert.equal(validateMediaFile({ name: "large.png", type: "image/png", size: 5 * 1024 * 1024 }, pngSignature), "too-large");
});
