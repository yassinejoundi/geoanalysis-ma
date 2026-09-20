import Image from "next/image";
import Link from "next/link";
import { AdminSignInForm } from "@/components/(admin)/sign-in/admin-sign-in-form";

export const metadata = {
  title: "Connexion · GEOANALYSIS",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="admin-sign-in-page">
      <section className="admin-sign-in-panel" aria-labelledby="admin-sign-in-title">
        <div className="admin-sign-in-card">
          <p className="admin-eyebrow">Espace d’administration</p>
          <h1 id="admin-sign-in-title">Connexion</h1>
          <p className="admin-sign-in-intro">Accédez à votre espace de travail Geoanalysis.</p>
          <AdminSignInForm />
          <p className="admin-sign-in-note">Accès réservé aux comptes administrateurs autorisés.</p>
        </div>
        <Link className="admin-sign-in-back-link" href="/fr">
          Retour au site <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <aside className="admin-sign-in-visual" aria-label="GEOANALYSIS, géomatique et territoires">
        <Link className="admin-sign-in-brand" href="/fr" aria-label="GEOANALYSIS — Accueil du site">
          <Image src="/geoanalysis-logo.png" width={48} height={48} alt="" priority />
          <span>
            <span className="admin-sign-in-brand-name">GEO<span>ANALYSIS</span></span>
            <span className="admin-sign-in-brand-caption">Bureau d’études géomatiques</span>
          </span>
        </Link>
        <div className="admin-sign-in-story">
          <p className="admin-sign-in-kicker">Géomatique · Cartographie · Territoires</p>
          <p className="admin-sign-in-statement">Lire le territoire.<br />Éclairer l’action.</p>
          <p className="admin-sign-in-description">Pilotez les réalisations, expertises et publications de Geoanalysis depuis un espace unique.</p>
        </div>
        <div className="admin-sign-in-footer" aria-hidden="true">
          <span>Administration</span>
          <span>Maroc · FR</span>
        </div>
      </aside>
    </main>
  );
}
