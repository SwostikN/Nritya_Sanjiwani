"use client";
/* ============================================================
   Reveal — the scroll-reveal + stat count-up from v2, re-armed on
   every route change (the original re-armed them inside go()).
   ============================================================ */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function countUp(node: HTMLElement, text: string, reduced: boolean) {
  const m = String(text).match(/^(\D*)(\d+)(.*)$/);
  if (!m || reduced) { node.textContent = text; return; }
  const [, pre, numStr, post] = m, target = +numStr;
  if (target > 400) { node.textContent = text; return; }
  let start: number | null = null;
  const dur = 1100;
  function step(t: number) {
    if (!start) start = t;
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = pre + Math.round(target * eased) + post;
    if (p < 1) requestAnimationFrame(step);
  }
  node.textContent = pre + "0" + post;
  requestAnimationFrame(step);
}

export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });

    const statIO = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const n = e.target as HTMLElement;
          countUp(n, n.dataset.count || "", reduced);
          statIO.unobserve(n);
        }
      });
    }, { threshold: .6 });

    const id = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(".rv, .rule, .wave, .mask")
        .forEach((n) => { if (!n.classList.contains("in")) io.observe(n); });
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => statIO.observe(n));
    });

    return () => { cancelAnimationFrame(id); io.disconnect(); statIO.disconnect(); };
  }, [pathname]);

  return null;
}
