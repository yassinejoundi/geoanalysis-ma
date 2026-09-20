"use client";

import { useRef, useState } from "react";
import { MessageEditorFields } from "@/components/(admin)/messages/message-editor-fields";
import { EditorDrawer } from "@/components/(admin)/shared/editor-drawer";
import { Toast } from "@/components/(admin)/shared/toast";
import { useAdminMessages } from "@/components/(admin)/shared/admin-messages-provider";
import { messageStatuses, type AdminMessage, type MessageStatus } from "@/lib/content/admin";
import { sendApiMutation } from "@/lib/api-client";

type ToastMessage = { id: number; message: string };

export function MessagesManager() {
  const { messages, setMessages } = useAdminMessages();
  const [editorValues, setEditorValues] = useState<AdminMessage | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function openMessage(message: AdminMessage) {
    setEditorValues({ ...message, type: { ...message.type } });
  }

  async function changeStatus(message: AdminMessage, status: MessageStatus) {
    if (message.status === status) return;
    try {
      await sendApiMutation(`/api/admin/messages/${message.id}`, "PATCH", { status });
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status } : item));
      const label = messageStatuses.find((item) => item.id === status)?.label.fr.toLocaleLowerCase("fr");
      notify(`${message.name} déplacé vers « ${label} ».`);
    } catch (error) { notify(error instanceof Error ? error.message : "Mise à jour impossible."); }
  }

  async function saveEditor() {
    if (!editorValues) return;
    try {
      await sendApiMutation(`/api/admin/messages/${editorValues.id}`, "PATCH", { status: editorValues.status });
      setMessages((current) => current.map((message) => message.id === editorValues.id ? { ...message, status: editorValues.status } : message));
      notify(`Statut de ${editorValues.name} mis à jour.`);
      setEditorValues(null);
    } catch (error) { notify(error instanceof Error ? error.message : "Mise à jour impossible."); }
  }

  return (
    <main className="admin-content-manager messages-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · DEMANDES</p>
          <h1>Messages & demandes</h1>
          <p>Suivez les demandes entrantes et mettez à jour leur statut.</p>
        </div>
      </header>

      <p className="message-board-hint" id="message-board-hint">
        Choisissez un statut dans une carte pour déplacer la demande. Les colonnes peuvent défiler horizontalement.
      </p>

      <div className="message-board-scroll" role="region" aria-label="Tableau des messages" aria-describedby="message-board-hint" tabIndex={0}>
        <ul className="message-board">
          {messageStatuses.map(({ id: status, label }) => {
            const columnMessages = messages.filter((message) => message.status === status);
            return (
              <li className="message-column" key={status}>
                <section aria-labelledby={`message-column-${status}`}>
                  <header className="message-column-header">
                    <span className="message-column-mark" aria-hidden="true" />
                    <h2 id={`message-column-${status}`}>{label.fr}</h2>
                    <span className="message-column-count" aria-label={`${columnMessages.length} message${columnMessages.length === 1 ? "" : "s"}`}>
                      {columnMessages.length}
                    </span>
                  </header>

                  {columnMessages.length === 0 ? (
                    <p className="message-column-empty">Aucun message dans cette étape.</p>
                  ) : (
                    <ul className="message-column-cards">
                      {columnMessages.map((message) => (
                        <li key={message.id}>
                          <article className="message-card">
                            <header className="message-card-header">
                              <h3>{message.name}</h3>
                              <time>{message.date}</time>
                            </header>
                            <p className="message-card-company">{message.company}</p>
                            <p className="message-card-project">{message.type.fr}</p>
                            {message.file && (
                              <p className="message-card-attachment" aria-label={`Pièce jointe : ${message.file}`}>
                                Pièce jointe · {message.file}
                              </p>
                            )}
                            <label className="admin-field message-card-status">
                              <span>Statut</span>
                              <select
                                value={message.status}
                                aria-label={`Statut du message de ${message.name}`}
                                onChange={(event) => changeStatus(message, event.currentTarget.value as MessageStatus)}
                              >
                                {messageStatuses.map((option) => (
                                  <option key={option.id} value={option.id}>{option.label.fr}</option>
                                ))}
                              </select>
                            </label>
                            <button className="admin-action" type="button" aria-label={`Voir les détails du message de ${message.name}`} onClick={() => openMessage(message)}>
                              Voir les détails
                            </button>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </li>
            );
          })}
        </ul>
      </div>

      <EditorDrawer
        open={editorValues !== null}
        heading="Détails du message"
        description="Consultez les informations reçues et mettez à jour leur statut."
        onClose={() => setEditorValues(null)}
        onSave={saveEditor}
      >
        {editorValues && (
          <MessageEditorFields
            message={editorValues}
            onStatusChange={(status) => setEditorValues((current) => current && ({ ...current, status }))}
          />
        )}
      </EditorDrawer>

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
