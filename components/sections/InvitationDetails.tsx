import Image from "next/image";
import { images } from "@/data/images";
import { wedding } from "@/data/wedding";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The formal panel — the words that make this an invitation rather than a page.
 *
 * Held inside a drawn arch and given a great deal of air; the two names are the
 * only things here allowed to be large.
 */
export function InvitationDetails() {
  const { groom, bride, invitation } = wedding;

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

              <Party name={groom.name} relation="Son of" parents={groom.parents} />

              <p className="t-script my-1 text-gold-antique" style={{ fontSize: "clamp(1.15rem, 5vw, 1.5rem)" }}>
                with
              </p>

              <Party name={bride.name} relation="Daughter of" parents={bride.parents} />

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
}: {
  name: string;
  relation: string;
  parents: string;
}) {
  return (
    <div className="mt-7">
      <p
        className="t-script text-espresso"
        style={{ fontSize: "clamp(2.5rem, 12vw, 3.6rem)", lineHeight: 1 }}
      >
        {name}
      </p>
      <p className="t-label mt-4">{relation}</p>
      <p className="t-caps mt-1" style={{ letterSpacing: "0.18em" }}>
        {parents}
      </p>
    </div>
  );
}
