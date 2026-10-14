"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ArticleEditorFields, type EditorialDraft, type EditorialKind } from "@/components/(admin)/editorial/editorial-editor-fields";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";
import { SaveStatusDialog } from "@/components/(admin)/shared/save-status-dialog";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { sendApiMutation } from "@/lib/api-client";
import type { LocalizedText } from "@/lib/i18n";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { uploadArticleFileToCloudinary } from "@/lib/upload-article-file";
import { emptyArticleDocument, parseArticleDocument } from "@/lib/content/article-document";

function emptyItem(categories: LocalizedText[]): EditorialDraft {
  const category = categories[0] ?? { fr: "", en: "" };
  const content = JSON.stringify(emptyArticleDocument);
  return {
    id: "",
    state: "draft",
    category: { ...category },
    tags: [],
    date: "",
    author: "",
    title: { fr: "", en: "" },
    image: null,
    content: { fr: content, en: content },
    files: [],
    resources: [],
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
  };
}

function normalizeItem(item: EditorialDraft): EditorialDraft {
  const content = item.content ?? { fr: "", en: "" };
  return {
    ...item,
    category: item.category ?? { fr: "", en: "" },
    tags: item.tags ?? [],
    date: item.date ?? "",
    title: item.title ?? { fr: "", en: "" },
    image: item.image ? {
      ...item.image,
      src: item.image.src ?? "",
      alt: { fr: item.image.alt?.fr ?? "", en: item.image.alt?.en ?? "" },
    } : null,
    content: {
      fr: JSON.stringify(parseArticleDocument(content.fr)),
      en: JSON.stringify(parseArticleDocument(content.en)),
    },
    files: item.files ?? [],
    resources: item.resources ?? [],
    author: item.author ?? "",
    seoTitle: item.seoTitle ?? { fr: "", en: "" },
    seoDescription: item.seoDescription ?? { fr: "", en: "" },
  };
}

export function EditorialRecordEditor({
  kind,
  initialItem,
  categories,
}: {
  kind: EditorialKind;
  initialItem: EditorialDraft | null;
  categories: LocalizedText[];
}) {
  const isArticle = kind === "article";
  const isNew = initialItem === null;
  const baseHref = isArticle ? "/admin/articles" : "/admin/actualites";
  const newItemLabel = isArticle ? "Nouvel article" : "Nouvelle actualité";
  const subject = isArticle ? "article" : "actualité";
  const endpoint = isArticle ? "/api/admin/articles" : "/api/admin/actualites";
  const [values, setValues] = useState(() => initialItem ? normalizeItem(initialItem) : emptyItem(categories));
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saving" | "success" | null>(null);
  const saveLock = useRef(false);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step) document.getElementById("editorial-step-heading")?.focus();
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
      let image = values.image;
      if (pendingImage && image) {
        setImageBusy(true);
        const uploaded = await uploadImageToCloudinary(pendingImage, isArticle ? "articles" : "actualites");
        image = { ...image, src: uploaded.url };
        setValues((current) => ({ ...current, image }));
        setPendingImage(null);
        setImageBusy(false);
      }

      let files = [...(values.files ?? [])];
      if (pendingFiles.length) {
        setFileBusy(true);
        for (const file of pendingFiles) {
          const uploaded = await uploadArticleFileToCloudinary(file, isArticle ? "articles" : "actualites");
          files = [...files, uploaded];
          setValues((current) => ({ ...current, files }));
          setPendingFiles((current) => current.filter((pending) => pending !== file));
        }
      }

      const fields = {
        state: values.state,
        category: values.category,
        tags: values.tags,
        title: values.title,
        content: values.content,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        image,
        date: values.date,
        author: values.author?.trim() ?? "",
        files,
        resources: values.resources ?? [],
        ...(isArticle && values.slug ? { slug: values.slug } : {}),
      };
      await sendApiMutation<EditorialDraft>(
        isNew ? endpoint : `${endpoint}/${values.id}`,
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

  const labels = ["Informations", "Contenu", "Référencement"];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.backLink} href={baseHref}>
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
          Retour aux {isArticle ? "articles" : "actualités"}
        </Link>
        <p className="admin-eyebrow">ADMINISTRATION · {isArticle ? "ARTICLES" : "ACTUALITÉS"}</p>
        <div className={styles.headingRow}>
          <h1>{isNew ? newItemLabel : `Modifier l’${subject}`}</h1>
          <StatusBadge status={values.state} />
        </div>
        <p className={styles.description}>Complétez les champs bilingues, avec le français au-dessus de l’anglais.</p>
      </header>

      <section className={styles.card} aria-label={`Fiche ${subject}`}>
        <div className={styles.progress}>
          <p className={styles.progressLabel} aria-live="polite">Étape {step} sur 3</p>
          <ol className={`${styles.steps} ${styles.stepsThree}`} aria-label="Étapes de saisie">
            {labels.map((label, index) => (
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
              <h2 className={styles.stepHeading} id="editorial-step-heading" tabIndex={-1}>{labels[step - 1]}</h2>
              <p className={styles.stepDescription}>
                {step === 1
                  ? "Les champs bilingues suivent l’ordre français, puis anglais. La date et le temps de lecture sont calculés automatiquement."
                  : step === 2
                    ? "Rédigez les deux versions et choisissez les fichiers à joindre. Les fichiers et images sont téléversés uniquement à l’enregistrement."
                    : "Ajoutez les titres et descriptions SEO dans les deux langues."}
              </p>
            </div>
            <ArticleEditorFields
              values={values}
              onChange={setValues}
              step={step}
              kind={kind}
              categories={categories}
              onImageSelected={setPendingImage}
              pendingFiles={pendingFiles}
              onPendingFilesChange={setPendingFiles}
            />
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <footer className={`${styles.footer} ${styles.articleFooter}`}>
            <Link className="admin-action" href={baseHref}>Annuler</Link>
            <div className={styles.actions}>
              {step > 1 ? (
                <button className="admin-action" type="button" onClick={() => { setError(""); setStep((current) => (current - 1) as 1 | 2); }}>
                  Précédent
                </button>
              ) : null}
              <button className="admin-action admin-action-primary" type="submit" disabled={saving}>
                {saving ? imageBusy ? "Téléversement de l’image…" : fileBusy ? "Téléversement des fichiers…" : "Enregistrement…" : step < 3 ? "Continuer" : "Enregistrer"}
              </button>
            </div>
          </footer>
        </form>
      </section>
      <SaveStatusDialog
        status={saveStatus}
        savingTitle={`Enregistrement de ${isArticle ? "l’article" : "l’actualité"}…`}
        savingMessage={imageBusy ? "Téléversement de l’image…" : fileBusy ? "Téléversement des fichiers…" : "Enregistrement en cours. Veuillez patienter."}
        successTitle={isNew ? isArticle ? "Article ajouté" : "Actualité ajoutée" : "Modifications enregistrées"}
        successMessage={isNew ? "La nouvelle fiche est enregistrée." : "La fiche est à jour."}
        redirectHref={baseHref}
        returnLabel={`Retourner aux ${isArticle ? "articles" : "actualités"}`}
      />
    </main>
  );
}
