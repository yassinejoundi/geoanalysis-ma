"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { compressImageToWebp } from "@/lib/client-image";
import { sendApiForm } from "@/lib/api-client";

export type UploadedImage = { id: string; name: string; url: string };

export function ImageUploadField({
  id,
  label,
  value,
  onUploaded,
  onBusyChange,
  disabled = false,
  uploadFolder,
}: {
  id: string;
  label: string;
  value?: string | null;
  onUploaded: (image: UploadedImage) => void;
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
  uploadFolder?: "home" | "bureau";
}) {
  const [preview, setPreview] = useState(value ?? null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const localPreview = useRef<string | null>(null);
  const helpId = `${id}-help`;
  const fileNameId = `${id}-file-name`;
  const statusId = `${id}-status`;
  const errorId = `${id}-error`;

  useEffect(() => {
    if (!localPreview.current) setPreview(value ?? null);
  }, [value]);

  useEffect(() => () => {
    if (localPreview.current) URL.revokeObjectURL(localPreview.current);
  }, []);

  async function upload(file: File) {
    const previewUrl = URL.createObjectURL(file);
    if (localPreview.current) URL.revokeObjectURL(localPreview.current);
    localPreview.current = previewUrl;
    setPreview(previewUrl);
    setError("");
    setUploading(true);
    onBusyChange?.(true);
    setStatus("Optimisation de l’image…");

    try {
      const optimized = await compressImageToWebp(file);
      setStatus("Envoi vers Cloudinary…");
      const form = new FormData();
      form.append("file", optimized);
      if (uploadFolder) form.append("folder", uploadFolder);
      const image = await sendApiForm<UploadedImage>("/api/admin/media", form);
      URL.revokeObjectURL(previewUrl);
      localPreview.current = null;
      setPreview(image.url);
      setStatus(`${image.name} envoyé en WebP.`);
      onUploaded(image);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Envoi de l’image impossible.";
      setError(message);
      setStatus("");
    } finally {
      setUploading(false);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="admin-image-upload">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading || disabled}
        aria-describedby={`${helpId} ${fileNameId} ${statusId}${error ? ` ${errorId}` : ""}`}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) {
            setSelectedName(file.name);
            void upload(file);
          }
        }}
      />
      <p className="admin-image-selected-name" id={fileNameId}>
        {selectedName ? <>Fichier choisi : <strong>{selectedName}</strong></> : "Aucune image sélectionnée."}
      </p>
      <span className="admin-field-help" id={helpId}>
        JPEG, PNG ou WebP. Conversion WebP haute qualité, dimensions conservées. 20 Mo maximum avant optimisation.
      </span>
      <p className="visually-hidden" id={statusId} role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
      {error && <p className="admin-image-upload-error" id={errorId} role="alert">{error}</p>}
      {preview && (
        <figure className="admin-image-preview">
          <Image src={preview} alt="" width={640} height={360} unoptimized />
          <figcaption>Aperçu de l’image</figcaption>
        </figure>
      )}
    </div>
  );
}
