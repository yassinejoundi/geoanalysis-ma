export function PageHero({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return <section className="page-hero"><div className="page-hero-inner"><p className="page-hero-kicker">{kicker}</p><h1>{title}</h1><p className="page-hero-lead">{lead}</p></div></section>;
}
