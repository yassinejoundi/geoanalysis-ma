"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { EditorialEditorFields, type EditorialDraft, type EditorialKind } from "@/components/(admin)/editorial/editorial-editor-fields";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { sendApiMutation } from "@/lib/api-client";
import type { LocalizedText } from "@/lib/i18n";
import { uploadImageToCloudinary } from "@/lib/upload-image";

function emptyItem(kind: EditorialKind, categories: LocalizedText[]): EditorialDraft {
  const category = categories[0] ?? { fr: "", en: "" };
  return {
    id: "",
    state: "draft",
    category: { ...category },
    tags: [],
    date: "",
    ...(kind === "article" ? { readingTime: "5 min" } : {}),
    title: { fr: "", en: "" },
    image: null,
    content: { fr: "", en: "" },
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
  };
}

function normalizeItem(item: EditorialDraft): EditorialDraft {
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
    content: item.content ?? { fr: "", en: "" },
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
  const [values, setValues] = useState(() => initialItem ? normalizeItem(initialItem) : emptyItem(kind, categories));
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fieldsVersion, setFieldsVersion] = useState(0);
  const saveLock = useRef(false);

  useEffect(() => {
    document.getElementById(`editorial-title-${language}`)?.focus();
  }, [language]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (language === "fr") {
      setLanguage("en");
      return;
    }
    if (saveLock.current) return;

    saveLock.current = true;
    setSaving(true);
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

      const draft = {
        ...values,
        image,
        date: values.date || new Date().toLocaleDateString("fr-FR"),
        ...(isArticle ? { readingTime: values.readingTime?.trim() || "5 min" } : {}),
      };
      const { id, ...fields } = draft;
      const saved = isNew
        ? await sendApiMutation<EditorialDraft>(endpoint, "POST", fields)
        : await sendApiMutation<EditorialDraft>(`${endpoint}/${id}`, "PATCH", fields);

      if (isNew) {
        setValues(emptyItem(kind, categories));
        setNotice(`${isArticle ? "Article ajouté" : "Actualité ajoutée"}. Fiche prête pour une nouvelle saisie.`);
      } else {
        setValues(normalizeItem(saved));
        setNotice("Modifications enregistrées.");
      }
      setPendingImage(null);
      setLanguage("fr");
      setFieldsVersion((version) => version + 1);
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
              key={fieldsVersion}
              values={values}
              onChange={setValues}
              language={language}
              categories={categories}
              onImageSelected={setPendingImage}
            />
          </div>
          <p className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
            {imageBusy ? "Envoi de l’image…" : saving ? "Enregistrement…" : notice}
          </p>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <footer className={styles.footer}>
            <Link className="admin-action" href={baseHref}>Annuler</Link>
            <div className={styles.actions}>
              {language === "en" && (
                <button className="admin-action" type="button" onClick={() => { setError(""); setLanguage("fr"); }}>
                  Retour au français
                </button>
              )}
              <button className="admin-action admin-action-primary" type="submit" disabled={saving}>
                {saving ? imageBusy ? "Envoi de l’image…" : "Enregistrement…" : language === "fr" ? "Continuer vers l’anglais" : "Enregistrer"}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </main>
  );
}
