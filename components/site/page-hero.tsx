export function PageHero({
  kicker,
  title,
  lead,
  byline,
}: {
  kicker: string;
  title: string;
  lead?: string;
  byline?: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <p className="page-hero-kicker">{kicker}</p>
        <h1>{title}</h1>
        {lead ? <p className="page-hero-lead">{lead}</p> : null}
        {byline ? <p className="page-hero-byline">{byline}</p> : null}
      </div>
    </section>
  );
}
