import type { Metadata } from "next";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Our Story · Nritya Sanjiwani",
  description: "How a classical form became a way for people to say what they could not otherwise say.",
};

export default async function Story() {
  const { CHAPTERS } = await getContent();
  return (
    <div className="page is-on" data-page="story">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">हाम्रो कथा</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Our Story</h1>
          <p className="lede rv" style={d(140)}>
            <strong>Nritya Sanjiwani</strong> began with a simple question: <em>What if Kathak
            could become a space for healing, expression, and connection?</em>
          </p>
          <p className="lede rv" style={{ ...d(200), marginTop: "1.1em" }}>
            Born from a personal journey of finding strength through Kathak, it began with an{" "}
            <strong>initiative from Aesthetic Dance Studio</strong> and grew into a community
            initiative combining <strong>Kathak, movement, counseling, and storytelling</strong>.
          </p>
          <p className="lede rv" style={{ ...d(260), marginTop: "1.1em" }}>
            In our first year, free sessions explored <strong>movement, rhythm, body awareness,
            emotional expression, storytelling, and guided counseling</strong>, bringing
            participants’ experiences together through a collective performance at{" "}
            <strong>Cultural Carnival 2025 at Patan Museum</strong>.
          </p>
          <p className="lede rv" style={{ ...d(320), marginTop: "1.1em" }}>
            The journey showed us how art can help people feel <strong>seen, heard, and
            connected</strong>. This year, we are taking that learning into communities with
            limited access to creative spaces, making <strong>Kathak and creative expression
            more accessible</strong>.
          </p>
          <p className="lede rv" style={{ ...d(380), marginTop: "1.1em" }}>
            <strong>From one dancer’s journey to a shared community movement, this is Nritya
            Sanjiwani.</strong>
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
