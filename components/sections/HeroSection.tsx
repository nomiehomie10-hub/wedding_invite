"use client";

import { useRef } from "react";
import Image from "next/image";
import { images } from "@/data/images";
import { wedding } from "@/data/wedding";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { nameSize } from "@/lib/nameFit";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import styles from "./HeroSection.module.css";

/**
 * The cinematic opening plate.
 *
 * Scroll-linked motion is deliberately small — a slow push on the photograph
 * and a lift on the type. The arch stays put, because an arch that drifts stops
 * reading as architecture.
 */
export function HeroSection() {
  const reduced = useReducedMotion();
  const size = nameSize("hero", wedding.groom.name, wedding.bride.name);
  const imageRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const sectionRef = useScrollProgress<HTMLElement>((progress) => {
    // The hero starts at progress ≈ 0.5 (fully in view); only the second half
    // of its travel is the scroll away from it.
    const p = Math.max(0, (progress - 0.5) * 2);

    if (imageRef.current) {
      imageRef.current.style.transform = `scale(${1 + p * 0.06}) translate3d(0, ${p * -10}px, 0)`;
    }
    if (copyRef.current) {
      copyRef.current.style.transform = `translate3d(0, ${p * -46}px, 0)`;
      copyRef.current.style.opacity = String(Math.max(0, 1 - p * 1.9));
    }
    if (indicatorRef.current) {
      indicatorRef.current.style.opacity = String(Math.max(0, 1 - p * 4));
    }
  }, !reduced);

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="Welcome">
      <div className={styles.window}>
        <Image
          ref={imageRef}
          src={images.hero.couple}
          alt="The couple beneath a marble arch at sunset, a palace and reflecting pool beyond"
          className={styles.image}
          width={940}
          height={1672}
          priority
          sizes="(max-width: 34rem) 100vw, 34rem"
        />
        <div className={styles.wash} aria-hidden="true" />
        <div className={styles.plateEdge} aria-hidden="true" />

        <div ref={copyRef} className={styles.copy}>
          <p className={`t-caps ${styles.welcome}`}>Welcome to the</p>
          <p className={styles.ceremony}>{wedding.ceremony.name}</p>
          <p className={styles.of}>of</p>

          <h1>
            <span className={styles.name} style={{ fontSize: size }}>
              {wedding.groom.name}
            </span>
            <span className={styles.amp} aria-hidden="true">
              &amp;
            </span>
            <span className="sr-only">and</span>
            <span className={styles.name} style={{ fontSize: size }}>
              {wedding.bride.name}
            </span>
          </h1>
        </div>

        <ScrollIndicator ref={indicatorRef} />
      </div>
    </section>
  );
}
