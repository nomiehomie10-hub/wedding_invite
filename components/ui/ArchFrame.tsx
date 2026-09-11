import type { ReactNode } from "react";

/**
 * A drawn Mughal cusped-ogee arch that stretches to any height without
 * distorting its crown.
 *
 * The crown is an SVG with a fixed aspect ratio; the jambs beneath it are CSS
 * hairlines positioned by the same width fractions the SVG uses, so the two
 * always meet exactly however tall the content grows.
 */
const VB_W = 400;
/** y of the springing line, where the curve hands over to the vertical jambs. */
const SPRING = 206;

/** Jamb positions as fractions of the frame width. */
const JAMB_INNER = 14 / VB_W;
const JAMB_OUTER = 4.4 / VB_W;

/**
 * Inner profile, mirrored about x = 200. Each cusp is a deliberate tangent
 * reversal: the curve arrives falling and leaves rising, which is what produces
 * the sharp inward point rather than a soft bump.
 */
const ARCH = [
  "M 14 206 L 14 152",
  "C 14 118 30 98 62 90", // springing into the shoulder lobe
  "C 84 72 106 60 128 64", // first cusp, then the second lobe
  "C 150 46 192 32 200 14", // ogee rise to the apex
  "C 208 32 250 46 272 64", // mirrored
  "C 294 60 316 72 338 90",
  "C 370 98 386 118 386 152",
  "L 386 206",
].join(" ");

export function ArchFrame({
  children,
  className = "",
  /** Draw the outer companion line. Off gives a single, quieter rule. */
  double = true,
}: {
  children: ReactNode;
  className?: string;
  double?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <ArchCrown double={double} />

      <div className="relative">
        {/* Jambs run the full height of the content block. */}
        <span aria-hidden="true">
          <Jamb side="left" offset={JAMB_INNER} />
          <Jamb side="right" offset={JAMB_INNER} />
          {double && <Jamb side="left" offset={JAMB_OUTER} dim />}
          {double && <Jamb side="right" offset={JAMB_OUTER} dim />}
        </span>

        <div className="px-[9%]">{children}</div>
      </div>

      <ArchBase double={double} />
    </div>
  );
}

function Jamb({
  side,
  offset,
  dim = false,
}: {
  side: "left" | "right";
  offset: number;
  dim?: boolean;
}) {
  return (
    <span
      className="pointer-events-none absolute top-0 bottom-0 w-px"
      style={{
        [side]: `${offset * 100}%`,
        background: "var(--color-gold-champagne)",
        opacity: dim ? 0.42 : 0.85,
      }}
    />
  );
}

function ArchCrown({ double }: { double: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${SPRING}`}
      className="block w-full"
      fill="none"
      stroke="var(--color-gold-champagne)"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {double && (
        // Scaling about the springing point keeps the outer line parallel and
        // keeps both jambs landing on the bottom edge.
        <path
          d={ARCH}
          transform={`translate(${VB_W / 2} ${SPRING}) scale(1.05) translate(${-VB_W / 2} ${-SPRING})`}
          opacity="0.45"
          strokeWidth="0.9"
        />
      )}
      <path d={ARCH} opacity="0.92" />
    </svg>
  );
}

function ArchBase({ double }: { double: boolean }) {
  return (
    <div className="relative" aria-hidden="true">
      {/* Straight rules, stretched. */}
      <svg
        viewBox="0 0 400 30"
        className="block w-full"
        fill="none"
        stroke="var(--color-gold-champagne)"
        strokeWidth="1.1"
        strokeLinecap="round"
        preserveAspectRatio="none"
      >
        <path d="M14 0v16h372V0" opacity="0.9" />
        {double && <path d="M4.4 0v25h391.2V0" opacity="0.42" strokeWidth="0.9" />}
      </svg>
      {/* Centre ornament, kept at true aspect so it never smears. */}
      <svg
        width="30"
        height="14"
        viewBox="0 0 30 14"
        fill="none"
        stroke="var(--color-gold-champagne)"
        strokeWidth="0.9"
        strokeLinecap="round"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "26%" }}
      >
        <path d="M15 1.5 18 7l-3 5.5L12 7Z" />
        <path d="M12 7H1M18 7h11" opacity="0.5" />
      </svg>
    </div>
  );
}
