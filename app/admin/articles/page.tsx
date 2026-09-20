import { adminArticles } from "@/lib/content/admin";
export default function AdminArticlesPage() {
  return (
    <main>
      <h1>Articles</h1>
      <p>{adminArticles.length}</p>
    </main>
  );
}
