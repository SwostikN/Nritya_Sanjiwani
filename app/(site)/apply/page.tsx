import type { Metadata } from "next";
import ApplyForm from "@/components/forms/ApplyForm";
import { getContent } from "@/lib/content-db";
import { d } from "@/lib/util";

export const metadata: Metadata = {
  title: "Join the Journey · Nritya Sanjiwani",
  description: "No dance experience is needed. Nothing here asks about your medical or mental-health history.",
};

export default async function Apply() {
  const { SITE } = await getContent();
  return (
    <div className="page is-on" data-page="apply">
      <section className="sec sec--tight">
        <div className="wrap narrow">
          <div className="rv"><span className="eyebrow deva">सहभागिता</span></div>
          <h1 className="h1 rv" style={{ ...d(80), margin: ".4em 0 .5em" }}>Join the Journey</h1>
          <p className="lede rv" style={d(140)}>
            No dance experience is needed. Nothing here asks about your medical or mental-health history.
          </p>
          <p className="body-lg rv muted" style={{ ...d(180), marginTop: ".9em" }} id="minAgeLine">
            {SITE.minAge ? `Minimum age: ${SITE.minAge}.` : ""}
          </p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap narrow" id="applyFormWrap"><ApplyForm /></div>
      </section>
    </div>
  );
}
