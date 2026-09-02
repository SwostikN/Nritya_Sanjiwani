"use client";
/* Header — brand, nav, burger, stuck state and scroll progress bar.
   Markup identical to v2; the nav is built from NAV as it was. */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/content";
import { keyFor } from "@/lib/routes";
import Logo from "./Logo";

/* `nav` is passed in rather than imported: which entries appear is a
   setting an admin can change, and that lives in the database. */
export default function Header({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const current = keyFor(pathname);
  const [open, setOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const hdr = useRef<HTMLElement>(null);

  /* close the menu whenever the route changes (v2 did this inside go()) */
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        hdr.current?.classList.toggle("is-stuck", y > 12);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        ticking = false;
      });
    };
    const onResize = () => { if (window.innerWidth > 1120) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("keydown", onKey);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="hdr" id="hdr" ref={hdr}>
      <div className="hdr__in">
        <div className="brand" data-go="home">
          <Logo className="brand__mark" />
          <span className="brand__en">Nritya Sanjiwani</span>
          <span className="brand__ne">नृत्य संजीवनी</span>
        </div>
        <nav className="nav" id="nav">
          {nav.map(([label, key]) => (
            <span key={key} className={"nav__i" + (key === current ? " is-on" : "")} data-go={key}>
              {label}
            </span>
          ))}
          <button className="btn" data-go="partner" style={{ padding: ".85em 1.5em" }}>
            Volunteer With Us
          </button>
        </nav>
        <button
          className="burger"
          id="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M0 1h26M0 7h26M0 13h26" />
          </svg>
        </button>
      </div>
      <div className={"mobnav" + (open ? " is-open" : "")} id="mobnav">
        {nav.map(([label, key]) => (
          <span key={key} className="mobnav__i" data-go={key}>{label}</span>
        ))}
        <span className="mobnav__i" data-go="partner" style={{ color: "var(--accent-2)" }}>
          Volunteer With Us
        </span>
      </div>
      <div className="progress" id="progress" ref={progress}></div>
    </header>
  );
}
