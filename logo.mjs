// The Carmine's Italiano logo, taken straight from the family's own vector file
// (Drive: Carmines2.0/Carmine's/ACTUAL LOGOS/LARGE_CARMINES_LOGO.ai, converted with pdftocairo, nothing redrawn).
// Paths: logo-paths.json. The original file paints the letter counters white, so each part is drawn
// through a mask to keep the holes transparent on any background.
import { readFileSync } from "node:fs";

const L = JSON.parse(readFileSync(new URL("./logo-paths.json", import.meta.url), "utf8"));
const [vx, vy, vw, vh] = L.viewBox.split(" ").map(Number);

// The site follows her printed menus (2017–2026): charcoal script, deep wine accents, aged paper.
// Colors sampled from the vector PDF of the March 2025 dinner menu. red/green are the building sign's
// colors (sampled from LARGE_CARMINES_LOGO(COLOR).jpg), kept for reference only.
export const BRAND = { ink: "#282624", wine: "#5f1722", paper: "#f4f0e4", red: "#bb1016", green: "#2f6409" };

const part = (p, color, id) => `<mask id="${id}" maskUnits="userSpaceOnUse" x="${vx}" y="${vy}" width="${vw}" height="${vh}"><path fill="#fff" d="${p.fill}"/><path fill="#000" d="${p.holes}"/></mask><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${color}" mask="url(#${id})"/>`;

// The logo Kelly uses (every printed menu since 2017): traced from CarminesLogo.png, see logo-script-paths.json.
const N = JSON.parse(readFileSync(new URL("./logo-script-paths.json", import.meta.url), "utf8"));
export const SCRIPT_VIEWBOX = N.viewBox;

// Default: the script logo in charcoal. italiano: true draws the older sign lockup instead
// (red script + green "Italiano", from LARGE_CARMINES_LOGO.ai), kept only as logo-sign.svg.
export function logoSVG({ script = BRAND.ink, word = BRAND.ink, italiano = false, title = "Carmine's Italiano", id = "lg", cls = "" } = {}) {
  if (italiano) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${L.viewBox}"${cls ? ` class="${cls}"` : ""} role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>
${part(L.script, script, `${id}-s`)}${part(L.italiano, word, `${id}-i`)}
</svg>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${N.viewBox}"${cls ? ` class="${cls}"` : ""} role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>
<path fill="${script}" transform="${N.transform}" d="${N.d}"/>
</svg>`;
}
