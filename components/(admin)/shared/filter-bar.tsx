type FilterBarOption = {
  id: string;
  label: string;
  count?: number;
};

type FilterBarProps = {
  label: string;
  heading: string;
  resultLabel: string;
  options: FilterBarOption[];
  selected: string;
  onSelect: (id: string) => void;
};

export function FilterBar({
  label,
  heading,
  resultLabel,
  options,
  selected,
  onSelect,
}: FilterBarProps) {
  return (
    <section className="admin-filter-panel" aria-label={label}>
      <div className="admin-filter-heading">
        <h2>{heading}</h2>
        <p>{resultLabel}</p>
      </div>
      <div className="admin-filter-chips" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            className="admin-filter-chip"
            key={option.id}
            type="button"
            aria-pressed={selected === option.id}
            onClick={() => onSelect(option.id)}
          >
            {option.label}{option.count === undefined ? "" : ` (${option.count})`}
          </button>
        ))}
      </div>
    </section>
  );
}
