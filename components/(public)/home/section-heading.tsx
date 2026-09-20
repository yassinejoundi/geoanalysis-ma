export function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div className="home-section-heading">
      <p className="home-kicker">{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}
