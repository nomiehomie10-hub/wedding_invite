"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "ready" | "unavailable";

/**
 * A single ambient track, created lazily and never autoplayed.
 *
 * If the file is missing or the browser refuses to decode it the hook reports
 * `unavailable` and the caller removes its control — the invitation carries on
 * silently rather than showing a button that does nothing.
 */
export function useAudioTrack(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) {
      setStatus("unavailable");
      return;
    }

    const audio = new Audio();
    // "metadata" rather than "none": a few kilobytes buys us a definitive
    // answer about whether the file is there. With "none" the browser fetches
    // nothing, no error is ever raised, and the control offers a track that
    // does not exist.
    audio.preload = "metadata";
    audio.loop = true;
    audio.volume = 0;
    audio.src = src;
    audioRef.current = audio;

    const onReady = () => setStatus("ready");
    audio.addEventListener("loadedmetadata", onReady);
    const onError = () => {
      setStatus("unavailable");
      setPlaying(false);
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onReady);
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);

  /** Ease the gain rather than cutting it — an abrupt start breaks the spell. */
  const fadeTo = useCallback((target: number, ms: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const from = audio.volume;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      if (!audioRef.current) return;
      audioRef.current.volume = from + (target - from) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      fadeTo(0, 500);
      window.setTimeout(() => audioRef.current?.pause(), 520);
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
      setStatus("ready");
      fadeTo(0.4, 1200);
    } catch {
      // Blocked by autoplay policy or an undecodable file. Either way the
      // control should stop offering something that cannot happen.
      setStatus("unavailable");
      setPlaying(false);
    }
  }, [playing, fadeTo]);

  // Hidden until the track is proven to exist, rather than shown until it is
  // proven not to.
  return { available: status === "ready", playing, toggle };
}
