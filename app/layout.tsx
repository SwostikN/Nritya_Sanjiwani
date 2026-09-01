import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nritya Sanjiwani — Healing Through Kathak",
  description:
    "A community-based initiative using Kathak, movement, art and storytelling to create spaces for emotional expression and well-being in the Kathmandu Valley.",
};

/* Deliberately bare: the public site's header and footer live in
   (site)/layout.tsx so the admin can sit beside it without them. */
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
      <body>{children}</body>
    </html>
  );
}
