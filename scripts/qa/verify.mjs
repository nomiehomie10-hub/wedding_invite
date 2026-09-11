/**
 * Behavioural checks for the invitation. Run with the dev or prod server up.
 *   node verify.mjs [baseUrl]
 */
import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:3000/";
const results = [];
const ok = (n, pass, detail = "") => results.push({ n, pass, detail });

const browser = await chromium.launch();

async function newPage(opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    ...opts,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  return { ctx, page, errs };
}

const openSeal = async (page) => {
  await page.locator("button[aria-label^='Open the invitation']").click();
  await page.waitForTimeout(2200);
};

// 1. Scroll is locked while sealed, and released after opening.
{
  const { ctx, page } = await newPage();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  const lockedY = await page.evaluate(() => window.scrollY);
  ok("scroll locked while sealed", lockedY === 0, `scrollY=${lockedY}`);

  await openSeal(page);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  const freeY = await page.evaluate(() => window.scrollY);
  ok("scroll released after opening", freeY > 100, `scrollY=${freeY}`);
  await ctx.close();
}

// 2. sessionStorage skips the opening on a second visit in the same session.
{
  const { ctx, page } = await newPage();
  await openSeal(page);
  const flag = await page.evaluate(() => sessionStorage.getItem("invitationOpened"));
  ok("sessionStorage flag written", flag === "true", `flag=${flag}`);

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const envelopeCount = await page.locator("button[aria-label^='Open the invitation']").count();
  const sealedAttr = await page.evaluate(() => document.documentElement.dataset.sealed);
  ok("returning visit skips the envelope", envelopeCount === 0 && sealedAttr === "false",
     `envelope=${envelopeCount} sealed=${sealedAttr}`);

  // A brand-new context (new session) should be sealed again.
  const fresh = await newPage();
  const freshCount = await fresh.page.locator("button[aria-label^='Open the invitation']").count();
  ok("a new session is sealed again", freshCount === 1, `envelope=${freshCount}`);
  await fresh.ctx.close();
  await ctx.close();
}

// 3. Scratching a card reveals it; vertical drags still scroll the page.
{
  const { ctx, page } = await newPage();
  await openSeal(page);
  const card = page.locator("canvas").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  const box = await card.boundingBox();
  await page.mouse.move(box.x + 8, box.y + 12);
  await page.mouse.down();
  for (let row = 0; row < 8; row++) {
    for (let i = 0; i <= 10; i++) {
      const x = box.x + (row % 2 ? box.width - 6 : 6) + (row % 2 ? -1 : 1) * (i / 10) * (box.width - 12);
      await page.mouse.move(x, box.y + 10 + (row / 7) * (box.height - 20));
    }
  }
  await page.mouse.up();
  await page.waitForTimeout(900);

  const revealed = await card.getAttribute("data-revealed");
  ok("scratching reveals the card", revealed === "true", `data-revealed=${revealed}`);

  // The date text is in the DOM whether or not anyone scratched.
  const dayText = await page.locator("canvas").first().locator("xpath=../div").first().innerText();
  ok("date is real text underneath", dayText.trim() === "10", `text=${dayText.trim()}`);

  // touch-action must permit vertical panning over the canvas.
  const ta = await card.evaluate((el) => getComputedStyle(el).touchAction);
  ok("canvas still allows page scroll", ta === "pan-y", `touch-action=${ta}`);
  await ctx.close();
}

// 4. Keyboard reveal without any scratching.
{
  const { ctx, page } = await newPage();
  await openSeal(page);
  const card = page.locator("canvas").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const btn = page.getByRole("button", { name: /Reveal the day/i });
  await btn.focus();
  const visible = await btn.evaluate((el) => getComputedStyle(el).position !== "absolute");
  await btn.press("Enter");
  await page.waitForTimeout(700);
  const revealed = await card.getAttribute("data-revealed");
  ok("keyboard reveals without scratching", revealed === "true", `data-revealed=${revealed}`);
  ok("reveal control becomes visible on focus", visible, `visible=${visible}`);
  await ctx.close();
}

// 5. Reduced motion: content is visible, nothing animates.
{
  const { ctx, page, errs } = await newPage({ reducedMotion: "reduce" });
  await openSeal(page);
  await page.evaluate(() => window.scrollTo({ top: 2200, behavior: "instant" }));
  await page.waitForTimeout(600);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal")].filter((el) => {
      const r = el.getBoundingClientRect();
      const onScreen = r.top < innerHeight && r.bottom > 0;
      return onScreen && parseFloat(getComputedStyle(el).opacity) < 0.9;
    }).length);
  ok("reduced motion leaves nothing invisible", hidden === 0, `${hidden} faded elements on screen`);

  const spine = await page.evaluate(() => {
    const el = document.querySelector('[class*="spineFill"]');
    return el ? getComputedStyle(el).transform : "none";
  });
  ok("timeline spine drawn without motion", spine !== "matrix(1, 0, 0, 0, 0, 0)", `transform=${spine}`);
  ok("no errors under reduced motion", errs.length === 0, errs.join("; "));
  await ctx.close();
}

// 6. Countdown ticks and never goes negative.
{
  const { ctx, page } = await newPage();
  await openSeal(page);
  const timer = page.getByRole("timer");
  await timer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const first = await timer.innerText();
  await page.waitForTimeout(1600);
  const second = await timer.innerText();
  ok("countdown ticks", first !== second, `${first.replace(/\n/g, " ")} -> ${second.replace(/\n/g, " ")}`);
  ok("countdown has no negative values", !/-\d/.test(second), second.replace(/\n/g, " "));
  await ctx.close();
}

// 7. No horizontal overflow at every target width.
{
  for (const width of [375, 390, 393, 430, 768, 1024, 1440, 1920]) {
    const { ctx, page } = await newPage({ viewport: { width, height: 900 }, isMobile: width < 700 });
    await openSeal(page);
    const over = await page.evaluate(async () => {
      // Walk the whole document, not just the initial viewport.
      const step = innerHeight * 0.8;
      let worst = 0;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => requestAnimationFrame(r));
        worst = Math.max(worst, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      }
      return worst;
    });
    ok(`no horizontal overflow at ${width}px`, over <= 0, `${over}px`);
    await ctx.close();
  }
}

// 8. Music control is absent when the track is missing.
{
  const { ctx, page } = await newPage();
  await openSeal(page);
  await page.waitForTimeout(1200);
  const count = await page.getByRole("button", { name: /the music/i }).count();
  ok("music control hidden when track is missing", count === 0, `controls=${count}`);
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.n}${r.detail ? `  (${r.detail})` : ""}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
