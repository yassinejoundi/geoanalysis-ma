"use client";

import type { AdminMessage, MessageStatus } from "@/lib/content/admin";
import { messageStatuses } from "@/lib/content/admin";

export function MessageEditorFields({
  message,
  updating,
  onStatusChange,
}: {
  message: AdminMessage;
  updating: boolean;
  onStatusChange: (status: MessageStatus) => void;
}) {
  const attachmentType = message.file.split(".").pop()?.toUpperCase() || "Fichier";

  return (
    <>
      <dl className="message-detail-list">
        <div>
          <dt>Type de projet</dt>
          <dd>{message.type.fr}</dd>
        </div>
        {message.email && <div><dt>E-mail</dt><dd><a href={`mailto:${message.email}`}>{message.email}</a></dd></div>}
        {message.phone && <div><dt>Téléphone</dt><dd><a href={`tel:${message.phone}`}>{message.phone}</a></dd></div>}
      </dl>

      <label className="admin-field">
        <span>Statut</span>
        <select
          value={message.status}
          disabled={updating}
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
        {message.file && <p className="admin-field-help">Le nom du fichier joint est fourni avec le message.</p>}
      </section>
    </>
  );
}
