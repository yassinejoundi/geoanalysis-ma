"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadImageToCloudinary, type UploadedImage } from "@/lib/upload-image";
export type { UploadedImage } from "@/lib/upload-image";

export function ImageUploadField({
  id,
  label,
  value,
  onUploaded,
  onBusyChange,
  disabled = false,
  deferUpload = false,
  onFileSelected,
  onFilesSelected,
  uploadFolder,
  multiple = false,
  maxFiles,
}: {
  id: string;
  label: string;
  value?: string | null;
  onUploaded?: (image: UploadedImage) => void;
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
  deferUpload?: boolean;
  onFileSelected?: (file: File) => void;
  onFilesSelected?: (files: File[]) => void;
  uploadFolder?: "home" | "bureau" | "expertises" | "logo";
  multiple?: boolean;
  maxFiles?: number;
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

  async function upload(files: File[]) {
    setError("");
    setUploading(true);
    onBusyChange?.(true);
    let uploadedCount = 0;
    const failures: string[] = [];

    for (const [index, file] of files.entries()) {
      setStatus(files.length > 1
        ? `Optimisation et envoi de l’image ${index + 1} sur ${files.length}…`
        : "Optimisation et envoi de l’image…");
      const previewUrl = files.length === 1 ? URL.createObjectURL(file) : null;
      if (previewUrl) {
        if (localPreview.current) URL.revokeObjectURL(localPreview.current);
        localPreview.current = previewUrl;
        setPreview(previewUrl);
      }

      try {
        const image = await uploadImageToCloudinary(file, uploadFolder);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          localPreview.current = null;
        }
        setPreview(image.url);
        uploadedCount += 1;
        onUploaded?.(image);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "Envoi de l’image impossible.";
        failures.push(`${file.name} : ${message}`);
      }
    }

    setStatus(`${uploadedCount} image${uploadedCount === 1 ? "" : "s"} envoyée${uploadedCount === 1 ? "" : "s"} en WebP.`);
    if (failures.length) setError(failures.join(" "));
    setUploading(false);
    onBusyChange?.(false);
  }

  function handleSelection(files: File[]) {
    if (files.length === 0) return;
    if (maxFiles !== undefined && files.length > maxFiles) {
      setError(`Sélectionnez au maximum ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`);
      return;
    }
    setSelectedName(files.length === 1 ? files[0].name : `${files.length} fichiers sélectionnés`);
    if (deferUpload) {
      const file = files[0];
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      if (localPreview.current) URL.revokeObjectURL(localPreview.current);
      localPreview.current = previewUrl;
      setPreview(previewUrl);
      setError("");
      setStatus(`${files.length} image${files.length === 1 ? "" : "s"} prête${files.length === 1 ? "" : "s"} à l’enregistrement.`);
      onFileSelected?.(file);
      onFilesSelected?.(files);
    } else if (files.length) {
      void upload(files);
    }
  }

  return (
    <div className="admin-image-upload">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={uploading || disabled || maxFiles === 0}
        aria-describedby={`${helpId} ${fileNameId} ${statusId}${error ? ` ${errorId}` : ""}`}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          handleSelection(files);
        }}
      />
      <p className="admin-image-selected-name" id={fileNameId}>
        {selectedName ? <>Sélection : <strong>{selectedName}</strong></> : "Aucune image sélectionnée."}
      </p>
      <span className="admin-field-help" id={helpId}>
        JPEG, PNG ou WebP. Conversion WebP haute qualité, dimensions conservées. 20 Mo maximum avant optimisation.
        {maxFiles !== undefined ? ` ${maxFiles} image${maxFiles === 1 ? "" : "s"} restante${maxFiles === 1 ? "" : "s"} dans la galerie.` : ""}
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
