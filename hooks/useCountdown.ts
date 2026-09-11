"use client";

import { useEffect, useState } from "react";

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target has passed — the countdown is replaced, not negated. */
  arrived: boolean;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function remainingUntil(target: number): Remaining {
  const delta = target - Date.now();
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true };
  }
  return {
    days: Math.floor(delta / DAY),
    hours: Math.floor((delta % DAY) / HOUR),
    minutes: Math.floor((delta % HOUR) / MINUTE),
    seconds: Math.floor((delta % MINUTE) / SECOND),
    arrived: false,
  };
}

/**
 * Ticks once a second toward an ISO date.
 *
 * Returns `null` until after hydration: the server has no idea what "now" is on
 * the guest's device, and rendering a guess would mismatch. Callers render
 * stable placeholder glyphs for that first frame.
 */
export function useCountdown(iso: string): Remaining | null {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = new Date(iso).getTime();
    if (Number.isNaN(target)) return;

    const tick = () => setRemaining(remainingUntil(target));
    tick();

    const id = window.setInterval(tick, SECOND);
    // A backgrounded tab throttles the interval; resync the moment it returns.
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [iso]);

  return remaining;
}
