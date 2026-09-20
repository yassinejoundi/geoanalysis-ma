export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <p className="page-hero-kicker">{kicker}</p>
        <h1>{title}</h1>
        {lead ? <p className="page-hero-lead">{lead}</p> : null}
      </div>
    </section>
  );
}
