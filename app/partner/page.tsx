import type { Metadata } from "next";
import PartnerForm from "@/components/forms/PartnerForm";
import { PartnerWallFull } from "@/components/PartnerWall";
import { PARTNER_TYPES, PARTNERS } from "@/lib/content";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Partner With Us · Nritya Sanjiwani",
  description: "Tell us about your community and what you would want this to look like. We reply to every enquiry within five working days.",
};

export default function Partner() {
  return (
    <div className="page is-on" data-page="partner">
      <section className="sec sec--tight">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="rv rv--l">
            <span className="eyebrow deva">सहकार्य</span>
            <h1 className="h1" style={{ margin: ".4em 0 .5em" }}>Partner With Us</h1>
            <p className="lede">
              Tell us about your community and what you would want this to look like.
              We reply to every enquiry within five working days.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem", marginTop: "2.6rem" }} id="partnerBrief">
              {PARTNER_TYPES.map((p) => (
                <div style={{ paddingLeft: "1.2rem", borderLeft: "2px solid var(--accent)" }} key={p.title}>
                  <div style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".3em" }}>{p.title}</div>
                  <div style={{ fontSize: ".9rem", color: "var(--body)", lineHeight: 1.6 }}>{p.body}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rv rv--r" style={d(120)}>
            <div id="partnerFormWrap"><PartnerForm /></div>
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
          <div className="rv" style={d(160)} id="partnerWallFull"><PartnerWallFull /></div>
          <p className="pnote rv" style={d(220)} id="partnerNote">{PARTNERS.note}</p>
        </div>
      </section>
    </div>
  );
}
