"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ScratchCard.module.css";

/** Proportion of foil removed before the rest lifts on its own. */
const AUTO_REVEAL_AT = 0.45;
/** Scratch radius as a fraction of the card's smaller side — generous on purpose. */
const BRUSH_RATIO = 0.19;
/** Only sample the alpha channel every Nth stroke; it is the expensive part. */
const SAMPLE_EVERY = 6;

type Props = {
  /** The real value underneath. Rendered as text, never painted into canvas. */
  value: string;
  label: string;
  /** Announced to assistive tech and used by the keyboard fallback. */
  revealLabel: string;
  valueSize?: string;
  onReveal?: () => void;
};

/**
 * A foil panel the guest rubs away.
 *
 * The canvas is decoration over live HTML: keyboard users, screen readers and
 * anyone who simply taps get the date without scratching at all.
 */
export function ScratchCard({ value, label, revealLabel, valueSize, onReveal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const revealedRef = useRef(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    onReveal?.();
  }, [onReveal]);

  /** Paint (or repaint) the champagne foil at the current device resolution. */
  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Brushed foil: a raking highlight across an antique-gold ground.
    const sweep = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    sweep.addColorStop(0, "#a5865d");
    sweep.addColorStop(0.24, "#c9b190");
    sweep.addColorStop(0.42, "#e6d8bd");
    sweep.addColorStop(0.58, "#cdb99b");
    sweep.addColorStop(0.78, "#9c7f57");
    sweep.addColorStop(1, "#bda27b");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Fine horizontal tooling marks, so the foil catches light like metal.
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = "#6d5433";
    ctx.lineWidth = 1;
    for (let y = 0; y < rect.height; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(rect.width, y + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, []);

  // Repaint on mount and whenever the card is resized.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paintFoil();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => paintFoil());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paintFoil]);

  /** Fraction of the foil already erased, measured from the alpha channel. */
  const erasedFraction = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return 0;

    // Sample a coarse grid rather than every pixel — 32x32 is ample to decide
    // "mostly gone" and costs a fraction of a full readback.
    const step = Math.max(1, Math.floor(canvas.width / 32));
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        total++;
        if (data[(y * canvas.width + x) * 4 + 3] < 40) clear++;
      }
    }
    return total === 0 ? 0 : clear / total;
  }, []);

  const scratchTo = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const radius = Math.min(rect.width, rect.height) * BRUSH_RATIO;

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = radius * 2;

      ctx.beginPath();
      if (last.current) {
        ctx.moveTo(last.current.x, last.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      // A dab at the head of the stroke, so a single tap also marks the foil.
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      last.current = { x, y };

      if (++strokes.current % SAMPLE_EVERY === 0 && erasedFraction() >= AUTO_REVEAL_AT) {
        reveal();
      }
    },
    [erasedFraction, reveal],
  );

  const toLocal = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    drawing.current = true;
    last.current = null;
    // Capture so a stroke that wanders off the card keeps scratching it.
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = toLocal(event);
    scratchTo(x, y);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealedRef.current) return;
    const { x, y } = toLocal(event);
    scratchTo(x, y);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    last.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // Anyone who has done most of the work shouldn't have to finish the corners.
    if (!revealedRef.current && erasedFraction() >= AUTO_REVEAL_AT * 0.75) reveal();
  };

  return (
    <div>
      <div className={styles.card} data-revealed={revealed}>
        <div className={styles.value}>
          <span
            className={styles.valueText}
            style={valueSize ? ({ "--value-size": valueSize } as React.CSSProperties) : undefined}
          >
            {value}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          className={styles.canvas}
          data-revealed={revealed}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>

      <p className={`t-label ${styles.label}`}>{label}</p>

      {/*
       * The accessible path. Overlaying the canvas with a button would swallow
       * every stroke, so it lives after the card: clipped away for pointer
       * users, and a visible gold link the moment it takes keyboard focus.
       */}
      {!revealed && (
        <button type="button" className={styles.revealButton} onClick={reveal}>
          {revealLabel}
        </button>
      )}
    </div>
  );
}
