import Image from "next/image";
import { images } from "@/data/images";
import { coupleNames, wedding } from "@/data/wedding";
import { Ornament, OrnamentMinor } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

/** The last panel. Nothing after it — the invitation simply ends. */
export function ClosingSection() {
  return (
    <section
      className="stage stage-last relative overflow-hidden"
      aria-labelledby="closing-heading"
    >
      {/* The same arch that framed the formal panel, receding into the paper. */}
      <Image
        src={images.architecture.archColumned}
        alt=""
        width={1024}
        height={1536}
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute top-0 left-1/2 w-[min(120%,40rem)] -translate-x-1/2 opacity-[0.13]"
      />

      <div className="column relative text-center">
        <Reveal>
          <p className="t-caps">With love,</p>
          <h2
            id="closing-heading"
            className="t-script mt-3 text-espresso"
            style={{ fontSize: "clamp(2.2rem, 10vw, 3.4rem)" }}
          >
            {coupleNames}
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-9 space-y-1.5">
            {wedding.closing.lines.map((line) => (
              <p key={line} className="t-body">
                {line}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <Ornament className="mt-14" tone="antique" />
          <OrnamentMinor className="mx-auto mt-8 opacity-60" />
        </Reveal>
      </div>
    </section>
  );
}
