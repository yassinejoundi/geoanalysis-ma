"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth/next";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const authClient = createAuthClient();

type SignInFailure = "connection" | "origin" | "credentials" | "service";

const signInFailureCopy: Record<SignInFailure, { title: string; message: string; retry: boolean }> = {
  connection: {
    title: "Connexion interrompue",
    message: "Impossible de joindre le service d’authentification. Vérifiez votre connexion Internet, puis réessayez.",
    retry: true,
  },
  origin: {
    title: "Adresse du site non autorisée",
    message: "Le service d’authentification refuse cette adresse du site. Contactez l’administrateur pour autoriser le domaine.",
    retry: false,
  },
  credentials: {
    title: "Identifiants incorrects",
    message: "Adresse e-mail ou mot de passe invalide. Vérifiez vos identifiants et réessayez.",
    retry: false,
  },
  service: {
    title: "Connexion impossible",
    message: "Le service d’authentification a refusé la demande. Réessayez plus tard ou contactez l’administrateur si le problème persiste.",
    retry: true,
  },
};

function classifySignInFailure(error: unknown): SignInFailure {
  const details = typeof error === "object" && error !== null ? error as Record<string, unknown> : {};
  const message = typeof details.message === "string" ? details.message.toLowerCase() : "";
  const code = typeof details.code === "string" ? details.code.toLowerCase() : "";
  const status = typeof details.status === "number" ? details.status : 0;

  if (message.includes("invalid origin") || code.includes("origin")) return "origin";
  if (status === 401 || code.includes("invalid_credentials")) return "credentials";
  if (
    error instanceof TypeError ||
    status === 502 ||
    status === 503 ||
    /failed to fetch|network error|network request failed|load failed/i.test(message)
  ) return "connection";
  return "service";
}

export function AdminSignInForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<SignInFailure | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (failure && dialog && !dialog.open) dialog.showModal();
    else if (!failure && dialog?.open) dialog.close();
  }, [failure]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFailure(null);
    const form = new FormData(event.currentTarget);
    try {
      const result = await authClient.signIn.email({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
      });
      if (result.error) {
        setFailure(classifySignInFailure(result.error));
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setFailure(classifySignInFailure(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form ref={formRef} className="admin-sign-in-form" onSubmit={handleSubmit}>
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
        <button className="admin-action admin-action-primary" type="submit" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <dialog
        ref={dialogRef}
        className="admin-sign-in-dialog"
        role="alertdialog"
        aria-labelledby="admin-sign-in-error-title"
        aria-describedby="admin-sign-in-error-message"
        onCancel={() => setFailure(null)}
        onClose={() => setFailure(null)}
      >
        {failure && (
          <>
            <p className="admin-eyebrow">Échec de connexion</p>
            <h2 id="admin-sign-in-error-title">{signInFailureCopy[failure].title}</h2>
            <p id="admin-sign-in-error-message">{signInFailureCopy[failure].message}</p>
            <div className="admin-sign-in-dialog-actions">
              {signInFailureCopy[failure].retry && (
                <button
                  className="admin-action admin-action-primary"
                  type="button"
                  onClick={() => {
                    dialogRef.current?.close();
                    formRef.current?.requestSubmit();
                  }}
                >
                  Réessayer
                </button>
              )}
              <button className="admin-action" type="button" autoFocus onClick={() => dialogRef.current?.close()}>
                Fermer
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
