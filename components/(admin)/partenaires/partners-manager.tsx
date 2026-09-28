"use client";

import { useRef, useState } from "react";
import { faArrowUpRightFromSquare, faMagnifyingGlass, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import { PartnerEditorFields, type PartnerDraft } from "@/components/(admin)/partenaires/partner-editor-fields";
import { sendApiMutation } from "@/lib/api-client";

type ToastMessage = { id: number; message: string };

function normalizePartnerUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : "https://" + trimmed;
  try {
    const parsed = new URL(candidate);
    if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || !parsed.hostname) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

function displayPartnerUrl(value: string) {
  const normalized = normalizePartnerUrl(value);
  if (!normalized) return value;
  const parsed = new URL(normalized);
  return parsed.host + (parsed.pathname === "/" ? "" : parsed.pathname) + parsed.search + parsed.hash;
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("fr");
}

export function PartnersManager({ initialPartners, embedded = false }: { initialPartners: PartnerDraft[]; embedded?: boolean }) {
  const [partners, setPartners] = useState<PartnerDraft[]>(initialPartners);
  const [editorValues, setEditorValues] = useState<PartnerDraft | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PartnerDraft | null>(null);
  const [urlError, setUrlError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const saveLock = useRef(false);
  const query = search.trim().toLocaleLowerCase("fr");
  const visiblePartners = partners.filter((partner) =>
    (partner.name + " " + displayPartnerUrl(partner.url)).toLocaleLowerCase("fr").includes(query),
  );

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openCreateEditor() {
    setUrlError("");
    setIsCreating(true);
    setEditorValues({ id: "", name: "", url: "" });
  }

  function openEditor(partner: PartnerDraft) {
    setUrlError("");
    setIsCreating(false);
    setEditorValues({ ...partner, url: normalizePartnerUrl(partner.url) ?? partner.url });
  }

  function closeEditor() {
    setEditorValues(null);
    setIsCreating(false);
    setUrlError("");
  }

  async function saveEditor() {
    if (!editorValues || saveLock.current) return;
    const url = normalizePartnerUrl(editorValues.url);
    if (!url) {
      setUrlError("Saisissez une URL HTTP ou HTTPS valide avant d’enregistrer.");
      return;
    }

    saveLock.current = true;
    setIsSaving(true);
    const updatedPartner = { ...editorValues, name: editorValues.name.trim(), url };
    try {
      const fields = { name: updatedPartner.name, url: updatedPartner.url };
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
          <p>Réunissez les organisations qui accompagnent vos projets.</p>
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
              placeholder="Nom ou site web"
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
              <p>Ajoutez les organisations partenaires et leurs sites web.</p>
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
            {visiblePartners.map((partner) => {
              const href = normalizePartnerUrl(partner.url);
              return (
                <li className="directory-record partner-record" key={partner.id}>
                  <span className="directory-avatar directory-partner-avatar" aria-hidden="true">{initials(partner.name)}</span>
                  <div className="directory-record-copy">
                    <h2>{partner.name}</h2>
                    {href ? (
                      <a
                        className="directory-partner-link"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={"Visiter le site de " + partner.name + " (nouvel onglet)"}
                      >
                        <span>{displayPartnerUrl(partner.url)}</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="directory-partner-link">{partner.url}</p>
                    )}
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
              );
            })}
          </ul>
        )}
      </section>

      <EditorDrawer
        open={editorValues !== null}
        heading={isCreating ? "Ajouter un partenaire" : "Modifier un partenaire"}
        description={isCreating ? "Renseignez le nom de l’organisation et son adresse web." : "Mettez à jour le nom et le lien du partenaire."}
        onClose={closeEditor}
        onSave={saveEditor}
        saving={isSaving}
      >
        {editorValues && (
          <PartnerEditorFields
            values={editorValues}
            onChange={setEditorValues}
            urlError={urlError}
            onUrlChange={() => setUrlError("")}
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
