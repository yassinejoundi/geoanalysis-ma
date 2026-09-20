"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import { TeamEditorFields, type TeamDraft } from "@/components/(admin)/equipe/team-editor-fields";
import { adminTeam } from "@/lib/content/admin";

type ToastMessage = { id: number; message: string };

export function TeamManager() {
  const [members, setMembers] = useState<TeamDraft[]>(() => adminTeam.map((member) => ({
    ...member,
    role: { ...member.role },
    bio: { ...member.bio },
  })));
  const [editorValues, setEditorValues] = useState<TeamDraft | null>(null);
  const [editorLanguage, setEditorLanguage] = useState<"fr" | "en">("fr");
  const [pendingDelete, setPendingDelete] = useState<TeamDraft | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const sortedMembers = [...members].sort((left, right) => left.order - right.order);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openEditor(member: TeamDraft) {
    setEditorLanguage("fr");
    setEditorValues({ ...member, role: { ...member.role }, bio: { ...member.bio } });
  }

  function saveEditor() {
    if (!editorValues) return;
    const updatedMember = {
      ...editorValues,
      name: editorValues.name.trim(),
      role: { ...editorValues.role },
      bio: { ...editorValues.bio },
    };
    setMembers((current) => {
      const reordered = current.filter((member) => member.id !== updatedMember.id)
        .sort((left, right) => left.order - right.order);
      const targetIndex = Math.min(reordered.length, Math.max(0, Math.round(updatedMember.order) - 1));
      reordered.splice(targetIndex, 0, updatedMember);
      return reordered.map((member, index) => ({ ...member, order: index + 1 }));
    });
    notify(`${updatedMember.name} mis à jour.`);
    setEditorValues(null);
  }

  function moveMember(member: TeamDraft, direction: -1 | 1) {
    const targetPosition = member.order + direction;
    setMembers((current) => {
      const reordered = [...current].sort((left, right) => left.order - right.order);
      const currentIndex = reordered.findIndex((entry) => entry.id === member.id);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= reordered.length) return current;
      [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
      return reordered.map((entry, index) => ({ ...entry, order: index + 1 }));
    });
    notify(`${member.name} déplacé à la position ${targetPosition}.`);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setMembers((current) => current.filter((member) => member.id !== pendingDelete.id)
      .sort((left, right) => left.order - right.order)
      .map((member, index) => ({ ...member, order: index + 1 })));
    notify(`${pendingDelete.name} supprimé.`);
    setPendingDelete(null);
  }

  return (
    <main className="admin-content-manager team-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · ÉQUIPE</p>
          <h1>Équipe</h1>
          <p>Gérez les profils et leur ordre d’affichage.</p>
        </div>
      </header>

      <p className="expertise-demo-notice">
        Mode démo : les modifications sont réinitialisées au rechargement de la page.
      </p>

      {sortedMembers.length === 0 ? (
        <section className="admin-empty-state" aria-live="polite">
          <h2>Aucun membre dans l’équipe</h2>
          <p>Les membres supprimés ne sont pas conservés après le rechargement.</p>
        </section>
      ) : (
        <ul className="team-card-grid">
          {sortedMembers.map((member, index) => (
            <li className="team-card" key={member.id}>
              <article>
                <header className="team-card-heading">
                  <div className="team-avatar" aria-hidden="true">{member.name.slice(0, 1)}</div>
                  <div className="team-card-identity">
                    <h2>{member.name}</h2>
                    <p>{member.role.fr}</p>
                  </div>
                  <span className="team-order">#{member.order}</span>
                </header>
                <p className="team-biography">{member.bio.fr}</p>
                <div className="team-card-actions">
                  <div className="admin-action-group" role="group" aria-label={`Ordre de ${member.name}`}>
                    <button className="admin-action" type="button" aria-label={`Monter ${member.name}`} disabled={index === 0} onClick={() => moveMember(member, -1)}>
                      Monter
                    </button>
                    <button className="admin-action" type="button" aria-label={`Descendre ${member.name}`} disabled={index === sortedMembers.length - 1} onClick={() => moveMember(member, 1)}>
                      Descendre
                    </button>
                  </div>
                  <div className="admin-action-group">
                    <button className="admin-action" type="button" aria-label={`Modifier ${member.name}`} onClick={() => openEditor(member)}>
                      Modifier
                    </button>
                    <button className="admin-action admin-action-danger" type="button" aria-label={`Supprimer ${member.name}`} onClick={() => setPendingDelete(member)}>
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
        open={editorValues !== null}
        heading="Modifier un membre"
        description="Renseignez le nom, la fonction, la biographie et l’ordre du membre."
        onClose={() => setEditorValues(null)}
        onSave={saveEditor}
      >
        {editorValues && (
          <TeamEditorFields
            values={editorValues}
            onChange={setEditorValues}
            language={editorLanguage}
            onLanguageChange={setEditorLanguage}
            maxOrder={members.length}
          />
        )}
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.name ?? ""}
        description="Ce membre sera retiré de la liste de démonstration. Cette action ne peut pas être annulée."
        actionLabel={pendingDelete ? `Supprimer « ${pendingDelete.name} »` : "Supprimer le membre"}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
