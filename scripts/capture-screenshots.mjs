/**
 * LabelFlow screenshot capture script
 * Run after `npm run dev` is already started on port 5174
 * Usage: node scripts/capture-screenshots.mjs
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/screenshots");
const BASE_URL = "http://localhost:5174";

const SECTIONS = [
  { id: "dashboard",       label: "Dashboard" },
  { id: "artists",         label: "Artists" },
  { id: "campaigns",       label: "Campaigns" },
  { id: "assets",          label: "Assets" },
  { id: "todos",           label: "Todos" },
  { id: "ai-blog-writer",  label: "AI Blog Writer" },
  { id: "merch-mockups",   label: "Merch Mockups" },
  { id: "spot-spotter",    label: "Spot Spotter" },
  { id: "analytics",       label: "Analytics" },
];

async function clickNavItem(page, sectionId) {
  // Try clicking the sidebar nav item with matching data-section or href
  const clicked = await page.evaluate((id) => {
    const selectors = [
      `[data-section="${id}"]`,
      `[href="#${id}"]`,
      `a[data-id="${id}"]`,
      `.nav-item[data-section="${id}"]`,
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) { el.click(); return true; }
    }
    // Fallback: find any nav item whose text matches
    const items = document.querySelectorAll(".nav-item, .sidebar-item, nav li, nav a");
    for (const item of items) {
      if (item.dataset.section === id || item.dataset.id === id) {
        item.click(); return true;
      }
    }
    return false;
  }, sectionId);
  return clicked;
}

(async () => {
  console.log("Launching Puppeteer…");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`Navigating to ${BASE_URL}…`);
  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 30000 });

  // Wait for the app to fully render
  await new Promise(r => setTimeout(r, 2000));

  for (const section of SECTIONS) {
    console.log(`  Capturing: ${section.label}`);
    const ok = await clickNavItem(page, section.id);
    if (!ok) {
      console.warn(`    ⚠ Could not find nav item for "${section.id}", trying URL hash`);
      await page.goto(`${BASE_URL}#${section.id}`, { waitUntil: "networkidle0" });
    }
    await new Promise(r => setTimeout(r, 1000));
    const outPath = path.join(OUT_DIR, `${section.id}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`    ✓ Saved → docs/screenshots/${section.id}.png`);
  }

  await browser.close();
  console.log("\nAll screenshots captured!");
})();
