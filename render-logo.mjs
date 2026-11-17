// Writes the logo files (pure paths, no fonts needed) and renders PNGs (og:image, favicon, apple-touch-icon)
// with headless Chrome. Run: node render-logo.mjs   (needs Google Chrome installed)
import { writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { logoSVG, BRAND } from "./logo.mjs";

mkdirSync("assets/img", { recursive: true });
writeFileSync("assets/img/logo.svg", logoSVG());
writeFileSync("assets/img/logo-reversed.svg", logoSVG({ script: BRAND.paper }));
writeFileSync("assets/img/logo-wine.svg", logoSVG({ script: BRAND.wine }));
writeFileSync("assets/img/logo-sign.svg", logoSVG({ italiano: true, script: BRAND.red, word: BRAND.green }));

// Favicon: the script "C" in paper on wine.
const fav = logoSVG({ id: "fav", script: BRAND.paper }).replace(/viewBox="[^"]*"/, 'viewBox="58 178 192 192"').replace("<svg ", `<svg style="background:${BRAND.wine}" `);
writeFileSync("assets/img/favicon.svg", fav);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = mkdtempSync(join(tmpdir(), "logo-"));
const shot = (name, w, h, body) => {
  const html = join(dir, name + ".html");
  writeFileSync(html, `<!doctype html><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600&display=block" rel="stylesheet"><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style>${body}`);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--virtual-time-budget=4000", `--window-size=${w},${h}`, `--screenshot=${resolve("assets/img/" + name + ".png")}`, "file://" + html], { stdio: "ignore" });
};
const rule = `<div style="height:7px;border-top:1.5px solid ${BRAND.ink};border-bottom:1.5px solid ${BRAND.ink};width:860px;margin:0 auto"></div>`;
const caps = `font:600 26px 'Josefin Sans',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${BRAND.wine}`;
shot("og-image", 1200, 630, `<div style="width:1200px;height:630px;background:${BRAND.paper};display:flex;flex-direction:column;justify-content:center;gap:30px;text-align:center">
  <div style="width:720px;margin:0 auto">${logoSVG({ id: "og" })}</div>${rule}
  <div style="${caps}">Dine-in · Take-out · Catering · Banquets</div>
  <div style="${caps};font-size:22px;color:${BRAND.ink}">7170 Transit Rd. Williamsville, NY · 716.636.3100</div></div>`);
shot("apple-touch-icon", 180, 180, fav.replace("<svg ", '<svg width="180" height="180" '));
shot("favicon", 64, 64, fav.replace("<svg ", '<svg width="64" height="64" '));
console.log("logo files written");
