import { Fragment } from "react";
import Image from "next/image";
import { images } from "@/data/images";
import { couple, wedding } from "@/data/wedding";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { nameSize } from "@/lib/nameFit";

/**
 * The formal panel — the words that make this an invitation rather than a page.
 *
 * Held inside a drawn arch and given a great deal of air; the two names are the
 * only things here allowed to be large.
 */
export function InvitationDetails() {
  const { invitation } = wedding;
  const size = nameSize("panel", ...couple.map((person) => person.name));

  return (
    <section className="stage" aria-labelledby="invitation-heading">
      <div className="column">
        <Reveal>
          <ArchFrame>
            <div className="pt-2 pb-10 text-center">
              <p
                className="t-arabic text-gold-antique"
                style={{ fontSize: "clamp(1.05rem, 4.6vw, 1.35rem)" }}
                lang="ar"
              >
                {invitation.bismillah}
              </p>

              <span className="rule-gold mx-auto mt-6 mb-8 block w-12" aria-hidden="true" />

              <h2 id="invitation-heading" className="t-caps">
                You are invited to the
                <br />
                {wedding.ceremony.name} of
              </h2>

              {couple.map((person, index) => (
                <Fragment key={person.name}>
                  {index > 0 && (
                    <p
                      className="t-script my-1 text-gold-antique"
                      style={{ fontSize: "clamp(1.15rem, 5vw, 1.5rem)" }}
                    >
                      with
                    </p>
                  )}
                  <Party
                    name={person.name}
                    relation={person.relation}
                    parents={person.parents}
                    size={size}
                  />
                </Fragment>
              ))}

              <div className="mt-12">
                <p
                  className="t-script text-espresso"
                  style={{ fontSize: "clamp(1.35rem, 6vw, 1.85rem)" }}
                >
                  {invitation.salutation}
                </p>
                <p className="t-body mx-auto mt-4 max-w-[22rem] text-balance">
                  {invitation.letter}
                </p>
              </div>
            </div>
          </ArchFrame>
        </Reveal>

        {/* A floral spray breaking the frame, as on the printed sheet. */}
        <Reveal delay={140} className="relative">
          <Image
            src={images.florals.corner}
            alt=""
            width={900}
            height={1350}
            className="pointer-events-none absolute -top-24 -left-6 w-28 opacity-70 sm:w-36"
            aria-hidden="true"
          />
          <Ornament className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}

function Party({
  name,
  relation,
  parents,
  size,
}: {
  name: string;
  relation: string;
  parents: string;
  size: string;
}) {
  return (
    <div className="mt-7">
      <p
        className="t-script text-espresso"
        style={{ fontSize: size, lineHeight: 1 }}
      >
        {name}
      </p>
      <p className="t-label mt-4">{relation}</p>
      {/* Balanced so a long honorific splits evenly instead of orphaning the
          surname on a line of its own. */}
      <p
        className="t-caps mx-auto mt-1 max-w-[20rem] text-balance"
        style={{ letterSpacing: "0.16em" }}
      >
        {parents}
      </p>
    </div>
  );
}
