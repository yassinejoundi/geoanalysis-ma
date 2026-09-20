"use client";

import type { Dispatch, SetStateAction } from "react";

export type PartnerDraft = {
  id: string;
  name: string;
  url: string;
};

export function PartnerEditorFields({
  values,
  onChange,
  urlError,
  onUrlChange,
}: {
  values: PartnerDraft;
  onChange: Dispatch<SetStateAction<PartnerDraft | null>>;
  urlError: string;
  onUrlChange: () => void;
}) {
  return (
    <>
      <label className="admin-field">
        <span>Nom</span>
        <input
          autoFocus
          required
          value={values.name}
          onChange={(event) => {
            const name = event.currentTarget.value;
            onChange((current) => current && ({ ...current, name }));
          }}
        />
      </label>

      <label className="admin-field">
        <span>Lien du partenaire</span>
        <input
          type="url"
          required
          value={values.url}
          aria-describedby="partner-url-help"
          aria-invalid={urlError ? true : undefined}
          onChange={(event) => {
            const url = event.currentTarget.value;
            onChange((current) => current && ({ ...current, url }));
            onUrlChange();
          }}
        />
        <span className="admin-field-help" id="partner-url-help">Saisissez une adresse complète, par exemple https://onhym.com.</span>
      </label>
      {urlError && <p className="partner-url-error" role="alert">{urlError}</p>}

      <p className="admin-disabled-field">Logo : les fichiers restent des espaces réservés dans cette démo.</p>
    </>
  );
}
