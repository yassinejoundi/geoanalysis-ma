export async function sendApiMutation<T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return undefined as T;
  const result = await response.json().catch(() => null) as { data?: T; error?: string } | null;
  if (!response.ok) throw new Error(result?.error ?? "Cette opération n’a pas pu aboutir.");
  return result?.data as T;
}

export async function sendApiForm<T>(path: string, body: FormData) {
  const response = await fetch(path, { method: "POST", credentials: "same-origin", body });
  const result = await response.json().catch(() => null) as { data?: T; error?: string } | null;
  if (!response.ok) throw new Error(result?.error ?? "Cette opération n’a pas pu aboutir.");
  return result?.data as T;
}
