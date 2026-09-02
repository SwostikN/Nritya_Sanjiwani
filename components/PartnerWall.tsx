import type { PartnerItem, PartnersData } from "@/lib/content";

function Plogo({ p }: { p: PartnerItem }) {
  const inner = (
    <>
      {p.logo
        ? <img loading="lazy" src={p.logo} alt={p.name} />
        : <span className="plogo__n">{p.name}</span>}
      {p.role ? <span className="plogo__r">{p.role}</span> : null}
    </>
  );
  return p.url
    ? <a className="plogo" href={p.url} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div className="plogo">{inner}</div>;
}

function Popen({ text }: { text: string }) {
  return (
    <div className="popen" data-go="partner">
      <span className="deva">साथ</span>
      <span>{text} <b>start a conversation →</b></span>
    </div>
  );
}

/* the grouped wall — Partner page and Our Journey */
export function PartnerWallFull({ partners }: { partners: PartnersData }) {
  return (
    <>
      {partners.groups.map((g) => (
        <div className="pgroup" key={g.label}>
          <div className="pgroup__h"><b>{g.label}</b><i></i></div>
          {g.items.length
            ? <div className="plogos">{g.items.map((p, i) => <Plogo key={i} p={p} />)}</div>
            : <Popen text="This is open — if your organisation belongs here," />}
        </div>
      ))}
    </>
  );
}

/* the quiet home strip — every named partner, no group labels */
export function PartnerStrip({ partners }: { partners: PartnersData }) {
  const all = partners.groups.reduce<PartnerItem[]>((a, g) => a.concat(g.items), []);
  return all.length
    ? <div className="plogos">{all.map((p, i) => <Plogo key={i} p={p} />)}</div>
    : <Popen text="We are building this list — if your organisation belongs on it," />;
}
