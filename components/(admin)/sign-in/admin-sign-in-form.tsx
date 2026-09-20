"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth/next";

const authClient = createAuthClient();

export function AdminSignInForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);

    if (result.error) {
      setError("Connexion impossible. Vérifiez votre adresse et votre mot de passe.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="admin-sign-in-form" onSubmit={handleSubmit}>
      <label className="admin-field" htmlFor="admin-sign-in-email">
        <span>Adresse e-mail</span>
        <input id="admin-sign-in-email" name="email" type="email" autoComplete="username" maxLength={254} required />
      </label>
      <label className="admin-field" htmlFor="admin-sign-in-password">
        <span>Mot de passe</span>
        <input id="admin-sign-in-password" name="password" type="password" autoComplete="current-password" maxLength={128} required />
      </label>
      <button className="admin-action admin-action-primary" type="submit" disabled={busy}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
      <p className="admin-sign-in-error" role="status" aria-live="polite">{error}</p>
    </form>
  );
}
