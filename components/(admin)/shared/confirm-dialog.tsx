"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  itemName: string;
  description: string;
  actionLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  itemName,
  description,
  actionLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}>
      <div className="confirm-dialog-content">
        <p className="admin-eyebrow">CONFIRMATION</p>
        <h2 id="confirm-dialog-title">Supprimer « {itemName} » ?</h2>
        <p id="confirm-dialog-description">{description}</p>
        <div className="confirm-dialog-actions">
          <button
            className="admin-action"
            type="button"
            autoFocus
            onClick={onCancel}>
            Annuler
          </button>
          <button
            className="admin-action admin-action-danger"
            type="button"
            onClick={onConfirm}>
            {actionLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
