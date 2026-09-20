"use client";

import type { Dispatch, SetStateAction } from "react";
import type { LocalizedText } from "@/lib/i18n";
import type { PublicationState } from "@/lib/content/admin";

export type EditorialKind = "article" | "news";

export type EditorialDraft = {
  id: string;
  state: PublicationState;
  category: LocalizedText;
  tags: string[];
  date: string;
  readingTime?: string;
  title: LocalizedText;
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
}: {
  values: EditorialDraft;
  onChange: Dispatch<SetStateAction<EditorialDraft>>;
  language: "fr" | "en";
  onLanguageChange: (language: "fr" | "en") => void;
  categories: LocalizedText[];
}) {
  const languageName = language === "fr" ? "Français" : "English";

  function updateLocalizedField(
    field: "title" | "content" | "seoTitle" | "seoDescription",
    value: string,
  ) {
    onChange((current) => ({
      ...current,
      [field]: { ...current[field], [language]: value },
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
          value={values.category.fr}
          onChange={(event) => {
            const category = categories.find((item) => item.fr === event.currentTarget.value);
            if (category) onChange((current) => ({ ...current, category }));
          }}
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.fr} value={category.fr}>
              {category.fr}
            </option>
          ))}
        </select>
      </label>

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
        <p className="admin-disabled-field">
          Médiathèque indisponible en mode démo.
        </p>
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
          Le contenu texte est disponible. L’éditeur riche n’est pas inclus en mode démo.
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
