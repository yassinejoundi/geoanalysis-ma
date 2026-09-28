import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import type { BureauContent } from "./content";
import type {
  PublicPartner,
  PublicTeamMember,
} from "@/lib/server/data/admin";
import styles from "./directory-sections.module.css";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("fr");
}

export function BureauDirectorySections({
  locale,
  content,
  team,
  partners,
}: {
  locale: Locale;
  content: BureauContent;
  team: PublicTeamMember[];
  partners: PublicPartner[];
}) {
  return (
    <>
      <section className={styles.about} id="firm-about" aria-labelledby="firm-about-title">
        <div className="firm-story-inner">
          <div className={styles.aboutGrid}>
            <header className="firm-story-heading">
              <p className="firm-story-eyebrow">{content.aboutEyebrow}</p>
              <h2 id="firm-about-title">{content.aboutTitle}</h2>
            </header>
            <div className={styles.aboutCopy}>
              <p>{content.aboutLead}</p>
              <p>{content.aboutDetail}</p>
              <p className={styles.location}>{content.aboutLocation}</p>
            </div>
          </div>
          <ul className={styles.aboutGallery} aria-label={content.aboutGalleryLabel}>
            {content.gallery.map((photo) => (
              <li key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  className={styles.aboutImage}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 0 && (
        <section className={styles.team} aria-labelledby="firm-team-title">
          <div className="firm-story-inner">
            <header className="firm-story-heading">
              <p className="firm-story-eyebrow">{content.teamEyebrow}</p>
              <h2 id="firm-team-title">{content.teamTitle}</h2>
            </header>
            <ul className={styles.teamList}>
              {team.map((member) => (
                <li className={styles.teamCard} key={member.id}>
                  <div className={styles.teamMeta}>
                    <span className={styles.teamOrder} aria-hidden="true">
                      {String(member.order).padStart(2, "0")}
                    </span>
                    <span className={styles.teamRule} aria-hidden="true" />
                  </div>
                  <div className={styles.teamProfile}>
                    <div className={styles.teamAvatar} aria-hidden="true">
                      {member.image ? (
                        <Image src={member.image} alt="" width={72} height={72} className={styles.teamPortrait} />
                      ) : initials(member.name)}
                    </div>
                    <div className={styles.teamIdentity}>
                      <h3>{member.name}</h3>
                    </div>
                  </div>
                  <p className={styles.teamRole}>{member.role[locale]}</p>
                  <p className={styles.teamBio}>{member.bio[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className={styles.partners} aria-labelledby="firm-partners-title">
          <div className="firm-story-inner">
            <header className="firm-story-heading">
              <p className="firm-story-eyebrow">{content.partnersEyebrow}</p>
              <h2 id="firm-partners-title">{content.partnersTitle}</h2>
            </header>
            <ul className={styles.partnerList}>
              {partners.map((partner) => (
                <li key={partner.id}>
                  <a className={styles.partnerLink} href={partner.url} target="_blank" rel="noopener noreferrer">
                    <span>{partner.name}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
