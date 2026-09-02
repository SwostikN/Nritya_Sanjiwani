import type { Metadata } from "next";
import Frame from "@/components/Frame";
import Stats from "@/components/Stats";
import { PartnerWallFull } from "@/components/PartnerWall";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Our Journey · Nritya Sanjiwani",
  description: "The record of the sessions, workshops and performances that came before the 2026–27 community program.",
};

export default async function Reflection() {
  const { REFLECTION, PARTNERS } = await getContent();
  return (
    <div className="page is-on" data-page="reflection">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">हाम्रो यात्रा</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Our Journey</h1>
          <p className="lede rv" style={d(140)} id="backLede">{REFLECTION.lede}</p>
          <div className="rv" style={{ ...d(200), marginTop: "clamp(26px,3vw,40px)" }}>
            <div className="note"><b>On what appears here</b><span id="backNote">{REFLECTION.note}</span></div>
          </div>
        </div>
      </section>

      <div className="wrap rv rv--s">
        <div className="frame r-16x9 frame--hover">
          <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/UNESCO_Kathmandu_Dissemination_Workshop_-_Nepal_01.jpg/1920px-UNESCO_Kathmandu_Dissemination_Workshop_-_Nepal_01.jpg"
               alt="People gathered around artwork during a community workshop in Kathmandu." />
          <div className="cap">A workshop session</div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap" id="backYears">
          {REFLECTION.years.map((y) => (
            <section className="ygroup" key={y.year}>
              <div className="yhead rv">
                <span className="yhead__y">{y.year}</span>
                {y.deva ? <span className="yhead__d deva">{y.deva}</span> : null}
              </div>
              {y.title ? (
                <h2 className="h2 rv" style={{ ...d(80), margin: ".7em 0 .5em", maxWidth: "20ch" }}>{y.title}</h2>
              ) : null}
              {y.summary ? (
                <p className="lede rv" style={{ ...d(130), maxWidth: "72ch" }}>{y.summary}</p>
              ) : null}
              {y.stats && y.stats.length ? (
                <div className="stats stats--auto rv" style={d(170)}><Stats items={y.stats} /></div>
              ) : null}

              <div className="tline">
                {(y.events || []).map((e, i) => (
                  <article className="tev rv" key={i}>
                    <span className="tev__dot"></span>
                    <div>
                      <div className="tev__when">{e.when}</div>
                      {e.where ? <div className="tev__where">{e.where}</div> : null}
                    </div>
                    <div>
                      {e.tag ? <span className="tev__tag">{e.tag}</span> : null}
                      <h3 className="h3">{e.title}</h3>
                      <p className="body-lg">{e.body}</p>
                      {e.img ? (
                        <div className="tev__media"><Frame img={e.img} alt={e.alt} ratio="r-3x2" /></div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              {y.learned && y.learned.length ? (
                <>
                  <h3 className="h3 rv" style={{ margin: "clamp(46px,5vw,74px) 0 1.4rem" }}>What the year taught us</h3>
                  <div className="grid2">
                    {y.learned.map((l, i) => (
                      <article className="card rv" style={d((i % 2) * 90)} key={l.n}>
                        <div className="phase__tag">{l.n}</div>
                        <h3 className="h3">{l.title}</h3><p>{l.body}</p>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ))}
        </div>
      </section>

      <section className="sec sec--surface">
        <div className="wrap">
          <div className="sec__head">
            <div className="rv"><span className="eyebrow deva">साथ</span></div>
            <h2 className="h2 rv" style={d(80)}>None of it happened alone.</h2>
            <p className="lede rv" style={{ ...d(140), marginTop: ".9em" }}>
              Every session above sat inside somebody else&rsquo;s room, schedule or trust.
            </p>
          </div>
          <div className="rv" style={d(160)} id="partnerWallBack"><PartnerWallFull partners={PARTNERS} /></div>
        </div>
      </section>

      <section className="sec sec--deep" style={{ textAlign: "center" }}>
        <div className="wrap narrow">
          <p className="pull rv">We keep the record so the next cohort inherits something.</p>
          <div className="rv" style={{ ...d(200), display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: "2.6rem" }}>
            <button className="btn btn--light" data-go="program">See the 2026–27 Program</button>
            <button className="btn btn--light" data-go="partner">Partner With Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}
