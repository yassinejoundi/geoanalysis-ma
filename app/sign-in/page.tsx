import { AdminSignInForm } from "@/components/(admin)/sign-in/admin-sign-in-form";

export const metadata = {
  title: "Connexion · GEOANALYSIS",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="admin-sign-in-page">
      <section className="admin-sign-in-card" aria-labelledby="admin-sign-in-title">
        <p className="admin-eyebrow">GEOANALYSIS · ADMINISTRATION</p>
        <h1 id="admin-sign-in-title">Connexion</h1>
        <p>Connectez-vous avec votre compte administrateur.</p>
        <AdminSignInForm />
      </section>
    </main>
  );
}
