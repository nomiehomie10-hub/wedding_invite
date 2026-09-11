"use client";

import { wedding } from "@/data/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

/**
 * The wait, counted out.
 *
 * Renders neutral placeholder glyphs until the client has a clock, which keeps
 * the markup identical on both sides of hydration and reserves the exact final
 * width so nothing shifts when the first tick lands.
 */
export function Countdown() {
  const remaining = useCountdown(wedding.date.iso);

  if (remaining?.arrived) {
    return (
      <section className="stage" aria-labelledby="countdown-heading">
        <div className="column text-center">
          <SectionHeading id="countdown-heading" title="The Celebration Begins" />
          <Reveal delay={100}>
            <p
              className="t-script mt-10 text-gold-antique"
              style={{ fontSize: "clamp(2rem, 9vw, 3rem)" }}
            >
              Today is the day.
            </p>
          </Reveal>
          <Ornament className="mt-10" />
        </div>
      </section>
    );
  }

  const values = remaining
    ? [remaining.days, remaining.hours, remaining.minutes, remaining.seconds]
    : null;

  return (
    <section className="stage" aria-labelledby="countdown-heading">
      <div className="column">
        <SectionHeading id="countdown-heading" title="The Celebration Begins" />

        <Reveal delay={100}>
          <div
            className="mt-9 flex items-start justify-center"
            role="timer"
            aria-live="off"
            aria-label={`Counting down to ${wedding.date.day} ${wedding.date.month} ${wedding.date.year}`}
          >
            {UNITS.map((unit, index) => (
              <div key={unit} className="flex items-start">
                {index > 0 && (
                  <span
                    className="px-0.5 text-[var(--color-gold-foil)] sm:px-1"
                    style={{ fontSize: "clamp(1.3rem, 5.5vw, 2rem)", lineHeight: 1.2 }}
                    aria-hidden="true"
                  >
                    :
                  </span>
                )}
                <div className="text-center">
                  <span
                    className="foil block"
                    style={{
                      fontSize: "clamp(1.75rem, 8vw, 2.7rem)",
                      lineHeight: 1.2,
                      letterSpacing: "0.01em",
                      // Cormorant defaults to old-style figures, which set
                      // digits at three different heights — wrong for a clock.
                      fontVariantNumeric: "lining-nums tabular-nums",
                      fontFeatureSettings: '"lnum" 1, "tnum" 1',
                      // Reserve the widest plausible value so a tick can never
                      // nudge the row.
                      minWidth: index === 0 ? "3.2ch" : "2.4ch",
                    }}
                  >
                    {values ? pad(values[index], index === 0 ? 1 : 2) : "––"}
                  </span>
                  <span className="t-label mt-1 block">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Ornament className="mt-10" />
      </div>
    </section>
  );
}

/** Never shows a negative value — the arrived branch takes over instead. */
function pad(value: number, min: number) {
  return String(Math.max(0, value)).padStart(min, "0");
}
