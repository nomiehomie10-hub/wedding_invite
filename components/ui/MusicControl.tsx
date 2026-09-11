"use client";

import { wedding } from "@/data/wedding";
import { useAudioTrack } from "@/hooks/useAudioTrack";

/**
 * A small piece of stationery that happens to play music.
 *
 * Never autoplays, appears only once the invitation is open, and removes itself
 * entirely if the track is missing — an inert button would be worse than none.
 */
export function MusicControl() {
  const { available, playing, toggle } = useAudioTrack(wedding.audio.src);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Pause the music" : "Play the music"}
      className="fixed z-40 grid size-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--color-gold-champagne)_55%,transparent)] bg-[var(--color-paper-light)]/92 backdrop-blur-[2px] transition-transform duration-300 hover:scale-105 active:scale-95"
      style={{
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        boxShadow: "0 6px 18px -10px rgba(74, 58, 44, 0.55)",
      }}
    >
      {playing ? <PauseGlyph /> : <PlayGlyph />}
    </button>
  );
}

function PlayGlyph() {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="var(--color-gold-antique)" aria-hidden="true">
      <path d="M2 1.4a.7.7 0 0 1 1.06-.6l8.3 5.6a.7.7 0 0 1 0 1.2l-8.3 5.6A.7.7 0 0 1 2 12.6Z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="var(--color-gold-antique)" aria-hidden="true">
      <rect x="1" y="1" width="3.4" height="12" rx="1" />
      <rect x="7.6" y="1" width="3.4" height="12" rx="1" />
    </svg>
  );
}
