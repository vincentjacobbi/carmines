// Writes the logo files (pure paths, no fonts needed) and renders PNGs (og:image, favicon, apple-touch-icon)
// with headless Chrome. Run: node render-logo.mjs   (needs Google Chrome installed)
// BRAND PLACEHOLDER: the favicon and og:image layouts are neutral stand-ins until the brand pass.
import { writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { logoSVG, BRAND } from "./logo.mjs";

mkdirSync("assets/img", { recursive: true });
writeFileSync("assets/img/logo.svg", logoSVG());
writeFileSync("assets/img/logo-reversed.svg", logoSVG({ script: BRAND.paper, word: BRAND.paper }));
writeFileSync("assets/img/logo-script.svg", logoSVG({ italiano: false }));

// Favicon: the script mark, cropped to the "C". Placeholder crop; revisit in the brand pass.
const fav = logoSVG({ italiano: false, id: "fav" }).replace(/viewBox="[^"]*"/, 'viewBox="64 170 172 172"').replace("<svg ", `<svg style="background:${BRAND.paper}" `);
writeFileSync("assets/img/favicon.svg", fav);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = mkdtempSync(join(tmpdir(), "logo-"));
const shot = (name, w, h, body) => {
  const html = join(dir, name + ".html");
  writeFileSync(html, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style>${body}`);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, `--screenshot=${resolve("assets/img/" + name + ".png")}`, "file://" + html], { stdio: "ignore" });
};
shot("og-image", 1200, 630, `<div style="width:1200px;height:630px;background:${BRAND.paper};display:grid;place-items:center"><div style="width:900px">${logoSVG({ id: "og" })}</div></div>`);
shot("apple-touch-icon", 180, 180, fav.replace("<svg ", '<svg width="180" height="180" '));
shot("favicon", 64, 64, fav.replace("<svg ", '<svg width="64" height="64" '));
console.log("logo files written");
