/* React escapes text by default, so the v2 esc() is only kept for the
   rare place that still needs a raw string. */
export const esc = (s: unknown) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

/* the --d reveal-delay custom property, as a style object */
export const d = (ms: number | string): React.CSSProperties =>
  ({ "--d": typeof ms === "number" ? `${ms}ms` : ms } as React.CSSProperties);
