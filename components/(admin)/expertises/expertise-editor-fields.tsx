"use client";

import type { LocalizedText } from "@/lib/i18n";
import type { PublicationState } from "@/lib/content/admin";

export type ExpertiseEditorValues = {
  name: LocalizedText;
  short: LocalizedText;
  slug: string;
  state: PublicationState;
};

export function ExpertiseEditorFields({
  kind,
  values,
  onChange,
  language,
  onLanguageChange,
}: {
  kind: "expertise" | "subService";
  values: ExpertiseEditorValues;
  onChange: (values: ExpertiseEditorValues) => void;
  language: "fr" | "en";
  onLanguageChange: (language: "fr" | "en") => void;
}) {
  const languageName = language === "fr" ? "Français" : "English";

  function updateLocalizedField(field: "name" | "short", value: string) {
    onChange({
      ...values,
      [field]: { ...values[field], [language]: value },
    });
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
          type="text"
          value={values.name[language]}
          onChange={(event) => updateLocalizedField("name", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Description courte — {languageName}</span>
        <textarea
          rows={4}
          value={values.short[language]}
          onChange={(event) => updateLocalizedField("short", event.currentTarget.value)}
        />
      </label>

      {kind === "expertise" && (
        <label className="admin-field">
          <span>Slug</span>
          <input
            required
            type="text"
            value={values.slug}
            onChange={(event) => onChange({ ...values, slug: event.currentTarget.value })}
            aria-describedby="editor-slug-help"
          />
          <span className="admin-field-help" id="editor-slug-help">
            Adresse : /expertises/{values.slug || "votre-slug"}
          </span>
        </label>
      )}

      <label className="admin-field">
        <span>Statut de publication</span>
        <select
          value={values.state}
          onChange={(event) =>
            onChange({ ...values, state: event.currentTarget.value as PublicationState })
          }
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </label>
    </>
  );
}
