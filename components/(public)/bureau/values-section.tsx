import { firmValues } from "@/lib/content/firm";
import { localize, type Locale } from "@/lib/i18n";

export function ValuesSection({ locale, title }: { locale: Locale; title: string }) {
  return <section className="firm-values" aria-labelledby="firm-values-title"><div className="firm-values-inner"><h2 id="firm-values-title">{title}</h2><ul>{firmValues.map((value) => <li key={value.number}><span className="firm-value-number">{value.number}</span><h3>{localize(value.title, locale)}</h3><p>{localize(value.description, locale)}</p></li>)}</ul></div></section>;
}
