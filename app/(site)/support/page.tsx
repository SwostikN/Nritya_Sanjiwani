import type { Metadata } from "next";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Support · Nritya Sanjiwani",
  description: "Funding is what puts a facilitator, a counsellor and a floor to dance on inside a community that has none of the three.",
};

export default async function Support() {
  const { SUPPORT_ITEMS, SUPPORT_MODELS } = await getContent();
  return (
    <div className="page is-on" data-page="support">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">सहयोग</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Your support creates access.</h1>
          <p className="lede rv" style={d(140)}>
            Funding is what puts a facilitator, a counsellor and a floor to dance on inside a community
            that has none of the three.
          </p>
        </div>
      </section>
      <section className="sec sec--surface">
        <div className="wrap">
          <div className="pills rv" id="supportItems" style={{ margin: "0 0 clamp(40px,4.5vw,64px)" }}>
            {SUPPORT_ITEMS.map((s) => <span className="pill" key={s}>{s}</span>)}
          </div>
          <h2 className="h2 rv" style={{ marginBottom: "clamp(30px,3.4vw,46px)" }}>Ways to support</h2>
          <div className="grid3" id="supportModels">
            {SUPPORT_MODELS.map((m, i) => (
              <article className="card rv" style={d((i % 3) * 90)} key={m.title}>
                <h3 className="h3">{m.title}</h3><p>{m.body}</p>
                <span className="tlink" data-go="contact">Start a conversation <span className="arw">→</span></span>
              </article>
            ))}
          </div>
          <p className="body-lg rv muted" style={{ marginTop: "2.4rem", fontSize: ".9rem" }}>
            Support levels are conversations, not fixed amounts. No payment is taken on this site.
          </p>
        </div>
      </section>
    </div>
  );
}
