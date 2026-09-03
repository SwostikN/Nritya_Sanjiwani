import Marquee from "@/components/Marquee";
import Frame from "@/components/Frame";
import Stats from "@/components/Stats";
import Wave from "@/components/Wave";
import HeroMedia from "@/components/HeroMedia";
import { PartnerStrip } from "@/components/PartnerWall";
import { d } from "@/lib/util";
import { getContent, on } from "@/lib/content-db";

export default async function Home() {
  const { PILLARS, METHOD, STATS, PHASES, PARTNER_TYPES, TAKE_PART, REFLECTION, PARTNERS, STORIES,
          HOME_ABOUT: about, sections } = await getContent();
  const y0 = REFLECTION.years[0];
  return (
    <div className="page is-on" data-page="home">

      <section className="hero">
        <div className="hero__deva" aria-hidden="true">नृत्य</div>
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <h1 className="h-display hero__title rv" style={{ ...d(80), marginTop: ".08em" }}>
              <span className="mask"><span className="deva">नृत्य संजीवनी</span></span>
              <span className="mask"><span>Healing <span className="thru">through</span> Kathak</span></span>
            </h1>
            <div className="rule rule--gold rv" style={{ ...d(340), margin: ".85rem 0 .7rem", maxWidth: 120 }}></div>
            <p className="lede rv" style={{ ...d(400), maxWidth: "60ch" }}>
              A community-based initiative using dance, movement, art and storytelling
              to create spaces for emotional expression and well-being.
            </p>
            <div className="hero__cta rv" style={d(480)}>
              <button className="btn" data-go="program">Explore the Journey <span className="arw">→</span></button>
              <button className="btn btn--ghost" data-go="partner">Partner With Us</button>
            </div>
            <div className="hero__meta rv" style={d(560)}>
              {/* <span>12–16 Weeks</span><i></i><span>Three Phases</span><i></i><span>One Performance</span> */}
            </div>
          </div>
          <div className="hero__media rv rv--s" style={d(200)}>
            <HeroMedia />
            <div className="hero__badge">
              <div><b>2027</b><span>February</span></div>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* belief */}
      <section className="sec">
        <div className="wrap narrow narrow--mid" style={{ textAlign: "center" }}>
          <div className="rv"><span className="eyebrow deva" style={{ justifyContent: "center" }}>विश्वास</span></div>
          <h2 className="h2 rv" style={{ ...d(80), margin: ".6em 0 1em" }}>What if everyone had a space to express?</h2>
          <p className="lede rv" style={d(160)}>
            Many communities have limited access to performing arts and creative well-being experiences.
          </p>
          <p className="lede rv" style={{ ...d(220), marginTop: "1.1em" }}>
            Nritya Sanjiwani brings these experiences directly into communities, using Kathak, movement,
            art and storytelling as pathways for expression, connection, and self-discovery.
          </p>
          <div className="rule rule--gold rv" style={{ ...d(300), margin: "3rem auto 2.4rem", maxWidth: 90 }}></div>
          <p className="pull rv" style={d(340)}>Art should not be a <em>privilege</em>.</p>
        </div>
      </section>

      {/* what it is — every line of this comes from Settings on the
          Landing page screen in the admin, so a blank one is a
          deliberate removal and leaves nothing behind. Without the
          picture the words take the whole column rather than half of
          an empty split. */}
      <section className="sec sec--surface">
        <div className={"wrap " + (about.img ? "split" : "narrow")}>
          {about.img ? (
            <div className="rv rv--l">
              <div className="frame r-4x5 frame--hover">
                <img loading="lazy" src={about.img} alt={about.alt} />
                {about.cap ? <div className="cap">{about.cap}</div> : null}
              </div>
            </div>
          ) : null}
          <div className="rv rv--r" style={d(100)}>
            {about.eyebrow ? <span className="eyebrow">{about.eyebrow}</span> : null}
            {about.title ? <h2 className="h2" style={{ margin: ".55em 0 .6em" }}>{about.title}</h2> : null}
            {about.body ? <p className="lede">{about.body}</p> : null}
            {PILLARS.length > 0 && (
              <div className="pills" id="pills">
                {PILLARS.map((p) => <span className="pill" key={p}>{p}</span>)}
              </div>
            )}
            {about.cta ? (
              <span className="tlink" data-go={about.go}>{about.cta} <span className="arw">→</span></span>
            ) : null}
          </div>
        </div>
      </section>

      {/* method */}
      <section className="sec">
        <div className="wrap">
          <div className="sec__head" style={{ maxWidth: 640 }}>
            <div className="rv"><span className="eyebrow deva">गति</span></div>
            <h2 className="h2 rv" style={d(80)}>The method moves in three</h2>
          </div>
          <Wave />
          <div className="method" id="method">
            {METHOD.map((m, i) => (
              <article className="mcard rv" style={d(i * 110)} key={m.n}>
                <div style={{ position: "relative" }}>
                  {/* the method card images are 16:11, overriding the frame default */}
                  <div className="frame frame--hover" style={{ aspectRatio: "16/11" }}>
                    <img loading="lazy" src={m.img} alt={m.alt} />
                  </div>
                  <span className="mcard__scrim"></span>
                  <span className="mcard__n">{m.n}</span>
                </div>
                <div className="mcard__b">
                  <div className="mcard__deva">{m.deva}</div>
                  <h3 className="h3">{m.title}</h3>
                  <p>{m.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* programme stats */}
      <section className="sec sec--deep">
        <div className="wrap">
          <div className="sec__head rv" style={{ marginBottom: 0 }}>
            <span className="eyebrow">The 2026–27 Program</span>
            <h2 className="h2" style={{ marginTop: ".5em" }}>Taking the arts where they are least accessible.</h2>
          </div>
          <div className="stats rv" style={d(120)} id="stats"><Stats items={STATS} /></div>
          <button className="btn btn--light rv" style={d(200)} data-go="program">Explore the 2026–27 Program <span className="arw">→</span></button>
        </div>
      </section>

      {/* phases */}
      <section className="sec">
        <div className="wrap">
          <div className="sec__head" style={{ maxWidth: 600 }}>
            <div className="rv"><span className="eyebrow">The Three Phases</span></div>
            <h2 className="h2 rv" style={d(80)}>From first step to shared stage</h2>
          </div>
          <div id="phases">
            {PHASES.map((p, i) => (
              <div className={"phase" + (i % 2 ? " phase--rev" : "")} key={p.tag}>
                <div className={"rv " + (i % 2 ? "rv--r" : "rv--l")}>
                  <Frame img={p.img} alt={p.alt} ratio="r-3x2" />
                </div>
                <div className={"rv " + (i % 2 ? "rv--l" : "rv--r")} style={d(100)}>
                  <div className="phase__tag">{p.tag}</div>
                  <div className="phase__deva">{p.deva}</div>
                  <h3 className="h2" style={{ fontSize: "clamp(1.7rem,3vw,2.6rem)", marginBottom: ".5em" }}>{p.title}</h3>
                  <p className="body-lg">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="pull rv" style={{ marginTop: "clamp(44px,5vw,72px)", textAlign: "center", maxWidth: "20ch", marginInline: "auto" }}>
            The stage is not the destination. It is the <em>celebration</em> of the journey.
          </p>
        </div>
      </section>

      {/* stories (consent-gated) — the pending slots stand in until
          a story with signed consent is added in the admin */}
      {on(sections, "home_stories") ? (
      <section className="sec sec--surface">
        <div className="wrap">
          <div className="sec__head">
            <div className="rv"><span className="eyebrow deva">कथाहरू</span></div>
            <h2 className="h2 rv" style={d(80)}>Every movement carries a story.</h2>
          </div>
          <div className="grid3" id="storySlots">
            {STORIES.length ? STORIES.map((s, i) => (
              <article className="card rv" style={d(i * 100)} key={i}>
                {s.deva ? <div className="card__deva">{s.deva}</div> : null}
                <p>&ldquo;{s.quote}&rdquo;</p>
                <div className="card__ask">
                  {s.name || "Anonymous"}{s.role ? `, ${s.role}` : ""}
                </div>
              </article>
            )) : [0, 1, 2].map((i) => (
              <div className="rv" style={d(i * 100)} key={i}>
                <div className="slot r-4x5">
                  <span className="slot__mark">कथा</span>
                  <span className="slot__t">Story pending</span>
                  <span className="slot__d">Published only with the participant&rsquo;s signed consent.</span>
                </div>
              </div>
            ))}
          </div>
          <div className="note rv" style={{ marginTop: "clamp(28px,3vw,42px)", maxWidth: "70ch" }}>
            <b>On consent</b>
            No quote, name or photograph is published here without signed consent from the participant.
            This section stays empty until that consent exists.
          </div>
        </div>
      </section>
      ) : null}

      {/* partners */}
      <section className="sec">
        <div className="wrap">
          <div className="sec__head" style={{ maxWidth: 620 }}>
            <div className="rv"><span className="eyebrow deva">सहयात्रा</span></div>
            <h2 className="h2 rv" style={d(80)}>Let&rsquo;s take the arts further.</h2>
          </div>
          <div className="grid3" id="partnerTypes">
            {PARTNER_TYPES.map((p, i) => (
              <article className="card rv" style={d(i * 100)} key={p.title}>
                <h3 className="h3">{p.title}</h3><p>{p.body}</p>
                <span className="tlink" data-go={p.go}>{p.cta} <span className="arw">→</span></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* take part */}
      <section className="sec sec--surface">
        <div className="wrap">
          <div className="sec__head">
            <div className="rv"><span className="eyebrow deva">सहभागी बन्नुहोस्</span></div>
            <h2 className="h2 rv" style={d(80)}>Ways to take part</h2>
            <p className="lede rv" style={{ ...d(140), marginTop: "1em" }}>
              The program is carried by people who give time. None of these roles require you to have
              danced before. Only one of them does.
            </p>
          </div>
          <div className="grid3" id="takePart">
            {TAKE_PART.map((t, i) => (
              <article className="card card--role rv" style={d(i * 90)} data-go="partner" key={t.role}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1em" }}>
                  <h3 className="h3">{t.role}</h3><span className="card__deva">{t.deva}</span>
                </div>
                <p>{t.body}</p><div className="card__ask">{t.ask}</div>
              </article>
            ))}
          </div>
          <div className="rv" style={{ marginTop: "clamp(30px,3.4vw,46px)" }}>
            <span className="tlink" data-go="partner">Tell us how you&rsquo;d like to help <span className="arw">→</span></span>
          </div>
        </div>
      </section>

      {/* our journey (teaser) */}
      {on(sections, "home_reflection") && y0 ? (
      <section className="sec">
        <div className="wrap">
          <div className="sec__head">
            <div className="rv"><span className="eyebrow deva">हाम्रो यात्रा</span></div>
            <h2 className="h2 rv" style={d(80)}>Before this, there was a year.</h2>
            <p className="lede rv" style={{ ...d(140), marginTop: ".9em" }}>
              The 2026–27 community program did not begin from nothing. It began in borrowed rooms,
              with a first group of people who showed us what the work actually needed to be.
            </p>
          </div>
          <div className="grid3" id="backHighlights">
            {(y0.events || []).slice(0, 3).map((e, i) => (
              <article className="card card--role rv" style={d(i * 100)} data-go="reflection" key={i}>
                <div className="phase__tag">{e.when}</div>
                <h3 className="h3">{e.title}</h3><p>{e.body}</p>
                <div className="card__ask">{e.where || y0.year}</div>
              </article>
            ))}
          </div>
          <div className="rv" style={{ ...d(280), marginTop: "clamp(30px,3.4vw,46px)" }}>
            <span className="tlink" data-go="reflection">Read the full reflection <span className="arw">→</span></span>
          </div>
        </div>
      </section>
      ) : null}

      {/* partners (quiet strip) */}
      {on(sections, "home_partners") ? (
      <section className="sec sec--surface sec--tight">
        <div className="wrap">
          <div className="rv" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "1.2em", marginBottom: "clamp(20px,2.4vw,30px)" }}>
            <span className="eyebrow eyebrow--label">In partnership with</span>
            <span className="tlink" data-go="partner">Walk with us <span className="arw">→</span></span>
          </div>
          <div className="rv" style={d(100)} id="partnerWallHome"><PartnerStrip partners={PARTNERS} /></div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
