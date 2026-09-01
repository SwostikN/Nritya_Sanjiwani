import type { Metadata } from "next";
import { getContent } from "@/lib/content-db";

export const metadata: Metadata = {
  title: "Contact · Nritya Sanjiwani",
  description: "Get in touch with Nritya Sanjiwani — Kathmandu, Nepal.",
};

export default async function Contact() {
  const { SITE } = await getContent();
  const rows: [string, string][] = ([
    ["Email", SITE.email],
    ["Phone", SITE.phone],
    ["Based in", "Kathmandu, Nepal"],
    ["Social", Object.keys(SITE.social).join(" · ")],
  ] as [string, string][]).filter((r) => r[1]);

  return (
    <div className="page is-on" data-page="contact">
      <section className="sec sec--tight">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="rv rv--l">
            <span className="eyebrow deva">सम्पर्क</span>
            <h1 className="h1" style={{ margin: ".4em 0 .5em" }}>Contact</h1>
            <div style={{ display: "flex", flexDirection: "column" }} id="contactRows">
              {rows.map(([l, v]) => (
                <div key={l} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "1em", padding: "1.1em 0", borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>{l}</div>
                  <div>{v}</div>
                </div>
              ))}
            </div>
            <p className="body-lg" style={{ marginTop: "2.2rem" }}>
              For partnership enquiries, the{" "}
              <span className="tlink" data-go="partner" style={{ fontSize: ".78rem" }}>Partner With Us</span>{" "}
              form reaches the right person fastest.
            </p>
          </div>
          <div className="rv rv--r" style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className="frame r-4x5 frame--hover">
              <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Kathak_Solo_Performance_%2815%29.jpg/1920px-Kathak_Solo_Performance_%2815%29.jpg"
                   alt="Close portrait of a Kathak dancer in a red veil, looking down." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
