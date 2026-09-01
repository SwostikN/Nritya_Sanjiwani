import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavRoot from "@/components/NavRoot";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Nritya Sanjiwani — Healing Through Kathak",
  description:
    "A community-based initiative using Kathak, movement, art and storytelling to create spaces for emotional expression and well-being in the Kathmandu Valley.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..600&family=Manrope:wght@300..800&family=Tiro+Devanagari+Sanskrit:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NavRoot />
        <Reveal />
        <Header />
        <main id="main">{children}</main>

        {/* ==================== NEWSLETTER ==================== */}
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
      </body>
    </html>
  );
}
