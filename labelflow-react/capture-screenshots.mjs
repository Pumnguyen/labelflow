/**
 * LabelFlow screenshot capture script
 * Run: node capture-screenshots.mjs  (from inside labelflow-react/)
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
  { id: "assets",          label: "Asset Manager" },
  { id: "todos",           label: "Todos" },
  { id: "ai-blog-writer",  label: "AI Blog Writer" },
  { id: "merch-mockups",   label: "Merch Mockups" },
  { id: "spot-spotter",    label: "Spot Spotter" },
  { id: "analytics",       label: "Analytics" },
];

async function clickNavItem(page, sectionId) {
  return page.evaluate((id) => {
    const candidates = document.querySelectorAll(
      ".nav-item, .sidebar-item, [data-section], nav li, nav a, li[class]"
    );
    for (const el of candidates) {
      const ds = el.dataset.section || el.dataset.id || el.getAttribute("href");
      if (ds === id || ds === `#${id}`) { el.click(); return true; }
    }
    return false;
  }, sectionId);
}

(async () => {
  console.log("Launching Puppeteer…");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  for (const section of SECTIONS) {
    console.log(`  Capturing: ${section.label}…`);
    const clicked = await clickNavItem(page, section.id);
    if (!clicked) {
      console.warn(`    ⚠ Nav not found for "${section.id}", reloading with hash`);
      await page.goto(`${BASE_URL}#${section.id}`, { waitUntil: "networkidle0" });
    }
    await new Promise(r => setTimeout(r, 1200));
    const outPath = path.join(OUT_DIR, `${section.id}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`    ✓ docs/screenshots/${section.id}.png`);
  }

  await browser.close();
  console.log("\nAll screenshots captured! ✓");
})();
