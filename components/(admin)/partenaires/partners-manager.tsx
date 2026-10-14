"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { faMagnifyingGlass, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import { PartnerEditorFields, type PartnerDraft } from "@/components/(admin)/partenaires/partner-editor-fields";
import { sendApiMutation } from "@/lib/api-client";

type ToastMessage = { id: number; message: string };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("fr");
}

export function PartnersManager({ initialPartners, embedded = false }: { initialPartners: PartnerDraft[]; embedded?: boolean }) {
  const [partners, setPartners] = useState<PartnerDraft[]>(initialPartners);
  const [editorValues, setEditorValues] = useState<PartnerDraft | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PartnerDraft | null>(null);
  const [logoError, setLogoError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const saveLock = useRef(false);
  const query = search.trim().toLocaleLowerCase("fr");
  const visiblePartners = partners.filter((partner) => partner.name.toLocaleLowerCase("fr").includes(query));

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openCreateEditor() {
    setLogoError("");
    setIsCreating(true);
    setEditorValues({ id: "", name: "", logo: "" });
  }

  function openEditor(partner: PartnerDraft) {
    setLogoError("");
    setIsCreating(false);
    setEditorValues(partner);
  }

  function closeEditor() {
    setEditorValues(null);
    setIsCreating(false);
    setLogoError("");
  }

  async function saveEditor() {
    if (!editorValues || saveLock.current || isUploading) return;
    const logo = editorValues.logo.trim();
    if (!logo) {
      setLogoError("Téléversez un logo avant d’enregistrer.");
      document.getElementById("partner-logo")?.focus();
      return;
    }

    saveLock.current = true;
    setIsSaving(true);
    const updatedPartner = { ...editorValues, name: editorValues.name.trim(), logo };
    try {
      const fields = { name: updatedPartner.name, logo: updatedPartner.logo };
      if (isCreating) {
        const created = await sendApiMutation<PartnerDraft>("/api/admin/partenaires", "POST", fields);
        setPartners((current) => [...current, created]);
        notify(created.name + " ajouté aux partenaires.");
      } else {
        await sendApiMutation("/api/admin/partenaires/" + updatedPartner.id, "PATCH", fields);
        setPartners((current) => current.map((partner) => partner.id === updatedPartner.id ? updatedPartner : partner));
        notify(updatedPartner.name + " mis à jour.");
      }
      closeEditor();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await sendApiMutation<void>("/api/admin/partenaires/" + pendingDelete.id, "DELETE");
      setPartners((current) => current.filter((partner) => partner.id !== pendingDelete.id));
      notify(pendingDelete.name + " supprimé.");
      setPendingDelete(null);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Suppression impossible.");
    }
  }

  const Root = embedded ? "section" : "main";

  return (
    <Root
      id={embedded ? "bureau-partners" : undefined}
      aria-labelledby={embedded ? "bureau-partners-title" : undefined}
      className={embedded ? "bureau-directory-embed partner-directory" : "admin-content-manager directory-manager partner-directory"}
    >
      <header className="directory-header">
        <div className="directory-heading-copy">
          <p className="admin-eyebrow">{embedded ? "LE BUREAU / PARTENAIRES" : "ORGANISATION / PARTENAIRES"}</p>
          {embedded ? <h2 id="bureau-partners-title">Partenaires</h2> : <h1>Partenaires</h1>}
          <p>Ajoutez les organisations partenaires et leurs logos.</p>
        </div>
        <button className="admin-action admin-action-primary directory-add-action" type="button" onClick={openCreateEditor}>
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          Ajouter un partenaire
        </button>
      </header>

      <section className="directory-panel" aria-label="Gestion des partenaires">
        <div className="directory-toolbar">
          <label className="directory-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            <input
              type="search"
              aria-label="Rechercher un partenaire"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Nom du partenaire"
            />
          </label>
          <p className="directory-result-count" aria-live="polite">
            <strong>{visiblePartners.length}</strong> / {partners.length} partenaires
          </p>
        </div>

        {partners.length === 0 ? (
          <div className="directory-empty-state" aria-live="polite">
            <span className="directory-empty-index" aria-hidden="true">01</span>
            <div>
              <h2>Votre réseau commence ici</h2>
              <p>Ajoutez un partenaire pour afficher son logo sur la page du bureau.</p>
            </div>
          </div>
        ) : visiblePartners.length === 0 ? (
          <div className="directory-empty-state" aria-live="polite">
            <span className="directory-empty-index" aria-hidden="true">—</span>
            <div>
              <h2>Aucun résultat</h2>
              <p>Essayez un autre nom ou une partie de l’adresse du site.</p>
            </div>
            <button className="directory-clear-search" type="button" onClick={() => setSearch("")}>Effacer la recherche</button>
          </div>
        ) : (
          <ul className="directory-list" aria-label="Organisations partenaires">
            {visiblePartners.map((partner) => (
                <li className="directory-record partner-record" key={partner.id}>
                  {partner.logo ? (
                    <Image className="directory-avatar directory-partner-avatar directory-partner-logo" src={partner.logo} alt="" width={48} height={48} />
                  ) : (
                    <span className="directory-avatar directory-partner-avatar" aria-hidden="true">{initials(partner.name)}</span>
                  )}
                  <div className="directory-record-copy">
                    <h2>{partner.name}</h2>
                  </div>
                  <span className="directory-record-kind">Partenaire</span>
                  <div className="directory-actions">
                    <button className="directory-text-action" type="button" onClick={() => openEditor(partner)}>
                      <FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" />
                      Modifier
                    </button>
                    <button className="directory-text-action directory-danger-action" type="button" onClick={() => setPendingDelete(partner)}>
                      <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                      Supprimer
                    </button>
                  </div>
                </li>
            ))}
          </ul>
        )}
      </section>

      <EditorDrawer
        open={editorValues !== null}
        heading={isCreating ? "Ajouter un partenaire" : "Modifier un partenaire"}
        description={isCreating ? "Renseignez le nom de l’organisation et téléversez son logo." : "Mettez à jour le nom et le logo du partenaire."}
        onClose={closeEditor}
        onSave={saveEditor}
        saving={isSaving || isUploading}
        savingLabel={isUploading ? "Envoi du logo…" : "Enregistrement…"}
      >
        {editorValues && (
          <PartnerEditorFields
            values={editorValues}
            onChange={setEditorValues}
            logoError={logoError}
            onLogoChange={() => setLogoError("")}
            onBusyChange={(busy) => {
              setIsUploading(busy);
              if (busy) setLogoError("");
            }}
            disabled={isSaving}
          />
        )}
      </EditorDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        itemName={pendingDelete?.name ?? ""}
        description="Ce partenaire sera supprimé. Cette action ne peut pas être annulée."
        actionLabel={pendingDelete ? "Supprimer « " + pendingDelete.name + " »" : "Supprimer le partenaire"}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </Root>
  );
}
