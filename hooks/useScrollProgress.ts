"use client";

import { useEffect, useRef } from "react";

/**
 * Reports how far a element has travelled through the viewport, from 0 as its
 * top edge reaches the bottom of the screen to 1 as its bottom edge leaves the
 * top.
 *
 * The value is handed to `onProgress` rather than stored in state: scroll-linked
 * motion has to write straight to the DOM to stay smooth. Reads are batched into
 * a single rAF tick and the listener is passive, so scrolling is never blocked.
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress: (progress: number) => void,
  enabled = true,
) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(onProgress);
  callbackRef.current = onProgress;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // When disabled, leave the DOM exactly as rendered. Writing a progress of
    // 0 here would stamp over whatever resting state the caller set for
    // reduced motion — which is how the timeline spine ended up undrawn.
    if (!enabled) return;

    let frame = 0;
    let visible = true;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const span = rect.height + viewport;
      const travelled = viewport - rect.top;
      callbackRef.current(Math.min(1, Math.max(0, travelled / span)));
    };

    const schedule = () => {
      if (frame || !visible) return;
      frame = requestAnimationFrame(measure);
    };

    // Stop doing work entirely once the element is far off screen.
    const gate = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "20% 0px" },
    );
    gate.observe(node);

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      gate.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return ref;
}
