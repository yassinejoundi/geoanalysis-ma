"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImageUploadField, type UploadedImage } from "@/components/(admin)/shared/image-upload-field";
import { TeamManager } from "@/components/(admin)/equipe/team-manager";
import { PartnersManager } from "@/components/(admin)/partenaires/partners-manager";
import type { TeamDraft } from "@/components/(admin)/equipe/team-editor-fields";
import type { PartnerDraft } from "@/components/(admin)/partenaires/partner-editor-fields";
import type { BureauContent, BureauPhoto, BureauTextRow } from "@/components/(public)/bureau/content";
import { sendApiMutation } from "@/lib/api-client";
import { locales, type Locale } from "@/lib/i18n";

type Section = "seo" | "hero" | "about" | "directory" | "method" | "values";
type ListKey = "domains" | "stages" | "values";
type TextKey = Exclude<keyof BureauContent, ListKey | "gallery">;

const sections: { id: Section; label: string }[] = [
  { id: "seo", label: "Référencement" },
  { id: "hero", label: "En-tête" },
  { id: "about", label: "Présentation et galerie" },
  { id: "directory", label: "Équipe et partenaires" },
  { id: "method", label: "Notre méthode" },
  { id: "values", label: "Nos engagements" },
];

const localeLabels: Record<Locale, string> = { fr: "Français", en: "English" };

function cloneContent(content: BureauContent): BureauContent {
  return {
    ...content,
    domains: [...content.domains],
    gallery: content.gallery.map((photo) => ({ ...photo })),
    stages: content.stages.map((row) => ({ ...row })),
    values: content.values.map((row) => ({ ...row })),
  };
}

function TextField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  maxLength = 2000,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="admin-field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={id} value={value} maxLength={maxLength} rows={3} required onChange={(event) => onChange(event.currentTarget.value)} />
      ) : (
        <input id={id} type="text" value={value} maxLength={maxLength} required onChange={(event) => onChange(event.currentTarget.value)} />
      )}
    </label>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return <p className="home-content-preview-line"><span>{label}</span>{value || <em>Non renseigné</em>}</p>;
}

function TextRowsEditor({
  id,
  title,
  rows,
  labels,
  maxRows,
  onChange,
  onAdd,
  onRemove,
}: {
  id: string;
  title: string;
  rows: BureauTextRow[];
  labels: [string, string];
  maxRows: number;
  onChange: (row: number, field: keyof BureauTextRow, value: string) => void;
  onAdd: () => void;
  onRemove: (row: number) => void;
}) {
  return (
    <div className="home-content-list-editor">
      <div className="home-content-editor-heading"><h3>{title}</h3></div>
      {rows.map((row, index) => (
        <fieldset className="home-content-row" key={`${id}-${index}`}>
          <legend>{title} {index + 1}</legend>
          <div className="home-content-row-fields">
            <TextField id={`${id}-${index}-title`} label={labels[0]} value={row.title} maxLength={300} onChange={(value) => onChange(index, "title", value)} />
            <TextField id={`${id}-${index}-description`} label={labels[1]} value={row.description} multiline onChange={(value) => onChange(index, "description", value)} />
          </div>
          <button className="admin-action admin-action-danger" type="button" aria-label={`Retirer ${title.toLocaleLowerCase("fr")} ${index + 1}`} disabled={rows.length <= 1} onClick={() => onRemove(index)}>Retirer</button>
        </fieldset>
      ))}
      <button className="admin-action" type="button" disabled={rows.length >= maxRows} onClick={onAdd}>Ajouter</button>
    </div>
  );
}

export function BureauManager({
  initialContent,
  initialMembers,
  initialPartners,
}: {
  initialContent: Record<Locale, BureauContent>;
  initialMembers: TeamDraft[];
  initialPartners: PartnerDraft[];
}) {
  const [contentByLocale, setContentByLocale] = useState(initialContent);
  const [locale, setLocale] = useState<Locale>("fr");
  const [editing, setEditing] = useState<Section | null>(null);
  const [draft, setDraft] = useState<BureauContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const saveLock = useRef(false);
  const focusAfterOpen = useRef<Section | null>(null);
  const focusAfterClose = useRef<Section | null>(null);
  const content = contentByLocale[locale];

  useEffect(() => {
    const section = editing ?? focusAfterClose.current;
    if (!section || (editing && !focusAfterOpen.current)) return;
    const firstFields: Record<Section, string> = {
      seo: "seoTitle",
      hero: "heroKicker",
      about: "aboutEyebrow",
      directory: "teamEyebrow",
      method: "methodEyebrow",
      values: "valuesTitle",
    };
    document.getElementById(editing ? `bureau-${section}-${firstFields[section]}` : `bureau-edit-${section}`)?.focus();
    focusAfterOpen.current = null;
    focusAfterClose.current = null;
  }, [editing]);

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

  function updateDomain(index: number, value: string) {
    setDraft((current) => current ? { ...current, domains: current.domains.map((domain, item) => item === index ? value : domain) } : current);
  }

  function updatePhoto(index: number, field: keyof BureauPhoto, value: string) {
    setDraft((current) => current ? {
      ...current,
      gallery: current.gallery.map((photo, item) => item === index ? { ...photo, [field]: value } : photo),
    } : current);
  }

  function updateRows(key: "stages" | "values", row: number, field: keyof BureauTextRow, value: string) {
    setDraft((current) => current ? {
      ...current,
      [key]: current[key].map((item, index) => index === row ? { ...item, [field]: value } : item),
    } : current);
  }

  function updateImage(image: UploadedImage, field: "heroImage" | number) {
    if (field === "heroImage") updateText("heroImage", image.url);
    else updatePhoto(field, "src", image.url);
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !editing || saveLock.current || uploading) return;
    saveLock.current = true;
    setSaving(true);
    setError("");
    void sendApiMutation<BureauContent>(`/api/admin/bureau/${locale}`, "PATCH", { content: draft })
      .then((saved) => {
        focusAfterClose.current = editing;
        setContentByLocale((current) => ({ ...current, [locale]: saved }));
        setDraft(null);
        setEditing(null);
        setStatus("Contenu enregistré.");
      })
      .catch(() => setError("Enregistrement impossible. Vérifiez votre connexion puis réessayez."))
      .finally(() => {
        saveLock.current = false;
        setSaving(false);
      });
  }

  function renderPreview(section: Section) {
    switch (section) {
      case "seo":
        return <><h3>{content.seoTitle} | GEOANALYSIS</h3><PreviewLine label="Description" value={content.seoDescription} /></>;
      case "hero":
        return (
          <div className="home-content-about-preview">
            <Image className="home-content-preview-image" src={content.heroImage} alt="" width={360} height={220} unoptimized />
            <div>
              <p className="home-content-kicker">{content.heroKicker}</p>
              <h3>{content.heroTitle}</h3>
              <p>{content.heroLead}</p>
              <div className="home-content-preview-actions"><span>{content.primaryAction}</span><span>{content.secondaryAction}</span></div>
              <PreviewLine label="Texte alternatif" value={content.heroImageAlt} />
              <PreviewLine label="Légende" value={content.heroImageCaption} />
              <PreviewLine label={content.fieldsLabel} value={content.domains.join(" · ")} />
            </div>
          </div>
        );
      case "about":
        return (
          <>
            <p className="home-content-kicker">{content.aboutEyebrow}</p>
            <h3>{content.aboutTitle}</h3>
            <p>{content.aboutLead}</p><p>{content.aboutDetail}</p>
            <PreviewLine label="Lieu" value={content.aboutLocation} />
            <div className="bureau-gallery-preview" aria-label={content.aboutGalleryLabel}>
              {content.gallery.map((photo, index) => <Image key={`${photo.src}-${index}`} src={photo.src} alt={photo.alt} width={220} height={150} unoptimized />)}
            </div>
          </>
        );
      case "directory":
        return <div className="home-content-preview-actions"><span>{content.teamEyebrow} · {content.teamTitle}</span><span>{content.partnersEyebrow} · {content.partnersTitle}</span></div>;
      case "method":
        return <><p className="home-content-kicker">{content.methodEyebrow}</p><h3>{content.methodTitle}</h3><p>{content.methodLead}</p><ol className="home-content-preview-list">{content.stages.map((row, index) => <li key={index}><strong>{String(index + 1).padStart(2, "0")} · {row.title}</strong><span>{row.description}</span></li>)}</ol></>;
      case "values":
        return <><h3>{content.valuesTitle}</h3><ol className="home-content-preview-list">{content.values.map((row, index) => <li key={index}><strong>{String(index + 1).padStart(2, "0")} · {row.title}</strong><span>{row.description}</span></li>)}</ol></>;
    }
  }

  function renderEditor(section: Section) {
    if (!draft) return null;
    const field = (key: TextKey, label: string, multiline = false, maxLength = 2000) => (
      <TextField key={key} id={`bureau-${section}-${key}`} label={label} value={draft[key]} multiline={multiline} maxLength={maxLength} onChange={(value) => updateText(key, value)} />
    );

    switch (section) {
      case "seo":
        return <div className="home-content-fields-grid">{field("seoTitle", "Titre SEO", false, 160)}{field("seoDescription", "Description SEO", true, 320)}</div>;
      case "hero":
        return <>
          <div className="home-content-fields-grid">{field("heroKicker", "Accroche")}{field("heroTitle", "Titre principal", true, 300)}{field("heroLead", "Présentation", true)}{field("heroImageAlt", "Texte alternatif", true, 250)}{field("heroImageLabel", "Libellé de l’image")}{field("heroImageCaption", "Légende de l’image")}{field("fieldsLabel", "Libellé des domaines")}{field("primaryAction", "Lien de contact")}{field("secondaryAction", "Lien vers la méthode")}</div>
          <ImageUploadField id={`bureau-${locale}-hero-image`} label="Image d’en-tête" value={draft.heroImage} uploadFolder="bureau" disabled={uploading} onUploaded={(image) => updateImage(image, "heroImage")} onBusyChange={setUploading} />
          <div className="home-content-list-editor">
            <div className="home-content-editor-heading"><h3>Domaines affichés</h3></div>
            {draft.domains.map((domain, index) => (
              <fieldset className="home-content-row" key={`bureau-domain-${index}`}>
                <legend>Domaine {index + 1}</legend>
                <TextField id={`bureau-domain-${index}`} label="Nom du domaine" value={domain} maxLength={300} onChange={(value) => updateDomain(index, value)} />
                <button className="admin-action admin-action-danger" type="button" aria-label={`Retirer le domaine ${index + 1}`} disabled={draft.domains.length <= 1} onClick={() => setDraft((current) => current ? { ...current, domains: current.domains.filter((_, item) => item !== index) } : current)}>Retirer</button>
              </fieldset>
            ))}
            <button className="admin-action" type="button" disabled={draft.domains.length >= 8} onClick={() => setDraft((current) => current ? { ...current, domains: [...current.domains, ""] } : current)}>Ajouter un domaine</button>
          </div>
        </>;
      case "about":
        return <>
          <div className="home-content-fields-grid">{field("aboutEyebrow", "Accroche")}{field("aboutTitle", "Titre", true, 300)}{field("aboutLead", "Texte principal", true)}{field("aboutDetail", "Texte complémentaire", true)}{field("aboutLocation", "Lieu")}{field("aboutGalleryLabel", "Description de la galerie")}</div>
          <div className="home-content-list-editor">
            <div className="home-content-editor-heading"><h3>Galerie photo</h3></div>
            {draft.gallery.map((photo, index) => (
              <fieldset className="home-content-row" key={`bureau-photo-${index}`}>
                <legend>Image {index + 1}</legend>
                <ImageUploadField id={`bureau-${locale}-gallery-${index}`} label="Choisir une image" value={photo.src} uploadFolder="bureau" disabled={uploading} onUploaded={(image) => updateImage(image, index)} onBusyChange={setUploading} />
                <TextField id={`bureau-gallery-alt-${index}`} label="Texte alternatif" value={photo.alt} maxLength={250} onChange={(value) => updatePhoto(index, "alt", value)} />
                <button className="admin-action admin-action-danger" type="button" aria-label={`Retirer l’image ${index + 1}`} disabled={draft.gallery.length <= 1} onClick={() => setDraft((current) => current ? { ...current, gallery: current.gallery.filter((_, item) => item !== index) } : current)}>Retirer</button>
              </fieldset>
            ))}
            <button className="admin-action" type="button" disabled={draft.gallery.length >= 8} onClick={() => setDraft((current) => current ? { ...current, gallery: [...current.gallery, { src: "", alt: "" }] } : current)}>Ajouter une image</button>
          </div>
        </>;
      case "directory":
        return <div className="home-content-fields-grid">{field("teamEyebrow", "Accroche de l’équipe")}{field("teamTitle", "Titre de l’équipe")}{field("partnersEyebrow", "Accroche des partenaires")}{field("partnersTitle", "Titre des partenaires")}</div>;
      case "method":
        return <>
          <div className="home-content-fields-grid">{field("methodEyebrow", "Accroche")}{field("methodTitle", "Titre")}{field("methodLead", "Présentation", true)}</div>
          <TextRowsEditor id="bureau-stage" title="Étapes" rows={draft.stages} labels={["Titre", "Description"]} maxRows={12} onChange={(row, key, value) => updateRows("stages", row, key, value)} onAdd={() => setDraft((current) => current ? { ...current, stages: [...current.stages, { title: "", description: "" }] } : current)} onRemove={(row) => setDraft((current) => current ? { ...current, stages: current.stages.filter((_, index) => index !== row) } : current)} />
        </>;
      case "values":
        return <><div className="home-content-fields-grid">{field("valuesTitle", "Titre de section")}</div><TextRowsEditor id="bureau-value" title="Engagements" rows={draft.values} labels={["Titre", "Description"]} maxRows={12} onChange={(row, key, value) => updateRows("values", row, key, value)} onAdd={() => setDraft((current) => current ? { ...current, values: [...current.values, { title: "", description: "" }] } : current)} onRemove={(row) => setDraft((current) => current ? { ...current, values: current.values.filter((_, index) => index !== row) } : current)} /></>;
    }
  }

  return (
    <main className="admin-content-manager home-content-manager bureau-content-manager">
      <header className="home-content-header">
        <div>
          <p className="admin-eyebrow">CONTENUS / LE BUREAU</p>
          <h1>Page du bureau</h1>
          <p>Prévisualisez et modifiez les sections de la page, l’équipe et les partenaires au même endroit.</p>
        </div>
        <div className="editor-language-switch" role="group" aria-label="Langue du contenu">
          <span>Langue</span>
          <div>
            {locales.map((value) => <button key={value} className="editor-language-button" type="button" aria-pressed={locale === value} disabled={editing !== null} onClick={() => { setLocale(value); setStatus(""); }}>{localeLabels[value]}</button>)}
          </div>
        </div>
      </header>

      <nav className="bureau-manager-nav" aria-label="Accès rapide aux sections">
        <a href="#bureau-page-content">Contenu de la page</a>
        <a href="#bureau-team">Équipe</a>
        <a href="#bureau-partners">Partenaires</a>
      </nav>
      <p className="home-content-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>

      <div className="home-content-sections" id="bureau-page-content">
        {sections.map(({ id, label }, index) => (
          <article className="home-content-card" key={id}>
            <header className="home-content-card-header">
              <div><p className="admin-eyebrow">SECTION {String(index + 1).padStart(2, "0")}</p><h2>{label}</h2></div>
              <button className="admin-action" type="button" id={`bureau-edit-${id}`} aria-expanded={editing === id} aria-label={`Modifier la section ${label}`} disabled={editing !== null || saving} onClick={() => startEditing(id)}>Modifier</button>
            </header>
            <section className="home-content-preview" aria-label={`Aperçu : ${label}`}>
              <p className="home-content-preview-label">Aperçu publié · {localeLabels[locale]}</p>
              {renderPreview(id)}
            </section>
            {editing === id && (
              <form className="home-content-editor" onSubmit={saveEditor}>
                <div className="home-content-editor-heading"><h3>Modifier cette section</h3><p>Les changements seront publiés dès leur enregistrement.</p></div>
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

      <TeamManager embedded initialMembers={initialMembers} />
      <PartnersManager embedded initialPartners={initialPartners} />
    </main>
  );
}
