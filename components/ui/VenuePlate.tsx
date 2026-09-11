"use client";

import { useState } from "react";
import Image from "next/image";
import { images } from "@/data/images";
import { wedding } from "@/data/wedding";
import { Ornament } from "@/components/ui/Ornament";

/**
 * The venue plate, cut to the same pointed arch the rest of the invitation uses.
 *
 * No photograph ships with the invitation. Until one is set on
 * `images.venue.exterior` this shows an engraved plate rather than a hole —
 * same arch, same gold outline, same floral sprays — so dropping a photograph
 * in later changes the picture and nothing else about the layout.
 */
export function VenuePlate() {
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(images.venue.exterior) && !failed;

  return (
    <div className="relative">
      <div className="relative aspect-4/5 overflow-hidden" style={archMask}>
        {hasPhoto ? (
          <Image
            src={images.venue.exterior}
            alt={`${wedding.venue.name}, ${wedding.venue.city}`}
            fill
            className="object-cover"
            sizes="(max-width: 34rem) 90vw, 30rem"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <EngravedVenue />
        )}
      </div>

      {/* Gold hairline following the arch. Stroked rather than box-shadowed so
          it traces the curve instead of only the straight edges. */}
      <svg
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        fill="none"
        stroke="var(--color-gold-champagne)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        <path d={ARCH_PATH} vectorEffect="non-scaling-stroke" opacity="0.8" />
      </svg>

      {/* Sprays break the frame, but stay inside the viewport. */}
      <Image
        src={images.florals.corner}
        alt=""
        width={900}
        height={1350}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -left-2 w-20 opacity-75 sm:w-28"
        loading="lazy"
      />
      <Image
        src={images.florals.cornerRight}
        alt=""
        width={900}
        height={1350}
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 -right-2 w-16 rotate-180 opacity-55 sm:w-20"
        loading="lazy"
      />
    </div>
  );
}

/** One arch, used as both the mask and the outline so they cannot drift apart. */
const ARCH_PATH =
  "M0 125V50C0 30 12 14 28 12 38 11 45 8 50 0c5 8 12 11 22 12 16 2 28 18 28 38v75Z";

const ARCH_SHAPE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 125' preserveAspectRatio='none'%3E%3Cpath d='${ARCH_PATH}' fill='%23000'/%3E%3C/svg%3E")`;

const archMask: React.CSSProperties = {
  WebkitMaskImage: ARCH_SHAPE,
  maskImage: ARCH_SHAPE,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
};

/**
 * Shown only when a configured photograph fails to load — the section omits
 * the plate altogether when none is configured.
 *
 * Deliberately not another arch: an arch drawn inside an arch reads as a
 * mistake. Just paper, a flourish, and the venue named once.
 */
function EngravedVenue() {
  return (
    <div className="paper-card absolute inset-0 grid place-items-center px-8 text-center">
      <div>
        <Ornament className="mb-7" />
        <p
          className="t-script text-gold-antique"
          style={{ fontSize: "clamp(1.4rem, 6.5vw, 2rem)" }}
        >
          {wedding.venue.name}
        </p>
        <Ornament className="mt-7" />
      </div>
    </div>
  );
}
