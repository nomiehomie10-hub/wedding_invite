"use client";

import { useEffect, useRef } from "react";
import { OpeningEnvelope } from "./opening/OpeningEnvelope";
import { HeroSection } from "./sections/HeroSection";
import { DateReveal } from "./sections/DateReveal";
import { InvitationDetails } from "./sections/InvitationDetails";
import { InMemoriam } from "./sections/InMemoriam";
import { EventsTimeline } from "./sections/EventsTimeline";
import { Countdown } from "./sections/Countdown";
import { LocationSection } from "./sections/LocationSection";
import { ClosingSection } from "./sections/ClosingSection";
import { MusicControl } from "./ui/MusicControl";
import { PageMargins } from "./ui/PageMargins";
import { useSealState } from "@/hooks/useSealState";

/**
 * The invitation, start to finish.
 *
 * One continuous document rather than a set of sections: the envelope opens
 * into the hero, and everything after it shares the same paper, the same gold
 * and the same vertical rhythm. This component owns only the seal state and
 * the moment the letter becomes readable.
 */
export function InvitationExperience() {
  const { stage, open, isOpen } = useSealState();
  const letterRef = useRef<HTMLDivElement>(null);

  // The guest opened the seal at the top of the letter; make sure that is
  // where they are, even if the browser restored a previous scroll position.
  useEffect(() => {
    if (stage !== "opening") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stage]);

  return (
    <>
      {/*
       * The letter is always mounted, so its images and fonts are already
       * fetched by the time the fold finishes. It is hidden from assistive tech
       * and from tab order until the seal is broken.
       */}
      <div
        ref={letterRef}
        id="invitation"
        aria-hidden={isOpen ? undefined : "true"}
        inert={!isOpen}
      >
        <PageMargins />

        <main className="relative z-10">
          <HeroSection />
          <DateReveal />
          <InvitationDetails />
          <InMemoriam />
          <EventsTimeline />
          <Countdown />
          <LocationSection />
          <ClosingSection />
        </main>
      </div>

      {/*
       * Server-rendered so the closed invitation is the very first thing
       * painted. A guest who has already opened it this session never sees it:
       * the head script hides it via `html[data-sealed="false"]` before paint,
       * and the effect below unmounts it a moment later.
       */}
      {stage !== "opened" && <OpeningEnvelope stage={stage} onOpen={open} />}

      {isOpen && <MusicControl />}
    </>
  );
}
