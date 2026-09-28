import type { BureauContent } from "./content";

export function ValuesSection({
  content,
  title,
}: {
  content: BureauContent;
  title: string;
}) {
  return (
    <section className="firm-values" aria-labelledby="firm-values-title">
      <div className="firm-values-inner">
        <h2 id="firm-values-title">{title}</h2>
        <ul>
          {content.values.map((value, index) => (
            <li key={index}>
              <span className="firm-value-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
