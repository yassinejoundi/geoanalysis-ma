"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth/next";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const authClient = createAuthClient();

export function AdminSignInForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form className="admin-sign-in-form" onSubmit={handleSubmit}>
      <label className="admin-field" htmlFor="admin-sign-in-email">
        <span>Adresse e-mail</span>
        <input id="admin-sign-in-email" name="email" type="email" autoComplete="username" maxLength={254} required />
      </label>
      <div className="admin-field">
        <label htmlFor="admin-sign-in-password">Mot de passe</label>
        <div className="admin-password-control">
          <input id="admin-sign-in-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" maxLength={128} required />
          <button
            className="admin-password-toggle"
            type="button"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="admin-sign-in-error" role="status" aria-live="polite">{error}</p>
      <button className="admin-action admin-action-primary" type="submit" disabled={busy}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
