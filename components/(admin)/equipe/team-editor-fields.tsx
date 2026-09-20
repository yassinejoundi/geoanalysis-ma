"use client";

import type { Dispatch, SetStateAction } from "react";
import type { LocalizedText } from "@/lib/i18n";

export type TeamDraft = {
  id: string;
  order: number;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
};

export function TeamEditorFields({
  values,
  onChange,
  language,
  onLanguageChange,
  maxOrder,
}: {
  values: TeamDraft;
  onChange: Dispatch<SetStateAction<TeamDraft | null>>;
  language: "fr" | "en";
  onLanguageChange: (language: "fr" | "en") => void;
  maxOrder: number;
}) {
  const languageName = language === "fr" ? "Français" : "English";

  function updateLocalizedField(field: "role" | "bio", value: string) {
    onChange((current) => current && ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }

  return (
    <>
      <div className="editor-language-switch" role="group" aria-label="Langue de saisie">
        <span>Langue du contenu</span>
        <div>
          <button className="editor-language-button" type="button" aria-pressed={language === "fr"} onClick={() => onLanguageChange("fr")}>
            FR
          </button>
          <button className="editor-language-button" type="button" aria-pressed={language === "en"} onClick={() => onLanguageChange("en")}>
            EN
          </button>
        </div>
      </div>

      <label className="admin-field">
        <span>Nom</span>
        <input
          autoFocus
          required
          value={values.name}
          onChange={(event) => {
            const name = event.currentTarget.value;
            onChange((current) => current && ({ ...current, name }));
          }}
        />
      </label>

      <label className="admin-field">
        <span>Fonction — {languageName}</span>
        <input
          required
          value={values.role[language]}
          onChange={(event) => updateLocalizedField("role", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Biographie — {languageName}</span>
        <textarea
          rows={4}
          value={values.bio[language]}
          onChange={(event) => updateLocalizedField("bio", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Ordre d’affichage</span>
        <input
          type="number"
          min={1}
          max={maxOrder}
          step={1}
          required
          value={values.order}
          onChange={(event) => {
            const order = Number(event.currentTarget.value);
            onChange((current) => current && ({ ...current, order }));
          }}
        />
        <span className="admin-field-help">Vous pouvez aussi réordonner les membres avec les boutons Monter et Descendre.</span>
      </label>

      <p className="admin-disabled-field">Photo : les fichiers restent des espaces réservés dans cette démo.</p>
    </>
  );
}
