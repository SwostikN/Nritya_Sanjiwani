"use client";
/* Header — brand, nav, burger, stuck state and scroll progress bar.

   The bar used to be six flat items. Two of them were really one
   subject each (who we are; what has already happened year by year),
   so those became menus. A node with children never navigates itself:
   its panel carries the parent page as the first entry, which keeps
   one behaviour for the label on mouse, touch and keyboard alike
   instead of "click navigates, hover opens" — the pattern that eats
   taps on a phone. */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { NavNode } from "@/lib/content";
import { keyFor } from "@/lib/routes";
import Logo from "./Logo";

function Caret() {
  return (
    <svg className="nav__car" width="9" height="6" viewBox="0 0 9 6" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <path d="M1 1.5 4.5 4.75 8 1.5" />
    </svg>
  );
}

/* `nav` is passed in rather than imported: which entries appear is a
   setting an admin can change, and that lives in the database. */
export default function Header({ nav }: { nav: NavNode[] }) {
  const pathname = usePathname();
  const current = keyFor(pathname);
  const [open, setOpen] = useState(false);          // burger / mobile sheet
  const [menu, setMenu] = useState<string | null>(null);   // which desktop panel is down
  const [drawer, setDrawer] = useState<string | null>(null); // which mobile group is expanded
  const progress = useRef<HTMLDivElement>(null);
  const hdr = useRef<HTMLElement>(null);
  const navEl = useRef<HTMLElement>(null);
  const shut = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* what put the panel down. A plain toggle on the label is wrong here:
     hovering opens it, and the click that naturally follows would shut
     it again — same for keyboard, where focus opens it and Enter would
     close it. So the label only closes what a click itself opened. */
  const via = useRef<"pointer" | "focus" | "click" | null>(null);

  /* a menu that stays down while the pointer crosses the gap to it,
     but does not hang around once the pointer has truly left */
  const hold = (key: string, by: "pointer" | "focus") => {
    if (shut.current) clearTimeout(shut.current);
    if (menu !== key) via.current = by;
    setMenu(key);
  };
  const release = () => {
    if (shut.current) clearTimeout(shut.current);
    shut.current = setTimeout(() => { via.current = null; setMenu(null); }, 140);
  };
  const press = (key: string) => {
    if (shut.current) clearTimeout(shut.current);
    if (menu === key && via.current === "click") { via.current = null; setMenu(null); return; }
    via.current = "click";
    setMenu(key);
  };

  /* close everything whenever the route changes (v2 did this inside go()) */
  useEffect(() => { setOpen(false); setMenu(null); setDrawer(null); via.current = null; }, [pathname]);

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
    const onResize = () => { if (window.innerWidth > 1120) { setOpen(false); setDrawer(null); } };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false); setMenu(null); via.current = null;
    };
    /* a panel opened by click needs somewhere to be dismissed */
    const onDown = (e: PointerEvent) => {
      if (!navEl.current?.contains(e.target as Node)) { via.current = null; setMenu(null); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      if (shut.current) clearTimeout(shut.current);
    };
  }, []);

  /* a group is lit when the page showing is the group's own or one of
     its children's — so Our Team keeps About Us underlined */
  const isOn = (n: NavNode) =>
    n.key === current || (n.children ?? []).some((c) => c.key === current);

  return (
    <header className="hdr" id="hdr" ref={hdr}>
      <div className="hdr__in">
        <div className="brand" data-go="home">
          <Logo className="brand__mark" />
          <span className="brand__en">Nritya Sanjiwani</span>
          {/* <span className="brand__ne">नृत्य संजीवनी</span> */}
        </div>
        <nav className="nav" id="nav" ref={navEl}>
          {nav.map((n) =>
            n.children ? (
              <div key={n.key} className="nav__g"
                   onMouseEnter={() => hold(n.key, "pointer")} onMouseLeave={release}
                   onFocus={() => hold(n.key, "focus")}
                   onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) release(); }}>
                <button type="button"
                        className={"nav__i nav__i--g" + (isOn(n) ? " is-on" : "") + (menu === n.key ? " is-open" : "")}
                        aria-expanded={menu === n.key}
                        onClick={() => press(n.key)}>
                  {n.label}<Caret />
                </button>
                <div className="nav__menu" hidden={menu !== n.key}>
                  <div className="nav__menu-in">
                    {n.children.map((c) => (
                      <div key={c.href} className={c.head ? "nav__sec" : undefined}>
                        {c.head ? <span className="nav__head">{c.head}</span> : null}
                        <Link href={c.href} className="nav__mi"
                              onClick={() => { via.current = null; setMenu(null); }}>
                          <span>{c.label}</span>
                          {c.deva ? <span className="nav__mi-d deva">{c.deva}</span> : null}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : n.href ? (
              /* a year-wise page with exactly one year: skip the menu and
                 the redirect, and point straight at that year */
              <Link key={n.key} href={n.href} className={"nav__i" + (isOn(n) ? " is-on" : "")}>
                {n.label}
              </Link>
            ) : (
              <span key={n.key} className={"nav__i" + (isOn(n) ? " is-on" : "")} data-go={n.key}>
                {n.label}
              </span>
            )
          )}
          <button className="btn" data-go="partner" style={{ padding: ".85em 1.5em" }}>
            Join Us
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
        {nav.map((n) =>
          n.children ? (
            <div key={n.key} className="mobnav__g">
              <button type="button"
                      className={"mobnav__i mobnav__i--g" + (drawer === n.key ? " is-open" : "")}
                      aria-expanded={drawer === n.key}
                      onClick={() => setDrawer((k) => (k === n.key ? null : n.key))}>
                {n.label}<Caret />
              </button>
              {drawer === n.key ? (
                <div className="mobnav__sub">
                  {n.children.map((c) => (
                    <div key={c.href}>
                      {c.head ? <span className="mobnav__head">{c.head}</span> : null}
                      <Link href={c.href} className="mobnav__si" onClick={() => setOpen(false)}>
                        {c.label}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : n.href ? (
            <Link key={n.key} href={n.href} className="mobnav__i" onClick={() => setOpen(false)}>{n.label}</Link>
          ) : (
            <span key={n.key} className="mobnav__i" data-go={n.key}>{n.label}</span>
          )
        )}
        <span className="mobnav__i" data-go="partner" style={{ color: "var(--accent-2)" }}>
          Join Us
        </span>
      </div>
      <div className="progress" id="progress" ref={progress}></div>
    </header>
  );
}
