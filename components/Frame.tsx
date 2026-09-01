import { esc } from "@/lib/util";

export default function Frame({
  img, alt, ratio = "r-4x5", cap, priority,
}: { img: string; alt?: string; ratio?: string; cap?: string; priority?: boolean }) {
  return (
    <div className={"frame " + ratio + " frame--hover"}>
      <img loading={priority ? "eager" : "lazy"} src={img} alt={alt || ""} />
      {cap ? <div className="cap">{cap}</div> : null}
    </div>
  );
}
