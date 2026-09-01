"use client";
/* the hero image plus the cheap transform-only parallax from v2 */
import { useEffect, useRef } from "react";

export default function HeroMedia() {
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        if (img.current) img.current.style.transform = `scale(1.06) translateY(${y * -0.045}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="frame r-4x5">
      <img
        ref={img}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kathak_Solo_Performance_%2830%29.jpg/1920px-Kathak_Solo_Performance_%2830%29.jpg"
        alt="A Kathak dancer mid-movement, skirt flaring, arms raised in a classical pose."
      />
    </div>
  );
}
