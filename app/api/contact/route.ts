import { randomUUID } from "node:crypto";
import { mutationFailureResponse, mutationResponse, limitedResponse } from "@/lib/server/api";
import { isSameOrigin, readJsonBody } from "@/lib/server/http";
import { saveContactMessage } from "@/lib/server/data/admin";
import { parseContactSubmission } from "@/lib/server/validation";

const projectTypes = {
  mining: { fr: "Exploration minière", en: "Mineral exploration" },
  impact: { fr: "Étude d’impact", en: "Impact study" },
  water: { fr: "Ressources en eau", en: "Water resources" },
  other: { fr: "Autre", en: "Other" },
} as const;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return mutationFailureResponse(403, "Same-origin request required.");
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return mutationFailureResponse(415, "JSON content required.");
  }

  try {
    const limited = await limitedResponse(request, "contact");
    if (limited) return limited;
    const body = await readJsonBody(request, 8 * 1024);
    if (!body.ok) return mutationFailureResponse(body.status, "Invalid request.");
    const submission = parseContactSubmission(body.value);
    if (!submission) return mutationFailureResponse(400, "Invalid request.");

    if (submission.website) return mutationResponse({ data: { accepted: true } }, 202);

    const record = {
      id: "message-" + randomUUID(),
      status: "new",
      name: submission.name,
      company: submission.company,
      email: submission.email,
      phone: submission.phone,
      date: new Date().toLocaleDateString("fr-FR"),
      type: projectTypes[submission.projectType as keyof typeof projectTypes],
      file: "",
      message: submission.message,
    };
    await saveContactMessage(record);
    return mutationResponse({ data: { accepted: true } }, 201);
  } catch {
    return mutationFailureResponse(503, "The request could not be processed.");
  }
}
