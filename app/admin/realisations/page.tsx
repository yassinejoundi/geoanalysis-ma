import { adminProjects } from "@/lib/content/admin";
export default function AdminProjectsPage() {
  return (
    <main>
      <h1>Réalisations</h1>
      <p>{adminProjects.length}</p>
    </main>
  );
}
