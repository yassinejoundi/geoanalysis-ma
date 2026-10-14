"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { EditorialEditorFields, type EditorialDraft, type EditorialKind } from "@/components/(admin)/editorial/editorial-editor-fields";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";
import { SaveStatusDialog } from "@/components/(admin)/shared/save-status-dialog";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { sendApiMutation } from "@/lib/api-client";
import type { LocalizedText } from "@/lib/i18n";
import { uploadImageToCloudinary } from "@/lib/upload-image";
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
    ...(kind === "article" ? { readingTime: "5 min" } : {}),
    title: { fr: "", en: "" },
    image: null,
    content: kind === "article" ? { fr: articleContent, en: articleContent } : { fr: "", en: "" },
    ...(kind === "article" ? { files: [] } : {}),
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
    ...(kind === "article" ? { files: item.files ?? [] } : {}),
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
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saving" | "success" | null>(null);
  const saveLock = useRef(false);

  useEffect(() => {
    document.getElementById(`editorial-title-${language}`)?.focus();
  }, [language]);

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

      const fields = {
        state: values.state,
        category: values.category,
        tags: values.tags,
        title: values.title,
        content: values.content,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        image,
        date: values.date || new Date().toLocaleDateString("fr-FR"),
        ...(isArticle ? {
          readingTime: values.readingTime?.trim() || "5 min",
          files: values.files ?? [],
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
          Rédigez d’abord la version française, puis passez à la version anglaise.
        </p>
      </header>

      <section className={styles.card} aria-label={`Fiche ${subject}`}>
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
            <EditorialEditorFields
              values={values}
              onChange={setValues}
              language={language}
              categories={categories}
              onImageSelected={setPendingImage}
              onFilesBusyChange={setFileBusy}
              kind={kind}
            />
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <footer className={styles.footer}>
            <Link className="admin-action" href={baseHref}>Annuler</Link>
            <div className={styles.actions}>
              {language === "en" && (
                <button className="admin-action" type="button" onClick={() => { setError(""); setLanguage("fr"); }}>
                  Retour au français
                </button>
              )}
              <button className="admin-action admin-action-primary" type="submit" disabled={saving || fileBusy}>
                {saving ? imageBusy ? "Envoi de l’image…" : "Enregistrement…" : fileBusy ? "Envoi du fichier…" : language === "fr" ? "Continuer vers l’anglais" : "Enregistrer"}
              </button>
            </div>
          </footer>
        </form>
      </section>
      <SaveStatusDialog
        status={saveStatus}
        savingTitle={`Enregistrement de ${isArticle ? "l’article" : "l’actualité"}…`}
        savingMessage={imageBusy ? "Envoi de l’image…" : fileBusy ? "Envoi du fichier…" : "Enregistrement en cours. Veuillez patienter."}
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
