"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { faArrowDown, faArrowUp, faMagnifyingGlass, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import { TeamEditorFields, type TeamDraft } from "@/components/(admin)/equipe/team-editor-fields";
import { sendApiMutation } from "@/lib/api-client";
import styles from "./team-manager.module.css";

type ToastMessage = { id: number; message: string };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("fr");
}

export function TeamManager({ initialMembers }: { initialMembers: TeamDraft[] }) {
  const [members, setMembers] = useState<TeamDraft[]>(initialMembers);
  const [editorValues, setEditorValues] = useState<TeamDraft | null>(null);
  const [editorLanguage, setEditorLanguage] = useState<"fr" | "en">("fr");
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<TeamDraft | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const saveLock = useRef(false);
  const sortedMembers = [...members].sort((left, right) => left.order - right.order);
  const query = search.trim().toLocaleLowerCase("fr");
  const visibleMembers = sortedMembers.filter((member) =>
    [member.name, member.role.fr, member.role.en, member.bio.fr, member.bio.en]
      .some((value) => value.toLocaleLowerCase("fr").includes(query)),
  );

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openCreateEditor() {
    setIsCreating(true);
    setEditorLanguage("fr");
    setEditorValues({
      id: "",
      order: members.length + 1,
      name: "",
      role: { fr: "", en: "" },
      bio: { fr: "", en: "" },
      image: null,
    });
  }

  function openEditor(member: TeamDraft) {
    setIsCreating(false);
    setEditorLanguage("fr");
    setEditorValues({ ...member, role: { ...member.role }, bio: { ...member.bio } });
  }

  function closeEditor() {
    setEditorValues(null);
    setIsCreating(false);
  }

  async function saveEditor() {
    if (!editorValues || saveLock.current || isUploading) return;
    const updatedMember = {
      ...editorValues,
      order: isCreating ? members.length + 1 : editorValues.order,
      name: editorValues.name.trim(),
      role: { ...editorValues.role },
      bio: { ...editorValues.bio },
    };
    const missingLanguage = (["fr", "en"] as const).find((language) =>
      !updatedMember.role[language].trim() || !updatedMember.bio[language].trim(),
    );
    if (missingLanguage) {
      setEditorLanguage(missingLanguage);
      notify("Complétez la fonction et la biographie en " + (missingLanguage === "fr" ? "français." : "anglais."));
      return;
    }
    saveLock.current = true;
    setIsSaving(true);

    try {
      const fields = {
        order: updatedMember.order,
        name: updatedMember.name,
        role: updatedMember.role,
        bio: updatedMember.bio,
        image: updatedMember.image,
      };
      if (isCreating) {
        const created = await sendApiMutation<TeamDraft>("/api/admin/equipe", "POST", fields);
        setMembers((current) => [...current, created]);
        notify(created.name + " ajouté à l’équipe.");
      } else {
        const reordered = sortedMembers.filter((member) => member.id !== updatedMember.id);
        const targetIndex = Math.min(reordered.length, Math.max(0, Math.round(updatedMember.order) - 1));
        reordered.splice(targetIndex, 0, updatedMember);
        const nextMembers = reordered.map((member, index) => ({ ...member, order: index + 1 }));
        await sendApiMutation("/api/admin/equipe/" + updatedMember.id, "PATCH", {
          ...fields,
          order: nextMembers.findIndex((member) => member.id === updatedMember.id) + 1,
        });
        await sendApiMutation("/api/admin/equipe", "PATCH", { order: nextMembers.map((member) => member.id) });
        setMembers(nextMembers);
        notify(updatedMember.name + " mis à jour.");
      }
      closeEditor();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  }

  async function moveMember(member: TeamDraft, direction: -1 | 1) {
    const reordered = [...sortedMembers];
    const currentIndex = reordered.findIndex((entry) => entry.id === member.id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= reordered.length) return;
    [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
    const next = reordered.map((entry, index) => ({ ...entry, order: index + 1 }));
    try {
      await sendApiMutation("/api/admin/equipe", "PATCH", { order: next.map((entry) => entry.id) });
      setMembers(next);
      notify(member.name + " déplacé à la position " + (targetIndex + 1) + ".");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Réorganisation impossible.");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const next = sortedMembers.filter((member) => member.id !== pendingDelete.id)
      .map((member, index) => ({ ...member, order: index + 1 }));
    try {
      await sendApiMutation<void>("/api/admin/equipe/" + pendingDelete.id, "DELETE");
      if (next.length) await sendApiMutation("/api/admin/equipe", "PATCH", { order: next.map((member) => member.id) });
      setMembers(next);
      notify(pendingDelete.name + " supprimé.");
      setPendingDelete(null);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Suppression impossible.");
    }
  }

  return (
    <main className={`admin-content-manager directory-manager team-directory ${styles.teamManager}`}>
      <header className="directory-header">
        <div className="directory-heading-copy">
          <p className="admin-eyebrow">ORGANISATION / ÉQUIPE</p>
          <h1>Équipe</h1>
          <p>Présentez les parcours et les expertises de votre bureau.</p>
        </div>
        <button className="admin-action admin-action-primary directory-add-action" type="button" onClick={openCreateEditor}>
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          Ajouter un membre
        </button>
      </header>

      <section className="directory-panel" aria-label="Gestion des membres de l’équipe">
        <div className="directory-toolbar">
          <label className="directory-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            <input
              type="search"
              aria-label="Rechercher un membre"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Nom, fonction ou biographie"
            />
          </label>
          <p className="directory-result-count" aria-live="polite">
            <strong>{visibleMembers.length}</strong> / {sortedMembers.length} profils
          </p>
        </div>

        {sortedMembers.length === 0 ? (
          <div className="directory-empty-state" aria-live="polite">
            <span className="directory-empty-index" aria-hidden="true">01</span>
            <div>
              <h2>Votre équipe commence ici</h2>
              <p>Ajoutez les profils qui présentent les compétences du bureau.</p>
            </div>
          </div>
        ) : visibleMembers.length === 0 ? (
          <div className="directory-empty-state" aria-live="polite">
            <span className="directory-empty-index" aria-hidden="true">—</span>
            <div>
              <h2>Aucun résultat</h2>
              <p>Essayez un autre nom, une fonction ou un mot de la biographie.</p>
            </div>
            <button className="directory-clear-search" type="button" onClick={() => setSearch("")}>Effacer la recherche</button>
          </div>
        ) : (
          <ul className="directory-list" aria-label="Membres de l’équipe">
            {visibleMembers.map((member) => {
              const position = sortedMembers.findIndex((entry) => entry.id === member.id);
              return (
                <li className="directory-record team-record" key={member.id}>
                  <span className="directory-position">{String(member.order).padStart(2, "0")}</span>
                  <div className={styles.memberProfile}>
                    <span className="directory-avatar" aria-hidden="true">
                      {member.image ? (
                        <Image src={member.image} alt="" width={48} height={48} sizes="48px" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      ) : initials(member.name)}
                    </span>
                    <h2 className={styles.memberName}>{member.name}</h2>
                    <span className={`directory-role ${styles.memberRole}`}>{member.role.fr}</span>
                    <p className={`directory-description ${styles.memberBio}`}>{member.bio.fr || "Biographie non renseignée."}</p>
                  </div>
                  <div className="directory-actions">
                    <div className="directory-order-actions" role="group" aria-label={"Ordre de " + member.name}>
                      <button
                        className="directory-icon-action"
                        type="button"
                        aria-label={"Monter " + member.name}
                        title="Monter"
                        disabled={isSaving || position === 0}
                        onClick={() => moveMember(member, -1)}
                      >
                        <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" />
                      </button>
                      <button
                        className="directory-icon-action"
                        type="button"
                        aria-label={"Descendre " + member.name}
                        title="Descendre"
                        disabled={isSaving || position === sortedMembers.length - 1}
                        onClick={() => moveMember(member, 1)}
                      >
                        <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
                      </button>
                    </div>
                    <button className="directory-text-action" type="button" onClick={() => openEditor(member)}>
                      <FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" />
                      Modifier
                    </button>
                    <button className="directory-text-action directory-danger-action" type="button" onClick={() => setPendingDelete(member)}>
                      <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                      Supprimer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <EditorDrawer
        open={editorValues !== null}
        heading={isCreating ? "Ajouter un membre" : "Modifier un membre"}
        description={isCreating ? "Renseignez son nom, sa fonction et sa biographie en français et en anglais." : "Mettez à jour son profil et son ordre d’affichage."}
        onClose={closeEditor}
        onSave={saveEditor}
        saving={isSaving || isUploading}
        savingLabel={isUploading ? "Envoi de l’image…" : undefined}
      >
        {editorValues && (
          <TeamEditorFields
            values={editorValues}
            onChange={setEditorValues}
            language={editorLanguage}
            onLanguageChange={setEditorLanguage}
            maxOrder={members.length}
            isNew={isCreating}
            onUploadBusyChange={setIsUploading}
          />
        )}
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.name ?? ""}
        description="Ce membre sera supprimé. Cette action ne peut pas être annulée."
        actionLabel={pendingDelete ? "Supprimer « " + pendingDelete.name + " »" : "Supprimer le membre"}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
