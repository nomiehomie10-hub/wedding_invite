"use client";

import Image from "next/image";
import { images } from "@/data/images";
import type { WeddingEvent } from "@/data/wedding";
import { useInView } from "@/hooks/useInView";
import styles from "@/components/sections/EventsTimeline.module.css";

/**
 * One moment in the evening: a time, a title, and a line-engraved illustration,
 * arranged either side of the spine.
 */
export function TimelineEvent({
  event,
  index,
  delay,
}: {
  event: WeddingEvent;
  index: number;
  delay: number;
}) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.35 });
  const textOnRight = index % 2 === 0;
  const illustration = images.timeline[event.image];

  return (
    <li
      ref={ref}
      className={`reveal ${styles.row}`}
      data-visible={inView ? "true" : "false"}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      <div
        className={`${styles.side} ${styles.sideText} ${
          textOnRight ? styles.textRight : styles.textLeft
        }`}
      >
        <p className={styles.time}>
          <time>{event.time}</time>
        </p>
        <p className={styles.title}>{event.title}</p>
      </div>

      <span className={styles.node} aria-hidden="true">
        <Node />
      </span>

      <div
        className={`${styles.side} ${styles.sideArt} ${
          textOnRight ? styles.artLeft : styles.artRight
        }`}
      >
        {illustration && (
          <Image
            src={illustration}
            alt=""
            width={420}
            height={420}
            className={styles.illustration}
            loading="lazy"
            sizes="(max-width: 34rem) 30vw, 10rem"
            aria-hidden="true"
          />
        )}
      </div>
    </li>
  );
}

function Node() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="var(--color-ivory)"
      stroke="var(--color-gold-antique)"
      strokeWidth="1"
    >
      <path d="M6.5 1 12 6.5 6.5 12 1 6.5Z" />
    </svg>
  );
}
