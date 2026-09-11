"use client";

import { useCallback, useEffect, useState } from "react";

export type SealStage = "closed" | "opening" | "opened";

const STORAGE_KEY = "invitationOpened";

/** How long the fold animation runs before the letter takes over. */
export const OPEN_DURATION = 1800;

/**
 * Owns the closed → opening → opened progression and remembers, for the rest of
 * the browser session, that the guest has already broken the seal.
 *
 * Starts as `"closed"` on the server and on first paint, then resolves from
 * sessionStorage in an effect — reading storage during render would desync
 * hydration.
 */
export function useSealState() {
  const [stage, setStage] = useState<SealStage>("closed");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alreadyOpened = false;
    try {
      alreadyOpened = window.sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // Private mode or blocked storage: fall through and simply play the
      // opening again. Never a hard failure.
    }
    if (alreadyOpened) setStage("opened");
    setHydrated(true);
  }, []);

  const open = useCallback(() => {
    setStage((current) => (current === "closed" ? "opening" : current));
  }, []);

  // Advance to `opened` when the fold finishes, and persist the fact.
  useEffect(() => {
    if (stage !== "opening") return;

    const id = window.setTimeout(() => {
      setStage("opened");
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {
        /* storage unavailable — the experience is unaffected */
      }
    }, OPEN_DURATION);

    return () => window.clearTimeout(id);
  }, [stage]);

  /*
   * Publishes the stage to the document so CSS can drive the hand-over:
   *   "true"    sealed — letter hidden, scroll locked
   *   "opening" folding — letter rising into view, scroll still locked
   *   "false"   open — letter settled, scroll released
   * The pre-hydration script in the document head sets this first; from here
   * on React owns it.
   */
  useEffect(() => {
    document.documentElement.dataset.sealed =
      stage === "opened" ? "false" : stage === "opening" ? "opening" : "true";
  }, [stage]);

  return { stage, hydrated, open, isOpen: stage === "opened" };
}
