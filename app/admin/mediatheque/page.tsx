import { adminMedia } from "@/lib/content/admin";
export default function AdminMediaPage() {
  return (
    <main>
      <h1>Médiathèque</h1>
      <p>{adminMedia.length}</p>
    </main>
  );
}
