"use client";

import type { Dispatch, SetStateAction } from "react";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";

export type PartnerDraft = {
  id: string;
  name: string;
  logo: string;
};

export function PartnerEditorFields({
  values,
  onChange,
  logoError,
  onLogoChange,
  onFileSelected,
  disabled,
}: {
  values: PartnerDraft;
  onChange: Dispatch<SetStateAction<PartnerDraft | null>>;
  logoError: string;
  onLogoChange: () => void;
  onFileSelected: (file: File | null) => void;
  disabled: boolean;
}) {
  return (
    <>
      <label className="admin-field">
        <span>Nom</span>
        <input
          autoFocus
          required
          maxLength={120}
          value={values.name}
          onChange={(event) => {
            const name = event.currentTarget.value;
            onChange((current) => current && ({ ...current, name }));
          }}
        />
      </label>

      <ImageUploadField
        id="partner-logo"
        label="Logo du partenaire"
        value={values.logo}
        uploadFolder="bureau/partners"
        deferUpload
        disabled={disabled}
        errorMessage={logoError}
        onFileSelected={onFileSelected}
        onRemove={() => {
          onFileSelected(null);
          onChange((current) => current && ({ ...current, logo: "" }));
          onLogoChange();
        }}
      />
    </>
  );
}
