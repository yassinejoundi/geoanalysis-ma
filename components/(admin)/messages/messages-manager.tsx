"use client";

import { useRef, useState } from "react";
import { MessageEditorFields } from "@/components/(admin)/messages/message-editor-fields";
import { Toast } from "@/components/(admin)/shared/toast";
import { useAdminMessages } from "@/components/(admin)/shared/admin-messages-provider";
import { messageStatuses, type AdminMessage, type MessageStatus } from "@/lib/content/admin";
import { sendApiMutation } from "@/lib/api-client";

type ToastMessage = { id: number; message: string };
type MessageFilter = "all" | "new" | "active" | "closed";

const filters: { id: MessageFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "new", label: "Nouveaux" },
  { id: "active", label: "En cours" },
  { id: "closed", label: "Terminés" },
];

function matchesFilter(message: AdminMessage, filter: MessageFilter) {
  if (filter === "new") return message.status === "new";
  if (filter === "active") return ["contacted", "talking", "quoted"].includes(message.status);
  if (filter === "closed") return ["won", "lost"].includes(message.status);
  return true;
}

export function MessagesManager() {
  const { messages, setMessages } = useAdminMessages();
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const visibleMessages = messages.filter((message) => {
    const searchableText = [message.name, message.company, message.email, message.phone, message.type.fr, message.date, message.message]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("fr");
    return matchesFilter(message, filter) && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
  const selectedMessage = visibleMessages.find((message) => message.id === selectedId) ?? visibleMessages[0] ?? null;
  const resultCount = visibleMessages.length === 1
    ? "1 message affiché"
    : `${visibleMessages.length} messages affichés`;
  const newCount = messages.filter((message) => message.status === "new").length;
  const activeCount = messages.filter((message) => ["contacted", "talking", "quoted"].includes(message.status)).length;
  const closedCount = messages.filter((message) => ["won", "lost"].includes(message.status)).length;

  async function changeStatus(message: AdminMessage, status: MessageStatus) {
    if (message.status === status || updatingId) return;
    setUpdatingId(message.id);
    try {
      await sendApiMutation(`/api/admin/messages/${message.id}`, "PATCH", { status });
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status } : item));
      const label = messageStatuses.find((item) => item.id === status)?.label.fr.toLocaleLowerCase("fr");
      notify(`Statut de ${message.name} mis à jour : ${label}.`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Mise à jour impossible.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="admin-content-manager messages-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · DEMANDES</p>
          <h1>Messages</h1>
          <p>Retrouvez les demandes reçues et leur suivi.</p>
        </div>
      </header>

      <section className="message-overview" aria-label="Résumé des messages">
        {[
          { label: "Au total", value: messages.length },
          { label: "Nouveaux", value: newCount },
          { label: "En cours", value: activeCount },
          { label: "Terminés", value: closedCount },
        ].map(({ label, value }) => (
          <div className="message-overview-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="message-toolbar" aria-label="Recherche et filtres des messages">
        <div className="message-filter-group" role="group" aria-label="Filtrer les messages">
          {filters.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label}
            </button>
          ))}
        </div>
        <label className="admin-field message-search">
          <span>Rechercher</span>
          <span className="message-search-control">
            <span className="message-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Nom, société, e-mail ou contenu"
            />
          </span>
        </label>
      </section>

      <p className="message-results-count" role="status" aria-live="polite" aria-atomic="true">
        {resultCount}
      </p>

      <div className="message-inbox-layout">
        <section className="message-inbox-list" aria-labelledby="message-list-title">
          <header className="message-panel-header">
            <div>
              <h2 id="message-list-title">Boîte de réception</h2>
              <p>Sélectionnez une demande pour lire son contenu.</p>
            </div>
            <span className="message-list-count">{visibleMessages.length}</span>
          </header>

          {visibleMessages.length ? (
            <ul className="message-list">
              {visibleMessages.map((message) => {
                const statusLabel = messageStatuses.find(({ id }) => id === message.status)?.label.fr ?? message.status;
                return (
                  <li key={message.id}>
                    <button
                      type="button"
                      className="message-list-item"
                      aria-pressed={selectedMessage?.id === message.id}
                      onClick={() => setSelectedId(message.id)}
                    >
                      <span className="message-list-top">
                        <span className="message-list-name">{message.name}</span>
                        <span className="message-list-date">{message.date}</span>
                      </span>
                      {message.company && <span className="message-list-company">{message.company}</span>}
                      <span className="message-list-subject">{message.type.fr}</span>
                      <span className="message-list-preview">{message.message}</span>
                      <span className="message-list-bottom">
                        <span className="message-status" data-status={message.status}>
                          <span className="message-status-mark" aria-hidden="true" />
                          {statusLabel}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="message-empty-state">
              <h3>{messages.length ? "Aucun résultat" : "Aucun message reçu"}</h3>
              <p>
                {messages.length
                  ? normalizedQuery
                    ? `Aucun message ne correspond à « ${query} ». Modifiez la recherche ou le filtre.`
                    : "Aucun message ne correspond à ce filtre. Choisissez un autre filtre."
                  : "Les demandes envoyées depuis le formulaire de contact apparaîtront ici."}
              </p>
              {messages.length > 0 && (query || filter !== "all") && (
                <button className="admin-action" type="button" onClick={() => { setQuery(""); setFilter("all"); }}>
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
        </section>

        <aside className="message-preview" aria-labelledby="message-preview-title">
          {selectedMessage ? (
            <>
              <header className="message-preview-header">
                <div>
                  <p className="admin-eyebrow">DEMANDE REÇUE</p>
                  <h2 id="message-preview-title">{selectedMessage.name}</h2>
                  {selectedMessage.company && <p>{selectedMessage.company}</p>}
                </div>
                <span className="message-preview-date">{selectedMessage.date}</span>
              </header>
              <MessageEditorFields
                message={selectedMessage}
                updating={updatingId === selectedMessage.id}
                onStatusChange={(status) => changeStatus(selectedMessage, status)}
              />
              {selectedMessage.email && (
                <div className="message-preview-actions">
                  <a className="admin-action admin-action-primary" href={`mailto:${selectedMessage.email}`}>
                    Répondre par e-mail
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="message-preview-empty">
              <h2 id="message-preview-title">Aucun message sélectionné</h2>
              <p>Choisissez une demande dans la liste pour afficher ses coordonnées et son contenu.</p>
            </div>
          )}
        </aside>
      </div>

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
