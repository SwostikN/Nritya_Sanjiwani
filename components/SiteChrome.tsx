import { getContent, visibleNav } from "@/lib/content-db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavRoot from "@/components/NavRoot";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/forms/NewsletterForm";

/* The public site's furniture. Used by the (site) layout and by the
   404, which lives at the app root and so cannot inherit that layout. */
export default async function SiteChrome({ children }: { children: React.ReactNode }) {
  const { NAV, sections } = await getContent();
  return (
    <>
      <NavRoot />
      <Reveal />
      <Header nav={visibleNav(sections, NAV)} />
      <main id="main">{children}</main>

      <section className="news">
        <div className="wrap news__in">
          <div className="rv">
            <h2 className="h2" style={{ maxWidth: "14ch" }}>Follow the journey.</h2>
            <p className="lede" style={{ marginTop: "1em", maxWidth: "48ch" }}>
              Occasional notes from the program — no more than one a month, and never a fundraising blast.
            </p>
          </div>
          <div className="rv" style={{ "--d": "120ms" } as React.CSSProperties} id="newsWrap">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
