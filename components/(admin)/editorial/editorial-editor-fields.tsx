"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { LocalizedText } from "@/lib/i18n";
import type { PublicationState } from "@/lib/content/admin";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";

export type EditorialKind = "article" | "news";
export type EditorialImage = { src: string; alt: LocalizedText };

export type EditorialDraft = {
  id: string;
  state: PublicationState;
  category: LocalizedText;
  tags: string[];
  date: string;
  readingTime?: string;
  title: LocalizedText;
  image?: EditorialImage | null;
  content: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
};

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
    field: "title" | "content" | "seoTitle" | "seoDescription",
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
              <input value={values.date} placeholder="Date du jour si vide" onChange={(event) => onChange((current) => ({ ...current, date: event.currentTarget.value }))} />
              <span className="admin-field-help">La date du jour sera utilisée si ce champ reste vide.</span>
            </label>
            {values.readingTime !== undefined && (
              <label className="admin-field">
                <span>Temps de lecture</span>
                <input required value={values.readingTime} onChange={(event) => onChange((current) => ({ ...current, readingTime: event.currentTarget.value }))} />
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
        />
        {values.image && language === "fr" && (
          <>
            <label className="admin-field">
              <span>Texte alternatif — Français</span>
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
            <button className="admin-action" type="button" onClick={() => {
              onImageSelected(null);
              setImageInputVersion((version) => version + 1);
              onChange((current) => ({ ...current, image: null }));
            }}>
              Retirer l’image
            </button>
          </>
        )}
      </div>
      {values.image && language === "en" && (
        <label className="admin-field">
          <span>Texte alternatif — Anglais</span>
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

      <label className="admin-field">
        <span>Contenu — {languageName}</span>
        <textarea
          rows={8}
          value={values.content[language]}
          onChange={(event) => updateLocalizedField("content", event.currentTarget.value)}
          aria-describedby="editorial-content-help"
        />
        <span className="admin-field-help" id="editorial-content-help">
          Le contenu est enregistré comme texte brut.
        </span>
      </label>

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
