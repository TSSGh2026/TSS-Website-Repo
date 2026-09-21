import puppeteer from "/Users/fatemahanif/tss-website/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
const OUT = "/private/tmp/claude-501/-Users-fatemahanif/ac1734a5-0ed3-40e9-adba-2466d1e5a77e/scratchpad/shots";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true, args: ["--font-render-hinting=none"],
});
async function shoot(w, h, name) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await p.goto("http://localhost:5000/", { waitUntil: "networkidle0" });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 700));
  await p.evaluate(() => { const n = document.querySelector("header, nav"); if (n) n.style.visibility = "hidden"; });
  await (await p.$("#services")).screenshot({ path: `${OUT}/${name}.png` });
  await p.close();
  console.log("→", name);
}
await shoot(1440, 900, "final-1440");
await shoot(900, 1000, "final-900");
await shoot(390, 844, "final-390");
await browser.close();
