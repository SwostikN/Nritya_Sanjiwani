/* The alapadma — the open-lotus mudra — as the site's mark, redrawn
   from images/16-alapadma.svg for use at brand size. Three changes,
   all of which only matter once the mark is 30px rather than 512:

   the viewBox is cropped to the drawing itself, so the lotus fills its
   slot instead of floating in a square of empty air; the strokes are
   about twice as heavy, because the original 8 lands under a single
   pixel here and greys out; and the fainter of the two bangle lines is
   gone, since at this size it merges with the one above it into a
   smudge. The same reasoning shaped app/icon.svg for the tab.

   The colour is the palette's own pair rather than the source file's
   browns — terracotta at the wrist, marigold at the tips, the rake the
   buttons and the progress bar already use. The stops read the tokens,
   so the mark follows the palette rather than pinning a copy of it. */

/* the five petals, as (rotation about the wrist, outline) */
const PETALS: [number, string][] = [
  [-58, "M 256 396 C 225.0 309.0 227.8 279.0 256 246.0 C 284.2 279.0 287.0 309.0 256 396 Z"],
  [-29, "M 256 396 C 223.0 290.4 226.0 254.0 256 214.0 C 286.0 254.0 289.0 290.4 256 396 Z"],
  [  0, "M 256 396 C 221.0 281.2 224.2 241.6 256 198.0 C 287.8 241.6 291.0 281.2 256 396 Z"],
  [ 29, "M 256 396 C 223.0 290.4 226.0 254.0 256 214.0 C 286.0 254.0 289.0 290.4 256 396 Z"],
  [ 58, "M 256 396 C 225.0 309.0 227.8 279.0 256 246.0 C 284.2 279.0 287.0 309.0 256 396 Z"],
];

export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="120 150 272 338" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="nsMark" gradientUnits="userSpaceOnUse" x1="140" y1="470" x2="380" y2="160">
          <stop offset="0"   style={{ stopColor: "var(--accent-2)" }} />
          <stop offset=".62" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1"   style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
      </defs>
      <g stroke="url(#nsMark)" strokeWidth="15" strokeLinejoin="round">
        {PETALS.map(([deg, d], i) => (
          <path key={i} d={d} transform={`rotate(${deg} 256 396)`} />
        ))}
      </g>
      <path d="M 166 398 C 200 456 312 456 346 398" stroke="url(#nsMark)" strokeWidth="15" strokeLinecap="round" />
      <path d="M 206 464 C 228 480 284 480 306 464" stroke="url(#nsMark)" strokeWidth="12" strokeLinecap="round" />
      {/* the bindu sits closer to the petals than in the source file:
          at this size the original gap read as a separate dot rather
          than part of the mark */}
      <circle cx="256" cy="170" r="13" fill="var(--accent-2)" />
    </svg>
  );
}
