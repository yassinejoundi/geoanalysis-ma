"use client";

import { useState, type FormEvent } from "react";
import { contactPageCopy } from "./content";
import type { Locale } from "@/lib/i18n";

type ErrorField = "name" | "email" | "projectType" | "message";
type ContactErrors = Partial<Record<ErrorField, string>>;

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = contactPageCopy[locale];
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function clearError(field: ErrorField) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (submitting) return;
    const data = new FormData(form);
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const nextErrors: ContactErrors = {};

    if (!String(data.get("name") ?? "").trim())
      nextErrors.name = copy.errors.name;
    if (!String(data.get("email") ?? "").trim()) {
      nextErrors.email = copy.errors.emailRequired;
    } else if (emailInput.validity.typeMismatch) {
      nextErrors.email = copy.errors.emailInvalid;
    }
    if (!data.get("projectType"))
      nextErrors.projectType = copy.errors.projectType;
    if (!String(data.get("message") ?? "").trim())
      nextErrors.message = copy.errors.message;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = (Object.keys(nextErrors) as ErrorField[])[0];
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      setSubmitted(false);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!response.ok) {
        setSubmitError(response.status === 429 ? copy.rateLimitError : copy.sendError);
        return;
      }
      setSubmitted(true);
      form.reset();
    } catch {
      setSubmitError(copy.sendError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <label className="contact-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="contact-fields-grid">
        <label className="contact-field" htmlFor="contact-name">
          <span>
            {copy.name} <span aria-hidden="true">*</span>
          </span>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            inputMode="text"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={() => clearError("name")}
          />
          {errors.name ? (
            <span className="contact-field-error" id="contact-name-error">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="contact-field" htmlFor="contact-company">
          <span>
            {copy.company}{" "}
            <span className="contact-optional">{copy.optional}</span>
          </span>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            inputMode="text"
          />
        </label>
        <label className="contact-field" htmlFor="contact-email">
          <span>
            {copy.email} <span aria-hidden="true">*</span>
          </span>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={() => clearError("email")}
          />
          {errors.email ? (
            <span className="contact-field-error" id="contact-email-error">
              {errors.email}
            </span>
          ) : null}
        </label>
        <label className="contact-field" htmlFor="contact-phone">
          <span>
            {copy.phone}{" "}
            <span className="contact-optional">{copy.optional}</span>
          </span>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
      </div>

      <fieldset
        className="contact-project-types"
        aria-invalid={Boolean(errors.projectType)}
        aria-describedby={
          errors.projectType ? "contact-project-type-error" : undefined
        }>
        <legend>
          {copy.projectType} <span aria-hidden="true">*</span>
        </legend>
        <div className="contact-project-options">
          {copy.projectTypes.map((projectType) => (
            <label className="contact-project-option" key={projectType.value}>
              <input
                type="radio"
                name="projectType"
                value={projectType.value}
                autoComplete="off"
                required
                aria-describedby={
                  errors.projectType ? "contact-project-type-error" : undefined
                }
                onChange={() => clearError("projectType")}
              />
              <span>{projectType.label}</span>
            </label>
          ))}
        </div>
        {errors.projectType ? (
          <p className="contact-field-error" id="contact-project-type-error">
            {errors.projectType}
          </p>
        ) : null}
      </fieldset>

      <label
        className="contact-field contact-message-field"
        htmlFor="contact-message">
        <span>
          {copy.message} <span aria-hidden="true">*</span>
        </span>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          autoComplete="off"
          inputMode="text"
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          onChange={() => clearError("message")}
        />
        {errors.message ? (
          <span className="contact-field-error" id="contact-message-error">
            {errors.message}
          </span>
        ) : null}
      </label>

      <button className="contact-submit" type="submit" disabled={submitting}>
        {submitting ? (locale === "fr" ? "Envoi…" : "Sending…") : copy.send}
      </button>
      <p className="contact-demo-note">{copy.demoNote}</p>
      {submitError ? <p className="contact-field-error" role="alert">{submitError}</p> : null}
      {submitted ? (
        <p className="contact-success" role="status" aria-live="polite">
          {copy.success}
        </p>
      ) : null}
    </form>
  );
}
