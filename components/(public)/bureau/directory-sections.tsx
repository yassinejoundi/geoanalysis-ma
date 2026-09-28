import type { Locale } from "@/lib/i18n";
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
    location: "Marrakech · Morocco",
    teamEyebrow: "The people behind the studies",
    teamTitle: "Our team",
    partnersEyebrow: "A trusted network",
    partnersTitle: "Our partners",
  },
} as const;

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
                  <h3>{member.name}</h3>
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
                  <a className={styles.partnerLink} href={partner.url}>
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
