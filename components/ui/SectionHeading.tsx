import { Reveal } from "./Reveal";

/**
 * Every stage opens the same way: a script title over a hairline rule. Reusing
 * one component is what stops the page reading as a set of separate sections.
 */
export function SectionHeading({
  id,
  title,
  subtitle,
  className = "",
}: {
  id?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      <h2
        id={id}
        className="t-script text-espresso"
        style={{ fontSize: "clamp(1.9rem, 8vw, 2.6rem)" }}
      >
        {title}
      </h2>
      {subtitle && <p className="t-caps mt-2">{subtitle}</p>}
      <span
        className="rule-gold mx-auto mt-3 block w-16"
        aria-hidden="true"
      />
    </Reveal>
  );
}
