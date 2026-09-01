import { MARQUEE } from "@/lib/content";

/* the strip is doubled so the -50% loop is seamless — as in v2 */
export default function Marquee() {
  const run = (pass: number) =>
    MARQUEE.map(([en, ne], i) => (
      <span key={`${pass}-${i}`}>
        <span className="marq__i">{en}</span>
        <span className="marq__i deva">{ne}</span>
      </span>
    ));
  return (
    <div className="marq">
      <div className="marq__t" id="marq">{run(0)}{run(1)}</div>
    </div>
  );
}
