type StatCardProps = {
  label: string;
  value: number;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-topline">
        <h2>{label}</h2>
        <span className="stat-dot" aria-hidden="true" />
      </div>
      <div className="stat-value">{String(value).padStart(2, "0")}</div>
      <p>{detail}</p>
    </article>
  );
}
