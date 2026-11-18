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

// Default: the script mark alone in charcoal, as on every printed menu since 2017.
// italiano: true adds the slab-serif "Italiano" (the sign lockup; use script: BRAND.red, word: BRAND.green for the sign colors).
export function logoSVG({ script = BRAND.ink, word = BRAND.ink, italiano = false, title = "Carmine's Italiano", id = "lg", cls = "" } = {}) {
  // Script alone: fit the script's own bounds (73–685 × 173–362). The old 178-unit height cut off the bottom of the C.
  const box = italiano ? L.viewBox : "70 169 619 197";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}"${cls ? ` class="${cls}"` : ""} role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>
${part(L.script, script, `${id}-s`)}${italiano ? part(L.italiano, word, `${id}-i`) : ""}
</svg>`;
}
