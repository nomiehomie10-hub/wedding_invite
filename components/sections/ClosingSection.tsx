import Image from "next/image";
import { images } from "@/data/images";
import { wedding } from "@/data/wedding";
import { Ornament, OrnamentMinor } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { nameSize } from "@/lib/nameFit";

/**
 * The arch plate is 1024x1536, and its crown occupies roughly the top third.
 * Expressing that as percentage padding — which resolves against the *width* —
 * keeps the sign-off inside the arch opening at every screen size, without
 * anyone measuring pixels.
 */
const ARCH_ASPECT = 1536 / 1024;
const CROWN_SHARE = 0.3;
const OPENING_TOP = `${Math.round(ARCH_ASPECT * CROWN_SHARE * 100)}%`;

/** The last panel. Nothing after it — the invitation simply ends. */
export function ClosingSection() {
  const { groom, bride } = wedding;
  // First names here: the sign-off is the couple speaking, not the
  // invitation addressing its guests.
  const size = nameSize("closing", groom.shortName, bride.shortName);

  return (
    <section
      className="stage stage-last relative overflow-hidden"
      aria-labelledby="closing-heading"
    >
      <div className="column relative">
        {/* The same arch that framed the formal panel, receding into the paper. */}
        <Image
          src={images.architecture.archColumned}
          alt=""
          width={1024}
          height={1536}
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-x-0 top-0 w-full opacity-[0.17]"
        />

        {/* Held within the arch opening rather than floating above the crown. */}
        <div
          className="relative px-[11%] text-center"
          style={{ paddingTop: OPENING_TOP }}
        >
          <Reveal>
            <p className="t-caps">With love,</p>
            {/*
             * Stacked rather than set as one string: run inline, a long name
             * wraps and leaves the ampersand stranded at the end of a line.
             * This also echoes the hero, where the pair is introduced the same
             * way.
             */}
            <h2 id="closing-heading" className="mt-3 text-espresso">
              <span className="t-script block" style={{ fontSize: size }}>
                {groom.shortName}
              </span>
              <span
                className="block font-serif text-gold-antique italic"
                style={{ fontSize: "clamp(1rem, 3.6vw, 1.3rem)", margin: "0.1em 0" }}
                aria-hidden="true"
              >
                &amp;
              </span>
              <span className="sr-only">and</span>
              <span className="t-script block" style={{ fontSize: size }}>
                {bride.shortName}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-8 space-y-1.5">
              {wedding.closing.lines.map((line) => (
                <p key={line} className="t-body">
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Below the arch, closing the invitation off. */}
        <Reveal delay={220}>
          <Ornament className="mt-12" tone="antique" />
          <OrnamentMinor className="mx-auto mt-8 opacity-60" />
        </Reveal>
      </div>
    </section>
  );
}
