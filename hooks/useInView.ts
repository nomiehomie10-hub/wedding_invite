"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number;
  /** Shrink the viewport so entrances land before the element hits the edge. */
  rootMargin?: string;
  /** Keep reporting `false` once the element leaves again. */
  repeat?: boolean;
};

/**
 * Entrance trigger built on IntersectionObserver — no scroll listener, no
 * layout reads. Disconnects itself after the first hit unless `repeat` is set.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -12% 0px",
  repeat = false,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without IntersectionObserver, show everything rather than nothing.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, repeat]);

  return { ref, inView };
}
