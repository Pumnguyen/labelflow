/**
 * LabelFlow screenshot capture script
 * Run: node capture-screenshots.mjs  (from inside labelflow-react/)
 *
 * Nav items are plain <div class="nav-item"> with a <span> child — no data attrs.
 * We click them by matching the span's trimmed text content.
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/screenshots");
const BASE_URL = "http://localhost:5174";

// navLabel must match exactly the <span> text inside the .nav-item div in Sidebar.jsx
const SECTIONS = [
  { id: "dashboard",      navLabel: "Dashboard" },
  { id: "artists",        navLabel: "Artists" },
  { id: "campaigns",      navLabel: "Campaigns" },
  { id: "assets",         navLabel: "Assets" },
  { id: "todos",          navLabel: "To-Do" },
  { id: "ai-blog-writer", navLabel: "AI Blog Writer" },
  { id: "merch-mockups",  navLabel: "Merch Mockups" },
  { id: "spot-spotter",   navLabel: "Street Marketing" },
  { id: "analytics",      navLabel: "Analytics" },
];

async function clickNavByLabel(page, label) {
  return page.evaluate((targetLabel) => {
    const navItems = document.querySelectorAll(".nav-item");
    for (const item of navItems) {
      const span = item.querySelector("span");
      if (span && span.textContent.trim() === targetLabel) {
        item.click();
        return true;
      }
    }
    return false;
  }, label);
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
  // Wait for React to hydrate
  await new Promise(r => setTimeout(r, 3000));

  for (const section of SECTIONS) {
    console.log(`  Capturing: ${section.navLabel}…`);
    const clicked = await clickNavByLabel(page, section.navLabel);
    if (!clicked) {
      console.error(`    ✗ Could not find nav item with label "${section.navLabel}"`);
      continue;
    }
    // Wait for the section to render
    await new Promise(r => setTimeout(r, 1500));
    const outPath = path.join(OUT_DIR, `${section.id}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`    ✓ docs/screenshots/${section.id}.png`);
  }

  await browser.close();
  console.log("\nAll screenshots captured! ✓");
})();
