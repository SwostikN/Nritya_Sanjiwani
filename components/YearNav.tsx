/* The years of a year-wise page, as a row of pills.

   With every year its own page and no "all years" index above them,
   this is how a reader gets from one to the next without going back up
   to the header — and on a phone, where the header menu is two taps
   behind a burger, it is the only comfortable way. */
import Link from "next/link";
import { yearPath } from "@/lib/routes";

export default function YearNav({
  page, years, current, label,
}: { page: "reflection" | "gallery"; years: string[]; current: string; label?: string }) {
  if (years.length < 2) return null;
  return (
    <nav className="ynav" aria-label={label ?? "Years"}>
      {label ? <span className="ynav__l">{label}</span> : null}
      <div className="ynav__r">
        {years.map((y) => (
          <Link key={y} href={yearPath(page, y)}
                className={"ynav__i" + (y === current ? " is-on" : "")}
                aria-current={y === current ? "page" : undefined}>
            {y}
          </Link>
        ))}
      </div>
    </nav>
  );
}
