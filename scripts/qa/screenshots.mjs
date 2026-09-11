import { chromium } from "playwright";
import fs from "node:fs/promises";

const OUT = process.argv[2];
const URL = process.env.SHOT_URL || "http://localhost:3000/";
const errors = [];

const browser = await chromium.launch();

async function session(name, { width, height, dpr = 2, reduced = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    isMobile: width < 700,
    hasTouch: width < 700,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${name}] console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${name}] pageerror: ${e.message}`));
  // The map iframe keeps the network busy indefinitely; wait for load only.
  // The map iframe never lets the load event fire; settle on a fixed wait.
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);
  return { ctx, page };
}

// --- closed state ---
{
  const { ctx, page } = await session("closed", { width: 393, height: 852 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/01-closed.png` });

  // open it
  await page.locator("button[aria-label^='Open the invitation']").click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/02-folding.png` });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/03-hero.png` });

  // check for horizontal overflow
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) errors.push(`[mobile 393] horizontal overflow: ${overflow}px`);

  // scroll through the journey
  const H = 852;
  const total = await page.evaluate(() => document.body.scrollHeight);
  let i = 4;
  for (let y = Math.round(H * 0.85); y < total; y += Math.round(H * 0.85)) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${String(i).padStart(2, "0")}-scroll.png` });
    i++;
    if (i > 16) break;
  }
  await ctx.close();
}

// --- desktop ---
{
  const { ctx, page } = await session("desktop", { width: 1440, height: 900, dpr: 1 });
  await page.locator("button[aria-label^='Open the invitation']").click();
  await page.waitForTimeout(2400);
  await page.screenshot({ path: `${OUT}/d1-hero.png` });
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) errors.push(`[desktop 1440] horizontal overflow: ${overflow}px`);
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/d2.png` });
  await page.evaluate(() => window.scrollTo({ top: 3200, behavior: "instant" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/d3.png` });
  await ctx.close();
}

await fs.writeFile(`${OUT}/errors.txt`, errors.join("\n") || "none");
console.log(errors.length ? errors.join("\n") : "no console errors, no overflow");
await browser.close();
