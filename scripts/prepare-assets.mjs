/**
 * Asset pipeline.
 *
 * Reads the original supplied artwork from /assets/source and writes optimised,
 * correctly-named WebP into /public/images/<category>. Idempotent — safe to
 * re-run after dropping in replacement artwork.
 *
 *   npm run assets
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("assets/source");
const OUT = path.resolve("public/images");

/** Original filenames of the supplied artwork. */
const S = {
  seal: "0031D4C4-94EB-415D-8175-E02EA1431B40.PNG",
  frameFloral: "079711BF-80ED-440E-AE30-656722416F1B.PNG",
  timelineSheet: "0A5F4DA8-8FAB-4112-9DCA-E559783E5A32.PNG",
  panelArch: "34DDCD95-A201-4288-920A-5987F878CBD0.PNG",
  cornerFloral: "5D2A4B6D-E160-4EAD-94B9-F1A6D9E89AD4.PNG",
  heroCouple: "65884123-B252-4F9D-92CF-1F54F0F033A5.PNG",
  archColumned: "7EA42D90-B044-4C1C-8113-DE2C68636580.PNG",
  archOrnate: "A26BE998-F4EF-4FF5-950E-67AA9525C7A9.PNG",
  envelopeFace: "A29C2964-628F-4F72-9813-C978B7B9CC4F.PNG",
};

/**
 * The six timeline illustrations arrive as one 3x2 contact sheet. Tiles are
 * listed in reading order and mapped onto the event slugs used by wedding.ts.
 */
const TIMELINE_TILES = [
  "arrival",         // champagne flutes
  "bride-entrance",  // veiled entrance arch
  "isha",            // mosque and crescent
  "nikah",           // canopy and Qur'an
  "dinner",          // laid table
  "celebration",     // dhol and parasol
];

/**
 * Bounds of the card within the envelope photograph, found by scanning for the
 * brightness step between the paper and the table it rests on.
 */
const ENVELOPE_CARD = { left: 130, top: 88, width: 866, height: 1222 };

const src = (key) => path.join(SRC, S[key]);

async function ensureDirs() {
  for (const d of ["opening", "hero", "florals", "architecture", "timeline", "venue", "closing"]) {
    await mkdir(path.join(OUT, d), { recursive: true });
  }
}

/** Write a WebP, preserving alpha, capped to `width`. */
async function emit(input, rel, width, { quality = 86, lossless = false } = {}) {
  const file = path.join(OUT, rel);
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, lossless, effort: 6, alphaQuality: 100 })
    .toFile(file);
  console.log(`  ✓ ${rel}`);
}

/**
 * Trim the fully-transparent margin an asset was exported with, so the artwork
 * fills its box and can be positioned predictably in CSS.
 */
async function emitTrimmed(input, rel, width, opts) {
  const buf = await sharp(input).trim({ threshold: 1 }).toBuffer();
  await emit(buf, rel, width, opts);
}

async function sliceTimeline() {
  const image = sharp(src("timelineSheet"));
  const { width, height } = await image.metadata();
  const tileW = Math.floor(width / 3);
  const tileH = Math.floor(height / 2);

  for (let i = 0; i < TIMELINE_TILES.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    // Re-read per tile: sharp instances are single-use once a pipeline runs.
    const tile = await sharp(src("timelineSheet"))
      .extract({ left: col * tileW, top: row * tileH, width: tileW, height: tileH })
      .trim({ threshold: 1 })
      .toBuffer();
    await emit(tile, `timeline/${TIMELINE_TILES[i]}.webp`, 420);
  }
}

async function main() {
  await ensureDirs();
  const present = new Set(await readdir(SRC));
  const missing = Object.values(S).filter((f) => !present.has(f));
  if (missing.length) {
    console.warn(`! missing source artwork, skipping those: ${missing.join(", ")}`);
  }

  console.log("opening/");
  // The source is a photograph of the card on a table. Crop to the card itself
  // so the flaps are pure invitation paper, edge to edge.
  const envelope = await sharp(src("envelopeFace"))
    .extract(ENVELOPE_CARD)
    .toBuffer();
  await emit(envelope, "opening/envelope-face.webp", 1000, { quality: 90 });
  await emitTrimmed(src("seal"), "opening/seal.webp", 640, { quality: 92 });

  console.log("hero/");
  await emit(src("heroCouple"), "hero/couple.webp", 940, { quality: 88 });

  console.log("architecture/");
  await emitTrimmed(src("archOrnate"), "architecture/arch-ornate.webp", 1024);
  await emitTrimmed(src("archColumned"), "architecture/arch-columned.webp", 1024);
  await emitTrimmed(src("panelArch"), "architecture/panel-arch.webp", 1024, { quality: 90 });

  console.log("florals/");
  await emitTrimmed(src("frameFloral"), "florals/frame.webp", 1024);
  await emitTrimmed(src("cornerFloral"), "florals/corner.webp", 900);
  // Mirrored variants so a spray can sit in any corner without CSS transforms
  // fighting the drop shadow.
  const corner = await sharp(src("cornerFloral")).trim({ threshold: 1 }).toBuffer();
  await emit(await sharp(corner).flop().toBuffer(), "florals/corner-right.webp", 900);

  console.log("timeline/");
  await sliceTimeline();

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
