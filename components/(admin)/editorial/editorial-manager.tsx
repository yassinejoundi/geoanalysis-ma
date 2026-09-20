"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { Toast } from "@/components/(admin)/shared/toast";
import {
  EditorialEditorFields,
  type EditorialDraft,
  type EditorialKind,
} from "@/components/(admin)/editorial/editorial-editor-fields";
import { useAdminSearch } from "@/components/(admin)/shell/admin-search";
import type { PublicationState } from "@/lib/content/admin";
import type { LocalizedText } from "@/lib/i18n";
import { sendApiMutation } from "@/lib/api-client";

type ToastMessage = { id: number; message: string };
type EditorialFilter = "all" | "published" | "draft";

function emptyItem(kind: EditorialKind, categories: LocalizedText[]): EditorialDraft {
  const category = categories[0] ?? { fr: "", en: "" };
  return {
    id: "",
    state: "draft",
    category: { ...category },
    tags: [],
    date: "",
    ...(kind === "article" ? { readingTime: "" } : {}),
    title: { fr: "", en: "" },
    content: { fr: "", en: "" },
    seoTitle: { fr: "", en: "" },
    seoDescription: { fr: "", en: "" },
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

export function EditorialManager({ kind, initialItems }: { kind: EditorialKind; initialItems: EditorialDraft[] }) {
  const [items, setItems] = useState<EditorialDraft[]>(initialItems);
  const [publicationFilter, setPublicationFilter] = useState<EditorialFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editor, setEditor] = useState<{ mode: "create" | "edit" } | null>(null);
  const [editorValues, setEditorValues] = useState<EditorialDraft>(() => emptyItem(kind, []));
  const [editorLanguage, setEditorLanguage] = useState<"fr" | "en">("fr");
  const [pendingDelete, setPendingDelete] = useState<EditorialDraft | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const { query, setQuery } = useAdminSearch();
  const searchTerm = normalize(query);
  const isArticle = kind === "article";
  const singularLabel = isArticle ? "article" : "actualité";
  const pluralLabel = isArticle ? "articles" : "actualités";
  const entityLabel = isArticle ? "l’article" : "l’actualité";
  const entityTitle = isArticle ? "Article" : "Actualité";
  const pageTitle = isArticle ? "Articles" : "Actualités";
  const newItemLabel = isArticle ? "Nouvel article" : "Nouvelle actualité";

  const categories = items.reduce<LocalizedText[]>((result, item) => {
    if (!result.some((category) => category.fr === item.category.fr)) result.push(item.category);
    return result;
  }, []);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openEditor(item?: EditorialDraft) {
    setEditorLanguage("fr");
    setEditorValues(
      item
        ? { ...item, category: { ...item.category }, tags: [...item.tags] }
        : emptyItem(kind, categories),
    );
    setEditor({ mode: item ? "edit" : "create" });
  }

  async function saveEditor() {
    if (!editor) return;
    const draft = {
      ...editorValues,
      date: editorValues.date || new Date().toLocaleDateString("fr-FR"),
      ...(isArticle && !editorValues.readingTime ? { readingTime: "5 min" } : {}),
    };
    const { id, ...fields } = draft;
    const endpoint = isArticle ? "/api/admin/articles" : "/api/admin/actualites";
    try {
      const saved = editor.mode === "create"
        ? await sendApiMutation<EditorialDraft>(endpoint, "POST", fields)
        : await sendApiMutation<EditorialDraft>(`${endpoint}/${id}`, "PATCH", fields);
      if (editor.mode === "create") setItems((current) => [...current, saved]);
      else setItems((current) => current.map((item) => item.id === saved.id ? saved : item));
      notify(`${entityTitle} ${editor.mode === "create" ? (isArticle ? "ajouté." : "ajoutée.") : (isArticle ? "mis à jour." : "mise à jour.")}`);
      setEditor(null);
    } catch (error) { notify(error instanceof Error ? error.message : "Enregistrement impossible."); }
  }

  async function togglePublication(item: EditorialDraft) {
    const state = nextPublicationState(item.state);
    const endpoint = isArticle ? "/api/admin/articles" : "/api/admin/actualites";
    try {
      const updated = await sendApiMutation<EditorialDraft>(`${endpoint}/${item.id}`, "PATCH", { state });
      setItems((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
      const statusLabel = isArticle ? state === "published" ? "publié." : "dépublié." : state === "published" ? "publiée." : "dépubliée.";
      notify(`${entityTitle} « ${item.title.fr} » ${statusLabel}`);
    } catch (error) { notify(error instanceof Error ? error.message : "Mise à jour impossible."); }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const endpoint = isArticle ? "/api/admin/articles" : "/api/admin/actualites";
    try {
      await sendApiMutation<void>(`${endpoint}/${pendingDelete.id}`, "DELETE");
      setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
      notify(`${entityTitle} « ${pendingDelete.title.fr} » ${isArticle ? "supprimé." : "supprimée."}`);
      setPendingDelete(null);
    } catch (error) { notify(error instanceof Error ? error.message : "Suppression impossible."); }
  }

  const filteredItems = items.filter((item) => {
    if (publicationFilter === "published" && item.state !== "published") return false;
    if (publicationFilter === "draft" && item.state !== "draft") return false;
    if (categoryFilter !== "all" && item.category.fr !== categoryFilter) return false;
    if (!searchTerm) return true;
    const searchableText = [
      localizedSearchText(item.title), localizedSearchText(item.category),
      item.tags.join(" "), item.date, item.readingTime ?? "",
    ].join(" ");
    return normalize(searchableText).includes(searchTerm);
  });

  const editorHeading = editor?.mode === "create" ? newItemLabel : `Modifier ${entityLabel}`;
  const filterOptions: { id: EditorialFilter; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "published", label: "Publiés" },
    { id: "draft", label: "Brouillons" },
  ];

  return (
    <main className="admin-content-manager editorial-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · ÉDITORIAL</p>
          <h1>{pageTitle}</h1>
          <p>Organisez les contenus, leurs catégories et leur publication.</p>
        </div>
        <button className="admin-action admin-action-primary" type="button" onClick={() => openEditor()}>
          {newItemLabel}
        </button>
      </header>

      <section className="admin-filter-panel editorial-filter-panel" aria-label={`Filtres des ${pluralLabel}`}>
        <div className="admin-filter-heading">
          <h2>Résultats</h2>
          <p>{filteredItems.length} {filteredItems.length === 1 ? singularLabel : pluralLabel}</p>
        </div>
        <div className="admin-filter-group">
          <h3>Statut</h3>
          <div className="admin-filter-chips" role="group" aria-label="Statut de publication">
            {filterOptions.map((filter) => (
              <button className="admin-filter-chip" key={filter.id} type="button" aria-pressed={publicationFilter === filter.id} onClick={() => setPublicationFilter(filter.id)}>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="admin-filter-group">
          <h3>Catégorie</h3>
          <div className="admin-filter-chips" role="group" aria-label="Catégorie">
            <button className="admin-filter-chip" type="button" aria-pressed={categoryFilter === "all"} onClick={() => setCategoryFilter("all")}>
              Toutes
            </button>
            {categories.map((category) => (
              <button className="admin-filter-chip" key={category.fr} type="button" aria-pressed={categoryFilter === category.fr} onClick={() => setCategoryFilter(category.fr)}>
                {category.fr}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredItems.length === 0 ? (
        <section className="admin-empty-state" aria-live="polite">
          <h2>Aucun contenu trouvé</h2>
          <p>Modifiez votre recherche ou choisissez un autre statut ou une autre catégorie.</p>
          <button className="admin-action" type="button" onClick={() => { setPublicationFilter("all"); setCategoryFilter("all"); setQuery(""); }}>
            Effacer les filtres
          </button>
        </section>
      ) : (
        <ul className="admin-editorial-card-list">
          {filteredItems.map((item, index) => (
            <li key={item.id}>
              <article className="admin-editorial-card">
                <div className="admin-editorial-image">
                  <span aria-hidden="true">{`IMAGE — ${isArticle ? "ARTICLE" : "ACTUALITÉ"} ${String(index + 1).padStart(2, "0")}`}</span>
                  <StatusBadge status={item.state} />
                </div>
                <div className="admin-editorial-card-body">
                  <div className="admin-editorial-tags">
                    <span className="admin-editorial-category">{item.category.fr}</span>
                    {item.tags.map((tag) => <span className="admin-editorial-tag" key={tag}>{tag}</span>)}
                  </div>
                  <h2>{item.title.fr || "Sans titre"}</h2>
                  <p className="admin-record-meta">
                    {item.date || "Date non renseignée"}{isArticle && item.readingTime ? ` · ${item.readingTime} de lecture` : ""}
                  </p>
                  <div className="admin-editorial-actions">
                    <button className="admin-action" type="button" aria-label={`${item.state === "published" ? "Dépublier" : "Publier"} « ${item.title.fr} »`} onClick={() => togglePublication(item)}>
                      {item.state === "published" ? "Dépublier" : "Publier"}
                    </button>
                    <button className="admin-action" type="button" aria-label={`Modifier « ${item.title.fr} »`} onClick={() => openEditor(item)}>
                      Modifier
                    </button>
                    <button className="admin-action admin-action-danger" type="button" aria-label={`Supprimer « ${item.title.fr} »`} onClick={() => setPendingDelete(item)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <EditorDrawer
        open={editor !== null}
        heading={editorHeading}
        description={`Renseignez le contenu et les métadonnées de ${entityLabel}.`}
        onClose={() => setEditor(null)}
        onSave={saveEditor}
      >
        <EditorialEditorFields values={editorValues} onChange={setEditorValues} language={editorLanguage} onLanguageChange={setEditorLanguage} categories={categories} />
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.title.fr ?? ""}
        description={`Ce contenu sera supprimé des ${pluralLabel}.`}
        actionLabel={`Supprimer ${entityLabel} « ${pendingDelete?.title.fr ?? ""} »`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
