"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
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
  categories,
  onImageSelected,
  pendingFiles,
  onPendingFilesChange,
}: {
  values: EditorialDraft;
  onChange: Dispatch<SetStateAction<EditorialDraft>>;
  step: 1 | 2 | 3;
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
          <legend className={styles.localizedLegend}>Titre de l’article</legend>
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
          <span>Auteur de l’article</span>
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
              <span id={labelId}>Contenu — {languageName}</span>
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
          onFilesChange={(files) => onChange((current) => ({ ...current, files }))}
          onPendingFilesChange={onPendingFilesChange}
        />
        <section className={styles.filesSection} aria-labelledby="article-resources-heading">
          <h2 id="article-resources-heading">Ressources</h2>
          <p className={styles.fileHelp}>Ajoutez des liens utiles à consulter avec l’article.</p>
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
                className={styles.removeFile}
                type="button"
                aria-label={`Retirer la ressource ${resource.text || index + 1}`}
                onClick={() => onChange((current) => ({
                  ...current,
                  resources: (current.resources ?? []).filter((_, itemIndex) => itemIndex !== index),
                }))}
              >
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

export function EditorialEditorFields({
  values,
  onChange,
  language,
  categories,
  onImageSelected,
}: {
  values: EditorialDraft;
  onChange: Dispatch<SetStateAction<EditorialDraft>>;
  language: "fr" | "en";
  categories: LocalizedText[];
  onImageSelected: (file: File | null) => void;
}) {
  const languageName = language === "fr" ? "Français" : "Anglais";
  const [customCategory, setCustomCategory] = useState(!categories.some((category) => category.fr === values.category.fr));
  const [imageInputVersion, setImageInputVersion] = useState(0);

  function updateLocalizedField(
    field: "title" | "seoTitle" | "seoDescription",
    value: string,
  ) {
    onChange((current) => ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }

  function selectImage(file: File) {
    onImageSelected(file);
    onChange((current) => ({
      ...current,
      image: { src: current.image?.src ?? "", alt: current.image?.alt ?? { fr: current.title.fr, en: current.title.en } },
    }));
  }

  return (
    <>
      <label className="admin-field">
        <span>Titre — {languageName}</span>
        <input
          id={`editorial-title-${language}`}
          required
          value={values.title[language]}
          onChange={(event) => updateLocalizedField("title", event.currentTarget.value)}
        />
      </label>

      {language === "fr" && (
        <>
          <label className="admin-field">
            <span>Catégorie</span>
            <span className="admin-select-control">
              <select
                id="editorial-category-fr"
                className="admin-select"
                required
                value={customCategory ? "__new__" : values.category.fr}
                onChange={(event) => {
                  if (event.currentTarget.value === "__new__") {
                    setCustomCategory(true);
                    onChange((current) => ({ ...current, category: { fr: "", en: "" } }));
                    return;
                  }
                  const category = categories.find((item) => item.fr === event.currentTarget.value);
                  if (category) {
                    setCustomCategory(false);
                    onChange((current) => ({ ...current, category }));
                  }
                }}
              >
                <option value="__new__">Nouvelle catégorie</option>
                {categories.map((category) => (
                  <option key={category.fr} value={category.fr}>{category.fr}</option>
                ))}
              </select>
              <span className="admin-select-chevron" aria-hidden="true" />
            </span>
          </label>
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
          <div className="admin-fields-grid">
            <label className="admin-field">
              <span>Date de publication</span>
              <input value={values.date} placeholder="Date du jour si vide" onChange={(event) => {
                const date = event.currentTarget.value;
                onChange((current) => ({ ...current, date }));
              }} />
              <span className="admin-field-help">La date du jour sera utilisée si ce champ reste vide.</span>
            </label>
            {values.readingTime !== undefined && (
              <label className="admin-field">
                <span>Temps de lecture</span>
                <input required value={values.readingTime} onChange={(event) => {
                  const readingTime = event.currentTarget.value;
                  onChange((current) => ({ ...current, readingTime }));
                }} />
              </label>
            )}
          </div>
        </>
      )}
      {(customCategory || language === "en") && (
        <label className="admin-field">
          <span>Catégorie — {languageName}</span>
          <input
            id={`editorial-category-${language}`}
            required
            maxLength={100}
            value={values.category[language]}
            onChange={(event) => {
              const category = event.currentTarget.value;
              onChange((current) => ({ ...current, category: { ...current.category, [language]: category } }));
            }}
          />
        </label>
      )}

      <div className="admin-field" hidden={language !== "fr"}>
        <span>Image principale</span>
        <ImageUploadField
          key={imageInputVersion}
          id="editorial-image"
          label="Choisir une image"
          value={values.image?.src}
          deferUpload
          onFileSelected={(file) => selectImage(file)}
          onRemove={() => {
            onImageSelected(null);
            setImageInputVersion((version) => version + 1);
            onChange((current) => ({ ...current, image: null }));
          }}
        />
        {values.image && language === "fr" && (
          <>
            <label className="admin-field">
              <span>Texte alternatif (description de l’image sur la page) — Français</span>
              <input
                id="editorial-image-alt-fr"
                required
                disabled={language !== "fr"}
                value={values.image.alt?.fr ?? ""}
                onChange={(event) => {
                  const alt = event.currentTarget.value;
                  onChange((current) => current.image ? ({
                    ...current,
                    image: { ...current.image, alt: { ...(current.image.alt ?? { fr: "", en: "" }), fr: alt } },
                  }) : current);
                }}
              />
            </label>
          </>
        )}
      </div>
      {values.image && language === "en" && (
        <label className="admin-field">
          <span>Texte alternatif (description de l’image sur la page) — Anglais</span>
          <input
            id="editorial-image-alt-en"
            required
            value={values.image.alt?.en ?? ""}
            onChange={(event) => {
              const alt = event.currentTarget.value;
              onChange((current) => current.image ? ({
                ...current,
                image: { ...current.image, alt: { ...(current.image.alt ?? { fr: "", en: "" }), en: alt } },
              }) : current);
            }}
          />
        </label>
      )}

      <div className="admin-field">
        <span id="editorial-content-label">Contenu — {languageName}</span>
        <textarea
          rows={8}
          value={values.content[language]}
          onChange={(event) => {
            const content = event.currentTarget.value;
            onChange((current) => ({
              ...current,
              content: { ...current.content, [language]: content },
            }));
          }}
          aria-describedby="editorial-content-help"
        />
        <span className="admin-field-help" id="editorial-content-help">
          Le contenu est enregistré comme texte brut.
        </span>
      </div>

      <section className="project-seo-editor" aria-labelledby="editorial-seo-title">
        <h3 id="editorial-seo-title">SEO</h3>
        <label className="admin-field">
          <span>Titre SEO — {languageName}</span>
          <input
            value={values.seoTitle[language]}
            onChange={(event) => updateLocalizedField("seoTitle", event.currentTarget.value)}
          />
        </label>
        <label className="admin-field">
          <span>Description SEO — {languageName}</span>
          <textarea
            rows={3}
            value={values.seoDescription[language]}
            onChange={(event) => updateLocalizedField("seoDescription", event.currentTarget.value)}
          />
        </label>
      </section>
    </>
  );
}
