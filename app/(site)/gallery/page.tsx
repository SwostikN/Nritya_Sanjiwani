import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getContent, galleryYears } from "@/lib/content-db";
import { yearPath } from "@/lib/routes";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Gallery · Nritya Sanjiwani",
  description: "Movement, people and process, a page for each year of the program.",
};

/* One page per year, so this address opens the most recent one. */
export default async function Gallery() {
  const content = await getContent();
  const years = galleryYears(content);
  if (years.length) redirect(yearPath("gallery", years[0]));

  return (
    <div className="page is-on" data-page="gallery">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">दृश्य</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Gallery</h1>
          <div className="rv" style={{ ...d(140), marginTop: "clamp(26px,3vw,40px)" }}>
            <div className="note"><b>Nothing published yet</b>
              Add a year in the admin and its pictures appear here as their own page.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
