"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImageUploadField, type UploadedImage } from "@/components/(admin)/shared/image-upload-field";
import type { HomeContent, HomeExpertiseCard } from "@/components/(public)/home/content";
import { sendApiMutation } from "@/lib/api-client";
import { locales, type Locale } from "@/lib/i18n";

type Section = "hero" | "expertise" | "about" | "process" | "methods" | "projects" | "editorial";
type TextKey = Exclude<keyof HomeContent, "pillars" | "steps" | "methodItems" | "expertiseCards">;

const sections: { id: Section; label: string }[] = [
  { id: "hero", label: "En-tête et référencement" },
  { id: "expertise", label: "Expertises" },
  { id: "about", label: "Présentation" },
  { id: "process", label: "Méthode" },
  { id: "methods", label: "Prestations" },
  { id: "projects", label: "Réalisations" },
  { id: "editorial", label: "Actualités et articles" },
];

const localeLabels: Record<Locale, string> = { fr: "Français", en: "English" };

function cloneContent(content: HomeContent): HomeContent {
  return {
    ...content,
    pillars: content.pillars.map((row) => [...row] as [string, string]),
    steps: content.steps.map((row) => [...row] as [string, string, string]),
    methodItems: content.methodItems.map((row) => [...row] as [string, string]),
    expertiseCards: content.expertiseCards.map((card) => ({ ...card, tags: [...card.tags] as [string, string, string] })),
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
        <textarea id={id} value={value} maxLength={maxLength} rows={3} onChange={(event) => onChange(event.currentTarget.value)} />
      ) : (
        <input id={id} type="text" value={value} maxLength={maxLength} onChange={(event) => onChange(event.currentTarget.value)} />
      )}
    </label>
  );
}

function EditableRow({
  id,
  title,
  labels,
  values,
  onChange,
  onRemove,
  canRemove = true,
}: {
  id: string;
  title: string;
  labels: string[];
  values: string[];
  onChange: (field: number, value: string) => void;
  onRemove: () => void;
  canRemove?: boolean;
}) {
  return (
    <fieldset className="home-content-row">
      <legend>{title}</legend>
      <div className="home-content-row-fields">
        {values.map((value, field) => {
          const fieldId = `${id}-${field}`;
          return (
            <TextField
              key={fieldId}
              id={fieldId}
              label={labels[field]}
              value={value}
              multiline={field === labels.length - 1 && labels.length > 2}
              onChange={(nextValue) => onChange(field, nextValue)}
            />
          );
        })}
      </div>
      <button className="admin-action admin-action-danger" type="button" aria-label={`Retirer ${title.toLocaleLowerCase("fr")}`} disabled={!canRemove} onClick={onRemove}>
        Retirer
      </button>
    </fieldset>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="home-content-preview-line">
      <span>{label}</span>
      {value || <em>Non renseigné</em>}
    </p>
  );
}

export function HomeContentManager({ initialContent }: { initialContent: Record<Locale, HomeContent> }) {
  const [contentByLocale, setContentByLocale] = useState(initialContent);
  const [locale, setLocale] = useState<Locale>("fr");
  const [editing, setEditing] = useState<Section | null>(null);
  const [draft, setDraft] = useState<HomeContent | null>(null);
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
      const firstFields: Record<Section, string> = {
        hero: "title",
        expertise: "expertise",
        about: "aboutKicker",
        process: "methodKicker",
        methods: "methods",
        projects: "projects",
        editorial: "editorialKicker",
      };
      document.getElementById(`home-${editing}-${firstFields[editing]}`)?.focus();
      focusAfterOpen.current = null;
    } else if (!editing && !saving && focusAfterClose.current) {
      document.getElementById(`home-edit-${focusAfterClose.current}`)?.focus();
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
    setUploading(false);
  }

  function updateText(field: TextKey, value: string) {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  }

  function updatePillar(index: number, field: number, value: string) {
    setDraft((current) => current ? {
      ...current,
      pillars: current.pillars.map((row, rowIndex) => rowIndex === index
        ? row.map((cell, cellIndex) => cellIndex === field ? value : cell) as [string, string]
        : row),
    } : current);
  }

  function updateStep(index: number, field: number, value: string) {
    setDraft((current) => current ? {
      ...current,
      steps: current.steps.map((row, rowIndex) => rowIndex === index
        ? row.map((cell, cellIndex) => cellIndex === field ? value : cell) as [string, string, string]
        : row),
    } : current);
  }

  function updateMethodItem(index: number, field: number, value: string) {
    setDraft((current) => current ? {
      ...current,
      methodItems: current.methodItems.map((row, rowIndex) => rowIndex === index
        ? row.map((cell, cellIndex) => cellIndex === field ? value : cell) as [string, string]
        : row),
    } : current);
  }

  function updateExpertiseCard(index: number, field: Exclude<keyof HomeExpertiseCard, "id" | "tags">, value: string) {
    setDraft((current) => current ? {
      ...current,
      expertiseCards: current.expertiseCards.map((card, cardIndex) => cardIndex === index ? { ...card, [field]: value } : card),
    } : current);
  }

  function updateExpertiseTag(index: number, tagIndex: number, value: string) {
    setDraft((current) => current ? {
      ...current,
      expertiseCards: current.expertiseCards.map((card, cardIndex) => cardIndex === index
        ? { ...card, tags: card.tags.map((tag, itemIndex) => itemIndex === tagIndex ? value : tag) as [string, string, string] }
        : card),
    } : current);
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !editing || saveLock.current || uploading) return;
    saveLock.current = true;
    setSaving(true);
    setError("");

    void sendApiMutation<HomeContent>(`/api/admin/home/${locale}`, "PATCH", { content: draft })
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

  function imageUploaded(image: UploadedImage) {
    updateText("aboutImage", image.url);
  }

  function renderPreview(section: Section) {
    switch (section) {
      case "hero":
        return (
          <>
            <p className="home-content-kicker">{content.kicker}</p>
            <h3>{content.hero}</h3>
            <p className="home-content-subtitle">{content.sub}</p>
            <p>{content.intro}</p>
            <div className="home-content-preview-actions"><span>{content.expertiseCta}</span><span>{content.talk}</span></div>
            <ul className="home-content-preview-list">
              {content.pillars.map(([title, description], index) => <li key={index}><strong>{title}</strong><span>{description}</span></li>)}
            </ul>
            <PreviewLine label="Titre SEO" value={content.title} />
            <PreviewLine label="Description SEO" value={content.description} />
          </>
        );
      case "expertise":
        return <>
          <p className="home-content-kicker">{content.expertise}</p>
          <h3>{content.expTitle}</h3>
          <p>{content.expDesc}</p>
          <div className="home-content-expertise-preview">
            {content.expertiseCards.map((card, index) => (
              <article className="home-content-expertise-preview-card" key={card.id}>
                <Image src={card.image} alt="" width={92} height={76} unoptimized />
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{card.name}</strong>
                  <p>{card.summary}</p>
                  <small>{card.tags.join(" · ")}</small>
                </div>
              </article>
            ))}
          </div>
        </>;
      case "about":
        return (
          <div className="home-content-about-preview">
            <Image className="home-content-preview-image" src={content.aboutImage} alt={content.aboutImageAlt} width={300} height={180} unoptimized />
            <div>
              <p className="home-content-kicker">{content.aboutKicker}</p>
              <h3>{content.aboutTitle}</h3>
              <p>{content.about}</p>
              <p>{content.about2}</p>
              <PreviewLine label="Lien" value={content.discover} />
              <PreviewLine label="Texte alternatif" value={content.aboutImageAlt} />
              <PreviewLine label="Légende" value={content.aboutImageCaption} />
              <PreviewLine label="Lieu" value={content.aboutImageLocation} />
            </div>
          </div>
        );
      case "process":
        return <><p className="home-content-kicker">{content.methodKicker}</p><h3>{content.methodTitle}</h3><ol className="home-content-preview-list">{content.steps.map(([number, title, description], index) => <li key={index}><strong>{number} · {title}</strong><span>{description}</span></li>)}</ol></>;
      case "methods":
        return <><p className="home-content-kicker">{content.methods}</p><h3>{content.methodsTitle}</h3><ol className="home-content-preview-list">{content.methodItems.map(([name, category], index) => <li key={index}><strong>{name}</strong><span>{category}</span></li>)}</ol><PreviewLine label="Lien" value={content.methodsLink} /></>;
      case "projects":
        return <><p className="home-content-kicker">{content.projects}</p><h3>{content.projectsTitle}</h3><PreviewLine label="Lien" value={content.projectsLink} /><PreviewLine label="Légende des visuels" value={content.projectImage} /></>;
      case "editorial":
        return <><p className="home-content-kicker">{content.editorialKicker}</p><h3>{content.editorialTitle}</h3><PreviewLine label="Accroche actualités" value={content.newsKicker} /><PreviewLine label="Accroche articles" value={content.articlesKicker} /><div className="home-content-preview-actions"><span>{content.news}</span><span>{content.articles}</span></div><PreviewLine label="Lien actualités" value={content.allNews} /><PreviewLine label="Lien articles" value={content.allArticles} /><PreviewLine label="Temps de lecture" value={content.read} /><PreviewLine label="Lieu" value={content.editorialLocation} /></>;
    }
  }

  function renderEditor(section: Section) {
    if (!draft) return null;
    const field = (key: TextKey, label: string, multiline = false) => (
      <TextField
        key={key}
        id={`home-${section}-${key}`}
        label={label}
        value={draft[key]}
        multiline={multiline}
        maxLength={key === "title" ? 160 : key === "description" ? 320 : key === "aboutImageAlt" ? 250 : 2000}
        onChange={(value) => updateText(key, value)}
      />
    );

    switch (section) {
      case "hero":
        return <>
          <div className="home-content-fields-grid">
            {field("title", "Titre SEO")}
            {field("kicker", "Accroche courte")}
            {field("hero", "Titre principal")}
            {field("sub", "Sous-titre")}
            {field("expertiseCta", "Lien vers les expertises")}
            {field("talk", "Lien vers le contact")}
            {field("description", "Description SEO", true)}
            {field("intro", "Texte d’introduction", true)}
          </div>
          <div className="home-content-list-editor">
            <div className="home-content-editor-heading"><h3>Domaines d’intervention</h3><p>Affichés sous le titre principal.</p></div>
            {draft.pillars.map((row, index) => (
              <EditableRow
                key={`pillar-${index}`}
                id={`home-pillar-${index}`}
                title={`Axe ${index + 1}`}
                labels={["Titre", "Description"]}
                values={row}
                canRemove={draft.pillars.length > 1}
                onChange={(fieldIndex, value) => updatePillar(index, fieldIndex, value)}
                onRemove={() => {
                  focusAfterListChange.current = `home-pillar-${index < draft.pillars.length - 1 ? index : index - 1}-0`;
                  setDraft((current) => current && current.pillars.length > 1
                    ? { ...current, pillars: current.pillars.filter((_, rowIndex) => rowIndex !== index) }
                    : current);
                }}
              />
            ))}
            <button className="admin-action" type="button" disabled={draft.pillars.length >= 8} onClick={() => setDraft((current) => current && current.pillars.length < 8 ? { ...current, pillars: [...current.pillars, ["", ""] as [string, string]] } : current)}>Ajouter un axe</button>
          </div>
        </>;
      case "expertise":
        return <>
          <div className="home-content-fields-grid">{field("expertise", "Titre de section")}{field("expTitle", "Titre", true)}{field("expDesc", "Description", true)}</div>
          <div className="home-content-list-editor">
            <div className="home-content-editor-heading"><h3>Cartes « Nos expertises »</h3><p>Modifiez les textes, les visuels et les prestations affichés sur la page d’accueil.</p></div>
            {draft.expertiseCards.map((card, index) => (
              <fieldset className="home-content-row" key={card.id}>
                <legend>{`Carte ${index + 1} · ${card.name}`}</legend>
                <div className="home-content-fields-grid">
                  <TextField id={`home-expertise-${card.id}-name`} label="Titre de la carte" value={card.name} maxLength={160} onChange={(value) => updateExpertiseCard(index, "name", value)} />
                  <TextField id={`home-expertise-${card.id}-summary`} label="Description courte" value={card.summary} multiline maxLength={700} onChange={(value) => updateExpertiseCard(index, "summary", value)} />
                </div>
                <ImageUploadField
                  id={`home-expertise-${card.id}-image`}
                  label={`Image de la carte ${index + 1}`}
                  value={card.image}
                  uploadFolder="expertises"
                  onUploaded={(image) => updateExpertiseCard(index, "image", image.url)}
                  onBusyChange={setUploading}
                />
                <div className="home-content-fields-grid">
                  <TextField id={`home-expertise-${card.id}-alt`} label="Texte alternatif de l’image" value={card.imageAlt} maxLength={250} onChange={(value) => updateExpertiseCard(index, "imageAlt", value)} />
                  {card.tags.map((tag, tagIndex) => (
                    <TextField key={tagIndex} id={`home-expertise-${card.id}-tag-${tagIndex}`} label={`Prestation ${tagIndex + 1}`} value={tag} maxLength={120} onChange={(value) => updateExpertiseTag(index, tagIndex, value)} />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </>;
      case "about":
        return <>
          <div className="home-content-fields-grid">{field("aboutKicker", "Accroche")}{field("aboutTitle", "Titre", true)}{field("about", "Texte principal", true)}{field("about2", "Texte complémentaire", true)}{field("discover", "Lien vers le bureau")}</div>
          <ImageUploadField
            id={`home-about-image-${locale}`}
            label="Image de la section"
            value={draft.aboutImage}
            uploadFolder="accueil"
            onUploaded={imageUploaded}
            onBusyChange={setUploading}
          />
          <div className="home-content-fields-grid">{field("aboutImageAlt", "Texte alternatif", true)}{field("aboutImageCaption", "Légende de l’image")}{field("aboutImageLocation", "Lieu affiché")}</div>
        </>;
      case "process":
        return <>
          <div className="home-content-fields-grid">{field("methodKicker", "Accroche")}{field("methodTitle", "Titre", true)}</div>
          <div className="home-content-list-editor">
            <div className="home-content-editor-heading"><h3>Étapes</h3><p>Le numéro et les deux textes apparaissent dans la page.</p></div>
            {draft.steps.map((row, index) => (
              <EditableRow
                key={`step-${index}`}
                id={`home-step-${index}`}
                title={`Étape ${index + 1}`}
                labels={["Numéro", "Titre", "Description"]}
                values={row}
                canRemove={draft.steps.length > 1}
                onChange={(fieldIndex, value) => updateStep(index, fieldIndex, value)}
                onRemove={() => {
                  focusAfterListChange.current = `home-step-${index < draft.steps.length - 1 ? index : index - 1}-0`;
                  setDraft((current) => current && current.steps.length > 1
                    ? { ...current, steps: current.steps.filter((_, rowIndex) => rowIndex !== index) }
                    : current);
                }}
              />
            ))}
            <button className="admin-action" type="button" disabled={draft.steps.length >= 12} onClick={() => setDraft((current) => current && current.steps.length < 12 ? { ...current, steps: [...current.steps, [String(current.steps.length + 1).padStart(2, "0"), "", ""] as [string, string, string]] } : current)}>Ajouter une étape</button>
          </div>
        </>;
      case "methods":
        return <>
          <div className="home-content-fields-grid">{field("methods", "Titre de section")}{field("methodsTitle", "Titre", true)}{field("methodsLink", "Lien vers les prestations")}</div>
          <div className="home-content-list-editor">
            <div className="home-content-editor-heading"><h3>Prestations mises en avant</h3><p>Ces lignes apparaissent dans la grille de la page d’accueil.</p></div>
            {draft.methodItems.map((row, index) => (
              <EditableRow
                key={`method-${index}`}
                id={`home-method-${index}`}
                title={`Prestation ${index + 1}`}
                labels={["Prestation", "Famille"]}
                values={row}
                canRemove={draft.methodItems.length > 1}
                onChange={(fieldIndex, value) => updateMethodItem(index, fieldIndex, value)}
                onRemove={() => {
                  focusAfterListChange.current = `home-method-${index < draft.methodItems.length - 1 ? index : index - 1}-0`;
                  setDraft((current) => current && current.methodItems.length > 1
                    ? { ...current, methodItems: current.methodItems.filter((_, rowIndex) => rowIndex !== index) }
                    : current);
                }}
              />
            ))}
            <button className="admin-action" type="button" disabled={draft.methodItems.length >= 12} onClick={() => setDraft((current) => current && current.methodItems.length < 12 ? { ...current, methodItems: [...current.methodItems, ["", ""] as [string, string]] } : current)}>Ajouter une prestation</button>
          </div>
        </>;
      case "projects":
        return <div className="home-content-fields-grid">{field("projects", "Titre de section")}{field("projectsTitle", "Titre", true)}{field("projectsLink", "Lien vers les réalisations")}{field("projectImage", "Légende des visuels")}</div>;
      case "editorial":
        return <div className="home-content-fields-grid">{field("editorialKicker", "Accroche")}{field("editorialTitle", "Titre", true)}{field("newsKicker", "Accroche actualités")}{field("articlesKicker", "Accroche articles")}{field("news", "Titre actualités")}{field("articles", "Titre articles")}{field("allNews", "Lien vers les actualités")}{field("allArticles", "Lien vers les articles")}{field("read", "Libellé du temps de lecture")}{field("editorialLocation", "Lieu affiché")}</div>;
    }
  }

  return (
    <main className="admin-content-manager home-content-manager">
      <header className="home-content-header">
        <div>
          <p className="admin-eyebrow">CONTENUS / PAGE D’ACCUEIL</p>
          <h1>Page d’accueil</h1>
          <p>Prévisualisez chaque section, puis modifiez son contenu publié.</p>
        </div>
        <div className="editor-language-switch" role="group" aria-label="Langue du contenu">
          <span>Langue</span>
          <div>
            {locales.map((value) => (
              <button
                key={value}
                className="editor-language-button"
                type="button"
                aria-pressed={locale === value}
                disabled={editing !== null}
                onClick={() => { setLocale(value); setStatus(""); }}
              >
                {localeLabels[value]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <p className="home-content-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>

      <div className="home-content-sections">
        {sections.map(({ id, label }, index) => (
          <article className="home-content-card" key={id}>
            <header className="home-content-card-header">
              <div><p className="admin-eyebrow">SECTION {String(index + 1).padStart(2, "0")}</p><h2>{label}</h2></div>
              <button
                className="admin-action"
                type="button"
                id={`home-edit-${id}`}
                aria-expanded={editing === id}
                aria-label={`Modifier la section ${label}`}
                disabled={editing !== null || saving}
                onClick={() => startEditing(id)}
              >
                Modifier
              </button>
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
                  <button className="admin-action admin-action-primary" type="submit" disabled={saving || uploading}>
                    {saving ? "Enregistrement…" : uploading ? "Envoi de l’image…" : "Enregistrer"}
                  </button>
                </div>
              </form>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
