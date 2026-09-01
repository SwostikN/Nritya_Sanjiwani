import type { Metadata } from "next";
import { CHAPTERS } from "@/lib/content";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Our Story · Nritya Sanjiwani",
  description: "How a classical form became a way for people to say what they could not otherwise say.",
};

export default function Story() {
  return (
    <div className="page is-on" data-page="story">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">हाम्रो कथा</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Our Story</h1>
          <p className="lede rv" style={d(140)}>
            How a classical form became a way for people to say what they could not otherwise say.
          </p>
        </div>
      </section>
      <div className="wrap rv rv--s">
        <div className="frame r-16x9 frame--hover">
          <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_124.jpg/1920px-Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_124.jpg"
               alt="An ensemble of Kathak dancers performing together on an outdoor stage." />
          <div className="cap">An ensemble in performance</div>
        </div>
      </div>
      <section className="sec">
        <div className="wrap narrow" id="chapters">
          {CHAPTERS.map((c) => (
            <div className="chap rv" key={c.n}>
              <div className="chap__n">{c.n}</div>
              <div>
                <h2 className="h3" style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)" }}>{c.title}</h2>
                <p className="body-lg" style={{ marginTop: ".8em" }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
