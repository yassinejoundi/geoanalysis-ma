"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ProjectEditorFields } from "@/components/(admin)/realisations/project-editor-fields";
import type { ProjectDraft, ProjectImage } from "@/lib/content/projects";
import type { AdminExpertise } from "@/lib/content/admin";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { sendApiMutation } from "@/lib/api-client";
import { uploadImageToCloudinary } from "@/lib/upload-image";

function emptyProject(): ProjectDraft {
  return {
    id: "",
    state: "draft",
    expertiseId: "",
    subServiceId: "",
    location: "",
    date: "",
    title: { fr: "", en: "" },
    context: { fr: "", en: "" },
    methodology: { fr: "", en: "" },
    results: { fr: "", en: "" },
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
    gallery: [],
  };
}

function normalizeProject(project: ProjectDraft): ProjectDraft {
  return {
    ...project,
    title: project.title ?? { fr: "", en: "" },
    context: project.context ?? { fr: "", en: "" },
    methodology: project.methodology ?? { fr: "", en: "" },
    results: project.results ?? { fr: "", en: "" },
    seoTitle: project.seoTitle ?? { fr: "", en: "" },
    seoDescription: project.seoDescription ?? { fr: "", en: "" },
    gallery: project.gallery ?? [],
  };
}

export function ProjectRecordEditor({
  initialProject,
  expertises,
}: {
  initialProject: ProjectDraft | null;
  expertises: AdminExpertise[];
}) {
  const isNew = initialProject === null;
  const router = useRouter();
  const [values, setValues] = useState(() => initialProject ? normalizeProject(initialProject) : emptyProject());
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const successDialogRef = useRef<HTMLDialogElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);
  const saveLock = useRef(false);

  useEffect(() => {
    document.getElementById(`project-title-${language}`)?.focus();
  }, [language]);

  useEffect(() => {
    if (!success) return;

    const dialog = successDialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    successTitleRef.current?.focus();

    const redirectTimer = window.setTimeout(() => {
      router.replace("/admin/realisations");
    }, 2800);

    return () => {
      window.clearTimeout(redirectTimer);
      if (dialog.open) dialog.close();
    };
  }, [router, success]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (language === "fr") {
      setLanguage("en");
      return;
    }
    if (saveLock.current) return;

    saveLock.current = true;
    setSaving(true);
    try {
      const uploadedImages: ProjectImage[] = [];
      for (const file of pendingImages) {
        setImageBusy(true);
        const image = await uploadImageToCloudinary(file, "realisations");
        const entry = {
          id: image.id,
          url: image.url,
          caption: "",
          isCover: values.gallery.length + uploadedImages.length === 0,
        };
        uploadedImages.push(entry);
        setValues((current) => ({ ...current, gallery: [...current.gallery, entry] }));
        setPendingImages((current) => current.slice(1));
      }

      const draft = { ...values, gallery: [...values.gallery, ...uploadedImages] };
      delete draft.slug;
      delete draft.legacyImage;
      const { id, ...fields } = draft;
      await sendApiMutation<ProjectDraft>(
        isNew ? "/api/admin/realisations" : `/api/admin/realisations/${id}`,
        isNew ? "POST" : "PATCH",
        fields,
      );
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Enregistrement impossible.");
    } finally {
      saveLock.current = false;
      setSaving(false);
      setImageBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.backLink} href="/admin/realisations">
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
          Retour aux réalisations
        </Link>
        <p className="admin-eyebrow">ADMINISTRATION · RÉALISATIONS</p>
        <div className={styles.headingRow}>
          <h1>{isNew ? "Nouvelle réalisation" : "Modifier la réalisation"}</h1>
          <StatusBadge status={values.state} />
        </div>
        <p className={styles.description}>
          Renseignez d’abord les informations du projet en français, puis son contenu en anglais.
        </p>
      </header>

      <section className={styles.card} aria-label="Fiche réalisation">
        <div className={styles.progress}>
          <p className={styles.progressLabel}>Étape {language === "fr" ? "1" : "2"} sur 2</p>
          <ol className={styles.steps} aria-label="Étapes de saisie">
            <li className={styles.step} aria-current={language === "fr" ? "step" : undefined}>
              <span className={styles.stepNumber}>1</span> Français
            </li>
            <li className={styles.step} aria-current={language === "en" ? "step" : undefined}>
              <span className={styles.stepNumber}>2</span> Anglais
            </li>
          </ol>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.fields}>
            <ProjectEditorFields
              values={values}
              onChange={setValues}
              expertises={expertises}
              language={language}
              pendingImages={pendingImages}
              onPendingImagesChange={setPendingImages}
            />
          </div>
          <p className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
            {imageBusy ? "Envoi des images…" : saving ? "Enregistrement…" : ""}
          </p>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <footer className={styles.footer}>
            <Link className="admin-action" href="/admin/realisations">Annuler</Link>
            <div className={styles.actions}>
              {language === "en" && (
                <button className="admin-action" type="button" onClick={() => { setError(""); setLanguage("fr"); }}>
                  Retour au français
                </button>
              )}
              <button className="admin-action admin-action-primary" type="submit" disabled={saving}>
                {saving ? imageBusy ? "Envoi des images…" : "Enregistrement…" : language === "fr" ? "Continuer vers l’anglais" : "Enregistrer"}
              </button>
            </div>
          </footer>
        </form>
      </section>

      <dialog
        ref={successDialogRef}
        className={`confirm-dialog ${styles.successDialog}`}
        aria-labelledby="project-save-success-title"
        aria-describedby="project-save-success-description"
        onCancel={(event) => {
          event.preventDefault();
          router.replace("/admin/realisations");
        }}
      >
        <div className={styles.successContent}>
          <span className={styles.successMark} aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path className={styles.successCheck} d="M10 24.5 19.5 34 38 14" />
            </svg>
          </span>
          <p className={styles.successEyebrow}>Enregistrement terminé</p>
          <h2
            ref={successTitleRef}
            className={styles.successTitle}
            id="project-save-success-title"
            tabIndex={-1}
          >
            {isNew ? "Réalisation ajoutée" : "Modifications enregistrées"}
          </h2>
          <p className={styles.successDescription} id="project-save-success-description">
            {isNew ? "La nouvelle fiche est enregistrée." : "La fiche est à jour."}
          </p>
          <Link className={styles.successAction} href="/admin/realisations" replace>
            Retourner aux réalisations
          </Link>
          <div className={styles.redirectStatus}>
            <span className={styles.redirectProgress} aria-hidden="true"><span /></span>
            <p>Redirection automatique vers la liste…</p>
          </div>
        </div>
      </dialog>
    </main>
  );
}
