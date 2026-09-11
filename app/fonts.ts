import { Cormorant_Garamond, Pinyon_Script, Amiri, Inter } from "next/font/google";

/** Primary serif — every heading, every line of body copy. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/** Calligraphic accent. Reserved for names and a handful of phrases. */
export const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

/** Naskh, for the bismillah. */
export const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

/** Tiny uppercase labels only — never body copy. */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-label",
  display: "swap",
});

export const fontVariables = [
  cormorant.variable,
  pinyon.variable,
  amiri.variable,
  inter.variable,
].join(" ");
