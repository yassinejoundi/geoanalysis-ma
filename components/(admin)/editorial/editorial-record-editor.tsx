"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ArticleEditorFields, EditorialEditorFields, type EditorialDraft, type EditorialKind } from "@/components/(admin)/editorial/editorial-editor-fields";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";
import { SaveStatusDialog } from "@/components/(admin)/shared/save-status-dialog";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { sendApiMutation } from "@/lib/api-client";
import type { LocalizedText } from "@/lib/i18n";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { uploadArticleFileToCloudinary } from "@/lib/upload-article-file";
import { emptyArticleDocument, parseArticleDocument } from "@/lib/content/article-document";

function emptyItem(kind: EditorialKind, categories: LocalizedText[]): EditorialDraft {
  const category = categories[0] ?? { fr: "", en: "" };
  const articleContent = JSON.stringify(emptyArticleDocument);
  return {
    id: "",
    state: "draft",
    category: { ...category },
    tags: [],
    date: "",
    ...(kind === "article" ? { author: "", resources: [], files: [] } : {}),
    title: { fr: "", en: "" },
    image: null,
    content: kind === "article" ? { fr: articleContent, en: articleContent } : { fr: "", en: "" },
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
  };
}

function normalizeItem(item: EditorialDraft, kind: EditorialKind): EditorialDraft {
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
    content: kind === "article" ? {
      fr: JSON.stringify(parseArticleDocument(content.fr)),
      en: JSON.stringify(parseArticleDocument(content.en)),
    } : content,
    ...(kind === "article" ? { files: item.files ?? [], resources: item.resources ?? [], author: item.author ?? "" } : {}),
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
  const [values, setValues] = useState(() => initialItem ? normalizeItem(initialItem, kind) : emptyItem(kind, categories));
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [articleStep, setArticleStep] = useState<1 | 2 | 3>(1);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saving" | "success" | null>(null);
  const saveLock = useRef(false);
  const previousArticleStep = useRef(articleStep);

  useEffect(() => {
    if (isArticle) {
      if (previousArticleStep.current !== articleStep) document.getElementById("editorial-step-heading")?.focus();
      previousArticleStep.current = articleStep;
      return;
    }
    document.getElementById(`editorial-title-${language}`)?.focus();
  }, [articleStep, isArticle, language]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isArticle && articleStep < 3) {
      setArticleStep((current) => (current + 1) as 2 | 3);
      return;
    }
    if (!isArticle && language === "fr") {
      setLanguage("en");
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
      if (isArticle && pendingFiles.length) {
        setFileBusy(true);
        for (const file of pendingFiles) {
          const uploaded = await uploadArticleFileToCloudinary(file);
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
        date: isArticle ? values.date : values.date || new Date().toLocaleDateString("fr-FR"),
        ...(isArticle ? {
          author: values.author?.trim() ?? "",
          files,
          resources: values.resources ?? [],
          ...(values.slug ? { slug: values.slug } : {}),
        } : {}),
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
    }
  }

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
        <p className={styles.description}>
          {isArticle
            ? "Complétez les champs bilingues, avec le français avant l’anglais."
            : "Rédigez d’abord la version française, puis passez à la version anglaise."}
        </p>
      </header>

      <section className={styles.card} aria-label={`Fiche ${subject}`}>
        <div className={styles.progress}>
          <p className={styles.progressLabel} aria-live="polite">
            Étape {isArticle ? articleStep : language === "fr" ? "1" : "2"} sur {isArticle ? "3" : "2"}
          </p>
          <ol className={`${styles.steps} ${isArticle ? styles.stepsThree : ""}`} aria-label="Étapes de saisie">
            {(isArticle ? ["Informations", "Contenu", "Référencement"] : ["Français", "Anglais"]).map((label, index) => {
              const currentStep = isArticle ? articleStep : language === "fr" ? 1 : 2;
              return (
                <li className={styles.step} aria-current={currentStep === index + 1 ? "step" : undefined} key={label}>
                  {isArticle && index + 1 < currentStep ? (
                    <button
                      className={styles.stepButton}
                      onClick={() => {
                        setError("");
                        setArticleStep((index + 1) as 1 | 2);
                      }}
                      type="button"
                    >
                      <span className={styles.stepNumber}>{index + 1}</span> {label}
                    </button>
                  ) : <><span className={styles.stepNumber}>{index + 1}</span> {label}</>}
                </li>
              );
            })}
          </ol>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.fields}>
            {isArticle ? (
              <>
                <div>
                  <h2 className={styles.stepHeading} id="editorial-step-heading" tabIndex={-1}>
                    {articleStep === 1 ? "Informations" : articleStep === 2 ? "Contenu" : "Référencement"}
                  </h2>
                  <p className={styles.stepDescription}>
                    {articleStep === 1
                      ? "Les champs bilingues suivent l’ordre français, puis anglais."
                      : articleStep === 2
                        ? "Rédigez les deux versions et choisissez les fichiers à joindre. Ils seront téléversés à l’enregistrement."
                        : "Ajoutez les titres et descriptions SEO dans les deux langues."}
                  </p>
                </div>
                <ArticleEditorFields
                  values={values}
                  onChange={setValues}
                  step={articleStep}
                  categories={categories}
                  onImageSelected={setPendingImage}
                  pendingFiles={pendingFiles}
                  onPendingFilesChange={setPendingFiles}
                />
              </>
            ) : (
              <EditorialEditorFields
                values={values}
                onChange={setValues}
                language={language}
                categories={categories}
                onImageSelected={setPendingImage}
              />
            )}
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <footer className={`${styles.footer} ${isArticle ? styles.articleFooter : ""}`}>
            <Link className="admin-action" href={baseHref}>Annuler</Link>
            <div className={styles.actions}>
              {isArticle && articleStep > 1 ? (
                <button className="admin-action" type="button" onClick={() => {
                  setError("");
                  setArticleStep((current) => (current - 1) as 1 | 2);
                }}>
                  Précédent
                </button>
              ) : !isArticle && language === "en" ? (
                <button className="admin-action" type="button" onClick={() => { setError(""); setLanguage("fr"); }}>
                  Retour au français
                </button>
              ) : null}
              <button className="admin-action admin-action-primary" type="submit" disabled={saving}>
                {saving
                  ? imageBusy ? "Téléversement de l’image…" : fileBusy ? "Téléversement des fichiers…" : "Enregistrement…"
                  : isArticle
                    ? articleStep < 3 ? "Continuer" : "Enregistrer"
                    : language === "fr" ? "Continuer vers l’anglais" : "Enregistrer"}
              </button>
            </div>
          </footer>
        </form>
      </section>
      <SaveStatusDialog
        status={saveStatus}
        savingTitle={`Enregistrement de ${isArticle ? "l’article" : "l’actualité"}…`}
        savingMessage={imageBusy ? "Téléversement de l’image…" : fileBusy ? "Téléversement des fichiers…" : "Enregistrement en cours. Veuillez patienter."}
        successTitle={isNew
          ? isArticle ? "Article ajouté" : "Actualité ajoutée"
          : "Modifications enregistrées"}
        successMessage={isNew ? "La nouvelle fiche est enregistrée." : "La fiche est à jour."}
        redirectHref={baseHref}
        returnLabel={`Retourner aux ${isArticle ? "articles" : "actualités"}`}
      />
    </main>
  );
}
