import Link from "next/link";
import { localizedHref, type Locale } from "@/lib/i18n";

export function ProjectContactSection({
  locale,
  title,
  lead,
  action,
}: {
  locale: Locale;
  title: string;
  lead: string;
  action: string;
}) {
  return (
    <section className="project-contact-section">
      <div className="project-contact-inner">
        <div>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        <Link
          className="project-contact-action"
          href={localizedHref(locale, "contact")}>
          {action}
        </Link>
      </div>
    </section>
  );
}
