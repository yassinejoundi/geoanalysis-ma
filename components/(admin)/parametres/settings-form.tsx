"use client";

import { useRef, useState, type FormEvent } from "react";
import { Toast } from "@/components/(admin)/shared/toast";
import { adminSettings } from "@/lib/content/admin";

type SettingsValues = typeof adminSettings;
type SettingKey = keyof SettingsValues;
type SettingField = {
  key: SettingKey;
  label: string;
  type?: "text" | "email" | "tel" | "url";
  multiline?: boolean;
};
type SettingsGroup = { id: string; title: string; fields: SettingField[] };
type ToastMessage = { id: number; message: string };

const settingsGroups: SettingsGroup[] = [
  {
    id: "identity",
    title: "Identité",
    fields: [
      { key: "siteName", label: "Nom du site", type: "text" },
      { key: "languages", label: "Langues actives", type: "text" },
    ],
  },
  {
    id: "contact",
    title: "Coordonnées",
    fields: [
      { key: "phone", label: "Téléphone", type: "tel" },
      { key: "email", label: "E-mail", type: "email" },
      { key: "address", label: "Adresse", type: "text" },
      { key: "hours", label: "Horaires", type: "text" },
    ],
  },
  {
    id: "social",
    title: "Réseaux sociaux",
    fields: [
      { key: "linkedin", label: "LinkedIn", type: "url" },
    ],
  },
  {
    id: "seo",
    title: "SEO global",
    fields: [
      { key: "seoTitle", label: "Titre SEO", type: "text" },
      { key: "seoDescription", label: "Description SEO", multiline: true },
    ],
  },
];

function initialSettings(): SettingsValues {
  return {
    ...adminSettings,
    linkedin: /^https?:\/\//i.test(adminSettings.linkedin)
      ? adminSettings.linkedin
      : `https://${adminSettings.linkedin}`,
  };
}

export function SettingsForm() {
  const [values, setValues] = useState<SettingsValues>(initialSettings);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastSequence = useRef(0);

  function updateSetting(key: SettingKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toastSequence.current += 1;
    setToast({
      id: toastSequence.current,
      message: "Paramètres enregistrés en mode démo. Rien n’a été sauvegardé de façon permanente.",
    });
  }

  return (
    <main className="admin-content-manager settings-manager">
      <header className="admin-manager-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION · CONFIGURATION</p>
          <h1>Paramètres</h1>
          <p>Configurez l’identité, les coordonnées et les informations globales du site.</p>
        </div>
      </header>

      <p className="expertise-demo-notice" id="settings-demo-notice">
        Mode démo : les paramètres restent en mémoire sur cette page et sont réinitialisés au rechargement. Aucune donnée n’est enregistrée.
      </p>

      <form className="settings-form" aria-describedby="settings-demo-notice" onSubmit={saveSettings}>
        <div className="settings-grid">
          {settingsGroups.map((group) => (
            <section className="settings-panel" key={group.id} aria-labelledby={`settings-${group.id}-title`}>
              <header>
                <h2 id={`settings-${group.id}-title`}>{group.title}</h2>
              </header>
              <div className="settings-fields">
                {group.fields.map((field) => (
                  <label className="admin-field" key={field.key}>
                    <span>{field.label}</span>
                    {field.multiline ? (
                      <textarea
                        rows={4}
                        required
                        value={values[field.key]}
                        onChange={(event) => updateSetting(field.key, event.currentTarget.value)}
                      />
                    ) : (
                      <input
                        type={field.type ?? "text"}
                        required
                        value={values[field.key]}
                        onChange={(event) => updateSetting(field.key, event.currentTarget.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="settings-form-actions">
          <button className="admin-action admin-action-primary" type="submit">Enregistrer les paramètres</button>
        </div>
      </form>

      {toast && <Toast key={toast.id} message={toast.message} />}
    </main>
  );
}
