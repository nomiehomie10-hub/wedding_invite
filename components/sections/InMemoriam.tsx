import { wedding } from "@/data/wedding";
import { OrnamentMinor } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A remembrance, held on its own quiet panel between the family names and the
 * running order of the evening.
 *
 * Deliberately the most restrained stage in the invitation: no arch, no
 * illustration, one hairline rule and a single line of script. Omitted
 * entirely when `wedding.memorial` is null.
 */
export function InMemoriam() {
  const memorial = wedding.memorial;
  if (!memorial) return null;

  return (
    <section className="stage" aria-label="In loving memory">
      <div className="column">
        <Reveal>
          <figure className="m-0 text-center">
            <span className="rule-gold mx-auto mb-8 block w-10" aria-hidden="true" />

            <blockquote className="m-0">
              <p className="t-body mx-auto max-w-[24rem] text-balance">{memorial.lead}</p>

              <p
                className="t-script my-5 text-gold-antique"
                style={{ fontSize: "clamp(1.5rem, 6.8vw, 2.1rem)" }}
              >
                {memorial.name}
              </p>

              <p className="t-body mx-auto max-w-[24rem] text-balance">{memorial.tail}</p>
            </blockquote>

            <OrnamentMinor className="mx-auto mt-8 opacity-70" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
