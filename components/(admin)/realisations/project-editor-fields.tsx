"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import type { AdminExpertise } from "@/lib/content/admin";
import type { ProjectDraft } from "@/lib/content/projects";
export type { ProjectDraft, ProjectImage } from "@/lib/content/projects";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";

export function ProjectEditorFields({
  values,
  onChange,
  expertises,
  language,
  pendingImages,
  onPendingImagesChange,
}: {
  values: ProjectDraft;
  onChange: Dispatch<SetStateAction<ProjectDraft>>;
  expertises: AdminExpertise[];
  language: "fr" | "en";
  pendingImages: File[];
  onPendingImagesChange: Dispatch<SetStateAction<File[]>>;
}) {
  const [imageInputVersion, setImageInputVersion] = useState(0);
  const selectedExpertise = expertises.find(
    (expertise) => expertise.id === values.expertiseId,
  );
  const languageName = language === "fr" ? "Français" : "Anglais";

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
      <label className="admin-field">
        <span>Titre — {languageName}</span>
        <input
          id={`project-title-${language}`}
          required
          value={values.title[language]}
          onChange={(event) => updateLocalizedField("title", event.currentTarget.value)}
        />
      </label>

      {language === "fr" && (
        <>
          <label className="admin-field">
            <span>Expertise associée</span>
            <span className="admin-select-control">
              <select
                id="project-expertise"
                className="admin-select"
                required
                value={values.expertiseId}
                onChange={(event) => {
                  const expertiseId = event.currentTarget.value;
                  onChange((current) => ({ ...current, expertiseId, subServiceId: "" }));
                }}
              >
                <option value="">Choisir une expertise</option>
                {expertises.map((expertise) => (
                  <option key={expertise.id} value={expertise.id}>{expertise.name.fr}</option>
                ))}
              </select>
              <span className="admin-select-chevron" aria-hidden="true" />
            </span>
          </label>

          <label className="admin-field">
            <span>Sous-service (optionnel)</span>
            <span className="admin-select-control">
              <select
                className="admin-select"
                value={values.subServiceId}
                onChange={(event) => onChange((current) => ({ ...current, subServiceId: event.currentTarget.value }))}
              >
                <option value="">—</option>
                {selectedExpertise?.subServices.map((service) => (
                  <option key={service.id} value={service.id}>{service.name.fr}</option>
                ))}
              </select>
              <span className="admin-select-chevron" aria-hidden="true" />
            </span>
          </label>

          <div className="admin-fields-grid">
            <label className="admin-field">
              <span>Localisation</span>
              <input
                id="project-location"
                required
                value={values.location}
                onChange={(event) => onChange((current) => ({ ...current, location: event.currentTarget.value }))}
              />
            </label>
            <label className="admin-field">
              <span>Date</span>
              <input
                id="project-date"
                required
                value={values.date}
                onChange={(event) => onChange((current) => ({ ...current, date: event.currentTarget.value }))}
              />
            </label>
          </div>
        </>
      )}

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

      {language === "fr" && <section className="project-gallery-editor" aria-labelledby="project-gallery-title">
        <div className="project-gallery-heading">
          <h3 id="project-gallery-title">Galerie du projet</h3>
          <p>Sélectionnez plusieurs fichiers à la fois. Chaque image sera ajoutée à la galerie.</p>
        </div>
        {values.gallery.length === 0 && values.legacyImage ? (
          <figure className="project-gallery-card">
            <div className="project-gallery-placeholder">
              <Image
                className="project-gallery-preview-image"
                src={values.legacyImage}
                alt="Image de couverture actuelle"
                width={420}
                height={236}
                unoptimized
              />
            </div>
            <figcaption className="project-gallery-empty">
              Image de couverture actuelle. Les images ajoutées à la galerie la remplaceront sur le site.
            </figcaption>
          </figure>
        ) : values.gallery.length === 0 ? (
          <p className="project-gallery-empty">Aucune image dans la galerie.</p>
        ) : (
          <ul className="project-gallery-grid">
            {values.gallery.map((image, index) => (
              <li className="project-gallery-card" key={image.id}>
                <div className="project-gallery-placeholder">
                  {image.url ? (
                    <Image
                      className="project-gallery-preview-image"
                      src={image.url}
                      alt={image.caption || `Aperçu de l’image ${index + 1}`}
                      width={420}
                      height={236}
                      unoptimized
                    />
                  ) : (
                    <span aria-hidden="true">{image.isCover ? "Couverture" : `Image ${index + 1}`}</span>
                  )}
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
        {pendingImages.length > 0 && (
          <ul aria-label="Images prêtes à l’enregistrement">
            {pendingImages.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                {file.name}
                <button className="admin-action" type="button" onClick={() => {
                  onPendingImagesChange((current) => current.filter((_, item) => item !== index));
                  setImageInputVersion((version) => version + 1);
                }}>
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
        <ImageUploadField
          key={imageInputVersion}
          id="project-gallery-image"
          label="Ajouter plusieurs images"
          multiple
          deferUpload
          maxFiles={30 - values.gallery.length - pendingImages.length}
          onFilesSelected={(files) => onPendingImagesChange((current) => [...current, ...files])}
        />
      </section>}

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
