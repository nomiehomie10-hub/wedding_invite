/**
 * Sizing for names set in the calligraphic face.
 *
 * Names in the configuration range from "Ali" to "Farhanullah Khan", and a
 * single clamp that flatters one will either overflow the invitation column or
 * look timid in the other. The size steps down as the name gets longer, so a
 * name can be changed in `data/wedding.ts` without anyone re-tuning type.
 */
export type NameContext = "hero" | "panel" | "closing";

/** [short, medium, long] — one clamp per tier, per place a name appears. */
const SIZES: Record<NameContext, readonly [string, string, string]> = {
  hero: [
    "clamp(2.9rem, 13vw, 4.4rem)",
    "clamp(2.35rem, 10.4vw, 3.5rem)",
    "clamp(1.95rem, 8.4vw, 2.9rem)",
  ],
  panel: [
    "clamp(2.5rem, 12vw, 3.6rem)",
    "clamp(2.05rem, 9.6vw, 3rem)",
    "clamp(1.7rem, 7.6vw, 2.5rem)",
  ],
  closing: [
    "clamp(2.2rem, 10vw, 3.4rem)",
    "clamp(1.85rem, 8.4vw, 2.8rem)",
    "clamp(1.55rem, 6.8vw, 2.3rem)",
  ],
};

/**
 * The size for a pair of names.
 *
 * Both names are measured together and given the same size — sizing them
 * independently would set a short name larger than the one beside it, and the
 * pair would stop reading as a couple.
 */
export function nameSize(context: NameContext, ...names: string[]): string {
  const longest = Math.max(...names.map((name) => name.trim().length));
  const tier = longest <= 9 ? 0 : longest <= 15 ? 1 : 2;
  return SIZES[context][tier];
}
