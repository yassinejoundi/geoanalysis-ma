"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { AdminExpertise } from "@/lib/content/admin";
import type { ProjectDraft } from "@/lib/content/projects";
export type { ProjectDraft, ProjectImage } from "@/lib/content/projects";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";
import { ArticleRichTextEditor } from "@/components/(admin)/editorial/article-rich-text-editor";
import { ArticleFilesEditor } from "@/components/(admin)/editorial/article-files-editor";
import styles from "@/components/(admin)/editorial/article-rich-text-editor.module.css";
import editorStyles from "@/components/(admin)/shared/admin-record-editor.module.css";

const languages = ["fr", "en"] as const;
type Language = (typeof languages)[number];
type RichField = "context" | "methodology" | "results";

export function ProjectEditorFields({
  values,
  onChange,
  expertises,
  step,
  pendingImages,
  onPendingImagesChange,
  pendingFiles,
  onPendingFilesChange,
}: {
  values: ProjectDraft;
  onChange: Dispatch<SetStateAction<ProjectDraft>>;
  expertises: AdminExpertise[];
  step: 1 | 2 | 3;
  pendingImages: File[];
  onPendingImagesChange: Dispatch<SetStateAction<File[]>>;
  pendingFiles: File[];
  onPendingFilesChange: (files: File[]) => void;
}) {
  const [imageInputVersion, setImageInputVersion] = useState(0);
  const selectedExpertise = expertises.find((expertise) => expertise.id === values.expertiseId);

  function updateLocalizedField(field: RichField | "title" | "seoTitle" | "seoDescription", language: Language, value: string) {
    onChange((current) => ({ ...current, [field]: { ...current[field], [language]: value } }));
  }

  function updateGalleryImage(imageId: string, caption: string) {
    onChange((current) => ({
      ...current,
      gallery: current.gallery.map((image) => image.id === imageId ? { ...image, caption } : image),
    }));
  }

  function selectCover(imageId: string) {
    onChange((current) => ({ ...current, gallery: current.gallery.map((image) => ({ ...image, isCover: image.id === imageId })) }));
  }

  function removeImage(imageId: string) {
    onChange((current) => {
      const gallery = current.gallery.filter((image) => image.id !== imageId);
      if (gallery.length > 0 && !gallery.some((image) => image.isCover)) gallery[0] = { ...gallery[0], isCover: true };
      return { ...current, gallery };
    });
  }

  if (step === 1) {
    return (
      <>
        <fieldset className={editorStyles.localizedPair}>
          <legend className={editorStyles.localizedLegend}>Titre de la réalisation</legend>
          {languages.map((language) => (
            <label className="admin-field" key={language}>
              <span>{language === "fr" ? "Français" : "Anglais"}</span>
              <input id={`project-title-${language}`} required value={values.title[language]}
                onChange={(event) => updateLocalizedField("title", language, event.currentTarget.value)} />
            </label>
          ))}
        </fieldset>

        <label className="admin-field">
          <span>Expertise associée</span>
          <span className="admin-select-control">
            <select className="admin-select" required value={values.expertiseId} onChange={(event) => {
              const expertiseId = event.currentTarget.value;
              onChange((current) => ({ ...current, expertiseId, subServiceId: "" }));
            }}>
              <option value="">Choisir une expertise</option>
              {expertises.map((expertise) => <option key={expertise.id} value={expertise.id}>{expertise.name.fr}</option>)}
            </select>
            <span className="admin-select-chevron" aria-hidden="true" />
          </span>
        </label>

        <label className="admin-field">
          <span>Sous-service (optionnel)</span>
          <span className="admin-select-control">
            <select className="admin-select" value={values.subServiceId} onChange={(event) => {
              const subServiceId = event.currentTarget.value;
              onChange((current) => ({ ...current, subServiceId }));
            }}>
              <option value="">—</option>
              {selectedExpertise?.subServices.map((service) => <option key={service.id} value={service.id}>{service.name.fr}</option>)}
            </select>
            <span className="admin-select-chevron" aria-hidden="true" />
          </span>
        </label>

        <div className="admin-fields-grid">
          <label className="admin-field">
            <span>Localisation</span>
            <input required value={values.location} onChange={(event) => {
              const location = event.currentTarget.value;
              onChange((current) => ({ ...current, location }));
            }} />
          </label>
          <label className="admin-field">
            <span>Date du projet</span>
            <input required value={values.date} onChange={(event) => {
              const date = event.currentTarget.value;
              onChange((current) => ({ ...current, date }));
            }} />
          </label>
        </div>
        <label className="admin-field">
          <span>Auteur / équipe du projet</span>
          <input maxLength={120} value={values.author ?? ""} onChange={(event) => {
            const author = event.currentTarget.value;
            onChange((current) => ({ ...current, author }));
          }} />
        </label>

        <section className="project-gallery-editor" aria-labelledby="project-gallery-title">
          <div className="project-gallery-heading">
            <h3 id="project-gallery-title">Galerie du projet</h3>
            <p>Sélectionnez plusieurs images. Elles seront optimisées en WebP lors de l’enregistrement.</p>
          </div>
          {values.gallery.length === 0 && values.legacyImage ? (
            <figure className="project-gallery-card">
              <div className="project-gallery-placeholder">
                <Image className="project-gallery-preview-image" src={values.legacyImage} alt="Image de couverture actuelle" width={420} height={236} unoptimized />
              </div>
              <figcaption className="project-gallery-empty">Image de couverture actuelle. Les images ajoutées à la galerie la remplaceront sur le site.</figcaption>
            </figure>
          ) : values.gallery.length === 0 ? (
            <p className="project-gallery-empty">Aucune image dans la galerie.</p>
          ) : (
            <ul className="project-gallery-grid">
              {values.gallery.map((image, index) => (
                <li className="project-gallery-card" key={image.id}>
                  <div className="project-gallery-placeholder">
                    {image.url ? <Image className="project-gallery-preview-image" src={image.url} alt={image.caption || `Aperçu de l’image ${index + 1}`} width={420} height={236} unoptimized />
                      : <span aria-hidden="true">{image.isCover ? "Couverture" : `Image ${index + 1}`}</span>}
                    <button className="project-gallery-remove" type="button" aria-label={`Supprimer l’image ${index + 1}`} onClick={() => removeImage(image.id)}>
                      <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                    </button>
                  </div>
                  <label className="admin-field">
                    <span>Légende de l’image {index + 1}</span>
                    <input value={image.caption} onChange={(event) => updateGalleryImage(image.id, event.currentTarget.value)} />
                  </label>
                  <div className="project-gallery-actions">
                    <button className="admin-action" type="button" aria-pressed={image.isCover} onClick={() => selectCover(image.id)}>
                      {image.isCover ? "Image de couverture" : "Définir comme couverture"}
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
                  }}>Retirer</button>
                </li>
              ))}
            </ul>
          )}
          <ImageUploadField key={imageInputVersion} id="project-gallery-image" label="Ajouter plusieurs images" multiple deferUpload
            maxFiles={30 - values.gallery.length - pendingImages.length}
            onFilesSelected={(files) => onPendingImagesChange((current) => [...current, ...files])} />
        </section>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        {(["context", "methodology", "results"] as const).map((field) => {
          const labels = { context: "Contexte", methodology: "Méthodologie", results: "Résultats" };
          return (
            <fieldset className={editorStyles.localizedPair} key={field}>
              <legend className={editorStyles.localizedLegend}>{labels[field]}</legend>
              {languages.map((language) => {
                const editorId = `project-${field}-${language}`;
                const helpId = `${editorId}-help`;
                return (
                  <div className="admin-field" key={language}>
                    <span id={`${editorId}-label`}>{language === "fr" ? "Français" : "Anglais"}</span>
                    <ArticleRichTextEditor labelId={`${editorId}-label`} helpId={helpId} value={values[field][language]}
                      onChange={(value) => updateLocalizedField(field, language, value)} />
                    <span className="admin-field-help" id={helpId}>Texte mis en forme et affiché sur la page du projet.</span>
                  </div>
                );
              })}
            </fieldset>
          );
        })}
        <ArticleFilesEditor files={values.files ?? []} pendingFiles={pendingFiles} collection="realisations"
          onFilesChange={(files) => onChange((current) => ({ ...current, files }))}
          onPendingFilesChange={onPendingFilesChange} />
        <section className={styles.filesSection} aria-labelledby="project-resources-heading">
          <h2 id="project-resources-heading">Ressources</h2>
          <p className={styles.fileHelp}>Ajoutez les liens utiles liés au projet.</p>
          {(values.resources ?? []).map((resource, index) => (
            <div className={styles.resourceRow} key={index}>
              <label className="admin-field"><span>Texte de la ressource</span><input required maxLength={160} value={resource.text} onChange={(event) => {
                const text = event.currentTarget.value;
                onChange((current) => ({ ...current, resources: (current.resources ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, text } : item) }));
              }} /></label>
              <label className="admin-field"><span>Lien</span><input required type="url" maxLength={2048} value={resource.url} onChange={(event) => {
                const url = event.currentTarget.value;
                onChange((current) => ({ ...current, resources: (current.resources ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, url } : item) }));
              }} /></label>
              <button className={styles.removeResource} type="button" aria-label={`Retirer la ressource ${resource.text || index + 1}`} onClick={() => onChange((current) => ({
                ...current, resources: (current.resources ?? []).filter((_, itemIndex) => itemIndex !== index),
              }))}>
                <FontAwesomeIcon icon={faTrash} aria-hidden="true" /> Retirer
              </button>
            </div>
          ))}
          <button className="admin-action" type="button" disabled={(values.resources?.length ?? 0) >= 20}
            onClick={() => onChange((current) => ({ ...current, resources: [...(current.resources ?? []), { text: "", url: "" }] }))}>
            Ajouter une ressource
          </button>
        </section>
      </>
    );
  }

  return (
    <section className="project-seo-editor" aria-labelledby="project-seo-title">
      <h3 id="project-seo-title">SEO</h3>
      {(["seoTitle", "seoDescription"] as const).map((field) => (
        <fieldset className={editorStyles.localizedPair} key={field}>
          <legend className={editorStyles.localizedLegend}>{field === "seoTitle" ? "Titre SEO" : "Description SEO"}</legend>
          {languages.map((language) => (
            <label className="admin-field" key={language}>
              <span>{language === "fr" ? "Français" : "Anglais"}</span>
              {field === "seoTitle" ? <input value={values[field][language]} onChange={(event) => updateLocalizedField(field, language, event.currentTarget.value)} />
                : <textarea rows={3} value={values[field][language]} onChange={(event) => updateLocalizedField(field, language, event.currentTarget.value)} />}
            </label>
          ))}
        </fieldset>
      ))}
    </section>
  );
}
