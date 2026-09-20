"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/(admin)/shared/confirm-dialog";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import { PartnerEditorFields, type PartnerDraft } from "@/components/(admin)/partenaires/partner-editor-fields";
import { adminPartners } from "@/lib/content/admin";

type ToastMessage = { id: number; message: string };

function normalizePartnerUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;
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
  return `${parsed.host}${parsed.pathname === "/" ? "" : parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function PartnersManager() {
  const [partners, setPartners] = useState<PartnerDraft[]>(() => adminPartners.map((partner) => ({ ...partner })));
  const [editorValues, setEditorValues] = useState<PartnerDraft | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PartnerDraft | null>(null);
  const [urlError, setUrlError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openEditor(partner: PartnerDraft) {
    setUrlError("");
    setEditorValues({
      ...partner,
      url: normalizePartnerUrl(partner.url) ?? partner.url,
    });
  }

  function saveEditor() {
    if (!editorValues) return;
    const url = normalizePartnerUrl(editorValues.url);
    if (!url) {
      setUrlError("Saisissez une URL HTTP ou HTTPS valide avant d’enregistrer.");
      return;
    }
    const updatedPartner = { ...editorValues, name: editorValues.name.trim(), url };
    setPartners((current) => current.map((partner) => partner.id === updatedPartner.id ? updatedPartner : partner));
    notify(`${updatedPartner.name} mis à jour.`);
    setEditorValues(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setPartners((current) => current.filter((partner) => partner.id !== pendingDelete.id));
    notify(`${pendingDelete.name} supprimé.`);
    setPendingDelete(null);
  }

  return (
    <main className="admin-content-manager partners-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · PARTENAIRES</p>
          <h1>Partenaires</h1>
          <p>Gérez les organisations partenaires et leurs liens.</p>
        </div>
      </header>

      <p className="expertise-demo-notice">
        Mode démo : les modifications sont réinitialisées au rechargement de la page.
      </p>

      {partners.length === 0 ? (
        <section className="admin-empty-state" aria-live="polite">
          <h2>Aucun partenaire</h2>
          <p>Les partenaires supprimés ne sont pas conservés après le rechargement.</p>
        </section>
      ) : (
        <ul className="partner-card-grid">
          {partners.map((partner) => {
            const href = normalizePartnerUrl(partner.url);
            return (
              <li className="partner-card" key={partner.id}>
                <article>
                  <div className="partner-logo-placeholder" aria-hidden="true">LOGO</div>
                  <h2>{partner.name}</h2>
                  {href ? (
                    <a className="partner-card-link" href={href} target="_blank" rel="noreferrer">
                      {displayPartnerUrl(partner.url)}
                    </a>
                  ) : (
                    <p className="partner-card-link">{partner.url}</p>
                  )}
                  <div className="admin-action-group">
                    <button className="admin-action" type="button" aria-label={`Modifier ${partner.name}`} onClick={() => openEditor(partner)}>
                      Modifier
                    </button>
                    <button className="admin-action admin-action-danger" type="button" aria-label={`Supprimer ${partner.name}`} onClick={() => setPendingDelete(partner)}>
                      Supprimer
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <EditorDrawer
        open={editorValues !== null}
        heading="Modifier un partenaire"
        description="Mettez à jour le nom et vérifiez le lien avant d’enregistrer le brouillon local."
        onClose={() => setEditorValues(null)}
        onSave={saveEditor}
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
        description="Ce partenaire sera retiré de la liste de démonstration. Cette action ne peut pas être annulée."
        actionLabel={pendingDelete ? `Supprimer « ${pendingDelete.name} »` : "Supprimer le partenaire"}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
