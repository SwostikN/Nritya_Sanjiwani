import type { CSSProperties } from "react";

/* The trail under "The method moves in three": a dotted line with a
   footprint at each of the three. The line is drawn stretched to the
   full width (preserveAspectRatio="none"), so anything sitting inside
   the SVG is squashed with the box — on a phone the old dots were
   drawn as slivers a quarter of their width. The footprints are
   therefore ordinary elements laid over it, placed in per cent of the
   curve's own box, which keeps a foot the shape of a foot at every
   width. The dots survive the same stretch through
   vector-effect="non-scaling-stroke", which measures the stroke and
   its dash pattern on screen rather than in the stretched grid. */

const PATH = "M0,86 C160,10 300,110 460,60 C620,10 700,108 860,66 C1000,30 1090,92 1200,44";

/* left: how far along the curve, in per cent of the box.
   top: the height of the curve there, nudged a little to the side a
   walking foot falls on — right feet land right of the line of travel,
   left feet left of it.
   rot: 90deg turns the toes to point along the walk; the remainder is
   the slope of the curve at that point.
   delay: the line takes 2.6s to draw itself, so each print lands just
   after the trail reaches it. */
const STEPS = [
  { x: "15%",   y: "52.7%", rot: 94,   left: false, delay: 520 },
  { x: "51.7%", y: "39.1%", rot: 99,   left: true,  delay: 1460 },
  { x: "87.5%", y: "54.5%", rot: 94.5, left: false, delay: 2380 },
];

/* A bare right foot, toes up: the sole with its arch cut into the
   inner edge, and five toes. A left foot is the same shape mirrored. */
function Foot() {
  return (
    <>
      <path d="M11.2,8 C15.9,8 18.4,10.6 18.4,14 C18.4,17.6 15.9,19.6 15.3,22.2
               C14.8,24.8 15.6,26.2 15.2,28.6 C14.6,32.3 12.9,34.9 10.3,34.9
               C7.7,34.9 6.4,32.4 6.5,29.7 C6.6,27 9.5,25 9.5,21.9
               C9.5,18.9 4.6,17.6 4.6,14 C4.6,10.4 6.8,8 11.2,8 Z" />
      <ellipse cx="6.0"  cy="4.6" rx="2.7"  ry="3.1" />
      <ellipse cx="10.4" cy="3.1" rx="1.75" ry="2.1" />
      <ellipse cx="13.7" cy="3.3" rx="1.55" ry="1.9" />
      <ellipse cx="16.4" cy="4.2" rx="1.4"  ry="1.75" />
      <ellipse cx="18.6" cy="5.7" rx="1.25" ry="1.55" />
    </>
  );
}

export default function Wave() {
  return (
    <div className="wave rv" aria-hidden="true">
      <svg className="wave__line" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <defs>
          {/* the line cannot draw itself with stroke-dasharray any more —
              the dashes are the dots. A thick stroke along the same path
              wipes across it instead. */}
          <mask id="waveWipe" maskUnits="userSpaceOnUse" x="-40" y="-40" width="1280" height="200">
            <path className="wave__wipe" d={PATH} fill="none" stroke="#fff" strokeWidth="40" strokeLinecap="round" />
          </mask>
        </defs>
        <path d={PATH} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round"
              strokeDasharray="0.01 10" vectorEffect="non-scaling-stroke" mask="url(#waveWipe)" />
      </svg>
      {STEPS.map((s) => (
        <svg key={s.x} className="wave__step" viewBox="0 0 22 36"
             style={{
               left: s.x, top: s.y, "--d": `${s.delay}ms`,
               "--t": `translate(-50%,-50%) rotate(${s.rot}deg)${s.left ? " scaleX(-1)" : ""}`,
             } as CSSProperties}>
          <Foot />
        </svg>
      ))}
    </div>
  );
}
