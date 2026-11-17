// Pasta-shape line drawings from Carmine's own printed menus (Dropbox: Carmines_pasta_*.ai), converted
// with pdftocairo, not redrawn. Paths: pasta-paths.json. Strokes use currentColor; the white fills that
// hide overlapping lines are painted with the page's paper color (.pasta .bg in site.css).
// Rights: these came from her menu designer's package; confirm with Kelly before launch (see CLAUDE.md).
import { readFileSync } from "node:fs";

const P = JSON.parse(readFileSync(new URL("./pasta-paths.json", import.meta.url), "utf8"));
export const SHAPES = ["spaghetti", "linguine", "fettuccine", "angelhair", "penne", "fussili", "gnocchi", "tortellini", "ravioli"];

export function pastaSVG(name, { cls = "", label } = {}) {
  const p = P[name];
  if (!p) throw new Error(`no pasta drawing "${name}"`);
  return `<svg class="pasta ${cls}" viewBox="${p.viewBox}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><g fill="none" stroke="currentColor">${p.body}</g></svg>`;
}
