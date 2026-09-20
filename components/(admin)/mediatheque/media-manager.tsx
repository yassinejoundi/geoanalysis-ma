"use client";

import { useEffect, useRef, useState } from "react";
import { FilterBar } from "@/components/(admin)/shared/filter-bar";
import { Toast } from "@/components/(admin)/shared/toast";
import { adminMedia } from "@/lib/content/admin";

type MediaFilter = "all" | "images" | "pdf" | "other";
type MediaItem = {
  id: string;
  name: string;
  kind: string;
  size: string;
  local?: boolean;
  previewUrl?: string;
};
type ToastMessage = { id: number; message: string };

const imageKinds = new Set(["AVIF", "BMP", "GIF", "HEIC", "JPEG", "JPG", "PNG", "SVG", "TIFF", "WEBP"]);

const fixtureMedia: MediaItem[] = adminMedia.map((item, index) => ({
  ...item,
  id: `fixture-${index}`,
}));

function mediaGroup(kind: string): Exclude<MediaFilter, "all"> {
  const normalizedKind = kind.toUpperCase();
  if (imageKinds.has(normalizedKind)) return "images";
  if (normalizedKind === "PDF") return "pdf";
  return "other";
}

function fileKind(file: File) {
  const extension = file.name.split(".").pop()?.toUpperCase();
  if (extension && extension !== file.name.toUpperCase()) return extension;
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type === "application/pdf") return "PDF";
  return "FICHIER";
}

function formatFileSize(bytes: number) {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
  return `${(bytes / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} MB`;
}

export function MediaManager() {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [localMedia, setLocalMedia] = useState<MediaItem | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);
  const objectUrl = useRef<string | null>(null);

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  useEffect(() => {
    if (progress === null || progress >= 100) return;
    const timeout = window.setTimeout(() => {
      const nextProgress = Math.min(progress + 25, 100);
      setProgress(nextProgress);
      if (nextProgress === 100 && localMedia) {
        setAnnouncement(`Aperçu local prêt pour ${localMedia.name}. Aucun transfert n’a lieu.`);
      }
    }, 180);
    return () => window.clearTimeout(timeout);
  }, [localMedia, progress]);

  function notify(message: string) {
    toastSequence.current += 1;
    setToast({ id: toastSequence.current, message });
  }

  function previewFile(file: File) {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    objectUrl.current = previewUrl ?? null;
    setLocalMedia({
      id: `local-${globalThis.crypto.randomUUID()}`,
      name: file.name,
      kind: fileKind(file),
      size: formatFileSize(file.size),
      local: true,
      previewUrl,
    });
    setProgress(0);
    setAnnouncement(`Préparation de l’aperçu local de ${file.name}. Aucun transfert n’a lieu.`);
  }

  function removeLocalPreview() {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setLocalMedia(null);
    setProgress(null);
    setAnnouncement("Aperçu local retiré.");
    notify("Aperçu local retiré.");
  }

  const media = localMedia ? [...fixtureMedia, localMedia] : fixtureMedia;
  const counts = media.reduce<Record<MediaFilter, number>>((total, item) => {
    total.all += 1;
    total[mediaGroup(item.kind)] += 1;
    return total;
  }, { all: 0, images: 0, pdf: 0, other: 0 });
  const filteredMedia = filter === "all"
    ? media
    : media.filter((item) => mediaGroup(item.kind) === filter);
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
          <p>Consultez les fichiers de la bibliothèque et prévisualisez un fichier local.</p>
        </div>
      </header>

      <p className="expertise-demo-notice">
        Mode démo : les fichiers choisis restent dans cet aperçu local, ne sont pas envoyés et disparaissent au rechargement.
      </p>

      <section className="media-upload-panel" aria-labelledby="media-upload-title">
        <div>
          <h2 id="media-upload-title">Ajouter un aperçu local</h2>
          <p>Sélectionnez un fichier depuis votre appareil. Aucun transfert serveur n’a lieu.</p>
        </div>
        <label className="media-upload-zone" htmlFor="media-local-file">
          <span className="media-upload-prompt">Choisir un fichier à prévisualiser</span>
          <span className="admin-field-help">L’aperçu reste dans cette page et est réinitialisé au rechargement.</span>
          <input
            id="media-local-file"
            aria-describedby="media-upload-help"
            type="file"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) previewFile(file);
              event.currentTarget.value = "";
            }}
          />
          <span className="visually-hidden" id="media-upload-help">
            Fichier utilisé pour un aperçu local uniquement. Aucun transfert serveur.
          </span>
        </label>
        {progress !== null && (
          <div className="media-upload-progress">
            <div className="media-progress-copy">
              <span>Préparation de l’aperçu local</span>
              <span className="admin-record-meta">{progress} %</span>
            </div>
            <progress aria-label="Progression de la préparation locale" max={100} value={progress} />
          </div>
        )}
        <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </section>

      <FilterBar
        label="Type de fichier"
        heading="Bibliothèque de fichiers"
        resultLabel={`${filteredMedia.length} fichier${filteredMedia.length === 1 ? "" : "s"}`}
        options={filterOptions}
        selected={filter}
        onSelect={(value) => setFilter(value as MediaFilter)}
      />

      {filteredMedia.length === 0 ? (
        <section className="admin-empty-state" aria-live="polite">
          <h2>Aucun fichier dans cette catégorie</h2>
          <p>Choisissez un autre type de fichier pour consulter la médiathèque.</p>
          <button className="admin-action" type="button" onClick={() => setFilter("all")}>
            Afficher tous les fichiers
          </button>
        </section>
      ) : (
        <ul className="media-grid">
          {filteredMedia.map((item) => (
            <li className="media-card" key={item.id}>
              <div
                className={`media-card-preview${item.previewUrl ? " media-card-preview-image" : ""}`}
                role={item.previewUrl ? "img" : undefined}
                aria-label={item.previewUrl ? `Aperçu de ${item.name}` : undefined}
                aria-hidden={item.previewUrl ? undefined : true}
                style={item.previewUrl ? { backgroundImage: `url("${item.previewUrl}")` } : undefined}
              >
                {!item.previewUrl && <span>{item.kind}</span>}
              </div>
              <div className="media-card-details">
                <p className="media-card-name" title={item.name}>{item.name}</p>
                <p className="admin-record-meta">{item.kind} · {item.size}</p>
                {item.local && <p className="media-local-label">Aperçu local · aucun transfert</p>}
                {item.local && (
                  <button className="admin-action" type="button" onClick={removeLocalPreview}>
                    Retirer l’aperçu
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
