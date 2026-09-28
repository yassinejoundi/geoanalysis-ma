"use client";

import { useRef, useState, type FormEvent } from "react";
import { Toast } from "@/components/(admin)/shared/toast";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";
import type { adminSettings } from "@/lib/content/admin";
import { sendApiMutation } from "@/lib/api-client";

export type SettingsValues = typeof adminSettings;
type SettingKey = keyof SettingsValues;
type ToastMessage = { id: number; message: string };

const contactFields: { key: SettingKey; label: string; type: "email" | "tel" | "url" | "text" }[] = [
  { key: "phone", label: "Téléphone", type: "tel" },
  { key: "email", label: "E-mail", type: "email" },
  { key: "address", label: "Adresse", type: "text" },
  { key: "hours", label: "Horaires", type: "text" },
  { key: "linkedin", label: "LinkedIn", type: "url" },
];

export function SettingsForm({ initialSettings }: { initialSettings: SettingsValues }) {
  const [values, setValues] = useState<SettingsValues>(() => ({
    ...initialSettings,
    linkedin: /^https?:\/\//i.test(initialSettings.linkedin) ? initialSettings.linkedin : `https://${initialSettings.linkedin}`,
  }));
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toastSequence = useRef(0);

  function updateSetting(key: SettingKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || uploading) return;
    setSaving(true);
    toastSequence.current += 1;
    try {
      await sendApiMutation("/api/admin/parametres", "PATCH", values);
      setToast({ id: toastSequence.current, message: "Paramètres enregistrés." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Enregistrement impossible.";
      setToast({ id: toastSequence.current, message: `${message} Vérifiez les champs, puis réessayez.` });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-content-manager settings-manager">
      <header className="settings-page-heading">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · CONFIGURATION</p>
          <h1>Paramètres du site</h1>
          <p>Coordonnées, référencement et identité visuelle de GEOANALYSIS.</p>
        </div>
        <button className="admin-action admin-action-primary settings-save-top" type="submit" form="settings-form" disabled={saving || uploading}>
          {saving ? "Enregistrement…" : uploading ? "Envoi de l’image…" : "Enregistrer"}
        </button>
      </header>

      <form className="settings-form" id="settings-form" onSubmit={saveSettings}>
        <div className="settings-grid">
          <section className="settings-panel" aria-labelledby="settings-contact-title">
            <header className="settings-panel-heading">
              <span aria-hidden="true">01</span>
              <div>
                <h2 id="settings-contact-title">Coordonnées</h2>
                <p>Informations affichées sur la page Contact.</p>
              </div>
            </header>
            <div className="settings-fields settings-fields-grid">
              {contactFields.map(({ key, label, type }) => (
                <label className="admin-field" key={key} data-field={key}>
                  <span>{label}</span>
                  <input
                    type={type}
                    maxLength={key === "address" ? 500 : key === "linkedin" ? 2048 : 180}
                    required
                    value={values[key]}
                    onChange={(event) => updateSetting(key, event.currentTarget.value)}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="settings-panel" aria-labelledby="settings-seo-title">
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
          </section>

          <section className="settings-panel" aria-labelledby="settings-logo-title">
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
          </section>
        </div>
      </form>

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
