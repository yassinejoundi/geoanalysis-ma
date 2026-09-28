"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImageUploadField } from "@/components/(admin)/shared/image-upload-field";
import type { ExpertiseApproachStep, ExpertisePageContent, ExpertiseServiceArea } from "@/components/(public)/expertises/content";
import { sendApiMutation } from "@/lib/api-client";
import { locales, type Locale } from "@/lib/i18n";

type Section = "seo" | "hero" | "domains" | "approach";
type TextKey = Exclude<keyof ExpertisePageContent, "areas" | "approachSteps">;
const sections: { id: Section; label: string }[] = [
  { id: "seo", label: "Référencement" },
  { id: "hero", label: "En-tête" },
  { id: "domains", label: "Domaines et prestations" },
  { id: "approach", label: "Démarche" },
];
const localeLabels: Record<Locale, string> = { fr: "Français", en: "English" };

function cloneContent(content: ExpertisePageContent): ExpertisePageContent {
  return {
    ...content,
    areas: content.areas.map((area) => ({ ...area, services: [...area.services] })),
    approachSteps: content.approachSteps.map((step) => ({ ...step })),
  };
}

function TextField({
  id, label, value, onChange, multiline = false, maxLength = 2000,
}: {
  id: string; label: string; value: string; onChange: (value: string) => void;
  multiline?: boolean; maxLength?: number;
}) {
  return (
    <label className="admin-field" htmlFor={id}>
      <span>{label} <span aria-hidden="true">*</span></span>
      {multiline
        ? <textarea id={id} value={value} maxLength={maxLength} rows={3} required onChange={(event) => onChange(event.currentTarget.value)} />
        : <input id={id} type="text" value={value} maxLength={maxLength} required onChange={(event) => onChange(event.currentTarget.value)} />}
    </label>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return <p className="home-content-preview-line"><span>{label}</span>{value || <em>Non renseigné</em>}</p>;
}

function nextAreaId(areas: ExpertiseServiceArea[]) {
  let suffix = 1;
  while (areas.some((area) => area.id === "domaine-" + suffix)) suffix += 1;
  return "domaine-" + suffix;
}

export function ExpertisePageManager({ initialContent }: { initialContent: Record<Locale, ExpertisePageContent> }) {
  const [contentByLocale, setContentByLocale] = useState(initialContent);
  const [locale, setLocale] = useState<Locale>("fr");
  const [editing, setEditing] = useState<Section | null>(null);
  const [draft, setDraft] = useState<ExpertisePageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const saveLock = useRef(false);
  const focusAfterOpen = useRef<Section | null>(null);
  const focusAfterClose = useRef<Section | null>(null);
  const focusAfterListChange = useRef<string | null>(null);
  const content = contentByLocale[locale];

  useEffect(() => {
    if (editing && focusAfterOpen.current) {
      const firstFields: Record<Section, string> = { seo: "seoTitle", hero: "heroKicker", domains: "indexNavLabel", approach: "approachKicker" };
      document.getElementById("expertise-" + editing + "-" + firstFields[editing])?.focus();
      focusAfterOpen.current = null;
    } else if (!editing && !saving && focusAfterClose.current) {
      document.getElementById("expertise-page-edit-" + focusAfterClose.current)?.focus();
      focusAfterClose.current = null;
    }
  }, [editing, saving]);

  useEffect(() => {
    if (!focusAfterListChange.current) return;
    document.getElementById(focusAfterListChange.current)?.focus();
    focusAfterListChange.current = null;
  }, [draft]);

  function startEditing(section: Section) {
    focusAfterOpen.current = section;
    setDraft(cloneContent(content));
    setEditing(section);
    setStatus("");
    setError("");
  }
  function cancelEditing() {
    focusAfterClose.current = editing;
    setDraft(null);
    setEditing(null);
    setError("");
  }
  function updateText(field: TextKey, value: string) {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  }
  function updateArea(index: number, field: "number" | "title" | "summary", value: string) {
    setDraft((current) => current ? {
      ...current, areas: current.areas.map((area, item) => item === index ? { ...area, [field]: value } : area),
    } : current);
  }
  function updateService(areaIndex: number, serviceIndex: number, value: string) {
    setDraft((current) => current ? {
      ...current, areas: current.areas.map((area, item) => item === areaIndex
        ? { ...area, services: area.services.map((service, index) => index === serviceIndex ? value : service) }
        : area),
    } : current);
  }
  function updateStep(index: number, field: keyof ExpertiseApproachStep, value: string) {
    setDraft((current) => current ? {
      ...current, approachSteps: current.approachSteps.map((step, item) => item === index ? { ...step, [field]: value } : step),
    } : current);
  }
  function addArea() {
    if (!draft || draft.areas.length >= 8) return;
    const id = nextAreaId(draft.areas);
    focusAfterListChange.current = "expertise-area-" + id + "-number";
    setDraft((current) => current ? { ...current, areas: [...current.areas, { id, number: "", title: "", summary: "", services: [""] }] } : current);
  }
  function removeArea(index: number) {
    if (!draft || draft.areas.length <= 1) return;
    const nextArea = draft.areas[index + 1] ?? draft.areas[Math.max(0, index - 1)];
    if (!nextArea) return;
    focusAfterListChange.current = "expertise-area-" + nextArea.id + "-number";
    setDraft((current) => current ? { ...current, areas: current.areas.filter((_, item) => item !== index) } : current);
  }
  function addService(areaIndex: number) {
    const area = draft?.areas[areaIndex];
    if (!draft || !area || area.services.length >= 16) return;
    focusAfterListChange.current = "expertise-service-" + area.id + "-" + area.services.length;
    setDraft((current) => current ? {
      ...current, areas: current.areas.map((item, index) => index === areaIndex ? { ...item, services: [...item.services, ""] } : item),
    } : current);
  }
  function removeService(areaIndex: number, serviceIndex: number) {
    const area = draft?.areas[areaIndex];
    if (!draft || !area || area.services.length <= 1) return;
    const nextIndex = serviceIndex < area.services.length - 1 ? serviceIndex : serviceIndex - 1;
    focusAfterListChange.current = "expertise-service-" + area.id + "-" + nextIndex;
    setDraft((current) => current ? {
      ...current, areas: current.areas.map((item, index) => index === areaIndex
        ? { ...item, services: item.services.filter((_, service) => service !== serviceIndex) }
        : item),
    } : current);
  }
  function addStep() {
    if (!draft || draft.approachSteps.length >= 12) return;
    const index = draft.approachSteps.length;
    focusAfterListChange.current = "expertise-step-" + index + "-label";
    setDraft((current) => current ? { ...current, approachSteps: [...current.approachSteps, { label: "", title: "", description: "" }] } : current);
  }
  function removeStep(index: number) {
    if (!draft || draft.approachSteps.length <= 1) return;
    const nextIndex = index < draft.approachSteps.length - 1 ? index : index - 1;
    focusAfterListChange.current = "expertise-step-" + nextIndex + "-label";
    setDraft((current) => current ? { ...current, approachSteps: current.approachSteps.filter((_, item) => item !== index) } : current);
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !editing || saveLock.current || uploading) return;
    saveLock.current = true;
    setSaving(true);
    setError("");
    void sendApiMutation<ExpertisePageContent>("/api/admin/expertise-page/" + locale, "PATCH", { content: draft })
      .then((saved) => {
        focusAfterClose.current = editing;
        setContentByLocale((current) => ({ ...current, [locale]: saved }));
        setDraft(null);
        setEditing(null);
        setStatus("Contenu enregistré.");
      })
      .catch(() => setError("Enregistrement impossible. Vérifiez les champs et votre connexion, puis réessayez."))
      .finally(() => { saveLock.current = false; setSaving(false); });
  }

  function renderPreview(section: Section) {
    switch (section) {
      case "seo":
        return <><h3>{content.seoTitle}</h3><PreviewLine label="Description" value={content.seoDescription} /></>;
      case "hero":
        return (
          <div className="home-content-about-preview">
            <Image className="home-content-preview-image" src={content.heroImage} alt={content.photoAlt} width={360} height={220} unoptimized />
            <div>
              <p className="home-content-kicker">{content.heroKicker}</p><h3>{content.heroTitle}</h3><p>{content.heroLead}</p>
              <div className="home-content-preview-actions"><span>{content.contactAction}</span><span>{content.exploreDomains}</span></div>
              <PreviewLine label="Texte alternatif" value={content.photoAlt} /><PreviewLine label="Légende" value={content.photoCaption} />
            </div>
          </div>
        );
      case "domains":
        return (
          <>
            <p className="home-content-kicker">{content.indexSectionKicker}</p><h3>{content.indexSectionTitle}</h3><p>{content.indexSectionLead}</p>
            <PreviewLine label="Navigation" value={content.indexNavLabel} />
            <ul className="home-content-preview-list">
              {content.areas.map((area) => <li key={area.id}><strong>{area.number} · {area.title}</strong><span>{area.summary}</span><span>{area.services.join(" · ")}</span></li>)}
            </ul>
          </>
        );
      case "approach":
        return (
          <>
            <p className="home-content-kicker">{content.approachKicker}</p><h3>{content.approachTitle}</h3><p>{content.approachLead}</p>
            <ol className="home-content-preview-list">
              {content.approachSteps.map((step, index) => <li key={index}><strong>{step.label} · {step.title}</strong><span>{step.description}</span></li>)}
            </ol>
          </>
        );
    }
  }

  function renderEditor(section: Section) {
    if (!draft) return null;
    const field = (key: TextKey, label: string, multiline = false) => {
      const maxLength = key === "seoTitle" ? 160 : key === "seoDescription" ? 320 : key === "photoAlt" ? 250
        : key === "heroTitle" || key === "indexSectionTitle" || key === "approachTitle" ? 300 : 2000;
      return <TextField key={key} id={"expertise-" + section + "-" + key} label={label} value={draft[key]} maxLength={maxLength} multiline={multiline} onChange={(value) => updateText(key, value)} />;
    };
    switch (section) {
      case "seo":
        return <div className="home-content-fields-grid">{field("seoTitle", "Titre de référencement")}{field("seoDescription", "Description de référencement", true)}</div>;
      case "hero":
        return (
          <>
            <div className="home-content-fields-grid">{field("heroKicker", "Accroche courte")}{field("heroTitle", "Titre principal", true)}{field("heroLead", "Texte d’introduction", true)}{field("contactAction", "Lien vers le contact")}{field("exploreDomains", "Lien vers les domaines")}</div>
            <ImageUploadField id={"expertise-hero-image-" + locale} label="Image d’en-tête" value={draft.heroImage} uploadFolder="expertises" onUploaded={(image) => updateText("heroImage", image.url)} onBusyChange={setUploading} />
            <div className="home-content-fields-grid">{field("photoAlt", "Texte alternatif")}{field("photoCaption", "Légende de l’image")}</div>
          </>
        );
      case "domains":
        return (
          <>
            <div className="home-content-fields-grid">{field("indexNavLabel", "Libellé de la navigation")}{field("indexSectionKicker", "Accroche de section")}{field("indexSectionTitle", "Titre", true)}{field("indexSectionLead", "Introduction", true)}</div>
            <div className="home-content-list-editor">
              <div className="home-content-editor-heading"><h3>Domaines d’intervention</h3><p>Modifiez les titres, les descriptions et les prestations affichées.</p></div>
              {draft.areas.map((area, index) => (
                <fieldset className="home-content-row" key={area.id}>
                  <legend>Domaine {index + 1}</legend>
                  <div className="home-content-row-fields">
                    <TextField id={"expertise-area-" + area.id + "-number"} label="Numéro" value={area.number} maxLength={12} onChange={(value) => updateArea(index, "number", value)} />
                    <TextField id={"expertise-area-" + area.id + "-title"} label="Titre" value={area.title} maxLength={200} onChange={(value) => updateArea(index, "title", value)} />
                    <TextField id={"expertise-area-" + area.id + "-summary"} label="Description" value={area.summary} maxLength={1200} multiline onChange={(value) => updateArea(index, "summary", value)} />
                  </div>
                  <div className="home-content-list-editor expertise-page-area-services">
                    <div className="home-content-editor-heading"><h4>Prestations</h4></div>
                    {area.services.map((service, serviceIndex) => (
                      <div className="expertise-page-service-editor-row" key={area.id + "-service-" + serviceIndex}>
                        <TextField id={"expertise-service-" + area.id + "-" + serviceIndex} label={"Prestation " + (serviceIndex + 1)} value={service} maxLength={500} onChange={(value) => updateService(index, serviceIndex, value)} />
                        <button className="admin-action admin-action-danger" type="button" aria-label={"Retirer la prestation " + (serviceIndex + 1) + " du domaine " + (index + 1)} disabled={area.services.length <= 1} onClick={() => removeService(index, serviceIndex)}>Retirer</button>
                      </div>
                    ))}
                    <button className="admin-action" type="button" disabled={area.services.length >= 16} onClick={() => addService(index)}>Ajouter une prestation</button>
                  </div>
                  <button className="admin-action admin-action-danger" type="button" aria-label={"Retirer ce domaine " + (index + 1) + " : " + area.title} disabled={draft.areas.length <= 1} onClick={() => removeArea(index)}>Retirer ce domaine</button>
                </fieldset>
              ))}
              <button className="admin-action" type="button" disabled={draft.areas.length >= 8} onClick={addArea}>Ajouter un domaine</button>
            </div>
          </>
        );
      case "approach":
        return (
          <>
            <div className="home-content-fields-grid">{field("approachKicker", "Accroche")}{field("approachTitle", "Titre", true)}{field("approachLead", "Introduction", true)}</div>
            <div className="home-content-list-editor">
              <div className="home-content-editor-heading"><h3>Étapes</h3><p>Chaque étape comprend un libellé, un titre et une description.</p></div>
              {draft.approachSteps.map((step, index) => (
                <fieldset className="home-content-row" key={index}>
                  <legend>Étape {index + 1}</legend>
                  <div className="home-content-row-fields">
                    <TextField id={"expertise-step-" + index + "-label"} label="Libellé" value={step.label} maxLength={200} onChange={(value) => updateStep(index, "label", value)} />
                    <TextField id={"expertise-step-" + index + "-title"} label="Titre" value={step.title} maxLength={300} onChange={(value) => updateStep(index, "title", value)} />
                    <TextField id={"expertise-step-" + index + "-description"} label="Description" value={step.description} multiline onChange={(value) => updateStep(index, "description", value)} />
                  </div>
                  <button className="admin-action admin-action-danger" type="button" aria-label={"Retirer cette étape " + (index + 1)} disabled={draft.approachSteps.length <= 1} onClick={() => removeStep(index)}>Retirer cette étape</button>
                </fieldset>
              ))}
              <button className="admin-action" type="button" disabled={draft.approachSteps.length >= 12} onClick={addStep}>Ajouter une étape</button>
            </div>
          </>
        );
    }
  }

  return (
    <main className="admin-content-manager home-content-manager expertise-page-manager">
      <header className="home-content-header">
        <div><p className="admin-eyebrow">CONTENUS / PAGE DES EXPERTISES</p><h1>Page des expertises</h1><p>Prévisualisez chaque section, puis modifiez son contenu publié.</p></div>
        <div className="editor-language-switch" role="group" aria-label="Langue du contenu">
          <span>Langue</span>
          <div>{locales.map((value) => (
            <button key={value} className="editor-language-button" type="button" aria-pressed={locale === value} disabled={editing !== null} onClick={() => { setLocale(value); setStatus(""); }}>
              {localeLabels[value]}
            </button>
          ))}</div>
        </div>
      </header>
      <p className="home-content-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
      <div className="home-content-sections">
        {sections.map(({ id, label }, index) => (
          <article className="home-content-card" key={id}>
            <header className="home-content-card-header">
              <div><p className="admin-eyebrow">SECTION {String(index + 1).padStart(2, "0")}</p><h2>{label}</h2></div>
              <button className="admin-action" type="button" id={"expertise-page-edit-" + id} aria-expanded={editing === id} aria-label={"Modifier la section " + label} disabled={editing !== null || saving} onClick={() => startEditing(id)}>Modifier</button>
            </header>
            <section className="home-content-preview" aria-label={"Aperçu : " + label}>
              <p className="home-content-preview-label">Aperçu publié · {localeLabels[locale]}</p>
              {renderPreview(id)}
            </section>
            {editing === id && (
              <form className="home-content-editor" onSubmit={saveEditor}>
                <div className="home-content-editor-heading"><h3>Modifier cette section</h3><p>Les champs marqués * sont obligatoires. Les changements seront publiés dès leur enregistrement.</p></div>
                {renderEditor(id)}
                {error && <p className="home-content-error" role="alert">{error}</p>}
                <div className="home-content-editor-actions">
                  <button className="admin-action" type="button" disabled={saving || uploading} onClick={cancelEditing}>Annuler</button>
                  <button className="admin-action admin-action-primary" type="submit" disabled={saving || uploading}>{saving ? "Enregistrement…" : uploading ? "Envoi de l’image…" : "Enregistrer"}</button>
                </div>
              </form>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
