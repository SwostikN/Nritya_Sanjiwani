import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Frame from "@/components/Frame";
import Stats from "@/components/Stats";
import YearNav from "@/components/YearNav";
import { PartnerWallFull } from "@/components/PartnerWall";
import { getContent, journeyYears } from "@/lib/content-db";
import { d } from "@/lib/util";

/* Every year that exists is prerendered. `dynamicParams` is left at its
   default of true on purpose: a year added in the admin after a build
   is still served, rendered on demand, so the admin and the site do not
   have to be deployed in step. */
export async function generateStaticParams() {
  const content = await getContent();
  return journeyYears(content).map((year) => ({ year }));
}

const find = async (year: string) => {
  const content = await getContent();
  return { content, y: content.REFLECTION.years.find((r) => String(r.year) === decodeURIComponent(year)) };
};

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { y } = await find((await params).year);
  if (!y) return { title: "Not found · Nritya Sanjiwani" };
  return {
    title: `${y.year} · Our Journey · Nritya Sanjiwani`,
    description: y.summary?.slice(0, 180) ?? `The record of ${y.year} — the sessions, workshops and performances of the year.`,
  };
}

export default async function ReflectionYear({ params }: { params: Promise<{ year: string }> }) {
  const { content, y } = await find((await params).year);
  if (!y) notFound();
  const { REFLECTION, PARTNERS } = content;
  const years = journeyYears(content);

  return (
    <div className="page is-on" data-page="reflection">
      <section className="sec sec--tight">
        <div className="wrap">
          <YearNav page="reflection" years={years} current={String(y.year)} label="Our Journey" />
        </div>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: 0 }}>
        <div className="wrap narrow">
          {y.deva ? <div className="rv"><span className="eyebrow deva">{y.deva}</span></div> : null}
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .3em" }}>{y.year}</h1>
          {y.title ? (
            <p className="yhero__t rv" style={d(120)}>{y.title}</p>
          ) : null}
          {y.summary ? <p className="lede rv" style={{ ...d(170), marginTop: "1em" }}>{y.summary}</p> : null}
          {REFLECTION.note ? (
            <div className="rv" style={{ ...d(220), marginTop: "clamp(26px,3vw,40px)" }}>
              <div className="note"><b>On what appears here</b>{REFLECTION.note}</div>
            </div>
          ) : null}
        </div>
      </section>

      {y.stats && y.stats.length ? (
        <section className="sec sec--tight" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="stats stats--auto rv"><Stats items={y.stats} /></div>
          </div>
        </section>
      ) : null}

      {y.events && y.events.length ? (
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="tline">
              {y.events.map((e, i) => (
                <article className="tev rv" key={i}>
                  <span className="tev__dot"></span>
                  <div>
                    <div className="tev__when">{e.when}</div>
                    {e.where ? <div className="tev__where">{e.where}</div> : null}
                  </div>
                  <div>
                    {e.tag ? <span className="tev__tag">{e.tag}</span> : null}
                    <h2 className="h3">{e.title}</h2>
                    <p className="body-lg">{e.body}</p>
                    {e.img ? (
                      <div className="tev__media"><Frame img={e.img} alt={e.alt} ratio="r-3x2" /></div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {y.learned && y.learned.length ? (
        <section className="sec sec--surface">
          <div className="wrap">
            <h2 className="h2 rv" style={{ marginBottom: "1.6rem" }}>What the year taught us</h2>
            <div className="grid2">
              {y.learned.map((l, i) => (
                <article className="card rv" style={d((i % 2) * 90)} key={l.n}>
                  <div className="phase__tag">{l.n}</div>
                  <h3 className="h3">{l.title}</h3><p>{l.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="sec">
        <div className="wrap">
          <div className="sec__head">
            <div className="rv"><span className="eyebrow deva">साथ</span></div>
            <h2 className="h2 rv" style={d(80)}>None of it happened alone.</h2>
            <p className="lede rv" style={{ ...d(140), marginTop: ".9em" }}>
              Every session above sat inside somebody else&rsquo;s room, schedule or trust.
            </p>
          </div>
          <div className="rv" style={d(160)}><PartnerWallFull partners={PARTNERS} /></div>
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
