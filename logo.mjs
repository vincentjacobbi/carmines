// The Carmine's Italiano logo, taken straight from the family's own vector file
// (Drive: Carmines2.0/Carmine's/ACTUAL LOGOS/LARGE_CARMINES_LOGO.ai, converted with pdftocairo, nothing redrawn).
// Paths: logo-paths.json. The original file paints the letter counters white, so each part is drawn
// through a mask to keep the holes transparent on any background.
import { readFileSync } from "node:fs";

const L = JSON.parse(readFileSync(new URL("./logo-paths.json", import.meta.url), "utf8"));
const [vx, vy, vw, vh] = L.viewBox.split(" ").map(Number);

// Colors sampled from LARGE_CARMINES_LOGO(COLOR).jpg (red script, green "Italiano").
// BRAND PLACEHOLDER: confirm these with Kelly before the design pass (see CLAUDE.md).
export const BRAND = { red: "#bb1016", green: "#2f6409", ink: "#231f20", paper: "#f7f3ea" };

const part = (p, color, id) => `<mask id="${id}" maskUnits="userSpaceOnUse" x="${vx}" y="${vy}" width="${vw}" height="${vh}"><path fill="#fff" d="${p.fill}"/><path fill="#000" d="${p.holes}"/></mask><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${color}" mask="url(#${id})"/>`;

// italiano: false draws just the script mark with its swash (as on the 2017 dinner menu).
export function logoSVG({ script = BRAND.red, word = BRAND.green, italiano = true, title = "Carmine's Italiano", id = "lg", cls = "" } = {}) {
  const box = italiano ? L.viewBox : `${vx} ${vy} ${vw} ${178}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}"${cls ? ` class="${cls}"` : ""} role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>
${part(L.script, script, `${id}-s`)}${italiano ? part(L.italiano, word, `${id}-i`) : ""}
</svg>`;
}
