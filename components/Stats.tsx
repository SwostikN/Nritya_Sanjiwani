import type { StatItem } from "@/lib/content";

export default function Stats({ items }: { items: StatItem[] }) {
  return (
    <>
      {items.map((s, i) => (
        <div className="stat" key={i}>
          <div className="stat__f" data-count={s.f}>{s.f}</div>
          <div className="stat__l">{s.l}</div>
        </div>
      ))}
    </>
  );
}
