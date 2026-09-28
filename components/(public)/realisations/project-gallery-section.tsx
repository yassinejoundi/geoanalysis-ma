import Image from "next/image";
import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ProjectImage } from "@/lib/content/projects";

export function ProjectGallerySection({
  gallery,
  title,
  copy,
}: {
  gallery: ProjectImage[];
  title: string;
  copy: { galleryKicker: string; galleryTitle: string; galleryImage: string };
}) {
  const images = gallery.filter((image): image is ProjectImage & { url: string } => Boolean(image.url));
  if (images.length === 0) return null;
  const cover = images.find((image) => image.isCover) ?? images[0];
  const remaining = images.filter((image) => image.id !== cover.id);

  return (
    <section className="project-gallery-section">
      <div className="project-detail-inner">
        <SectionHeading kicker={copy.galleryKicker} title={copy.galleryTitle} />
        <figure className="project-gallery-feature">
          <Image src={cover.url} alt={cover.caption ? "" : title} fill sizes="(max-width: 760px) 100vw, 1200px" />
          {cover.caption && <figcaption>{cover.caption}</figcaption>}
        </figure>
        {remaining.length > 0 && (
          <ul className="project-gallery-thumbnails">
            {remaining.map((image, index) => (
              <li key={image.id}>
                <figure>
                  <Image src={image.url} alt={image.caption ? "" : `${title} — ${index + 2}`} fill sizes="(max-width: 760px) 50vw, 25vw" />
                  <figcaption>{image.caption || `${copy.galleryImage} ${index + 2}`}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
