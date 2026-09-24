/* Headless smoke test — run: node scripts/smoke.mjs */
import { chromium } from "playwright-core";

const BASE = process.env.SMOKE_URL ?? "http://localhost:3000";
const results = [];
const log = (ok, msg) => {
  results.push({ ok, msg });
  console.log(`${ok ? "PASS" : "FAIL"} — ${msg}`);
};

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist"],
});

try {
  /* ---------- Desktop ---------- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3500);

  log((await page.title()).includes("Razim Khokhar"), `title: ${await page.title()}`);

  const h1 = await page.locator("h1").first().textContent();
  log(!!h1 && h1.replace(/\s+/g, " ").includes("RAZIM"), `h1: ${h1?.replace(/\s+/g, " ").trim()}`);

  for (const id of ["home", "about", "skills", "projects", "journey", "contact"]) {
    log((await page.locator(`#${id}`).count()) === 1, `section #${id} present`);
  }

  const canvases = await page.locator("canvas").count();
  log(canvases >= 1, `WebGL canvases mounted (got ${canvases})`);

  const navLinks = await page.locator("header nav ul a").count();
  log(navLinks === 6, `desktop nav links: ${navLinks}`);

  // Active section indicator after scrolling to skills
  await page.locator('a[href="#skills"]').first().click();
  await page.waitForTimeout(1200);
  const active = await page.locator('header nav a[aria-current="true"]').textContent();
  log(!!active && active.includes("SKILLS"), `active nav after click: ${active}`);

  // Skills legend hover updates description panel
  const pythonBtn = page.locator('#skills ul button').filter({ hasText: /^Python$/ }).first();
  const btnCount = await pythonBtn.count();
  log(btnCount === 1, `python chip found: ${btnCount}`);
  await pythonBtn.scrollIntoViewIfNeeded();
  await pythonBtn.hover();
  await page.waitForTimeout(600);
  const panel = await page.locator('[aria-live="polite"]').first().textContent();
  log(!!panel && panel.includes("Active node") && panel.includes("Python"), `skill hover panel: ${panel?.slice(0, 80)}`);

  // Keyboard: fresh load → first Tab focuses skip link
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.className ?? "");
  log(focused.includes("skip-link"), `first tab focus: ${focused}`);

  // Placeholder socials are not fake links
  const hrefs = await page.locator('section#contact a[aria-disabled="true"], section#contact span[aria-disabled="true"]').count();
  log(hrefs >= 2, `contact placeholder links: ${hrefs}`);

  // Scroll deep to mount project canvases
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const canvases2 = await page.locator("canvas").count();
  log(canvases2 >= 1, `canvases after projects scroll: ${canvases2}`);

  await page.locator("#journey").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const filtered = errors.filter(
    (e) => !e.includes("favicon") && !e.includes("Download the React DevTools"),
  );
  log(filtered.length === 0, `console/page errors: ${filtered.length ? filtered.join(" | ") : "none"}`);
  await page.close();

  /* ---------- Mobile ---------- */
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const mobileErrors = [];
  mobile.on("pageerror", (err) => mobileErrors.push(err.message));
  await mobile.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await mobile.waitForTimeout(2500);

  const menuBtn = mobile.locator('button[aria-controls="mobile-menu"]');
  log((await menuBtn.count()) === 1, "mobile hamburger present");
  await menuBtn.click();
  await mobile.waitForTimeout(500);
  const expanded = await menuBtn.getAttribute("aria-expanded");
  log(expanded === "true", `menu aria-expanded: ${expanded}`);
  const menuLinks = await mobile.locator("#mobile-menu a").count();
  log(menuLinks === 6, `mobile menu links: ${menuLinks}`);

  await mobile.keyboard.press("Escape");
  await mobile.waitForTimeout(400);
  const expandedAfter = await menuBtn.getAttribute("aria-expanded");
  log(expandedAfter === "false", `menu closed on Escape: ${expandedAfter}`);

  const mErrors = mobileErrors.filter((e) => !e.includes("favicon"));
  log(mErrors.length === 0, `mobile page errors: ${mErrors.length ? mErrors.join(" | ") : "none"}`);
  await mobile.close();
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
