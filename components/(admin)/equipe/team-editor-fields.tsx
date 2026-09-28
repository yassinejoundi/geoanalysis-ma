"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import type { LocalizedText } from "@/lib/i18n";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";

const placeholderAvatars = {
  man: "/avatars/team-man.png",
  woman: "/avatars/team-woman.png",
} as const;

export type TeamDraft = {
  id: string;
  order: number;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  image: string | null;
};

export function TeamEditorFields({
  values,
  onChange,
  language,
  onLanguageChange,
  maxOrder,
  isNew,
  disabled,
  isUploading,
  pendingImage,
  onImageFileSelected,
}: {
  values: TeamDraft;
  onChange: Dispatch<SetStateAction<TeamDraft | null>>;
  language: "fr" | "en";
  onLanguageChange: (language: "fr" | "en") => void;
  maxOrder: number;
  isNew: boolean;
  disabled: boolean;
  isUploading: boolean;
  pendingImage: File | null;
  onImageFileSelected: (file: File | null) => void;
}) {
  const [imageInputVersion, setImageInputVersion] = useState(0);
  const languageName = language === "fr" ? "Français" : "English";

  function updateLocalizedField(field: "role" | "bio", value: string) {
    onChange((current) => current && ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }

  function setAvatar(image: string | null) {
    onImageFileSelected(null);
    setImageInputVersion((version) => version + 1);
    onChange((current) => current && ({ ...current, image }));
  }

  return (
    <>
      <div className="editor-language-switch" role="group" aria-label="Langue de saisie">
        <span>Langue du contenu</span>
        <div>
          <button className="editor-language-button" type="button" disabled={disabled} aria-pressed={language === "fr"} onClick={() => onLanguageChange("fr")}>
            FR
          </button>
          <button className="editor-language-button" type="button" disabled={disabled} aria-pressed={language === "en"} onClick={() => onLanguageChange("en")}>
            EN
          </button>
        </div>
      </div>

      <label className="admin-field">
        <span>Nom</span>
        <input
          autoFocus
          required
          disabled={disabled}
          maxLength={120}
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
          disabled={disabled}
          maxLength={120}
          value={values.role[language]}
          onChange={(event) => updateLocalizedField("role", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Biographie — {languageName}</span>
        <textarea
          rows={4}
          required
          disabled={disabled}
          maxLength={1400}
          value={values.bio[language]}
          onChange={(event) => updateLocalizedField("bio", event.currentTarget.value)}
        />
      </label>

      <div className="admin-field">
        <span>Avatar sans photo</span>
        <div className="admin-action-group" role="group" aria-label="Choisir un avatar de remplacement">
          <button
            className={"admin-action" + (values.image === null ? " admin-action-primary" : "")}
            type="button"
            disabled={disabled}
            aria-pressed={!pendingImage && values.image === null}
            onClick={() => setAvatar(null)}
          >
            Initiales
          </button>
          <button
            className={"admin-action" + (values.image === placeholderAvatars.man ? " admin-action-primary" : "")}
            type="button"
            disabled={disabled}
            aria-pressed={!pendingImage && values.image === placeholderAvatars.man}
            onClick={() => setAvatar(placeholderAvatars.man)}
          >
            <Image src={placeholderAvatars.man} alt="" width={28} height={28} />
            Homme
          </button>
          <button
            className={"admin-action" + (values.image === placeholderAvatars.woman ? " admin-action-primary" : "")}
            type="button"
            disabled={disabled}
            aria-pressed={!pendingImage && values.image === placeholderAvatars.woman}
            onClick={() => setAvatar(placeholderAvatars.woman)}
          >
            <Image src={placeholderAvatars.woman} alt="" width={28} height={28} />
            Femme
          </button>
        </div>
        <span className="admin-field-help">Choisissez l’avatar affiché tant qu’aucune photo n’est téléversée.</span>
        <ImageUploadField
          key={imageInputVersion}
          id="team-member-image"
          label="Téléverser une photo (facultatif)"
          value={values.image}
          uploadFolder="bureau"
          disabled={disabled || isUploading}
          deferUpload
          onFileSelected={onImageFileSelected}
        />
      </div>

      {isNew ? (
        <p className="admin-field-help">Le profil sera ajouté en fin de liste. Vous pourrez ensuite modifier son ordre.</p>
      ) : (
        <label className="admin-field">
          <span>Ordre d’affichage</span>
          <input
            type="number"
            min={1}
            max={maxOrder}
            step={1}
            required
            disabled={disabled}
            value={values.order}
            onChange={(event) => {
              const order = Number(event.currentTarget.value);
              onChange((current) => current && ({ ...current, order }));
            }}
          />
          <span className="admin-field-help">Vous pouvez aussi réordonner les membres avec les boutons Monter et Descendre.</span>
        </label>
      )}
    </>
  );
}
