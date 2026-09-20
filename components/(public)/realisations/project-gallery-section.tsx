import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ProjectDetail } from "@/lib/content/project-details";
import { localize, type Locale } from "@/lib/i18n";

const galleryFrames = ["01", "02", "03", "04"];

export function ProjectGallerySection({
  detail,
  locale,
  copy,
}: {
  detail: ProjectDetail;
  locale: Locale;
  copy: { galleryKicker: string; galleryTitle: string; galleryImage: string };
}) {
  return (
    <section className="project-gallery-section">
      <div className="project-detail-inner">
        <SectionHeading kicker={copy.galleryKicker} title={copy.galleryTitle} />
        <div className="project-gallery-feature" aria-hidden="true">
          {localize(detail.imageLabel, locale)}
        </div>
        <ul className="project-gallery-thumbnails" aria-hidden="true">
          {galleryFrames.map((frame) => (
            <li key={frame}>{copy.galleryImage} {frame}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
