"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { LocalizedText } from "@/lib/i18n";
import type { PublicationState } from "@/lib/content/admin";
import { ImageUploadField, type UploadedImage } from "@/components/(admin)/shared/image-upload-field";

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
  onLanguageChange,
  categories,
  onUploadBusyChange,
}: {
  values: EditorialDraft;
  onChange: Dispatch<SetStateAction<EditorialDraft>>;
  language: "fr" | "en";
  onLanguageChange: (language: "fr" | "en") => void;
  categories: LocalizedText[];
  onUploadBusyChange: (busy: boolean) => void;
}) {
  const languageName = language === "fr" ? "Français" : "English";
  const [customCategory, setCustomCategory] = useState(!categories.some((category) => category.fr === values.category.fr));

  function updateLocalizedField(
    field: "title" | "content" | "seoTitle" | "seoDescription",
    value: string,
  ) {
    onChange((current) => ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }

  function setImage(image: UploadedImage) {
    onChange((current) => ({
      ...current,
      image: { src: image.url, alt: { fr: current.title.fr, en: current.title.en } },
    }));
  }

  return (
    <>
      <div className="editor-language-switch" role="group" aria-label="Langue de saisie">
        <span>Langue du contenu</span>
        <div>
          <button
            className="editor-language-button"
            type="button"
            aria-pressed={language === "fr"}
            onClick={() => onLanguageChange("fr")}
          >
            FR
          </button>
          <button
            className="editor-language-button"
            type="button"
            aria-pressed={language === "en"}
            onClick={() => onLanguageChange("en")}
          >
            EN
          </button>
        </div>
      </div>

      <label className="admin-field">
        <span>Titre — {languageName}</span>
        <input
          autoFocus
          required
          value={values.title[language]}
          onChange={(event) => updateLocalizedField("title", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Catégorie</span>
        <select
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
            <option key={category.fr} value={category.fr}>
              {category.fr}
            </option>
          ))}
        </select>
      </label>
      {customCategory && (
        <div className="admin-fields-grid">
          {(["fr", "en"] as const).map((locale) => (
            <label className="admin-field" key={locale}>
              <span>Catégorie — {locale === "fr" ? "Français" : "English"}</span>
              <input required maxLength={100} value={values.category[locale]} onChange={(event) => {
                const category = event.currentTarget.value;
                onChange((current) => ({ ...current, category: { ...current.category, [locale]: category } }));
              }} />
            </label>
          ))}
        </div>
      )}

      <label className="admin-field">
        <span>Tags (séparés par des virgules)</span>
        <input
          value={values.tags.join(", ")}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              tags: event.currentTarget.value.split(",").map((tag) => tag.trim()).filter(Boolean),
            }))
          }
        />
      </label>

      <div className="admin-field">
        <span>Image principale</span>
        <ImageUploadField
          id="editorial-image"
          label="Choisir une image"
          value={values.image?.src}
          onUploaded={setImage}
          onBusyChange={onUploadBusyChange}
        />
        {values.image && (
          <>
            <label className="admin-field">
              <span>Texte alternatif — {languageName}</span>
              <input
                required
                value={values.image.alt[language]}
                onChange={(event) => onChange((current) => current.image ? ({
                  ...current,
                  image: { ...current.image, alt: { ...current.image.alt, [language]: event.currentTarget.value } },
                }) : current)}
              />
            </label>
            <button className="admin-action" type="button" onClick={() => onChange((current) => ({ ...current, image: null }))}>
              Retirer l’image
            </button>
          </>
        )}
      </div>

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
