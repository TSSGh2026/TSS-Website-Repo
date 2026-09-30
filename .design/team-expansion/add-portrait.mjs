// Turns a supplied photograph into a specialist row's portrait.
//   node .design/team-expansion/add-portrait.mjs <source-image> <first-name> [focusY 0-1]
// Writes client/public/images/team/<first-name>.webp, cropped to 4:5 at 480x600
// (the row draws it 120px wide, so this is 4x), and prints the line to paste
// into SPECIALISTS in client/src/pages/team.tsx. focusY moves the crop window:
// 0 keeps the top of the frame, 0.5 the middle. Encodes through headless
// Chrome's canvas, the same way script/optimize-images.ts does, because the
// repo carries no image library.
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
const [src, first, focus = "0.25"] = process.argv.slice(2);
if (!src || !first) { console.error("usage: add-portrait.mjs <image> <first-name> [focusY]"); process.exit(1); }
const mime = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" }[extname(src).toLowerCase()] ?? "image/jpeg";
const dataUrl = `data:${mime};base64,${readFileSync(src).toString("base64")}`;
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage();
const webp = await page.evaluate(async (dataUrl, focus) => {
  const img = new Image(); img.src = dataUrl; await img.decode();
  const w = img.naturalWidth, h = img.naturalHeight;
  const cw = Math.min(w, Math.round(h * 0.8)), ch = Math.round(cw * 1.25);
  const sx = Math.round((w - cw) / 2), sy = Math.round(Math.max(0, (h - ch) * focus));
  const c = document.createElement("canvas"); c.width = 480; c.height = 600;
  const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
  g.drawImage(img, sx, sy, cw, ch, 0, 0, 480, 600);
  return c.toDataURL("image/webp", 0.82);
}, dataUrl, Number(focus));
await browser.close();
mkdirSync("client/public/images/team", { recursive: true });
const out = `client/public/images/team/${first.toLowerCase()}.webp`;
writeFileSync(out, Buffer.from(webp.split(",")[1], "base64"));
console.log(`wrote ${out}\npaste into ${first}'s entry:  portrait: "/images/team/${first.toLowerCase()}.webp",`);
