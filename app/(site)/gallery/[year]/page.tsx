import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Frame from "@/components/Frame";
import YearNav from "@/components/YearNav";
import { getContent, galleryYears } from "@/lib/content-db";
import type { GalleryItem } from "@/lib/content";
import { d } from "@/lib/util";

/* Every year that exists is prerendered; `dynamicParams` stays at its
   default of true so a year added in the admin after a build is still
   served, rendered on demand. */
export async function generateStaticParams() {
  const content = await getContent();
  return galleryYears(content).map((year) => ({ year }));
}

const find = async (year: string) => {
  const content = await getContent();
  return { content, y: content.GALLERY.find((g) => String(g.year) === decodeURIComponent(year)) };
};

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { y } = await find((await params).year);
  if (!y) return { title: "Not found · Nritya Sanjiwani" };
  return {
    title: `${y.year} · Gallery · Nritya Sanjiwani`,
    description: y.summary?.slice(0, 180) ?? `Photographs from ${y.year} — movement, people and process.`,
  };
}

/* Pictures in the order the admin put them, gathered under whatever
   sub-heading they were given. A year where nobody filled the field in
   comes back as a single unnamed run, which is the plain grid. */
function runs(items: GalleryItem[]) {
  const out: { section?: string; items: GalleryItem[] }[] = [];
  for (const it of items) {
    const key = it.section || undefined;
    const run = out.find((r) => r.section === key);
    if (run) run.items.push(it);
    else out.push({ section: key, items: [it] });
  }
  return out;
}

/* Columns are read off the pictures rather than stored: landscape wants
   room, upright wants company. Placeholders count as upright, which is
   the shape they render at. */
const wide = (it: GalleryItem) => it.r === "r-3x2" || it.r === "r-16x9";
const colsFor = (items: GalleryItem[]) =>
  items.filter(wide).length * 2 > items.length ? 2 : 3;

export default async function GalleryYear({ params }: { params: Promise<{ year: string }> }) {
  const { content, y } = await find((await params).year);
  if (!y) notFound();
  const years = galleryYears(content);
  const groups = runs(y.items);

  return (
    <div className="page is-on" data-page="gallery">
      <section className="sec sec--tight">
        <div className="wrap">
          <YearNav page="gallery" years={years} current={String(y.year)} label="Gallery" />
        </div>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: 0 }}>
        <div className="wrap narrow">
          {y.deva ? <div className="rv"><span className="eyebrow deva">{y.deva}</span></div> : null}
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .3em" }}>{y.year}</h1>
          {y.title ? <p className="yhero__t rv" style={d(120)}>{y.title}</p> : null}
          {y.summary ? <p className="lede rv" style={{ ...d(170), marginTop: "1em" }}>{y.summary}</p> : null}
        </div>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {y.items.length ? groups.map((g, gi) => (
            <section className="galgroup" key={g.section ?? `run-${gi}`}>
              {g.section ? (
                <div className="galgroup__h rv"><h2 className="h3">{g.section}</h2></div>
              ) : null}
              <div className={"gal" + (colsFor(g.items) === 2 ? " gal--2" : "")}>
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
          )) : (
            <div className="rv">
              <div className="note"><b>No pictures filed under {y.year} yet</b>
                They are added in the admin, under this year.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
