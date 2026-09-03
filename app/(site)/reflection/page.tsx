import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getContent, journeyYears } from "@/lib/content-db";
import { yearPath } from "@/lib/routes";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Our Journey · Nritya Sanjiwani",
  description: "The record of the sessions, workshops and performances, year by year.",
};

/* The record is one page per year now, so this address has no page of
   its own to be — it opens the most recent year. Everything already
   pointing at /reflection (the footer, the home teaser, old links)
   keeps landing somewhere real. */
export default async function Reflection() {
  const content = await getContent();
  const years = journeyYears(content);
  if (years.length) redirect(yearPath("reflection", years[0]));

  return (
    <div className="page is-on" data-page="reflection">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">हाम्रो यात्रा</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Our Journey</h1>
          <p className="lede rv" style={d(140)}>{content.REFLECTION.lede}</p>
          <div className="rv" style={{ ...d(200), marginTop: "clamp(26px,3vw,40px)" }}>
            <div className="note"><b>Nothing recorded yet</b>
              The first year of the record is added in the admin, and appears here as its own page.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
