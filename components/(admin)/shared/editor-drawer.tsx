"use client";

import { useEffect, useRef, type ReactNode } from "react";

type EditorDrawerProps = {
  open: boolean;
  heading: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
};

export function EditorDrawer({
  open,
  heading,
  description,
  children,
  onClose,
  onSave,
  saving = false,
}: EditorDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // A native modal dialog traps focus, inerts the page behind it, and restores focus on close.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="editor-drawer"
      aria-labelledby="editor-drawer-title"
      aria-describedby="editor-drawer-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <form
        className="editor-drawer-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <header className="editor-drawer-header">
          <div>
            <p className="admin-eyebrow">CONTENU DU SITE</p>
            <h2 id="editor-drawer-title">{heading}</h2>
            <p id="editor-drawer-description">{description}</p>
          </div>
          <button className="admin-action" type="button" onClick={onClose} disabled={saving}>
            Fermer
          </button>
        </header>

        <div className="editor-drawer-content">{children}</div>

        <footer className="editor-drawer-footer">
          <button className="admin-action" type="button" onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button className="admin-action admin-action-primary" type="submit" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
