import { forwardRef } from "react";
import styles from "@/components/sections/HeroSection.module.css";

/** The single understated cue that the invitation continues below. */
export const ScrollIndicator = forwardRef<HTMLDivElement>(function ScrollIndicator(_, ref) {
  return (
    <div ref={ref} className={styles.indicator} aria-hidden="true">
      <span className={styles.indicatorText}>Scroll down</span>
      <svg
        width="18"
        height="10"
        viewBox="0 0 18 10"
        fill="none"
        stroke="var(--color-gold-antique)"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.chevron}
      >
        <path d="M1 1l8 7.5L17 1" />
      </svg>
    </div>
  );
});
