"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * The invitation's one entrance gesture: lift, settle, resolve.
 *
 * Every stage uses this rather than its own animation, which is what keeps the
 * scroll feeling like a single continuous document. The motion itself lives in
 * CSS (`.reveal`), so `prefers-reduced-motion` neutralises it centrally.
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  threshold?: number;
  as?: ElementType;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });
  const settleTimer = useRef<number | undefined>(undefined);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  // Release the compositing hint once the entrance is over, so a long page
  // isn't holding a layer per element.
  useEffect(() => {
    if (!inView) return;
    settleTimer.current = window.setTimeout(() => {
      if (nodeRef.current) nodeRef.current.dataset.settled = "true";
    }, delay + 1200);
    return () => window.clearTimeout(settleTimer.current);
  }, [inView, delay]);

  return (
    <Tag
      ref={(node: HTMLDivElement | null) => {
        ref.current = node;
        nodeRef.current = node;
      }}
      className={`reveal ${className}`}
      data-visible={inView ? "true" : "false"}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
