import type { Metadata } from "next";
import PartnerForm from "@/components/forms/PartnerForm";
import { PartnerWallFull } from "@/components/PartnerWall";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Partner With Us · Nritya Sanjiwani",
  description: "Tell us about your community and what you would want this to look like, or ask us anything. We reply to every enquiry within five working days.",
};

export default async function Partner() {
  const { SITE, PARTNER_TYPES, PARTNERS, INTERESTS } = await getContent();
  /* the direct details, in the order someone reaches for them.
     A blank field drops its row rather than showing an empty one. */
  const reach = ([
    ["Email",    SITE.email ? <a href={`mailto:${SITE.email}`}>{SITE.email}</a> : null],
    ["Phone",    SITE.phone ? <a href={`tel:${SITE.phone.replace(/\s+/g, "")}`}>{SITE.phone}</a> : null],
    ["Based in", "Kathmandu, Nepal"],
    ["Follow",   Object.keys(SITE.social).length ? (
      <span className="reach__soc">
        {Object.entries(SITE.social).map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        ))}
      </span>
    ) : null],
  ] as [string, React.ReactNode][]).filter((r) => Boolean(r[1]));
  return (
    <div className="page is-on" data-page="partner">
      <section className="sec sec--tight">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="rv rv--l">
            <span className="eyebrow deva">सहकार्य</span>
            <h1 className="h1" style={{ margin: ".4em 0 .5em" }}>Partner With Us</h1>
            <p className="lede">
              Tell us about your community and what you would want this to look like,
              or ask us anything at all. We reply to every enquiry within five working days.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem", marginTop: "2.6rem" }} id="partnerBrief">
              {PARTNER_TYPES.map((p) => (
                <div style={{ paddingLeft: "1.2rem", borderLeft: "2px solid var(--accent)" }} key={p.title}>
                  <div style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".3em" }}>{p.title}</div>
                  <div style={{ fontSize: ".9rem", color: "var(--body)", lineHeight: 1.6 }}>{p.body}</div>
                </div>
              ))}
            </div>
            <div className="reach">
              <span className="eyebrow eyebrow--label">Or reach us directly</span>
              <dl className="reach__l">
                {reach.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          <div className="rv rv--r" style={d(120)}>
            <div id="partnerFormWrap"><PartnerForm interests={INTERESTS} /></div>
          </div>
        </div>
      </section>
      <section className="sec sec--surface">
        <div className="wrap">
          <div className="sec__head">
            <div className="rv"><span className="eyebrow deva">साथ</span></div>
            <h2 className="h2 rv" style={d(80)}>With gratitude</h2>
            <p className="lede rv" style={{ ...d(140), marginTop: ".9em" }} id="partnerWallLede">{PARTNERS.lede}</p>
          </div>
          <div className="rv" style={d(160)} id="partnerWallFull"><PartnerWallFull partners={PARTNERS} /></div>
          <p className="pnote rv" style={d(220)} id="partnerNote">{PARTNERS.note}</p>
        </div>
      </section>
    </div>
  );
}
