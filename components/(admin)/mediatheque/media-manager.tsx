"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FilterBar } from "@/components/(admin)/shared/filter-bar";
import { Toast } from "@/components/(admin)/shared/toast";
import { sendApiForm } from "@/lib/api-client";

type MediaFilter = "all" | "images" | "pdf" | "other";
export type MediaItem = { id: string; name: string; kind: string; size: number | string; url?: string };
type ToastMessage = { id: number; message: string };
const imageKinds = new Set(["AVIF", "GIF", "JPEG", "JPG", "PNG", "WEBP"]);

function mediaGroup(kind: string): Exclude<MediaFilter, "all"> {
  const normalized = kind.toUpperCase();
  if (imageKinds.has(normalized)) return "images";
  if (normalized === "PDF") return "pdf";
  return "other";
}

function formatFileSize(value: number | string) {
  if (typeof value !== "number") return value;
  if (value < 1_000_000) return `${Math.max(1, Math.round(value / 1_000))} KB`;
  return `${(value / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} MB`;
}

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [media, setMedia] = useState(initialMedia);
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);

  async function uploadFile(file: File) {
    setBusy(true);
    setAnnouncement("Envoi du fichier…");
    const form = new FormData();
    form.append("file", file);
    try {
      const uploaded = await sendApiForm<MediaItem>("/api/admin/media", form);
      setMedia((current) => [uploaded, ...current]);
      setAnnouncement(`${uploaded.name} a été envoyé dans la médiathèque.`);
      toastSequence.current += 1;
      setToast({ id: toastSequence.current, message: "Fichier envoyé." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Envoi impossible.";
      setAnnouncement(message);
      toastSequence.current += 1;
      setToast({ id: toastSequence.current, message });
    } finally {
      setBusy(false);
    }
  }

  const counts = media.reduce<Record<MediaFilter, number>>((total, item) => {
    total.all += 1;
    total[mediaGroup(item.kind)] += 1;
    return total;
  }, { all: 0, images: 0, pdf: 0, other: 0 });
  const filteredMedia = filter === "all" ? media : media.filter((item) => mediaGroup(item.kind) === filter);
  const filterOptions = [
    { id: "all", label: "Tous les fichiers", count: counts.all },
    { id: "images", label: "Images", count: counts.images },
    { id: "pdf", label: "PDF", count: counts.pdf },
    { id: "other", label: "Autres", count: counts.other },
  ];

  return (
    <main className="admin-content-manager media-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · FICHIERS</p>
          <h1>Médiathèque</h1>
          <p>Consultez les fichiers de la bibliothèque et envoyez des fichiers à Cloudinary.</p>
        </div>
      </header>
      <section className="media-upload-panel" aria-labelledby="media-upload-title">
        <div>
          <h2 id="media-upload-title">Ajouter un fichier</h2>
          <p>Images et PDF, 4 Mo maximum par fichier.</p>
        </div>
        <label className="media-upload-zone" htmlFor="media-file">
          <span className="media-upload-prompt">Choisir un fichier</span>
          <span className="admin-field-help">JPEG, PNG, WebP, GIF, AVIF ou PDF.</span>
          <input id="media-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf" disabled={busy} onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void uploadFile(file);
            event.currentTarget.value = "";
          }} />
        </label>
        {busy && <p role="status">Envoi en cours…</p>}
        <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      </section>
      <FilterBar label="Type de fichier" heading="Bibliothèque de fichiers" resultLabel={`${filteredMedia.length} fichier${filteredMedia.length === 1 ? "" : "s"}`} options={filterOptions} selected={filter} onSelect={(value) => setFilter(value as MediaFilter)} />
      {filteredMedia.length === 0 ? (
        <section className="admin-empty-state" aria-live="polite">
          <h2>Aucun fichier dans cette catégorie</h2>
          <p>Choisissez un autre type de fichier pour consulter la médiathèque.</p>
          <button className="admin-action" type="button" onClick={() => setFilter("all")}>Afficher tous les fichiers</button>
        </section>
      ) : (
        <ul className="media-grid">
          {filteredMedia.map((item) => {
            const image = Boolean(item.url && imageKinds.has(item.kind.toUpperCase()));
            return <li className="media-card" key={item.id}>
              <div className={`media-card-preview${image ? " media-card-preview-image" : ""}`}>
                {image ? <Image src={item.url!} alt={`Aperçu de ${item.name}`} width={320} height={180} unoptimized /> : <span aria-hidden="true">{item.kind}</span>}
              </div>
              <div className="media-card-details">
                <p className="media-card-name" title={item.name}>{item.name}</p>
                <p className="admin-record-meta">{item.kind} · {formatFileSize(item.size)}</p>
                {item.url && <a className="admin-action" href={item.url} target="_blank" rel="noreferrer">Ouvrir le fichier</a>}
              </div>
            </li>;
          })}
        </ul>
      )}
      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
