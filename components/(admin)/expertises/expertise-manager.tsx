"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import {
  ExpertiseEditorFields,
  type ExpertiseEditorValues,
} from "@/components/(admin)/expertises/expertise-editor-fields";
import { ExpertiseRow } from "@/components/(admin)/expertises/expertise-row";
import type {
  AdminExpertise,
  AdminSubService,
  PublicationState,
} from "@/lib/content/admin";
import { adminExpertises } from "@/lib/content/admin";

type EditorTarget = {
  kind: "expertise" | "subService";
  mode: "create" | "edit";
  expertiseId?: string;
  itemId?: string;
};

type PendingDelete = {
  kind: "expertise" | "subService";
  expertiseId: string;
  itemId?: string;
  itemName: string;
  description: string;
  actionLabel: string;
};

type ToastMessage = { id: number; message: string };

function emptyEditorValues(): ExpertiseEditorValues {
  return {
    name: { fr: "", en: "" },
    short: { fr: "", en: "" },
    slug: "",
    state: "draft",
  };
}

function editorValuesFor(
  item: AdminExpertise | AdminSubService,
): ExpertiseEditorValues {
  return {
    name: { ...item.name },
    short: { ...item.short },
    slug: "slug" in item ? item.slug : "",
    state: item.state,
  };
}

function moveItem<T extends { id: string }>(
  items: T[],
  itemId: string,
  direction: "up" | "down",
) {
  const index = items.findIndex((item) => item.id === itemId);
  const nextIndex = index + (direction === "up" ? -1 : 1);
  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items;

  const reordered = [...items];
  [reordered[index], reordered[nextIndex]] = [
    reordered[nextIndex],
    reordered[index],
  ];
  return reordered;
}

function nextPublicationState(state: PublicationState): PublicationState {
  return state === "published" ? "draft" : "published";
}

export function ExpertiseManager() {
  const [expertises, setExpertises] =
    useState<AdminExpertise[]>(adminExpertises);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(adminExpertises.map((expertise) => expertise.id)),
  );
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const [editorLanguage, setEditorLanguage] = useState<"fr" | "en">("fr");
  const [editorValues, setEditorValues] =
    useState<ExpertiseEditorValues>(emptyEditorValues);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null,
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openExpertiseEditor(expertise?: AdminExpertise) {
    setEditorLanguage("fr");
    setEditorValues(
      expertise ? editorValuesFor(expertise) : emptyEditorValues(),
    );
    setEditor({
      kind: "expertise",
      mode: expertise ? "edit" : "create",
      expertiseId: expertise?.id,
    });
  }

  function openSubServiceEditor(
    expertiseId: string,
    subService?: AdminSubService,
  ) {
    setEditorLanguage("fr");
    setEditorValues(
      subService ? editorValuesFor(subService) : emptyEditorValues(),
    );
    setEditor({
      kind: "subService",
      mode: subService ? "edit" : "create",
      expertiseId,
      itemId: subService?.id,
    });
  }

  function saveEditor() {
    if (!editor) return;

    if (editor.kind === "expertise") {
      const nextExpertise: AdminExpertise = {
        id: editor.expertiseId ?? "expertise-" + globalThis.crypto.randomUUID(),
        state: editorValues.state,
        slug: editorValues.slug.trim(),
        name: { ...editorValues.name },
        short: { ...editorValues.short },
        subServices: [],
      };

      if (editor.mode === "create") {
        setExpertises((current) => [...current, nextExpertise]);
        setExpandedIds((current) => new Set(current).add(nextExpertise.id));
      } else {
        setExpertises((current) =>
          current.map((expertise) =>
            expertise.id === editor.expertiseId
              ? {
                  ...expertise,
                  state: nextExpertise.state,
                  slug: nextExpertise.slug,
                  name: nextExpertise.name,
                  short: nextExpertise.short,
                }
              : expertise,
          ),
        );
      }
    } else {
      const nextSubService: AdminSubService = {
        id: editor.itemId ?? "sub-service-" + globalThis.crypto.randomUUID(),
        state: editorValues.state,
        name: { ...editorValues.name },
        short: { ...editorValues.short },
      };

      setExpertises((current) =>
        current.map((expertise) => {
          if (expertise.id !== editor.expertiseId) return expertise;
          if (editor.mode === "create") {
            return {
              ...expertise,
              subServices: [...expertise.subServices, nextSubService],
            };
          }
          return {
            ...expertise,
            subServices: expertise.subServices.map((subService) =>
              subService.id === editor.itemId ? nextSubService : subService,
            ),
          };
        }),
      );
    }

    const itemName = editorValues.name.fr.trim() || "Élément";
    notify(
      editor.mode === "create"
        ? itemName + " ajouté."
        : itemName + " mis à jour.",
    );
    setEditor(null);
  }

  function requestExpertiseDelete(expertise: AdminExpertise) {
    const childCount = expertise.subServices.length;
    setPendingDelete({
      kind: "expertise",
      expertiseId: expertise.id,
      itemName: expertise.name.fr,
      description:
        childCount > 0
          ? "Cette expertise et ses " +
            childCount +
            " sous-services seront retirés de la liste de démonstration."
          : "Cette expertise sera retirée de la liste de démonstration.",
      actionLabel: "Supprimer l’expertise « " + expertise.name.fr + " »",
    });
  }

  function requestSubServiceDelete(
    expertise: AdminExpertise,
    subService: AdminSubService,
  ) {
    setPendingDelete({
      kind: "subService",
      expertiseId: expertise.id,
      itemId: subService.id,
      itemName: subService.name.fr,
      description:
        "Ce sous-service de « " +
        expertise.name.fr +
        " » sera retiré de la liste de démonstration.",
      actionLabel: "Supprimer le sous-service « " + subService.name.fr + " »",
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;

    if (pendingDelete.kind === "expertise") {
      setExpertises((current) =>
        current.filter(
          (expertise) => expertise.id !== pendingDelete.expertiseId,
        ),
      );
      setExpandedIds((current) => {
        const next = new Set(current);
        next.delete(pendingDelete.expertiseId);
        return next;
      });
    } else {
      setExpertises((current) =>
        current.map((expertise) =>
          expertise.id === pendingDelete.expertiseId
            ? {
                ...expertise,
                subServices: expertise.subServices.filter(
                  (subService) => subService.id !== pendingDelete.itemId,
                ),
              }
            : expertise,
        ),
      );
    }

    notify(pendingDelete.itemName + " supprimé.");
    setPendingDelete(null);
  }

  function toggleExpertisePublication(expertise: AdminExpertise) {
    const state = nextPublicationState(expertise.state);
    setExpertises((current) =>
      current.map((item) =>
        item.id === expertise.id ? { ...item, state } : item,
      ),
    );
    notify(
      expertise.name.fr + (state === "published" ? " publié." : " dépublié."),
    );
  }

  function toggleSubServicePublication(
    expertiseId: string,
    subService: AdminSubService,
  ) {
    const state = nextPublicationState(subService.state);
    setExpertises((current) =>
      current.map((expertise) =>
        expertise.id === expertiseId
          ? {
              ...expertise,
              subServices: expertise.subServices.map((item) =>
                item.id === subService.id ? { ...item, state } : item,
              ),
            }
          : expertise,
      ),
    );
    notify(
      subService.name.fr + (state === "published" ? " publié." : " dépublié."),
    );
  }

  function moveExpertise(expertiseId: string, direction: "up" | "down") {
    setExpertises((current) => moveItem(current, expertiseId, direction));
  }

  function moveSubService(
    expertiseId: string,
    subServiceId: string,
    direction: "up" | "down",
  ) {
    setExpertises((current) =>
      current.map((expertise) =>
        expertise.id === expertiseId
          ? {
              ...expertise,
              subServices: moveItem(
                expertise.subServices,
                subServiceId,
                direction,
              ),
            }
          : expertise,
      ),
    );
  }

  function toggleExpanded(expertiseId: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(expertiseId)) next.delete(expertiseId);
      else next.add(expertiseId);
      return next;
    });
  }

  const editorHeading = editor
    ? (editor.mode === "create" ? "Ajouter " : "Modifier ") +
      (editor.kind === "expertise" ? "une expertise" : "un sous-service")
    : "";
  const editorDescription =
    editor?.kind === "subService"
      ? "Renseignez le nom et la description dans les deux langues."
      : "Renseignez le nom, la description, le slug et le statut de publication.";

  return (
    <main className="expertise-manager">
      <header className="expertise-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · CONTENU</p>
          <h1>Expertises &amp; services</h1>
          <p>
            Organisez les expertises et les sous-services affichés sur le site.
          </p>
        </div>
        <button
          className="admin-action admin-action-primary"
          type="button"
          onClick={() => openExpertiseEditor()}>
          Ajouter une expertise
        </button>
      </header>

      <p className="expertise-demo-notice">
        Mode démo : les modifications sont réinitialisées au rechargement de la
        page.
      </p>

      {expertises.length === 0 ? (
        <div className="expertise-empty-state">
          <h2>Aucune expertise</h2>
          <p>Ajoutez une expertise pour commencer à organiser les services.</p>
          <button
            className="admin-action admin-action-primary"
            type="button"
            onClick={() => openExpertiseEditor()}>
            Ajouter une expertise
          </button>
        </div>
      ) : (
        <ul className="expertise-list">
          {expertises.map((expertise, index) => (
            <li key={expertise.id}>
              <ExpertiseRow
                expertise={expertise}
                expanded={expandedIds.has(expertise.id)}
                canMoveUp={index > 0}
                canMoveDown={index < expertises.length - 1}
                onToggleExpanded={() => toggleExpanded(expertise.id)}
                onEdit={() => openExpertiseEditor(expertise)}
                onDelete={() => requestExpertiseDelete(expertise)}
                onTogglePublication={() =>
                  toggleExpertisePublication(expertise)
                }
                onMove={(direction) => moveExpertise(expertise.id, direction)}
                onAddSubService={() => openSubServiceEditor(expertise.id)}
                onEditSubService={(subService) =>
                  openSubServiceEditor(expertise.id, subService)
                }
                onDeleteSubService={(subService) =>
                  requestSubServiceDelete(expertise, subService)
                }
                onToggleSubServicePublication={(subService) =>
                  toggleSubServicePublication(expertise.id, subService)
                }
                onMoveSubService={(subService, direction) =>
                  moveSubService(expertise.id, subService.id, direction)
                }
              />
            </li>
          ))}
        </ul>
      )}

      <EditorDrawer
        open={editor !== null}
        heading={editorHeading}
        description={editorDescription}
        onClose={() => setEditor(null)}
        onSave={saveEditor}
      >
        <ExpertiseEditorFields
          kind={editor?.kind ?? "expertise"}
          values={editorValues}
          onChange={setEditorValues}
          language={editorLanguage}
          onLanguageChange={setEditorLanguage}
        />
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.itemName ?? ""}
        description={pendingDelete?.description ?? ""}
        actionLabel={pendingDelete?.actionLabel ?? "Supprimer"}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
