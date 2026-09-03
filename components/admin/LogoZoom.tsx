"use client";
/* Zoom a logo inside its box, and see the box while you do it.

   The frame below is the real cell from the partner wall at its real
   size — same 248x152, same 82px slot, same clipping. So this is not a
   preview of the setting, it is the setting: what shows here is what a
   visitor gets. Zooming moves the picture only; the cell is fixed, and
   anything pushed past its edge is cut off rather than allowed to shove
   the logos beside it. */
import { useState } from "react";

const MIN = 40, MAX = 250, DEF = 100;

export default function LogoZoom({ value, src, onChange }:
  { value: unknown; src?: string; onChange: (v: unknown) => void }) {
  const pct = Math.min(MAX, Math.max(MIN, Number(value) || DEF));
  const [live, setLive] = useState(pct);
  const set = (n: number) => {
    const v = Math.min(MAX, Math.max(MIN, Math.round(n)));
    setLive(v);
    onChange(v === DEF ? "" : v);   // the default is stored as nothing
  };

  if (!src)
    return (
      <div className="zoom">
        <span className="help" style={{ marginTop: 0 }}>
          Choose a logo above and it appears here, with a slider to size it inside its box.
        </span>
      </div>
    );

  return (
    <div className="zoom">
      <div className="zoom__stage">
        <div className="zoom__cell" title="The cell as a visitor sees it">
          <div className="zoom__slot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ transform: `scale(${live / 100})` }} />
          </div>
        </div>
        <div className="zoom__ctl">
          <input type="range" min={MIN} max={MAX} step={1} value={live}
                 onChange={(e) => set(Number(e.target.value))}
                 aria-label="Logo size inside its box" />
          <div className="zoom__row">
            <button type="button" className="b b--ghost b--sm" onClick={() => set(live - 5)}>−</button>
            <input className="zoom__num" type="number" min={MIN} max={MAX} value={live}
                   onChange={(e) => set(Number(e.target.value))} aria-label="Logo size, per cent" />
            <span className="zoom__pc">%</span>
            <button type="button" className="b b--ghost b--sm" onClick={() => set(live + 5)}>+</button>
            <button type="button" className="b b--ghost b--sm" onClick={() => set(DEF)}
                    disabled={live === DEF}>Reset</button>
          </div>
          <span className="help" style={{ marginTop: 0 }}>
            The box never changes size — only the logo inside it. Use this when a logo looks heavier or
            lighter than the ones beside it, which usually means its file carries more or less of its own
            white space than theirs.
          </span>
        </div>
      </div>
    </div>
  );
}
