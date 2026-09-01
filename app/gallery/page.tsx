import type { Metadata } from "next";
import Frame from "@/components/Frame";
import { GALLERY } from "@/lib/content";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Gallery · Nritya Sanjiwani",
  description: "Movement, people, process. The Performance category opens after February 2027.",
};

export default function Gallery() {
  return (
    <div className="page is-on" data-page="gallery">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">दृश्य</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Gallery</h1>
          <p className="lede rv" style={d(140)}>
            Movement, people, process. The Performance category opens after February 2027.
          </p>
        </div>
      </section>
      <section className="sec sec--tight" style={{ paddingTop: 0 }}>
        <div className="wrap" id="gallery">
          {GALLERY.map((g) => (
            <section className="galgroup" key={g.title}>
              <div className="galgroup__h rv">
                <h2 className="h3">{g.title}</h2>
                <span className="deva" style={{ color: "var(--accent-2)" }}>{g.deva}</span>
              </div>
              <div className={"gal" + (g.cols === 2 ? " gal--2" : "")}>
                {g.items.map((it, i) => (
                  <div className="rv" style={d(i * 90)} key={i}>
                    {it.slot ? (
                      <div className="slot r-4x5">
                        <span className="slot__mark">मानिस</span>
                        <span className="slot__t">Portrait pending</span>
                        <span className="slot__d">Published only with the participant&rsquo;s signed consent.</span>
                      </div>
                    ) : (
                      <Frame img={it.img!} alt={it.alt} ratio={it.r} cap={it.cap} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
