"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { Toast } from "@/components/(admin)/shared/toast";
import {
  ProjectEditorFields,
  type ProjectDraft,
  type ProjectImage,
} from "@/components/(admin)/realisations/project-editor-fields";
import { useAdminSearch } from "@/components/(admin)/shell/admin-search";
import {
  adminExpertises,
  adminProjects,
  type PublicationState,
} from "@/lib/content/admin";
import type { LocalizedText } from "@/lib/i18n";

const demoCaptions = [
  "Levé magnétique, secteur nord",
  "Profil IP ligne 4",
  "Affleurement minéralisé",
  "Équipe de terrain",
];

type ManagedProject = ProjectDraft;
type ToastMessage = { id: number; message: string };

function galleryForProject(projectId: string, count: number): ProjectImage[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${projectId}-image-${index + 1}`,
    caption: demoCaptions[index] ?? "",
    isCover: index === 0,
  }));
}

function createInitialProjects(): ManagedProject[] {
  return adminProjects.map((project) => ({
    ...project,
    context: { fr: "", en: "" },
    methodology: { fr: "", en: "" },
    results: { fr: "", en: "" },
    seoTitle: { ...project.title },
    seoDescription: { fr: "", en: "" },
    gallery: galleryForProject(project.id, project.imageCount),
  }));
}

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

export function ProjectManager() {
  const [projects, setProjects] = useState<ManagedProject[]>(createInitialProjects);
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

  function saveEditor() {
    if (!editor) return;
    const nextProject = {
      ...editorValues,
      id: editorValues.id || `project-${globalThis.crypto.randomUUID()}`,
    };
    if (editor.mode === "create") setProjects((current) => [...current, nextProject]);
    else setProjects((current) => current.map((project) => project.id === nextProject.id ? nextProject : project));
    notify(`${nextProject.title.fr || "Réalisation"} ${editor.mode === "create" ? "ajoutée." : "mise à jour."}`);
    setEditor(null);
  }

  function togglePublication(project: ManagedProject) {
    const state = nextPublicationState(project.state);
    setProjects((current) => current.map((item) => item.id === project.id ? { ...item, state } : item));
    notify(`${project.title.fr} ${state === "published" ? "publiée." : "dépubliée."}`);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setProjects((current) => current.filter((project) => project.id !== pendingDelete.id));
    notify(`${pendingDelete.title.fr} supprimée.`);
    setPendingDelete(null);
  }

  const filteredProjects = projects.filter((project) => {
    if (expertiseFilter !== "all" && project.expertiseId !== expertiseFilter) return false;
    if (!searchTerm) return true;
    const expertise = adminExpertises.find((item) => item.id === project.expertiseId);
    const service = expertise?.subServices.find((item) => item.id === project.subServiceId);
    const text = [
      localizedSearchText(project.title), project.location, project.date,
      expertise ? localizedSearchText(expertise.name) : "",
      service ? localizedSearchText(service.name) : "",
    ].join(" ");
    return normalize(text).includes(searchTerm);
  });

  const editorHeading = editor?.mode === "create" ? "Nouvelle réalisation" : "Modifier la réalisation";

  return (
    <main className="admin-content-manager project-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · CONTENU</p>
          <h1>Réalisations</h1>
          <p>Gérez les projets, leurs expertises et leurs galeries.</p>
        </div>
        <button className="admin-action admin-action-primary" type="button" onClick={() => openEditor()}>
          Nouvelle réalisation
        </button>
      </header>

      <p className="expertise-demo-notice">
        Mode démo : les modifications sont réinitialisées au rechargement de la page.
      </p>

      <section className="admin-filter-panel" aria-label="Filtres des réalisations">
        <div className="admin-filter-heading">
          <h2>Filtrer par expertise</h2>
          <p>{filteredProjects.length} {filteredProjects.length === 1 ? "réalisation" : "réalisations"}</p>
        </div>
        <div className="admin-filter-chips" role="group" aria-label="Expertise">
          <button className="admin-filter-chip" type="button" aria-pressed={expertiseFilter === "all"} onClick={() => setExpertiseFilter("all")}>
            Toutes
          </button>
          {adminExpertises.map((expertise) => (
            <button className="admin-filter-chip" key={expertise.id} type="button" aria-pressed={expertiseFilter === expertise.id} onClick={() => setExpertiseFilter(expertise.id)}>
              {expertise.name.fr}
            </button>
          ))}
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <section className="admin-empty-state" aria-live="polite">
          <h2>Aucune réalisation trouvée</h2>
          <p>Modifiez votre recherche ou choisissez une autre expertise.</p>
          <button className="admin-action" type="button" onClick={() => { setExpertiseFilter("all"); setQuery(""); }}>
            Effacer les filtres
          </button>
        </section>
      ) : (
        <ul className="admin-record-list project-record-list">
          {filteredProjects.map((project) => {
            const expertise = adminExpertises.find((item) => item.id === project.expertiseId);
            const service = expertise?.subServices.find((item) => item.id === project.subServiceId);
            return (
              <li key={project.id}>
                <article className="admin-project-row">
                  <div className="project-image-count">
                    <span aria-hidden="true">{project.gallery.length}</span>
                    <span className="visually-hidden">{project.gallery.length} images dans la galerie</span>
                  </div>
                  <div className="project-row-title">
                    <h2>{project.title.fr || "Sans titre"}</h2>
                    <p className="admin-record-meta">{project.date || "Date non renseignée"}</p>
                  </div>
                  <div className="project-row-expertise">
                    <p>{expertise?.name.fr ?? "Aucune expertise"}</p>
                    <span>{service?.name.fr ?? "Aucun sous-service"}</span>
                  </div>
                  <p className="project-row-location">{project.location || "Localisation non renseignée"}</p>
                  <div className="project-row-actions">
                    <StatusBadge status={project.state} />
                    <div className="admin-action-group">
                      <button className="admin-action" type="button" aria-label={`${project.state === "published" ? "Dépublier" : "Publier"} « ${project.title.fr} »`} onClick={() => togglePublication(project)}>
                        {project.state === "published" ? "Dépublier" : "Publier"}
                      </button>
                      <button className="admin-action" type="button" aria-label={`Modifier « ${project.title.fr} »`} onClick={() => openEditor(project)}>
                        Modifier
                      </button>
                      <button className="admin-action admin-action-danger" type="button" aria-label={`Supprimer « ${project.title.fr} »`} onClick={() => setPendingDelete(project)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <nav className="admin-pagination" aria-label="Pagination des réalisations">
        <span>Page 1 / 2</span>
        <span aria-current="page">1</span>
        <span>2</span>
        <span aria-hidden="true">›</span>
      </nav>

      <EditorDrawer
        open={editor !== null}
        heading={editorHeading}
        description="Renseignez le contenu, la méthodologie et les résultats du projet."
        onClose={() => setEditor(null)}
        onSave={saveEditor}
      >
        <ProjectEditorFields values={editorValues} onChange={setEditorValues} language={editorLanguage} onLanguageChange={setEditorLanguage} />
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.title.fr ?? ""}
        description="Cette réalisation sera retirée de la liste de démonstration."
        actionLabel={`Supprimer la réalisation « ${pendingDelete?.title.fr ?? ""} »`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
