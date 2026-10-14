"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ProjectEditorFields } from "@/components/(admin)/realisations/project-editor-fields";
import type { ProjectDraft, ProjectImage } from "@/lib/content/projects";
import type { AdminExpertise } from "@/lib/content/admin";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";
import { SaveStatusDialog } from "@/components/(admin)/shared/save-status-dialog";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { sendApiMutation } from "@/lib/api-client";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { uploadArticleFileToCloudinary } from "@/lib/upload-article-file";
import { emptyArticleDocument, parseArticleDocument } from "@/lib/content/article-document";

function emptyProject(): ProjectDraft {
  const emptyDocument = JSON.stringify(emptyArticleDocument);
  return {
    id: "",
    state: "draft",
    expertiseId: "",
    subServiceId: "",
    location: "",
    date: "",
    title: { fr: "", en: "" },
    context: { fr: emptyDocument, en: emptyDocument },
    methodology: { fr: emptyDocument, en: emptyDocument },
    results: { fr: emptyDocument, en: emptyDocument },
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
    gallery: [],
    author: "",
    files: [],
    resources: [],
  };
}

function normalizeProject(project: ProjectDraft): ProjectDraft {
  return {
    ...project,
    title: project.title ?? { fr: "", en: "" },
    context: {
      fr: JSON.stringify(parseArticleDocument(project.context?.fr)),
      en: JSON.stringify(parseArticleDocument(project.context?.en)),
    },
    methodology: {
      fr: JSON.stringify(parseArticleDocument(project.methodology?.fr)),
      en: JSON.stringify(parseArticleDocument(project.methodology?.en)),
    },
    results: {
      fr: JSON.stringify(parseArticleDocument(project.results?.fr)),
      en: JSON.stringify(parseArticleDocument(project.results?.en)),
    },
    seoTitle: project.seoTitle ?? { fr: "", en: "" },
    seoDescription: project.seoDescription ?? { fr: "", en: "" },
    gallery: project.gallery ?? [],
    author: project.author ?? "",
    files: project.files ?? [],
    resources: project.resources ?? [],
  };
}

const stepLabels = ["Informations", "Contenu", "Référencement"];

export function ProjectRecordEditor({
  initialProject,
  expertises,
}: {
  initialProject: ProjectDraft | null;
  expertises: AdminExpertise[];
}) {
  const isNew = initialProject === null;
  const [values, setValues] = useState(() => initialProject ? normalizeProject(initialProject) : emptyProject());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saving" | "success" | null>(null);
  const saveLock = useRef(false);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step) document.getElementById("project-step-heading")?.focus();
    previousStep.current = step;
  }, [step]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (step < 3) {
      setStep((current) => (current + 1) as 2 | 3);
      return;
    }
    if (saveLock.current) return;

    saveLock.current = true;
    setSaving(true);
    setSaveStatus("saving");
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
      setImageBusy(false);

      let files = [...(values.files ?? [])];
      if (pendingFiles.length) {
        setFileBusy(true);
        for (const file of pendingFiles) {
          const uploaded = await uploadArticleFileToCloudinary(file, "realisations");
          files = [...files, uploaded];
          setValues((current) => ({ ...current, files }));
          setPendingFiles((current) => current.filter((pending) => pending !== file));
        }
      }
      setFileBusy(false);

      const draft = { ...values, gallery: [...values.gallery, ...uploadedImages], files };
      delete draft.slug;
      delete draft.legacyImage;
      delete draft.publishedAt;
      delete draft.readingTime;
      const { id, ...fields } = draft;
      await sendApiMutation<ProjectDraft>(
        isNew ? "/api/admin/realisations" : `/api/admin/realisations/${id}`,
        isNew ? "POST" : "PATCH",
        fields,
      );
      setSaveStatus("success");
    } catch (cause) {
      setSaveStatus(null);
      setError(cause instanceof Error ? cause.message : "Enregistrement impossible.");
    } finally {
      saveLock.current = false;
      setSaving(false);
      setImageBusy(false);
      setFileBusy(false);
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
        <p className={styles.description}>Complétez les champs bilingues, avec le français au-dessus de l’anglais.</p>
      </header>

      <section className={styles.card} aria-label="Fiche réalisation">
        <div className={styles.progress}>
          <p className={styles.progressLabel} aria-live="polite">Étape {step} sur 3</p>
          <ol className={`${styles.steps} ${styles.stepsThree}`} aria-label="Étapes de saisie">
            {stepLabels.map((label, index) => (
              <li className={styles.step} aria-current={step === index + 1 ? "step" : undefined} key={label}>
                {index + 1 < step ? (
                  <button className={styles.stepButton} onClick={() => { setError(""); setStep((index + 1) as 1 | 2); }} type="button">
                    <span className={styles.stepNumber}>{index + 1}</span> {label}
                  </button>
                ) : <><span className={styles.stepNumber}>{index + 1}</span> {label}</>}
              </li>
            ))}
          </ol>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.fields}>
            <div>
              <h2 className={styles.stepHeading} id="project-step-heading" tabIndex={-1}>{stepLabels[step - 1]}</h2>
              <p className={styles.stepDescription}>
                {step === 1
                  ? "Définissez le projet et sa galerie. Les images sont converties en WebP lors de l’enregistrement."
                  : step === 2
                    ? "Rédigez les sections dans les deux langues et joignez les ressources utiles. Les fichiers seront téléversés à l’enregistrement."
                    : "Ajoutez les titres et descriptions SEO dans les deux langues."}
              </p>
            </div>
            <ProjectEditorFields
              values={values}
              onChange={setValues}
              expertises={expertises}
              step={step}
              pendingImages={pendingImages}
              onPendingImagesChange={setPendingImages}
              pendingFiles={pendingFiles}
              onPendingFilesChange={setPendingFiles}
            />
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <footer className={`${styles.footer} ${styles.articleFooter}`}>
            <Link className="admin-action" href="/admin/realisations">Annuler</Link>
            <div className={styles.actions}>
              {step > 1 ? <button className="admin-action" type="button" onClick={() => {
                setError("");
                setStep((current) => (current - 1) as 1 | 2);
              }}>Précédent</button> : null}
              <button className="admin-action admin-action-primary" type="submit" disabled={saving}>
                {saving ? imageBusy ? "Envoi des images…" : fileBusy ? "Envoi des fichiers…" : "Enregistrement…" : step < 3 ? "Continuer" : "Enregistrer"}
              </button>
            </div>
          </footer>
        </form>
      </section>

      <SaveStatusDialog
        status={saveStatus}
        savingTitle="Enregistrement de la réalisation…"
        savingMessage={imageBusy ? "Envoi des images…" : fileBusy ? "Envoi des fichiers…" : "Enregistrement en cours. Veuillez patienter."}
        successTitle={isNew ? "Réalisation ajoutée" : "Modifications enregistrées"}
        successMessage={isNew ? "La nouvelle fiche est enregistrée." : "La fiche est à jour."}
        redirectHref="/admin/realisations"
        returnLabel="Retourner aux réalisations"
      />
    </main>
  );
}
