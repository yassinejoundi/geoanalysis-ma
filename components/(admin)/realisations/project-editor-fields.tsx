"use client";

import type { Dispatch, SetStateAction } from "react";
import type { LocalizedText } from "@/lib/i18n";
import { adminExpertises, type PublicationState } from "@/lib/content/admin";

export type ProjectImage = {
  id: string;
  caption: string;
  isCover: boolean;
};

export type ProjectDraft = {
  id: string;
  state: PublicationState;
  expertiseId: string;
  subServiceId: string;
  location: string;
  date: string;
  title: LocalizedText;
  context: LocalizedText;
  methodology: LocalizedText;
  results: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  gallery: ProjectImage[];
};

export function ProjectEditorFields({
  values,
  onChange,
  language,
  onLanguageChange,
}: {
  values: ProjectDraft;
  onChange: Dispatch<SetStateAction<ProjectDraft>>;
  language: "fr" | "en";
  onLanguageChange: (language: "fr" | "en") => void;
}) {
  const selectedExpertise = adminExpertises.find(
    (expertise) => expertise.id === values.expertiseId,
  );
  const languageName = language === "fr" ? "Français" : "English";

  function updateLocalizedField(field: keyof Pick<
    ProjectDraft,
    "title" | "context" | "methodology" | "results" | "seoTitle" | "seoDescription"
  >, value: string) {
    onChange((current) => ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }

  function updateGalleryImage(imageId: string, caption: string) {
    onChange((current) => ({
      ...current,
      gallery: current.gallery.map((image) =>
        image.id === imageId ? { ...image, caption } : image,
      ),
    }));
  }

  function selectCover(imageId: string) {
    onChange((current) => ({
      ...current,
      gallery: current.gallery.map((image) => ({
        ...image,
        isCover: image.id === imageId,
      })),
    }));
  }

  function removeImage(imageId: string) {
    onChange((current) => {
      const gallery = current.gallery.filter((image) => image.id !== imageId);
      if (gallery.length > 0 && !gallery.some((image) => image.isCover)) {
        gallery[0] = { ...gallery[0], isCover: true };
      }
      return { ...current, gallery };
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
          value={values.title[language]}
          onChange={(event) => updateLocalizedField("title", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Expertise associée</span>
        <select
          required
          value={values.expertiseId}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              expertiseId: event.currentTarget.value,
              subServiceId: "",
            }))
          }
        >
          <option value="">Choisir une expertise</option>
          {adminExpertises.map((expertise) => (
            <option key={expertise.id} value={expertise.id}>
              {expertise.name.fr}
            </option>
          ))}
        </select>
      </label>

      <label className="admin-field">
        <span>Sous-service (optionnel)</span>
        <select
          value={values.subServiceId}
          onChange={(event) =>
            onChange((current) => ({ ...current, subServiceId: event.currentTarget.value }))
          }
        >
          <option value="">—</option>
          {selectedExpertise?.subServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name.fr}
            </option>
          ))}
        </select>
      </label>

      <div className="admin-fields-grid">
        <label className="admin-field">
          <span>Localisation</span>
          <input
            value={values.location}
            onChange={(event) =>
              onChange((current) => ({ ...current, location: event.currentTarget.value }))
            }
          />
        </label>
        <label className="admin-field">
          <span>Date</span>
          <input
            value={values.date}
            onChange={(event) =>
              onChange((current) => ({ ...current, date: event.currentTarget.value }))
            }
          />
        </label>
      </div>

      <label className="admin-field">
        <span>Contexte — {languageName}</span>
        <textarea
          rows={4}
          value={values.context[language]}
          onChange={(event) => updateLocalizedField("context", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Méthodologie — {languageName}</span>
        <textarea
          rows={4}
          value={values.methodology[language]}
          onChange={(event) => updateLocalizedField("methodology", event.currentTarget.value)}
        />
      </label>

      <label className="admin-field">
        <span>Résultats — {languageName}</span>
        <textarea
          rows={4}
          value={values.results[language]}
          onChange={(event) => updateLocalizedField("results", event.currentTarget.value)}
        />
      </label>

      <section className="project-gallery-editor" aria-labelledby="project-gallery-title">
        <div className="project-gallery-heading">
          <h3 id="project-gallery-title">Galerie du projet</h3>
          <p>Les images restent des espaces réservés en mode démo.</p>
        </div>
        {values.gallery.length === 0 ? (
          <p className="project-gallery-empty">Aucune image dans la galerie.</p>
        ) : (
          <ul className="project-gallery-grid">
            {values.gallery.map((image, index) => (
              <li className="project-gallery-card" key={image.id}>
                <div className="project-gallery-placeholder" aria-hidden="true">
                  <span>{image.isCover ? "Couverture" : `Image ${index + 1}`}</span>
                </div>
                <label className="admin-field">
                  <span>Légende de l’image {index + 1}</span>
                  <input
                    value={image.caption}
                    onChange={(event) => updateGalleryImage(image.id, event.currentTarget.value)}
                  />
                </label>
                <div className="project-gallery-actions">
                  <button
                    className="admin-action"
                    type="button"
                    aria-pressed={image.isCover}
                    onClick={() => selectCover(image.id)}
                  >
                    {image.isCover ? "Image de couverture" : "Définir comme couverture"}
                  </button>
                  <button
                    className="admin-action admin-action-danger"
                    type="button"
                    aria-label={`Supprimer l’image ${index + 1}${image.caption ? ` : ${image.caption}` : ""}`}
                    onClick={() => removeImage(image.id)}
                  >
                    Supprimer l’image
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button className="admin-action" type="button" disabled>
          Ajouter des images — médiathèque indisponible
        </button>
      </section>

      <section className="project-seo-editor" aria-labelledby="project-seo-title">
        <h3 id="project-seo-title">SEO</h3>
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
