"use client";

import { useState, type ChangeEvent } from "react";
import { maxArticleFileBytes, maxArticleFiles, type ArticleFileAttachment } from "@/lib/content/article-document";
import { uploadArticleFileToCloudinary } from "@/lib/upload-article-file";
import styles from "./article-rich-text-editor.module.css";

function formatSize(size: number) {
  return size < 1024 * 1024 ? `${Math.ceil(size / 1024)} Ko` : `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ArticleFilesEditor({
  files,
  onChange,
  onBusyChange,
}: {
  files: ArticleFileAttachment[];
  onChange: (files: ArticleFileAttachment[]) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  async function uploadSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    setInputKey((current) => current + 1);
    setError("");
    setStatus("");
    if (!selected.length) return;
    if (files.length + selected.length > maxArticleFiles) {
      setError(`Joignez ${maxArticleFiles} fichiers au maximum.`);
      return;
    }
    const oversized = selected.find((file) => file.size > maxArticleFileBytes);
    if (oversized) {
      setError(`${oversized.name} dépasse la limite de 15 Mo.`);
      return;
    }

    setBusy(true);
    onBusyChange(true);
    let updated = [...files];
    try {
      for (const [index, file] of selected.entries()) {
        setStatus(`Téléversement du fichier ${index + 1} sur ${selected.length}…`);
        const uploaded = await uploadArticleFileToCloudinary(file);
        updated = [...updated, uploaded];
        onChange(updated);
      }
      setStatus(`${selected.length} fichier${selected.length > 1 ? "s" : ""} ajouté${selected.length > 1 ? "s" : ""}.`);
    } catch (cause) {
      setStatus("");
      setError(cause instanceof Error ? cause.message : "Le fichier n’a pas pu être téléversé.");
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
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
          disabled={busy || files.length >= maxArticleFiles}
          multiple
          onChange={uploadSelected}
          type="file"
        />
      </label>
      {status ? <p className={styles.fileStatus} role="status">{status}</p> : null}
      {error ? <p className={styles.fileError} role="alert">{error}</p> : null}
      {files.length ? (
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
                disabled={busy}
                onClick={() => onChange(files.filter((item) => item.id !== file.id))}
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
