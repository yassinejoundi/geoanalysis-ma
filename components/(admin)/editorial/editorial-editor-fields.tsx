"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { LocalizedText } from "@/lib/i18n";
import type { PublicationState } from "@/lib/content/admin";
import type { ArticleFileAttachment, ArticleResource } from "@/lib/content/article-document";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";
import { ArticleRichTextEditor } from "./article-rich-text-editor";
import { ArticleFilesEditor } from "./article-files-editor";
import styles from "@/components/(admin)/shared/admin-record-editor.module.css";

export type EditorialKind = "article" | "news";
export type EditorialImage = { src: string; alt: LocalizedText };

export type EditorialDraft = {
  id: string;
  slug?: string;
  state: PublicationState;
  category: LocalizedText;
  tags: string[];
  date: string;
  readingTime?: string;
  author?: string;
  title: LocalizedText;
  image?: EditorialImage | null;
  content: LocalizedText;
  files?: ArticleFileAttachment[];
  resources?: ArticleResource[];
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
};

export function ArticleEditorFields({
  values,
  onChange,
  step,
  kind,
  categories,
  onImageSelected,
  pendingFiles,
  onPendingFilesChange,
}: {
  values: EditorialDraft;
  onChange: Dispatch<SetStateAction<EditorialDraft>>;
  step: 1 | 2 | 3;
  kind: EditorialKind;
  categories: LocalizedText[];
  onImageSelected: (file: File | null) => void;
  pendingFiles: File[];
  onPendingFilesChange: (files: File[]) => void;
}) {
  const [customCategory, setCustomCategory] = useState(!categories.some((category) => category.fr === values.category.fr));
  const [imageInputVersion, setImageInputVersion] = useState(0);

  function updateLocalizedField(field: "title" | "seoTitle" | "seoDescription", language: "fr" | "en", value: string) {
    onChange((current) => ({ ...current, [field]: { ...current[field], [language]: value } }));
  }

  function updateImageAlt(language: "fr" | "en", value: string) {
    onChange((current) => current.image ? ({
      ...current,
      image: { ...current.image, alt: { ...(current.image.alt ?? { fr: "", en: "" }), [language]: value } },
    }) : current);
  }

  function selectImage(file: File) {
    onImageSelected(file);
    onChange((current) => ({
      ...current,
      image: { src: current.image?.src ?? "", alt: current.image?.alt ?? { fr: current.title.fr, en: current.title.en } },
    }));
  }

  if (step === 1) {
    return (
      <>
        <fieldset className={styles.localizedPair}>
          <legend className={styles.localizedLegend}>Titre {kind === "article" ? "de l’article" : "de l’actualité"}</legend>
          {(["fr", "en"] as const).map((language) => (
            <label className="admin-field" key={language}>
              <span>{language === "fr" ? "Français" : "Anglais"}</span>
              <input
                id={`editorial-title-${language}`}
                required
                value={values.title[language]}
                onChange={(event) => updateLocalizedField("title", language, event.currentTarget.value)}
              />
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.localizedPair}>
          <legend className={styles.localizedLegend}>Catégorie</legend>
          <label className="admin-field">
            <span>Français</span>
            {customCategory ? (
              <input
                id="editorial-category-fr"
                required
                maxLength={100}
                value={values.category.fr}
                onChange={(event) => {
                  const category = event.currentTarget.value;
                  onChange((current) => ({ ...current, category: { ...current.category, fr: category } }));
                }}
              />
            ) : (
              <span className="admin-select-control">
                <select
                  id="editorial-category-fr"
                  className="admin-select"
                  required
                  value={values.category.fr}
                  onChange={(event) => {
                    if (event.currentTarget.value === "__new__") {
                      setCustomCategory(true);
                      onChange((current) => ({ ...current, category: { fr: "", en: "" } }));
                      return;
                    }
                    const category = categories.find((item) => item.fr === event.currentTarget.value);
                    if (category) onChange((current) => ({ ...current, category }));
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.fr} value={category.fr}>{category.fr}</option>
                  ))}
                  <option value="__new__">Nouvelle catégorie</option>
                </select>
                <span className="admin-select-chevron" aria-hidden="true" />
              </span>
            )}
          </label>
          <label className="admin-field">
            <span>Anglais</span>
            <input
              id="editorial-category-en"
              required
              maxLength={100}
              value={values.category.en}
              onChange={(event) => {
                const category = event.currentTarget.value;
                onChange((current) => ({ ...current, category: { ...current.category, en: category } }));
              }}
            />
          </label>
        </fieldset>

        <label className="admin-field">
          <span>Tags (séparés par des virgules)</span>
          <input
            value={values.tags.join(", ")}
            onChange={(event) => {
              const tags = event.currentTarget.value.split(",").map((tag) => tag.trim()).filter(Boolean);
              onChange((current) => ({ ...current, tags }));
            }}
          />
        </label>

        <label className="admin-field">
          <span>{kind === "article" ? "Auteur de l’article" : "Auteur de l’actualité"}</span>
          <input
            required
            maxLength={120}
            value={values.author ?? ""}
            onChange={(event) => {
              const author = event.currentTarget.value;
              onChange((current) => ({ ...current, author }));
            }}
          />
        </label>

        <div className="admin-field">
          <span>Image principale</span>
          <ImageUploadField
            key={imageInputVersion}
            id="editorial-image"
            label="Choisir une image"
            value={values.image?.src}
            deferUpload
            onFileSelected={selectImage}
            onRemove={() => {
              onImageSelected(null);
              setImageInputVersion((version) => version + 1);
              onChange((current) => ({ ...current, image: null }));
            }}
          />
          {values.image ? (
            <>
              <fieldset className={styles.localizedPair}>
                <legend className={styles.localizedLegend}>Texte alternatif (description de l’image sur la page)</legend>
                {(["fr", "en"] as const).map((language) => (
                  <label className="admin-field" key={language}>
                    <span>{language === "fr" ? "Français" : "Anglais"}</span>
                    <input
                      id={`editorial-image-alt-${language}`}
                      required
                      value={values.image?.alt?.[language] ?? ""}
                      onChange={(event) => updateImageAlt(language, event.currentTarget.value)}
                    />
                  </label>
                ))}
              </fieldset>
            </>
          ) : null}
        </div>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        {(["fr", "en"] as const).map((language) => {
          const languageName = language === "fr" ? "Français" : "Anglais";
          const labelId = `editorial-content-label-${language}`;
          const helpId = `editorial-content-help-${language}`;
          return (
            <div className="admin-field" key={language}>
              <span id={labelId}>{kind === "article" ? "Contenu" : "Contenu de l’actualité"} — {languageName}</span>
              <ArticleRichTextEditor
                labelId={labelId}
                helpId={helpId}
                value={values.content[language]}
                onChange={(value) => onChange((current) => ({
                  ...current,
                  content: { ...current.content, [language]: value },
                }))}
              />
              <span className="admin-field-help" id={helpId}>Mettez en forme le texte avec la barre d’outils.</span>
            </div>
          );
        })}
        <ArticleFilesEditor
          files={values.files ?? []}
          pendingFiles={pendingFiles}
          collection={kind === "article" ? "articles" : "actualites"}
          onFilesChange={(files) => onChange((current) => ({ ...current, files }))}
          onPendingFilesChange={onPendingFilesChange}
        />
        <section className={styles.filesSection} aria-labelledby={`${kind}-resources-heading`}>
          <h2 id={`${kind}-resources-heading`}>Ressources</h2>
          <p className={styles.fileHelp}>Ajoutez des liens utiles à consulter avec {kind === "article" ? "l’article" : "l’actualité"}.</p>
          {(values.resources ?? []).map((resource, index) => (
            <div className={styles.resourceRow} key={index}>
              <label className="admin-field">
                <span>Texte de la ressource</span>
                <input
                  required
                  maxLength={160}
                  value={resource.text}
                  onChange={(event) => {
                    const text = event.currentTarget.value;
                    onChange((current) => ({
                      ...current,
                      resources: (current.resources ?? []).map((item, itemIndex) => itemIndex === index
                        ? { ...item, text }
                        : item),
                    }));
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Lien</span>
                <input
                  required
                  type="url"
                  maxLength={2048}
                  value={resource.url}
                  onChange={(event) => {
                    const url = event.currentTarget.value;
                    onChange((current) => ({
                      ...current,
                      resources: (current.resources ?? []).map((item, itemIndex) => itemIndex === index
                        ? { ...item, url }
                        : item),
                    }));
                  }}
                />
              </label>
              <button
                className={styles.removeResource}
                type="button"
                aria-label={`Retirer la ressource ${resource.text || index + 1}`}
                onClick={() => onChange((current) => ({
                  ...current,
                  resources: (current.resources ?? []).filter((_, itemIndex) => itemIndex !== index),
                }))}
              >
                <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                Retirer
              </button>
            </div>
          ))}
          <button
            className="admin-action"
            type="button"
            disabled={(values.resources?.length ?? 0) >= 20}
            onClick={() => onChange((current) => ({
              ...current,
              resources: [...(current.resources ?? []), { text: "", url: "" }],
            }))}
          >
            Ajouter une ressource
          </button>
        </section>
      </>
    );
  }

  return (
    <section className="project-seo-editor" aria-labelledby="article-seo-title">
      <h3 id="article-seo-title">Référencement (SEO)</h3>
      <fieldset className={styles.localizedPair}>
        <legend className={styles.localizedLegend}>Titre SEO</legend>
        {(["fr", "en"] as const).map((language) => (
          <label className="admin-field" key={language}>
            <span>{language === "fr" ? "Français" : "Anglais"}</span>
            <input
              value={values.seoTitle[language]}
              onChange={(event) => updateLocalizedField("seoTitle", language, event.currentTarget.value)}
            />
          </label>
        ))}
      </fieldset>
      <fieldset className={styles.localizedPair}>
        <legend className={styles.localizedLegend}>Description SEO</legend>
        {(["fr", "en"] as const).map((language) => (
          <label className="admin-field" key={language}>
            <span>{language === "fr" ? "Français" : "Anglais"}</span>
            <textarea
              rows={3}
              value={values.seoDescription[language]}
              onChange={(event) => updateLocalizedField("seoDescription", language, event.currentTarget.value)}
            />
          </label>
        ))}
      </fieldset>
    </section>
  );
}
