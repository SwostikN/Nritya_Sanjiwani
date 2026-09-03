import type { Metadata } from "next";
import Frame from "@/components/Frame";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Our Team · Nritya Sanjiwani",
  description: "The artists, counsellors and organisers behind Nritya Sanjiwani.",
};

export default async function Team() {
  const { TEAM } = await getContent();
  return (
    <div className="page is-on" data-page="team">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">हाम्रो टोली</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Our Team</h1>
          <p className="lede rv" style={d(140)}>
            A small group: artists who teach, counsellors who hold the room, and the people who
            make the weeks actually happen.
          </p>
        </div>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: 0 }}>
        <div className="wrap" id="team">
          <div className="team">
            {TEAM.map((m, i) => (
              <article className="rv" style={d(i * 90)} key={m.name || `slot-${i}`}>
                {/* The same promise the People gallery makes: a face goes up
                    when the person has agreed to it, and a tile waits until then. */}
                {m.slot || !m.img ? (
                  <div className="slot r-4x5">
                    <span className="slot__mark">टोली</span>
                    <span className="slot__t">{m.role || "Team member"}</span>
                    <span className="slot__d">Introduced here once they have agreed to be named.</span>
                  </div>
                ) : (
                  <Frame img={m.img} alt={m.alt} ratio="r-4x5" />
                )}
                {m.name ? (
                  <div className="team__b">
                    {m.role ? <div className="team__r">{m.role}</div> : null}
                    <h2 className="h3 team__n">
                      {m.name}
                      {m.deva ? <span className="team__d deva">{m.deva}</span> : null}
                    </h2>
                    {m.bio ? <p className="team__x">{m.bio}</p> : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="rv" style={{ marginTop: "clamp(40px,4.4vw,68px)" }}>
            <div className="note">
              <b>On who appears here</b>
              Facilitators and counsellors are named with their consent. Participants are never
              listed on this page. Their work is theirs to attribute, on the Gallery and in
              performance, and only when they have asked for it.
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--deep" style={{ textAlign: "center" }}>
        <div className="wrap narrow narrow--mid">
          <p className="pull rv">The room only works because of who is standing in it.</p>
          <div className="rv" style={{ ...d(200), display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: "2.6rem" }}>
            <button className="btn btn--light" data-go="story">Read Our Story</button>
            <button className="btn btn--light" data-go="partner">Join Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}
