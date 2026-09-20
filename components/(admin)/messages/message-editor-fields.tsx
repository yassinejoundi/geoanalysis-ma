"use client";

import type { AdminMessage, MessageStatus } from "@/lib/content/admin";
import { messageStatuses } from "@/lib/content/admin";

export function MessageEditorFields({
  message,
  onStatusChange,
}: {
  message: AdminMessage;
  onStatusChange: (status: MessageStatus) => void;
}) {
  const attachmentType = message.file.split(".").pop()?.toUpperCase() ?? "Fichier";

  return (
    <>
      <dl className="message-detail-list">
        <div>
          <dt>Contact</dt>
          <dd>{message.name}</dd>
        </div>
        <div>
          <dt>Société</dt>
          <dd>{message.company}</dd>
        </div>
        <div>
          <dt>Type de projet</dt>
          <dd>{message.type.fr}</dd>
        </div>
        <div>
          <dt>Date de réception</dt>
          <dd>{message.date}</dd>
        </div>
      </dl>

      <label className="admin-field">
        <span>Statut</span>
        <select
          value={message.status}
          onChange={(event) => onStatusChange(event.currentTarget.value as MessageStatus)}
        >
          {messageStatuses.map(({ id, label }) => (
            <option key={id} value={id}>{label.fr}</option>
          ))}
        </select>
      </label>

      <section className="message-detail-section" aria-labelledby="message-body-title">
        <h3 id="message-body-title">Message reçu</h3>
        <p>{message.message}</p>
      </section>

      <section className="message-detail-section" aria-labelledby="message-attachment-title">
        <h3 id="message-attachment-title">Pièce jointe</h3>
        {message.file ? (
          <dl className="message-detail-list message-attachment-metadata">
            <div>
              <dt>Nom du fichier</dt>
              <dd aria-label={`Pièce jointe : ${message.file}`}>{message.file}</dd>
            </div>
            <div>
              <dt>Type de fichier</dt>
              <dd>{attachmentType}</dd>
            </div>
          </dl>
        ) : (
          <p>Aucun fichier joint à cette demande.</p>
        )}
        <p className="admin-field-help">Métadonnées de démonstration uniquement ; le téléchargement n’est pas disponible.</p>
      </section>
    </>
  );
}
