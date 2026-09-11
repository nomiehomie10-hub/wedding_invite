/**
 * Central image registry.
 *
 * Components reference artwork by key, never by path, so replacing a piece of
 * artwork is a one-line change here (or a drop-in file at the same path).
 * Run `npm run assets` after adding new source artwork to /assets/source.
 */
const BASE = "/images";

export const images = {
  opening: {
    /** The closed invitation face — folded into four flaps at runtime. */
    envelopeFace: `${BASE}/opening/envelope-face.webp`,
    /** Blank wax seal; the monogram is set in live type on top of it. */
    seal: `${BASE}/opening/seal.webp`,
  },

  hero: {
    /** Arch, couple and floral framing are all baked into this single plate. */
    couple: `${BASE}/hero/couple.webp`,
  },

  florals: {
    frame: `${BASE}/florals/frame.webp`,
    corner: `${BASE}/florals/corner.webp`,
    cornerRight: `${BASE}/florals/corner-right.webp`,
  },

  architecture: {
    archOrnate: `${BASE}/architecture/arch-ornate.webp`,
    archColumned: `${BASE}/architecture/arch-columned.webp`,
    panelArch: `${BASE}/architecture/panel-arch.webp`,
  },

  /** Keyed by the `image` slug on each entry in `wedding.events`. */
  timeline: {
    arrival: `${BASE}/timeline/arrival.webp`,
    "bride-entrance": `${BASE}/timeline/bride-entrance.webp`,
    isha: `${BASE}/timeline/isha.webp`,
    nikah: `${BASE}/timeline/nikah.webp`,
    dinner: `${BASE}/timeline/dinner.webp`,
    celebration: `${BASE}/timeline/celebration.webp`,
  } as Record<string, string>,

  venue: {
    /**
     * Optional, and empty by default. Drop a photograph into
     * /public/images/venue/ and put its path here to replace the engraved
     * plate in the Location section. Left empty, nothing is requested at all —
     * a missing file would otherwise log a 404 on every visit.
     */
    exterior: "" as string,
  },
} as const;

export type Images = typeof images;
