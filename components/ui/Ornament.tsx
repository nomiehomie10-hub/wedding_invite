/**
 * The engraved divider used between every stage.
 *
 * Drawn rather than imported so it stays crisp at any width, inherits the gold
 * from CSS, and costs nothing to load. `width` scales the whole flourish; the
 * hairline rules extend to fill whatever box it is given.
 */
export function Ornament({
  className = "",
  tone = "champagne",
}: {
  className?: string;
  tone?: "champagne" | "antique";
}) {
  const stroke =
    tone === "antique" ? "var(--color-gold-antique)" : "var(--color-gold-champagne)";

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="rule-gold h-px max-w-24 flex-1" />
      <svg
        width="76"
        height="16"
        viewBox="0 0 76 16"
        fill="none"
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinecap="round"
        className="shrink-0"
      >
        {/* Central lotus diamond */}
        <path d="M38 2.2 41.4 8 38 13.8 34.6 8Z" />
        <path d="M38 5.1 39.7 8 38 10.9 36.3 8Z" opacity="0.65" />
        {/* Scrolling leaf tendrils, mirrored about the centre */}
        <path d="M34.6 8c-3.4 0-5.2-2.1-7.4-2.1-1.9 0-3 1.1-3 2.1s1.1 2.1 3 2.1c2.2 0 4-2.1 7.4-2.1Z" />
        <path d="M41.4 8c3.4 0 5.2-2.1 7.4-2.1 1.9 0 3 1.1 3 2.1s-1.1 2.1-3 2.1c-2.2 0-4-2.1-7.4-2.1Z" />
        <path d="M24.2 8c-3 0-5.4 1.4-8 1.4M51.8 8c3 0 5.4 1.4 8 1.4" opacity="0.7" />
        {/* Terminal buds */}
        <circle cx="15.4" cy="9.2" r="1.1" />
        <circle cx="60.6" cy="9.2" r="1.1" />
      </svg>
      <span className="rule-gold h-px max-w-24 flex-1" />
    </div>
  );
}

/** A quieter mark for closing a section rather than separating two. */
export function OrnamentMinor({ className = "" }: { className?: string }) {
  return (
    <svg
      width="34"
      height="10"
      viewBox="0 0 34 10"
      fill="none"
      stroke="var(--color-gold-champagne)"
      strokeWidth="0.9"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 1.2 19.4 5 17 8.8 14.6 5Z" />
      <path d="M14.6 5H2M19.4 5H32" opacity="0.55" />
    </svg>
  );
}
