import type { Metadata } from "next";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "The Program · Nritya Sanjiwani",
  description: "Twelve to sixteen weeks, three phases, one collaborative performance, delivered inside the community.",
};

export default async function Program() {
  const { PROGRAM_BLOCKS } = await getContent();
  return (
    <div className="page is-on" data-page="program">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow">2026–27 Community Program</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>The Program</h1>
          <p className="lede rv" style={d(140)}>
            Twelve to sixteen weeks, three phases, one collaborative performance, delivered inside the
            community, not in a studio people have to travel to.
          </p>
        </div>
      </section>
      <div className="wrap rv rv--s">
        <div className="frame r-16x9 frame--hover">
          <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_003.jpg/1920px-Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_003.jpg"
               alt="Dancers in formation during a group Kathak performance." />
        </div>
      </div>
      <section className="sec">
        <div className="wrap">
          <div className="grid3" id="programBlocks">
            {PROGRAM_BLOCKS.map((b, i) => (
              <article className="card rv" style={d((i % 3) * 90)} key={b.title}>
                <div className="phase__tag">{b.tag}</div>
                <h3 className="h3">{b.title}</h3><p>{b.body}</p>
              </article>
            ))}
          </div>
          <div className="note rv" style={{ marginTop: "clamp(34px,4vw,54px)", maxWidth: "74ch" }}>
            <b>Please note</b>
            Nritya Sanjiwani is an arts-based emotional well-being initiative and does not replace
            professional mental-health treatment or clinical therapy. Professional counsellors are
            involved to support appropriate emotional well-being and guided reflection.
          </div>
          <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: "2.4rem" }}>
            {/* Applications are not open yet, so the invitation to apply is
                held back rather than deleted. Put this line back and it
                returns as the filled button, with Partner beside it in
                the outline style it had. */}
            {/* <button className="btn" data-go="apply">Apply to Participate <span className="arw">→</span></button> */}
            <button className="btn" data-go="partner">Partner With Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}
