"use client";
/* ============================================================
   NavRoot — replicates the original delegated [data-go] click
   handler, but pushes a real route instead of setting a hash.
   Keeping the delegate (rather than swapping every span for a
   <Link>) is deliberate: .ft__l span, .nav__i and .card--role are
   styled by tag in places, so changing the tags would change the
   look. The markup stays byte-identical to v2.
   ============================================================ */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pathFor } from "@/lib/routes";

export default function NavRoot() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest("[data-go]");
      if (!t) return;
      e.preventDefault();
      router.push(pathFor((t as HTMLElement).dataset.go!));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
  return null;
}
