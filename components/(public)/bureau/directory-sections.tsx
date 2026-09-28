import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import type {
  PublicPartner,
  PublicTeamMember,
} from "@/lib/server/data/admin";
import styles from "./directory-sections.module.css";

const copy = {
  fr: {
    aboutEyebrow: "À propos",
    aboutTitle: "Un bureau d’études entre terrain et décision",
    aboutLead:
      "Basé à Marrakech, GEOANALYSIS accompagne les projets en géologie, géophysique, hydrogéologie et environnement.",
    aboutDetail:
      "Les missions associent travail de terrain, études techniques et cartographie pour produire des livrables adaptés à chaque besoin.",
    aboutGalleryLabel: "L’équipe sur le terrain",
    location: "Marrakech · Maroc",
    teamEyebrow: "Les personnes derrière les études",
    teamTitle: "Notre équipe",
    partnersEyebrow: "Un réseau de confiance",
    partnersTitle: "Nos partenaires",
  },
  en: {
    aboutEyebrow: "About us",
    aboutTitle: "Grounded in the field. Focused on clear decisions.",
    aboutLead:
      "Based in Marrakech, GEOANALYSIS supports projects in geology, geophysics, hydrogeology and environmental studies.",
    aboutDetail:
      "Assignments bring together fieldwork, technical studies and mapping to deliver work suited to each project’s needs.",
    aboutGalleryLabel: "The team in the field",
    location: "Marrakech · Morocco",
    teamEyebrow: "The people behind the studies",
    teamTitle: "Our team",
    partnersEyebrow: "A trusted network",
    partnersTitle: "Our partners",
  },
} as const;

const aboutImages = [
  {
    src: "https://res.cloudinary.com/d7qa2cop/image/upload/v1790613173/geoanalysis-ma/bureau/about-team-geology-20260928.webp",
    alt: {
      fr: "Deux membres de l’équipe GEOANALYSIS en reconnaissance sur un site géologique.",
      en: "Two GEOANALYSIS team members surveying a geological site.",
    },
  },
  {
    src: "https://res.cloudinary.com/d7qa2cop/image/upload/v1790613179/geoanalysis-ma/bureau/about-team-geophysics-20260928.webp",
    alt: {
      fr: "Un membre de l’équipe consulte les mesures d’un appareil de terrain.",
      en: "A team member reviewing readings from field equipment.",
    },
  },
  {
    src: "https://res.cloudinary.com/d7qa2cop/image/upload/v1790613378/geoanalysis-ma/bureau/about-team-water-20260928.webp",
    alt: {
      fr: "Un membre de l’équipe inspecte un puits sur le terrain.",
      en: "A team member inspecting a well in the field.",
    },
  },
] as const;

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("fr");
}

export function BureauDirectorySections({
  locale,
  team,
  partners,
}: {
  locale: Locale;
  team: PublicTeamMember[];
  partners: PublicPartner[];
}) {
  const text = copy[locale];

  return (
    <>
      <section className={styles.about} id="firm-about" aria-labelledby="firm-about-title">
        <div className="firm-story-inner">
          <div className={styles.aboutGrid}>
            <header className="firm-story-heading">
              <p className="firm-story-eyebrow">{text.aboutEyebrow}</p>
              <h2 id="firm-about-title">{text.aboutTitle}</h2>
            </header>
            <div className={styles.aboutCopy}>
              <p>{text.aboutLead}</p>
              <p>{text.aboutDetail}</p>
              <p className={styles.location}>{text.location}</p>
            </div>
          </div>
          <ul className={styles.aboutGallery} aria-label={text.aboutGalleryLabel}>
            {aboutImages.map((photo) => (
              <li key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt[locale]}
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
              <p className="firm-story-eyebrow">{text.teamEyebrow}</p>
              <h2 id="firm-team-title">{text.teamTitle}</h2>
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
              <p className="firm-story-eyebrow">{text.partnersEyebrow}</p>
              <h2 id="firm-partners-title">{text.partnersTitle}</h2>
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
