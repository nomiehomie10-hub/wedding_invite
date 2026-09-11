"use client";

import Image from "next/image";
import { images } from "@/data/images";
import { monogram } from "@/data/wedding";
import type { SealStage } from "@/hooks/useSealState";
import styles from "./OpeningEnvelope.module.css";

/**
 * The invitation as the guest first meets it: closed, sealed, and asking to be
 * opened.
 *
 * The whole overlay is a single button. Nothing else is reachable until the
 * seal is broken, which is the point — the letter should not be readable
 * through the envelope.
 */
export function OpeningEnvelope({
  stage,
  onOpen,
}: {
  stage: SealStage;
  onOpen: () => void;
}) {
  return (
    <div
      className={styles.overlay}
      data-envelope=""
      data-stage={stage}
      // Once the fold starts, the overlay is scenery; the letter behind it is
      // what a screen reader should be reading.
      aria-hidden={stage === "opening" ? "true" : undefined}
    >
      <button
        type="button"
        className={styles.envelope}
        data-stage={stage}
        onClick={onOpen}
        disabled={stage !== "closed"}
        aria-label={`Open the invitation of ${monogram.replace("&", "and")}`}
        style={{ "--face": `url(${images.opening.envelopeFace})` } as React.CSSProperties}
      >
        <span className={styles.interior} aria-hidden="true" />

        {/* Four flaps of one sheet — see the stylesheet for why they share art. */}
        <span className={`${styles.flap} ${styles.top}`} aria-hidden="true" />
        <span className={`${styles.flap} ${styles.bottom}`} aria-hidden="true" />
        <span className={`${styles.flap} ${styles.left}`} aria-hidden="true" />
        <span className={`${styles.flap} ${styles.right}`} aria-hidden="true" />

        <span className={styles.seal} aria-hidden="true">
          {/* Blank wax; the monogram is live type so initials are a config change. */}
          <Image
            src={images.opening.seal}
            alt=""
            className={styles.sealImage}
            width={640}
            height={640}
            priority
          />
          <span className={styles.monogram}>{monogram}</span>
        </span>
      </button>

      <p className={styles.prompt}>
        <span className={`t-label ${styles.promptText}`}>Tap to open</span>
        <ChevronDown />
      </p>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      width="16"
      height="9"
      viewBox="0 0 16 9"
      fill="none"
      stroke="var(--color-gold-antique)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ opacity: 0.6 }}
    >
      <path d="M1 1l7 7 7-7" />
    </svg>
  );
}
