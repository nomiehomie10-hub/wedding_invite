import { wedding } from "@/data/wedding";

/**
 * A restrained map, framed like everything else on the sheet.
 *
 * The embed is keyless and lazy. An engraved card sits permanently behind it,
 * so a blocked iframe, an offline guest or a cleared `mapEmbedUrl` all degrade
 * to something that still looks intentional.
 */
export function MapCard() {
  const { name, city } = wedding.venue;
  // Widened from the `as const` literals so an edited config still type-checks.
  const mapsUrl: string = wedding.venue.mapsUrl;
  const mapEmbedUrl: string = wedding.venue.mapEmbedUrl;
  const hasLink = Boolean(mapsUrl) && mapsUrl !== "#";

  return (
    <figure className="m-0">
      <div
        className="paper-card relative aspect-[4/3] overflow-hidden rounded-[3px] p-[6px]"
        style={{ boxShadow: "0 0 0 1px color-mix(in srgb, var(--color-gold-champagne) 45%, transparent)" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2px] bg-blush">
          <EngravedMap />

          {mapEmbedUrl && (
            <iframe
              src={mapEmbedUrl}
              title={`Map showing ${name}, ${city}`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // Pulled into the invitation's palette rather than left as a
              // bright slab of product UI in the middle of the paper.
              style={{ filter: "sepia(0.5) saturate(0.55) contrast(0.88) brightness(1.06)" }}
            />
          )}

          {/* A last wash of ivory, so the map reads as printed, not embedded. */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: "var(--color-ivory)", opacity: 0.14, mixBlendMode: "multiply" }}
          />
        </div>

        {hasLink && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-espresso no-underline"
            // Set outright rather than through an opacity modifier: Tailwind
            // cannot apply one to a bare CSS variable, which silently left the
            // button transparent over the map.
            style={{
              background: "var(--color-paper-light)",
              border: "1px solid color-mix(in srgb, var(--color-gold-champagne) 50%, transparent)",
              boxShadow: "0 2px 8px -4px rgba(74, 58, 44, 0.4)",
            }}
          >
            Open in Maps
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 6.5 6.5 2.5M3.2 2.5h3.3v3.3" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>

      {/* Captions the map, which shows the venue. The hall is named once, in
          the address block above. */}
      <figcaption className="t-caps mt-3 text-center">{name}</figcaption>
    </figure>
  );
}

/** Purely decorative fallback beneath the embed. */
function EngravedMap() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="200" height="150" fill="var(--color-blush)" />
      <g stroke="var(--color-gold-champagne)" strokeWidth="0.6" fill="none" opacity="0.45">
        <path d="M-10 40h220M-10 96h220M46 -10v170M132 -10v170" />
        <path d="M-10 66C40 66 60 110 110 118s70 22 110 18" strokeWidth="1.6" opacity="0.6" />
      </g>
      <g fill="var(--color-gold-antique)" opacity="0.75">
        <path d="M100 62a7 7 0 0 1 7 7c0 5-7 13-7 13s-7-8-7-13a7 7 0 0 1 7-7Z" />
        <circle cx="100" cy="69" r="2.4" fill="var(--color-blush)" />
      </g>
    </svg>
  );
}
