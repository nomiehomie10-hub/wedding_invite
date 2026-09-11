"use client";

import { useState } from "react";
import { wedding } from "@/data/wedding";
import { ScratchCard } from "@/components/ui/ScratchCard";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Three foil panels hiding the date.
 *
 * The date lives in the DOM the whole time — the foil is a canvas laid over
 * ordinary text — so it is copyable, searchable and readable by assistive tech
 * whether or not anyone scratches.
 */
export function DateReveal() {
  const [revealedCount, setRevealedCount] = useState(0);
  const { day, month, year } = wedding.date;
  const all = revealedCount >= 3;

  const cards = [
    { value: String(day), label: "Day", size: "clamp(1.5rem, 7vw, 2.1rem)" },
    { value: month, label: "Month", size: "clamp(1rem, 4.4vw, 1.35rem)" },
    { value: String(year), label: "Year", size: "clamp(1.25rem, 5.6vw, 1.7rem)" },
  ];

  return (
    <section className="stage" aria-labelledby="date-heading">
      <div className="column">
        <SectionHeading id="date-heading" title="The Date" />

        <Reveal delay={80}>
          <p className="t-caps mt-4 flex items-center justify-center gap-2 text-center">
            <Sparkle />
            <span>Scratch to reveal the date</span>
            <Sparkle />
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-5">
            {cards.map((card) => (
              <ScratchCard
                key={card.label}
                value={card.value}
                label={card.label}
                valueSize={card.size}
                revealLabel={`Reveal the ${card.label.toLowerCase()}`}
                onReveal={() => setRevealedCount((n) => n + 1)}
              />
            ))}
          </div>
        </Reveal>

        {/* Confirms the date once, quietly, for everyone including screen readers. */}
        <p
          className="t-caps mt-8 text-center transition-opacity duration-1000"
          style={{ opacity: all ? 1 : 0 }}
          aria-live="polite"
        >
          {all ? `${day} ${month} ${year}` : ""}
        </p>

        <Reveal delay={220}>
          <Ornament className="mt-6" />
        </Reveal>
      </div>
    </section>
  );
}

function Sparkle() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="var(--color-gold-champagne)"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M4.5 0 5.5 3.5 9 4.5 5.5 5.5 4.5 9 3.5 5.5 0 4.5 3.5 3.5Z" />
    </svg>
  );
}
