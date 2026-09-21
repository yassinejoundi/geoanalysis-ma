"use client";

import { useRef, useState } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBullseye,
  faCalendarDays,
  faEye,
  faEyeSlash,
  faFolderOpen,
  faImages,
  faLocationDot,
  faPen,
  faPlus,
  faSitemap,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { StatCard } from "@/components/(admin)/dashboard/stat-card";
import { Toast } from "@/components/(admin)/shared/toast";
import {
  ProjectEditorFields,
  type ProjectDraft,
} from "@/components/(admin)/realisations/project-editor-fields";
import { useAdminSearch } from "@/components/(admin)/shell/admin-search";
import type { AdminExpertise, PublicationState } from "@/lib/content/admin";
import type { LocalizedText } from "@/lib/i18n";
import { sendApiMutation } from "@/lib/api-client";

type ManagedProject = ProjectDraft;
type ToastMessage = { id: number; message: string };

function emptyProject(): ManagedProject {
  return {
    id: "",
    state: "draft",
    expertiseId: "",
    subServiceId: "",
    location: "",
    date: "",
    title: { fr: "", en: "" },
    context: { fr: "", en: "" },
    methodology: { fr: "", en: "" },
    results: { fr: "", en: "" },
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
    gallery: [],
  };
}

function nextPublicationState(state: PublicationState): PublicationState {
  return state === "published" ? "draft" : "published";
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("fr");
}

function localizedSearchText(value: LocalizedText) {
  return `${value.fr} ${value.en}`;
}

function ProjectActionButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: IconDefinition;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      className={`project-action-button${danger ? " project-action-button-danger" : ""}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}>
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </button>
  );
}

export function ProjectManager({ initialProjects, initialExpertises }: { initialProjects: ManagedProject[]; initialExpertises: AdminExpertise[] }) {
  const [projects, setProjects] = useState<ManagedProject[]>(initialProjects);
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [editor, setEditor] = useState<{ mode: "create" | "edit" } | null>(null);
  const [editorValues, setEditorValues] = useState<ManagedProject>(emptyProject);
  const [editorLanguage, setEditorLanguage] = useState<"fr" | "en">("fr");
  const [pendingDelete, setPendingDelete] = useState<ManagedProject | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const { query, setQuery } = useAdminSearch();
  const searchTerm = normalize(query);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openEditor(project?: ManagedProject) {
    setEditorLanguage("fr");
    setEditorValues(project ? { ...project, gallery: project.gallery.map((image) => ({ ...image })) } : emptyProject());
    setEditor({ mode: project ? "edit" : "create" });
  }

  async function saveEditor() {
    if (!editor) return;
    const { id, ...fields } = editorValues;
    try {
      const saved = editor.mode === "create"
        ? await sendApiMutation<ManagedProject>("/api/admin/realisations", "POST", fields)
        : await sendApiMutation<ManagedProject>(`/api/admin/realisations/${id}`, "PATCH", fields);
      if (editor.mode === "create") setProjects((current) => [...current, saved]);
      else setProjects((current) => current.map((project) => project.id === saved.id ? saved : project));
      notify(`${saved.title.fr || "Réalisation"} ${editor.mode === "create" ? "ajoutée." : "mise à jour."}`);
      setEditor(null);
    } catch (error) { notify(error instanceof Error ? error.message : "Enregistrement impossible."); }
  }

  async function togglePublication(project: ManagedProject) {
    const state = nextPublicationState(project.state);
    try {
      const updated = await sendApiMutation<ManagedProject>(`/api/admin/realisations/${project.id}`, "PATCH", { state });
      setProjects((current) => current.map((item) => item.id === updated.id ? updated : item));
      notify(`${project.title.fr} ${state === "published" ? "publiée." : "dépubliée."}`);
    } catch (error) { notify(error instanceof Error ? error.message : "Mise à jour impossible."); }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await sendApiMutation<void>(`/api/admin/realisations/${pendingDelete.id}`, "DELETE");
      setProjects((current) => current.filter((project) => project.id !== pendingDelete.id));
      notify(`${pendingDelete.title.fr} supprimée.`);
      setPendingDelete(null);
    } catch (error) { notify(error instanceof Error ? error.message : "Suppression impossible."); }
  }

  const filteredProjects = projects.filter((project) => {
    if (expertiseFilter !== "all" && project.expertiseId !== expertiseFilter) return false;
    if (!searchTerm) return true;
    const expertise = initialExpertises.find((item) => item.id === project.expertiseId);
    const service = expertise?.subServices.find((item) => item.id === project.subServiceId);
    const text = [
      localizedSearchText(project.title), project.location, project.date,
      expertise ? localizedSearchText(expertise.name) : "",
      service ? localizedSearchText(service.name) : "",
    ].join(" ");
    return normalize(text).includes(searchTerm);
  });
  const publishedProjectCount = projects.filter(
    (project) => project.state === "published",
  ).length;
  const galleryImageCount = projects.reduce(
    (count, project) => count + project.gallery.length,
    0,
  );
  const projectsWithGalleryCount = projects.filter(
    (project) => project.gallery.length > 0,
  ).length;
  const representedExpertiseCount = new Set(
    projects.map((project) => project.expertiseId).filter(Boolean),
  ).size;
  const hasActiveFilters = expertiseFilter !== "all" || searchTerm.length > 0;

  const editorHeading = editor?.mode === "create" ? "Nouvelle réalisation" : "Modifier la réalisation";

  return (
    <main className="admin-content-manager project-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · CONTENU</p>
          <h1>Réalisations</h1>
          <p>Suivez vos projets et les études présentées sur le site.</p>
        </div>
        <button className="admin-action admin-action-primary project-create-action" type="button" onClick={() => openEditor()}>
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          Nouvelle réalisation
        </button>
      </header>

      <section className="project-overview-grid" aria-label="Résumé des réalisations">
        <StatCard
          label="Réalisations"
          value={projects.length}
          detail={`${publishedProjectCount} publiées · ${projects.length - publishedProjectCount} brouillons`}
          icon={faFolderOpen}
          tone="projects"
        />
        <StatCard
          label="Images en galerie"
          value={galleryImageCount}
          detail={`${projectsWithGalleryCount} projet${projectsWithGalleryCount === 1 ? "" : "s"} avec une galerie`}
          icon={faImages}
          tone="gallery"
        />
        <StatCard
          label="Expertises concernées"
          value={representedExpertiseCount}
          detail={`${initialExpertises.length} au catalogue`}
          icon={faBullseye}
          tone="expertises"
        />
      </section>

      <section className="admin-filter-panel project-filter-panel" aria-label="Filtres des réalisations">
        <div className="admin-filter-heading">
          <div className="project-filter-title">
            <FontAwesomeIcon icon={faBullseye} aria-hidden="true" />
            <h2>Filtrer par expertise</h2>
          </div>
          <p aria-live="polite" aria-atomic="true">
            {filteredProjects.length === 1
              ? "1 réalisation"
              : `${filteredProjects.length.toLocaleString("fr-FR")} réalisations`}
          </p>
        </div>
        <div className="admin-filter-chips" role="group" aria-label="Expertise">
          <button className="admin-filter-chip" type="button" aria-pressed={expertiseFilter === "all"} onClick={() => setExpertiseFilter("all")}>
            Toutes les expertises
          </button>
          {initialExpertises.map((expertise) => (
            <button className="admin-filter-chip" key={expertise.id} type="button" aria-pressed={expertiseFilter === expertise.id} onClick={() => setExpertiseFilter(expertise.id)}>
              {expertise.name.fr}
            </button>
          ))}
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <section className="admin-empty-state project-empty-state" aria-live="polite">
          <span className="project-empty-icon" aria-hidden="true">
            <FontAwesomeIcon icon={projects.length === 0 ? faFolderOpen : faBullseye} />
          </span>
          <h2>{projects.length === 0 ? "Aucune réalisation pour le moment" : "Aucune réalisation trouvée"}</h2>
          <p>
            {projects.length === 0
              ? "Créez une fiche pour présenter un projet sur le site."
              : "Essayez un autre terme ou une autre expertise."}
          </p>
          {projects.length > 0 && hasActiveFilters && (
            <button className="admin-action" type="button" onClick={() => { setExpertiseFilter("all"); setQuery(""); }}>
              Effacer les filtres
            </button>
          )}
        </section>
      ) : (
        <ul className="admin-record-list project-record-list">
          {filteredProjects.map((project) => {
            const expertise = initialExpertises.find((item) => item.id === project.expertiseId);
            const service = expertise?.subServices.find((item) => item.id === project.subServiceId);
            return (
              <li key={project.id}>
                <article className="admin-project-row">
                  <div className="project-image-count">
                    <FontAwesomeIcon icon={faImages} aria-hidden="true" />
                    <span className="project-image-count-value" aria-hidden="true">{project.gallery.length}</span>
                    <span className="visually-hidden">{project.gallery.length} images dans la galerie</span>
                  </div>
                  <div className="project-row-title">
                    <h2>{project.title.fr || "Sans titre"}</h2>
                    <p className="admin-record-meta">
                      <FontAwesomeIcon icon={faCalendarDays} aria-hidden="true" />
                      {project.date || "Date non renseignée"}
                    </p>
                  </div>
                  <div className="project-row-expertise">
                    <p>
                      <FontAwesomeIcon icon={faBullseye} aria-hidden="true" />
                      {expertise?.name.fr ?? "Aucune expertise"}
                    </p>
                    <span>
                      <FontAwesomeIcon icon={faSitemap} aria-hidden="true" />
                      {service?.name.fr ?? "Aucun sous-service"}
                    </span>
                  </div>
                  <p className="project-row-location">
                    <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
                    {project.location || "Localisation non renseignée"}
                  </p>
                  <div className="project-row-actions">
                    <StatusBadge status={project.state} />
                    <div className="project-action-group" role="group" aria-label={`Actions de la réalisation ${project.title.fr}`}>
                      <ProjectActionButton
                        icon={project.state === "published" ? faEyeSlash : faEye}
                        label={`${project.state === "published" ? "Dépublier" : "Publier"} « ${project.title.fr} »`}
                        onClick={() => togglePublication(project)}
                      />
                      <ProjectActionButton
                        icon={faPen}
                        label={`Modifier « ${project.title.fr} »`}
                        onClick={() => openEditor(project)}
                      />
                      <ProjectActionButton
                        icon={faTrash}
                        label={`Supprimer « ${project.title.fr} »`}
                        onClick={() => setPendingDelete(project)}
                        danger
                      />
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <EditorDrawer
        open={editor !== null}
        heading={editorHeading}
        description="Renseignez le contenu, la méthodologie et les résultats du projet."
        onClose={() => setEditor(null)}
        onSave={saveEditor}
      >
          <ProjectEditorFields values={editorValues} onChange={setEditorValues} expertises={initialExpertises} language={editorLanguage} onLanguageChange={setEditorLanguage} />
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.title.fr ?? ""}
        description="Cette réalisation sera supprimée."
        actionLabel={`Supprimer la réalisation « ${pendingDelete?.title.fr ?? ""} »`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
