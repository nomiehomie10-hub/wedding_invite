"use client";

import { useRef } from "react";
import { wedding } from "@/data/wedding";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Ornament } from "@/components/ui/Ornament";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineEvent } from "@/components/ui/TimelineEvent";
import styles from "./EventsTimeline.module.css";

/**
 * The running order of the evening.
 *
 * The gold spine draws itself as the guest arrives, and each event settles in
 * turn rather than the whole column appearing at once.
 */
export function EventsTimeline() {
  const reduced = useReducedMotion();
  const fillRef = useRef<HTMLSpanElement>(null);

  const trackRef = useScrollProgress<HTMLDivElement>((progress) => {
    if (!fillRef.current) return;
    // Draw across the middle of the element's travel, so the line is complete
    // by the time the last event is read rather than long after.
    const drawn = Math.min(1, Math.max(0, (progress - 0.18) / 0.52));
    fillRef.current.style.transform = `scaleY(${drawn})`;
  }, !reduced);

  return (
    <section className="stage" aria-labelledby="timeline-heading">
      <div className="column">
        <SectionHeading id="timeline-heading" title="Wedding Timeline" />

        <div ref={trackRef} className={`${styles.timeline} mt-10`}>
          <span className={styles.spine} aria-hidden="true" />
          <span
            ref={fillRef}
            className={styles.spineFill}
            aria-hidden="true"
            style={reduced ? { transform: "scaleY(1)" } : undefined}
          />

          <ol>
            {wedding.events.map((event, index) => (
              <TimelineEvent
                key={event.title}
                event={event}
                index={index}
                // Stagger within a row's own entrance, not across the whole list —
                // a long list would otherwise finish seconds after it is read.
                delay={(index % 3) * 110}
              />
            ))}
          </ol>
        </div>

        <Ornament className="mt-4" />
      </div>
    </section>
  );
}
