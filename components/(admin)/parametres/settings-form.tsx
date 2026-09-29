"use client";

import { useRef, useState, type FormEvent } from "react";
import { Toast } from "@/components/(admin)/shared/toast";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";
import type { adminSettings } from "@/lib/content/admin";
import { sendApiMutation } from "@/lib/api-client";

export type SettingsValues = typeof adminSettings;
type SettingKey = keyof SettingsValues;
type ToastMessage = { id: number; message: string };

const optionalLinkKeys = ["googleMaps", "linkedin", "facebook", "instagram"] as const;
const contactFields: { key: SettingKey; label: string; type: "email" | "tel" | "url" | "text"; optional?: boolean }[] = [
  { key: "phone", label: "Téléphone", type: "tel" },
  { key: "email", label: "E-mail", type: "email" },
  { key: "address", label: "Adresse", type: "text" },
  { key: "hours", label: "Horaires", type: "text" },
  { key: "googleMaps", label: "URL d’intégration Google Maps", type: "url", optional: true },
  { key: "linkedin", label: "LinkedIn", type: "url", optional: true },
  { key: "facebook", label: "Facebook", type: "url", optional: true },
  { key: "instagram", label: "Instagram", type: "url", optional: true },
];
const contactKeys = contactFields.map(({ key }) => key);
const seoKeys = ["siteName", "seoTitle", "seoDescription"] as const;
const logoKeys = ["logo", "logoInverse"] as const;

function addUrlProtocol(value: string) {
  return value && !/^https?:\/\//i.test(value) ? `https://${value}` : value;
}

export function SettingsForm({ initialSettings }: { initialSettings: SettingsValues }) {
  const [values, setValues] = useState<SettingsValues>(() => ({
    ...initialSettings,
    googleMaps: addUrlProtocol(initialSettings.googleMaps),
    linkedin: addUrlProtocol(initialSettings.linkedin),
    facebook: addUrlProtocol(initialSettings.facebook),
    instagram: addUrlProtocol(initialSettings.instagram),
  }));
  const [savedValues, setSavedValues] = useState(values);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toastSequence = useRef(0);

  function updateSetting(key: SettingKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>, keys: readonly SettingKey[]) {
    event.preventDefault();
    if (saving || uploading) return;
    setSaving(true);
    toastSequence.current += 1;
    const updates = Object.fromEntries(keys.map((key) => [key, values[key]]));
    try {
      await sendApiMutation("/api/admin/parametres", "PATCH", updates);
      setSavedValues((current) => ({ ...current, ...updates }));
      setToast({ id: toastSequence.current, message: "Paramètres enregistrés." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Enregistrement impossible.";
      setToast({ id: toastSequence.current, message: `${message} Vérifiez les champs, puis réessayez.` });
    } finally {
      setSaving(false);
    }
  }

  function hasChanges(keys: readonly SettingKey[]) {
    return keys.some((key) => values[key] !== savedValues[key]);
  }

  return (
    <main className="admin-content-manager settings-manager">
      <header className="settings-page-heading">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · CONFIGURATION</p>
          <h1>Paramètres du site</h1>
          <p>Coordonnées, référencement et identité visuelle de GEOANALYSIS.</p>
        </div>
      </header>

      <div className="settings-form">
        <div className="settings-grid">
          <form className="settings-panel" onSubmit={(event) => saveSettings(event, contactKeys)} aria-labelledby="settings-contact-title">
            <header className="settings-panel-heading">
              <span aria-hidden="true">01</span>
              <div>
                <h2 id="settings-contact-title">Coordonnées</h2>
                <p>Coordonnées, carte et réseaux sociaux du site.</p>
              </div>
            </header>
            <div className="settings-fields settings-fields-grid">
              {contactFields.map(({ key, label, type, optional }) => (
                <label className="admin-field" key={key} data-field={key}>
                  <span>{label}</span>
                  <input
                    type={type}
                    maxLength={key === "address" ? 500 : optional ? 2048 : 180}
                    required={!optional}
                    value={values[key]}
                    onChange={(event) => updateSetting(key, event.currentTarget.value)}
                    onBlur={(event) => {
                      if (optionalLinkKeys.includes(key as (typeof optionalLinkKeys)[number])) {
                        updateSetting(key, addUrlProtocol(event.currentTarget.value.trim()));
                      }
                    }}
                  />
                </label>
              ))}
              <p className="admin-field-help settings-links-help">
                Collez l’URL src de Google Maps via Partager → Intégrer une carte pour afficher le repère exact. Sinon, la carte affiche l’emplacement GEOANALYSIS. Les liens sociaux vides restent masqués.
              </p>
            </div>
            {hasChanges(contactKeys) && (
              <div className="settings-panel-actions">
                <button className="admin-action admin-action-primary settings-panel-save" type="submit" disabled={saving || uploading}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            )}
          </form>

          <form className="settings-panel" onSubmit={(event) => saveSettings(event, seoKeys)} aria-labelledby="settings-seo-title">
            <header className="settings-panel-heading">
              <span aria-hidden="true">02</span>
              <div>
                <h2 id="settings-seo-title">SEO global</h2>
                <p>Titre par défaut et description des pages sans SEO dédié.</p>
              </div>
            </header>
            <div className="settings-fields">
              <label className="admin-field">
                <span>Nom du site</span>
                <input maxLength={180} required value={values.siteName} onChange={(event) => updateSetting("siteName", event.currentTarget.value)} />
              </label>
              <label className="admin-field">
                <span>Titre par défaut</span>
                <input maxLength={180} required value={values.seoTitle} onChange={(event) => updateSetting("seoTitle", event.currentTarget.value)} />
                <span className="admin-field-help">Valeur par défaut ; les pages avec leur propre SEO gardent leur titre.</span>
              </label>
              <label className="admin-field">
                <span>Description par défaut</span>
                <textarea maxLength={320} rows={3} required value={values.seoDescription} onChange={(event) => updateSetting("seoDescription", event.currentTarget.value)} />
                <span className="admin-field-help">{values.seoDescription.length} / 320 caractères</span>
              </label>
            </div>
            {hasChanges(seoKeys) && (
              <div className="settings-panel-actions">
                <button className="admin-action admin-action-primary settings-panel-save" type="submit" disabled={saving || uploading}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            )}
          </form>

          <form className="settings-panel" onSubmit={(event) => saveSettings(event, logoKeys)} aria-labelledby="settings-logo-title">
            <header className="settings-panel-heading">
              <span aria-hidden="true">03</span>
              <div>
                <h2 id="settings-logo-title">Logo</h2>
                <p>Importez les fichiers, puis enregistrez pour publier les versions.</p>
              </div>
            </header>
            <div className="settings-fields settings-logo-grid">
              <div className="settings-logo-preview">
                <ImageUploadField
                  id="settings-logo"
                  label="Logo principal"
                  value={values.logo}
                  uploadFolder="logo"
                  disabled={saving || uploading}
                  onBusyChange={setUploading}
                  onUploaded={(image) => updateSetting("logo", image.url)}
                />
              </div>
              <div className="settings-logo-preview settings-logo-inverse">
                <ImageUploadField
                  id="settings-logo-inverse"
                  label="Logo sur fond sombre"
                  value={values.logoInverse}
                  uploadFolder="logo"
                  disabled={saving || uploading}
                  onBusyChange={setUploading}
                  onUploaded={(image) => updateSetting("logoInverse", image.url)}
                />
              </div>
            </div>
            {hasChanges(logoKeys) && (
              <div className="settings-panel-actions">
                <button className="admin-action admin-action-primary settings-panel-save" type="submit" disabled={saving || uploading}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
