import Image from "next/image";
import { images } from "@/data/images";

/**
 * Decoration for the wide margins a desktop leaves either side of the
 * invitation column.
 *
 * A phone gets none of this — there is no margin to fill, and the sprays would
 * only crowd the text. Hidden below 64rem, and never in the flow, so it costs
 * nothing on the layouts that matter most.
 */
export function PageMargins() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden select-none lg:block"
      aria-hidden="true"
    >
      <Image
        src={images.florals.corner}
        alt=""
        width={900}
        height={1350}
        className="absolute top-0 left-0 w-[15vw] max-w-56 opacity-[0.16]"
        loading="lazy"
      />
      <Image
        src={images.florals.cornerRight}
        alt=""
        width={900}
        height={1350}
        className="absolute top-0 right-0 w-[15vw] max-w-56 opacity-[0.16]"
        loading="lazy"
      />
      <Image
        src={images.florals.cornerRight}
        alt=""
        width={900}
        height={1350}
        className="absolute bottom-0 left-0 w-[13vw] max-w-48 rotate-180 opacity-[0.13]"
        loading="lazy"
      />
      <Image
        src={images.florals.corner}
        alt=""
        width={900}
        height={1350}
        className="absolute right-0 bottom-0 w-[13vw] max-w-48 rotate-180 opacity-[0.13]"
        loading="lazy"
      />
    </div>
  );
}
