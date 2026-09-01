import type { Metadata } from "next";
import Frame from "@/components/Frame";
import { JOURNAL } from "@/lib/content";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Journal · Nritya Sanjiwani",
  description: "Writing on Kathak, access, and what it means to give someone a language for feeling.",
};

export default function Journal() {
  return (
    <div className="page is-on" data-page="journal">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">पत्रिका</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Journal</h1>
          <p className="lede rv" style={d(140)}>
            Writing on Kathak, access, and what it means to give someone a language for feeling.
          </p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap" id="journal">
          {JOURNAL.map((j) => (
            <article className="jrow rv" key={j.title}>
              <div><Frame img={j.img} alt={j.alt} ratio="r-3x2" /></div>
              <div>
                <div className="jrow__meta">{j.meta}</div>
                <h2>{j.title}</h2>
                <p className="body-lg">{j.dek}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
