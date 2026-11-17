// Round badge "stickers": our own drawings inside a ring with curved lettering.
// The engine is reusable; the drawings and wording are not chosen yet.
// BRAND PLACEHOLDER: ART is empty until Kelly picks the motifs (see CLAUDE.md). Draw them from scratch;
// never copy another restaurant's or illustrator's art.
import { BRAND } from "./logo.mjs";

export const C = { ink: BRAND.ink, red: BRAND.red, green: BRAND.green, cream: BRAND.paper };
const S = `stroke="${C.ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

// Each entry is SVG drawn in a 200×200 box, centered near (100, 108).
const ART = {
  // Placeholder: a plain dotted circle so the layout can be tested. Replace with a real drawing.
  placeholder: `<circle cx="100" cy="108" r="34" fill="none" ${S} stroke-dasharray="4 6"/><text x="100" y="114" font-size="16" text-anchor="middle" fill="${C.ink}">art</text>`,
};

let n = 0;
// face/ink: badge background and lettering; art: one of ART's keys.
export function sticker({ art = "placeholder", top, bottom, face = C.cream, ink = C.red, ring = C.ink, cls = "", label }) {
  const id = `sk${++n}`;
  return `<div class="sticker ${cls}" role="img" aria-label="${label || [top, bottom].join(", ")}"><svg viewBox="0 0 200 200" aria-hidden="true">
  <defs><path id="${id}t" d="M30 100 A70 70 0 0 1 170 100"/><path id="${id}b" d="M14 100 A86 86 0 0 0 186 100"/></defs>
  <circle cx="100" cy="100" r="97" fill="${face}" stroke="${ring}" stroke-width="3"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="${ink}" stroke-width="1.4"/>
  <text font-family="var(--display, Georgia, serif)" font-weight="700" font-size="23" letter-spacing="1.5" fill="${ink}"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${top}</textPath></text>
  <text font-family="var(--display, Georgia, serif)" font-weight="700" font-size="16" letter-spacing="2" fill="${ink}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${bottom}</textPath></text>
  <g transform="translate(100 108) scale(.84) translate(-100 -108)">${ART[art]}</g>
</svg></div>`;
}

// Placeholder stickers: the wording must come from Kelly, so these say so.
export const STICKERS = {
  a: (o = {}) => sticker({ top: "STICKER TEXT", bottom: "TO BE CHOSEN", ...o }),
  b: (o = {}) => sticker({ top: "STICKER TEXT", bottom: "TO BE CHOSEN", face: C.green, ink: C.cream, ...o }),
};
