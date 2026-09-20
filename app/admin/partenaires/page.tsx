import { adminPartners } from "@/lib/content/admin";
export default function AdminPartnersPage() {
  return (
    <main>
      <h1>Partenaires</h1>
      <p>{adminPartners.length}</p>
    </main>
  );
}
