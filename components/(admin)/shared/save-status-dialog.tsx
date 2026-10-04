"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";

export function SaveStatusDialog({
  status,
  savingTitle,
  savingMessage,
  successTitle,
  successMessage,
  redirectHref,
  returnLabel,
}: {
  status: "saving" | "success" | null;
  savingTitle: string;
  savingMessage: string;
  successTitle: string;
  successMessage: string;
  redirectHref: string;
  returnLabel: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (status === null) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    titleRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (status !== "success") return;

    const redirectTimer = window.setTimeout(() => router.replace(redirectHref), 2800);
    return () => window.clearTimeout(redirectTimer);
  }, [redirectHref, router, status]);

  return (
    <dialog
      ref={dialogRef}
      className={`confirm-dialog ${styles.saveStatusDialog}`}
      aria-labelledby="save-status-title"
      aria-describedby="save-status-description"
      onCancel={(event) => {
        event.preventDefault();
        if (status === "success") router.replace(redirectHref);
      }}
    >
      <div className={styles.successContent}>
        <span
          className={`${styles.successMark} ${status === "saving" ? styles.savingMark : ""}`}
          aria-hidden="true"
        >
          {status === "saving" ? (
            <svg className={styles.savingSpinner} viewBox="0 0 48 48" focusable="false">
              <circle cx="24" cy="24" r="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 48 48" focusable="false">
              <path className={styles.successCheck} d="M10 24.5 19.5 34 38 14" />
            </svg>
          )}
        </span>
        <p className={styles.successEyebrow}>
          {status === "saving" ? "Enregistrement en cours" : "Enregistrement terminé"}
        </p>
        <h2 ref={titleRef} className={styles.successTitle} id="save-status-title" tabIndex={-1}>
          {status === "saving" ? savingTitle : successTitle}
        </h2>
        <p
          className={styles.successDescription}
          id="save-status-description"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === "saving" ? savingMessage : successMessage}
        </p>
        {status === "success" && (
          <>
            <Link className={styles.successAction} href={redirectHref} replace>
              {returnLabel}
            </Link>
            <div className={styles.redirectStatus}>
              <span className={styles.redirectProgress} aria-hidden="true"><span /></span>
              <p>Redirection automatique vers la liste…</p>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
