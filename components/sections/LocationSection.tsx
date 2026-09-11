import { images } from "@/data/images";
import { wedding } from "@/data/wedding";
import { MapCard } from "@/components/ui/MapCard";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VenuePlate } from "@/components/ui/VenuePlate";

/** Where the evening happens: city, house, room, and a way to get there. */
export function LocationSection() {
  const { city, name, room } = wedding.venue;

  return (
    <section className="stage" aria-labelledby="location-heading">
      <div className="column">
        <SectionHeading id="location-heading" title="Location" subtitle={city} />

        <Reveal delay={90}>
          <address className="mt-6 text-center not-italic">
            <p className="t-body text-espresso" style={{ fontSize: "clamp(1rem, 3.6vw, 1.15rem)" }}>
              {name}
            </p>
            {room && <p className="t-caps mt-1">{room}</p>}
          </address>
        </Reveal>

        {/*
         * The arch plate is a frame for a photograph. Without one it would
         * only restate the address directly above it, so it is left out
         * entirely rather than filled with repetition.
         */}
        {images.venue.exterior && (
          <Reveal delay={140}>
            <div className="mt-10">
              <VenuePlate />
            </div>
          </Reveal>
        )}

        <Reveal delay={120}>
          <div className="mt-14">
            <MapCard />
          </div>
        </Reveal>

        <Ornament className="mt-14" />
      </div>
    </section>
  );
}
