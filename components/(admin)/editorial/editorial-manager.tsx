"use client";

import { useRef, useState } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBookOpen,
  faBullhorn,
  faCalendarDays,
  faClock,
  faEye,
  faEyeSlash,
  faFileLines,
  faLayerGroup,
  faNewspaper,
  faPlus,
  faSliders,
  faTags,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";
import { Toast } from "@/components/(admin)/shared/toast";
import { StatCard } from "@/components/(admin)/dashboard/stat-card";
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

function EditorialActionButton({
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
      className={`editorial-action-button${danger ? " editorial-action-button-danger" : ""}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </button>
  );
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
  const publishedItemCount = items.filter((item) => item.state === "published").length;
  const draftItemCount = items.length - publishedItemCount;
  const usedTagCount = new Set(items.flatMap((item) => item.tags)).size;
  const hasActiveFilters = publicationFilter !== "all" || categoryFilter !== "all" || searchTerm.length > 0;

  const editorHeading = editor?.mode === "create" ? newItemLabel : `Modifier ${entityLabel}`;
  const filterOptions: { id: EditorialFilter; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "published", label: isArticle ? "Publiés" : "Publiées" },
    { id: "draft", label: "Brouillons" },
  ];

  return (
    <main className={`admin-content-manager editorial-manager${isArticle ? " editorial-manager-article" : " editorial-manager-news"}`}>
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · ÉDITORIAL</p>
          <h1>{pageTitle}</h1>
          <p>{isArticle ? "Structurez vos articles, leurs thèmes et leur rythme de lecture." : "Partagez les annonces, événements et nouvelles du cabinet."}</p>
        </div>
        <button className="admin-action admin-action-primary editorial-create-action" type="button" onClick={() => openEditor()}>
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          {newItemLabel}
        </button>
      </header>

      {isArticle && (
        <section className="editorial-overview-grid" aria-label="Résumé des articles">
          <StatCard
            label="Articles"
            value={items.length}
            detail={`${publishedItemCount} publiés · ${draftItemCount} brouillons`}
            icon={faFileLines}
            tone="articles"
          />
          <StatCard
            label="Catégories"
            value={categories.length}
            detail="Thèmes éditoriaux au catalogue"
            icon={faBookOpen}
            tone="categories"
          />
          <StatCard
            label="Tags utilisés"
            value={usedTagCount}
            detail="Mots-clés distincts"
            icon={faTags}
            tone="tags"
          />
        </section>
      )}

      {!isArticle && (
        <section className="editorial-overview-grid" aria-label="Résumé des actualités">
          <StatCard
            label="Actualités"
            value={items.length}
            detail={`${publishedItemCount} publiée${publishedItemCount === 1 ? "" : "s"} · ${draftItemCount} brouillon${draftItemCount === 1 ? "" : "s"}`}
            icon={faNewspaper}
            tone="news"
          />
          <StatCard
            label="À diffuser"
            value={draftItemCount}
            detail={`${publishedItemCount} déjà en ligne`}
            icon={faBullhorn}
            tone="announcements"
          />
          <StatCard
            label="Rubriques"
            value={categories.length}
            detail={`${usedTagCount} tags dans le flux`}
            icon={faLayerGroup}
            tone="news-categories"
          />
        </section>
      )}

      <section className={`admin-filter-panel editorial-filter-panel${isArticle ? " editorial-article-filter-panel" : " editorial-news-filter-panel"}`} aria-label={`Filtres des ${pluralLabel}`}>
        <div className="admin-filter-heading">
          <div className="editorial-filter-title">
            <FontAwesomeIcon icon={faSliders} aria-hidden="true" />
            <h2>{isArticle ? "Affiner les articles" : "Affiner les actualités"}</h2>
          </div>
          <p aria-live="polite" aria-atomic="true">
            {filteredItems.length.toLocaleString("fr-FR")} {filteredItems.length === 1 ? singularLabel : pluralLabel}
          </p>
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
        <section className={`admin-empty-state${isArticle ? " editorial-article-empty" : " editorial-news-empty"}`} aria-live="polite">
          <span className="editorial-empty-icon" aria-hidden="true"><FontAwesomeIcon icon={isArticle ? faFileLines : faNewspaper} /></span>
          <h2>
            {items.length === 0
              ? isArticle ? "Aucun article pour le moment" : "Aucune actualité pour le moment"
              : isArticle ? "Aucun article trouvé" : "Aucune actualité trouvée"}
          </h2>
          <p>
            {isArticle
              ? items.length === 0
                ? "Créez une fiche pour partager une analyse ou un conseil."
                : "Essayez un autre terme, statut ou catégorie."
              : items.length === 0
                ? "Créez une fiche pour partager une annonce ou un temps fort."
                : "Essayez un autre terme, statut ou catégorie."}
          </p>
          {items.length > 0 && hasActiveFilters && (
            <button className="admin-action" type="button" onClick={() => { setPublicationFilter("all"); setCategoryFilter("all"); setQuery(""); }}>
              Effacer les filtres
            </button>
          )}
        </section>
      ) : (
        <ul className={isArticle ? "admin-editorial-card-list editorial-article-card-list" : "editorial-news-list"}>
          {filteredItems.map((item) => (
            <li key={item.id}>
              {isArticle ? (
                <article className="admin-editorial-card editorial-article-card">
                  <div className="editorial-article-card-topline">
                    <span className="editorial-article-mark" aria-hidden="true"><FontAwesomeIcon icon={faBookOpen} /></span>
                    <span className="editorial-article-kind">Article éditorial</span>
                    <StatusBadge status={item.state} />
                  </div>
                  <div className="admin-editorial-card-body editorial-article-card-body">
                    <div className="admin-editorial-tags">
                      <span className="admin-editorial-category">{item.category.fr}</span>
                      {item.tags.map((tag) => <span className="admin-editorial-tag" key={tag}>{tag}</span>)}
                    </div>
                    <h2>{item.title.fr || "Sans titre"}</h2>
                    <div className="editorial-article-meta">
                      <span><FontAwesomeIcon icon={faCalendarDays} aria-hidden="true" />{item.date || "Date non renseignée"}</span>
                      {item.readingTime && <span><FontAwesomeIcon icon={faClock} aria-hidden="true" />{item.readingTime} de lecture</span>}
                    </div>
                    <div className="editorial-article-actions" role="group" aria-label={`Actions de l’article ${item.title.fr || "Sans titre"}`}>
                      <EditorialActionButton
                        icon={item.state === "published" ? faEyeSlash : faEye}
                        label={`${item.state === "published" ? "Dépublier" : "Publier"} « ${item.title.fr || "Sans titre"} »`}
                        onClick={() => togglePublication(item)}
                      />
                      <EditorialActionButton
                        icon={faPen}
                        label={`Modifier « ${item.title.fr || "Sans titre"} »`}
                        onClick={() => openEditor(item)}
                      />
                      <EditorialActionButton
                        icon={faTrash}
                        label={`Supprimer « ${item.title.fr || "Sans titre"} »`}
                        onClick={() => setPendingDelete(item)}
                        danger
                      />
                    </div>
                  </div>
                </article>
              ) : (
                <article className="editorial-news-card">
                  <div className="editorial-news-date">
                    <span className="editorial-news-date-icon" aria-hidden="true"><FontAwesomeIcon icon={faCalendarDays} /></span>
                    <span className="editorial-news-date-copy">
                      <span className="editorial-news-date-label">DATE</span>
                      <span className="editorial-news-date-value">{item.date || "Date non renseignée"}</span>
                    </span>
                  </div>
                  <div className="editorial-news-content">
                    <div className="admin-editorial-tags">
                      <span className="admin-editorial-category">{item.category.fr}</span>
                      {item.tags.map((tag) => <span className="admin-editorial-tag" key={tag}>{tag}</span>)}
                    </div>
                    <h2>{item.title.fr || "Sans titre"}</h2>
                  </div>
                  <div className="editorial-news-actions" role="group" aria-label={`Actions de l’actualité ${item.title.fr || "Sans titre"}`}>
                    <span className={`status-pill status-${item.state}`}>{item.state === "published" ? "Publiée" : "Brouillon"}</span>
                    <div className="editorial-news-action-group">
                      <EditorialActionButton
                        icon={item.state === "published" ? faEyeSlash : faEye}
                        label={`${item.state === "published" ? "Dépublier" : "Publier"} « ${item.title.fr || "Sans titre"} »`}
                        onClick={() => togglePublication(item)}
                      />
                      <EditorialActionButton
                        icon={faPen}
                        label={`Modifier « ${item.title.fr || "Sans titre"} »`}
                        onClick={() => openEditor(item)}
                      />
                      <EditorialActionButton
                        icon={faTrash}
                        label={`Supprimer « ${item.title.fr || "Sans titre"} »`}
                        onClick={() => setPendingDelete(item)}
                        danger
                      />
                    </div>
                  </div>
                </article>
              )}
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
