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
        <span className="admin-select-control">
          <select
            className="admin-select"
            value={message.status}
            disabled={updating}
            onChange={(event) => onStatusChange(event.currentTarget.value as MessageStatus)}
          >
            {messageStatuses.map(({ id, label }) => (
              <option key={id} value={id}>{label.fr}</option>
            ))}
          </select>
          <span className="admin-select-chevron" aria-hidden="true" />
        </span>
      </label>

      <section className="message-detail-section" aria-labelledby="message-body-title">
        <h3 id="message-body-title">Message reçu</h3>
        <p>{message.message}</p>
      </section>

    </>
  );
}
