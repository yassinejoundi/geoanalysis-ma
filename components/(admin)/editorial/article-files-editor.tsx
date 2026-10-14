"use client";

import { useState, type ChangeEvent } from "react";
import { maxArticleFileBytes, maxArticleFiles, type ArticleFileAttachment } from "@/lib/content/article-document";
import styles from "./article-rich-text-editor.module.css";

function formatSize(size: number) {
  return size < 1024 * 1024 ? `${Math.ceil(size / 1024)} Ko` : `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ArticleFilesEditor({
  files,
  pendingFiles,
  onFilesChange,
  onPendingFilesChange,
}: {
  files: ArticleFileAttachment[];
  pendingFiles: File[];
  onFilesChange: (files: ArticleFileAttachment[]) => void;
  onPendingFilesChange: (files: File[]) => void;
}) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  function stageSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    setInputKey((current) => current + 1);
    setError("");
    setStatus("");
    if (!selected.length) return;
    if (files.length + pendingFiles.length + selected.length > maxArticleFiles) {
      setError(`Joignez ${maxArticleFiles} fichiers au maximum.`);
      return;
    }
    const oversized = selected.find((file) => file.size > maxArticleFileBytes);
    if (oversized) {
      setError(`${oversized.name} dépasse la limite de 15 Mo.`);
      return;
    }

    onPendingFilesChange([...pendingFiles, ...selected]);
    setStatus(`${selected.length} fichier${selected.length > 1 ? "s" : ""} prêt${selected.length > 1 ? "s" : ""}. Le téléversement aura lieu lors de l’enregistrement.`);
  }

  return (
    <section className={styles.filesSection} aria-labelledby="article-files-heading">
      <h2 id="article-files-heading">Fichiers à joindre</h2>
      <p id="article-files-help" className={styles.fileHelp}>
        PDF, DOCX, XLSX ou CSV · 15 Mo maximum par fichier · {maxArticleFiles} fichiers maximum.
      </p>
      <label className={styles.filePicker}>
        <span>Choisir des fichiers</span>
        <input
          key={inputKey}
          accept=".pdf,.docx,.xlsx,.csv"
          aria-describedby="article-files-help"
          disabled={files.length + pendingFiles.length >= maxArticleFiles}
          multiple
          onChange={stageSelected}
          type="file"
        />
      </label>
      {status ? <p className={styles.fileStatus} role="status">{status}</p> : null}
      {error ? <p className={styles.fileError} role="alert">{error}</p> : null}
      {files.length || pendingFiles.length ? (
        <ul className={styles.fileList}>
          {files.map((file) => (
            <li key={file.id} className={styles.fileRow}>
              <a href={file.url} rel="noreferrer" target="_blank">
                <span>{file.name}</span>
                <small>{file.kind} · {formatSize(file.size)}</small>
              </a>
              <button
                aria-label={`Retirer ${file.name}`}
                className={styles.removeFile}
                onClick={() => {
                  setStatus("");
                  onFilesChange(files.filter((item) => item.id !== file.id));
                }}
                type="button"
              >
                Retirer
              </button>
            </li>
          ))}
          {pendingFiles.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}-${index}`} className={styles.fileRow}>
              <div className={styles.filePending}>
                <span>{file.name}</span>
                <small>{formatSize(file.size)} · En attente d’enregistrement</small>
              </div>
              <button
                aria-label={`Retirer ${file.name}`}
                className={styles.removeFile}
                onClick={() => {
                  setStatus("");
                  onPendingFilesChange(pendingFiles.filter((_, itemIndex) => itemIndex !== index));
                }}
                type="button"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      ) : <p className={styles.noFiles}>Aucun fichier joint.</p>}
    </section>
  );
}
