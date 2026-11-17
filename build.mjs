// Generates the static pages from shared parts. Run: node build.mjs
// Facts here come from carminestogo.com (Nov 2026) and the owners. Anything not confirmed is a placeholder:
// ph("...") renders a loud striped label, and prices are null (shown as "$ —"). Never fill these in by guessing.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { logoSVG, BRAND } from "./logo.mjs";
import { STICKERS } from "./stickers.mjs";

const SITE = "https://carminestogo.com"; // live domain (Jeremy manages it today; see CLAUDE.md)

// Family recipes approved for the site. The private transcriptions live in git-ignored recipes/.
const RECIPES = existsSync("content/recipes.json") ? JSON.parse(readFileSync("content/recipes.json", "utf8")).recipes : [];

const ph = (t) => `<span class="ph">[${t}]</span>`;
const phBlock = (t) => `<span class="ph ph-block">[${t}]</span>`;

const R = {
  name: "Carmine's Italiano",
  street: "7170 Transit Road",
  city: "Williamsville", region: "NY", zip: "14221",
  phone: "(716) 636-3100", tel: "+17166363100",
  facebook: "https://www.facebook.com/CarminesToGo/",
  instagram: "https://www.instagram.com/carminestogo/",
  // Placeholders: Kelly uses Uber Eats for online ordering; the store link isn't confirmed yet. No reservation system.
  ubereats: null,
};

// ---------- Dining menu ----------
// PLACEHOLDER. Transcribe from the current menu at carminestogo.com/Carmines/Carmines_Italiano_-_Dinner_Menu.html
// (and the take-out, wine, catering and banquet pages). The 2017 printed menu in Drive is outdated: use it only for layout.
// p: price (number), or [a, b] for two printed prices; v: options as [label, price, isAddOn]; img: file in assets/img.
const MENU = [
  { id: "appetizers", title: "Section name", items: [
    { n: "Dish name", d: "Description transcribed from the current menu", p: null, ph: true },
    { n: "Dish name", d: "Description transcribed from the current menu", p: null, ph: true },
  ]},
  { id: "pasta", title: "Section name", items: [
    { n: "Dish name", d: "Description transcribed from the current menu", p: null, ph: true },
    { n: "Dish name", d: "Description transcribed from the current menu", p: null, ph: true },
  ]},
];

// ---------- Catering & banquets ----------
// PLACEHOLDER. Transcribe from the Catering, Banquet and Take-Out menu pages on carminestogo.com.
// Confirmed on the current site: catering for gatherings of 10 or more, delivered anywhere in the 716 area,
// seven days a week, afternoon through evening.
const CATERING = {
  min: 10,
  intro: "Drop-off catering for gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week, afternoon through evening.",
  packages: [], // [{ title, price, note, items: [] }]
};

// Confirmed on carminestogo.com: dinner Wednesday–Sunday from 4pm; closed Monday and Tuesday. Closing times not listed.
const HOURS = [
  ["Monday", null], ["Tuesday", null],
  ["Wednesday", "From 4pm"], ["Thursday", "From 4pm"], ["Friday", "From 4pm"], ["Saturday", "From 4pm"], ["Sunday", "From 4pm"],
];

// ---------- helpers ----------
const money = (n) => (typeof n === "number" ? `$${Number.isInteger(n) ? n : n.toFixed(2)}` : n === "mp" ? "Market" : "$ —");
const priceText = (i) => (Array.isArray(i.p) ? i.p.map(money).join(" / ") : i.p != null ? money(i.p) : i.when || "$ —");
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Responsive photo: 800px copy in assets/img/sm, 1600px original in assets/img. No photos are approved yet.
const pic = (file, alt, sizes = "(max-width:820px) 100vw, 400px", eager = false) =>
  `<img src="/assets/img/sm/${file}.jpg" srcset="/assets/img/sm/${file}.jpg 800w, /assets/img/${file}.jpg 1600w" sizes="${sizes}" alt="${alt}"${eager ? "" : ' loading="lazy"'} decoding="async">`;
// Stand-in for a photo that hasn't been chosen or cleared yet.
const phPhoto = (label, ratio = "4/3") => `<div class="ph ph-block" style="aspect-ratio:${ratio};display:grid;place-items:center;text-align:center">[Photo: ${label}]</div>`;

const pageHero = (kicker, title, lead, photo, st = "") => `
<section class="menu-hero"><div class="wrap">
  <div><div class="eyebrow">${kicker}</div><h1>${title}</h1>${lead ? `<p>${lead}</p>` : ""}</div>
  <figure class="snap">${photo}${st}</figure>
</div></section>`;

const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: R.name,
  logo: `${SITE}/assets/img/og-image.png`,
  servesCuisine: ["Italian", "Italian-American"],
  telephone: R.tel,
  url: `${SITE}/`,
  address: { "@type": "PostalAddress", streetAddress: R.street, addressLocality: R.city, addressRegion: R.region, postalCode: R.zip, addressCountry: "US" },
  areaServed: "Buffalo, NY",
  // Placeholders left out on purpose until confirmed: image, priceRange, foundingDate, founder, closing times, hasMenu items.
  sameAs: [R.facebook, R.instagram],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "16:00" },
  ],
};

const itemOffers = (i) => (typeof i.p === "number" ? [{ "@type": "Offer", price: i.p.toFixed(2), priceCurrency: "USD" }] : []);
const realItems = (s) => s.items.filter((i) => !i.ph);
// Only real, transcribed items go into the structured data. Placeholders never do.
const menuSchema = MENU.some((s) => realItems(s).length) ? [{
  "@context": "https://schema.org", "@type": "Menu", name: "Dinner Menu", inLanguage: "en",
  hasMenuSection: MENU.filter((s) => realItems(s).length).map((s) => ({ "@type": "MenuSection", name: s.title,
    hasMenuItem: realItems(s).map((i) => { const o = itemOffers(i); return { "@type": "MenuItem", name: i.n, description: i.d, ...(o.length ? { offers: o[0] } : {}) }; }) })),
}] : [];

const orderBtn = (cls = "ghost") => R.ubereats
  ? `<a class="btn ${cls}" href="${R.ubereats}" target="_blank" rel="noopener">Order on Uber Eats</a>`
  : `<a class="btn ${cls}" href="tel:${R.tel}">Call to order</a>`;

const nav = (active) => `
<div class="demo-banner"><b>Staging preview</b> · A redesign concept for Carmine's. Striped labels are placeholders waiting on real content.</div>
<header class="nav"><div class="wrap">
  <a class="brand" href="/" aria-label="Carmine's Italiano, home">${logoSVG({ id: "hdr" })}</a>
  <button class="menu-toggle" aria-label="Menu" onclick="document.querySelector('nav.links').classList.toggle('open')">☰</button>
  <nav class="links">
    ${[["/menu.html", "Menu"], ["/story.html", "Our Story"], ["/catering.html", "Catering"], ["/#visit", "Visit"]]
      .map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    ${orderBtn()}
    <a class="btn primary" href="tel:${R.tel}">Call ${R.phone}</a>
  </nav>
</div></header>`;

const footer = `
<footer><div class="wrap">
  <div class="cols">
    <div><a class="foot-logo" href="/">${logoSVG({ id: "ftr", script: BRAND.paper, word: BRAND.paper })}</a>
      <p style="max-width:380px">Dine-in, take-out, catering &amp; banquets on Transit Road in Williamsville.</p></div>
    <div><b>Visit</b><br>${R.street}<br>${R.city}, ${R.region} ${R.zip}<br><a href="tel:${R.tel}">${R.phone}</a></div>
    <div><b>Elsewhere</b><br><a href="${R.facebook}">Facebook</a><br><a href="${R.instagram}">Instagram</a><br>${R.ubereats ? `<a href="${R.ubereats}">Uber Eats</a>` : ph("Uber Eats link")}</div>
  </div>
  <div class="fine">© ${new Date().getFullYear()} Carmine's Italiano · Staging preview, not the live site · <a href="/admin/">Owner dashboard (demo)</a></div>
</div></footer>
<script src="/assets/menu-data.js" defer></script>
<script src="/assets/chat.js" defer></script>`;

const page = (title, desc, active, main, extraSchema = [], path = "/") => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="${BRAND.red}">
<link rel="icon" type="image/png" href="/assets/img/favicon.png"><link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="restaurant">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}/assets/img/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Carmine's Italiano logo">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/site.css">
${[schema, ...extraSchema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
</head><body>
${nav(active)}
<main>${main}</main>
${footer}
</body></html>`;

const hoursList = `<ul class="info-list">${HOURS.map(([d, h]) => `<li><span>${d}</span><span class="${h ? "" : "closed"}">${h || "Closed"}</span></li>`).join("")}</ul>`;

// ---------- Home ----------
// Dishes the current site calls popular. Their descriptions and prices still need transcribing from the menu.
const FEATURED = ["Chicken Piccata", "Al's Fussili", "Risotto"];

const home = page(
  "Carmine's Italiano | Italian Restaurant on Transit Road, Williamsville NY",
  "Carmine's Italiano at 7170 Transit Road in Williamsville: dine-in, take-out, catering and banquets. Open Wednesday to Sunday from 4pm.",
  "",
  `
<section class="hero"><div class="wrap">
  <div class="hero-main">
    <h1 class="mark">${logoSVG({ id: "hero" })}</h1>
    <p class="tag">Dine-in, take-out, catering &amp; banquets.</p>
    <p class="lead">${ph("Opening line in Kelly's words: what Carmine's is and who it's for")}</p>
    <div class="ctas">
      <a class="btn primary" href="tel:${R.tel}">Call ${R.phone}</a>
      ${orderBtn()}
      <a class="link" href="#" data-open-chat>or ask us a question →</a>
    </div>
    <p class="hours"><b>Wed–Sun</b> from 4pm · <b>Mon–Tue</b> closed · Catering seven days a week</p>
  </div>
  <figure class="snap hero-snap">${phPhoto("the dining room or the front of 7170 Transit Road")}<figcaption>7170 Transit Road, Williamsville</figcaption>
    ${STICKERS.a({ cls: "s1" })}</figure>
</div></section>

<section><div class="wrap">
  <div class="eyebrow">From the kitchen</div>
  <h2>The dishes people ask for</h2>
  <p class="sub">The current site names these as favorites. ${ph("Kelly to confirm the list")}</p>
  <div class="dishes">
    ${FEATURED.map((n) => `<article class="dish">${phPhoto(n)}<h3>${n} <span class="price">$ —</span></h3><p>${ph("Description from the current menu")}</p></article>`).join("\n    ")}
  </div>
  <p style="margin-top:34px"><a class="btn ghost" href="/menu.html">The full menu</a></p>
</div></section>

<section><div class="wrap split">
  <div>
    <div class="eyebrow">Our story</div>
    <h2>${ph("Headline for the Carmine's story")}</h2>
    <p class="sub">${ph("Short history, written with Kelly and Alex. The current site says almost 45 years and several Taste of Buffalo honors; confirm the dates and awards before using them.")}</p>
    <a class="btn primary" href="/story.html">Read our story</a>
  </div>
  <figure class="photo vintage">${phPhoto("a family or archive photo, with rights confirmed", "4/5")}</figure>
</div></section>

<section class="alt"><div class="wrap cols2">
  <div>
    <div class="eyebrow">Catering</div>
    <h2>Catering &amp; banquets</h2>
    <p class="sub">${CATERING.intro}</p>
    <p><a class="btn primary" href="/catering.html">See catering</a></p>
  </div>
  <div id="visit">
    <div class="eyebrow">Visit</div>
    <h2>${R.street}</h2>
    ${hoursList}
    <p class="small">Reservations are suggested for parties of 6 or more and on Fridays and Saturdays. Call <a href="tel:${R.tel}">${R.phone}</a>.</p>
  </div>
</div></section>`
);

// ---------- Menu ----------
const itemRow = (i) => `<div class="item"><div class="txt"><div class="head"><span class="nm">${i.ph ? ph(i.n) : i.n}${i.h ? `<span class="heritage">${i.h}</span>` : ""}</span><span class="pr">${priceText(i)}</span></div><div class="ds">${i.ph ? ph(i.d) : i.d}</div>${i.v ? `<ul class="opts">${i.v.map(([l, p, add]) => `<li><span>${l}</span><span>${add ? "+" : ""}${money(p)}</span></li>`).join("")}</ul>` : ""}</div></div>`;
const menuPage = page(
  "Menu | Carmine's Italiano, Williamsville NY",
  "Dinner menu at Carmine's Italiano, 7170 Transit Road, Williamsville NY.",
  "Menu",
  `
${pageHero("Dinner menu", "The Menu", "", phPhoto("a signature dish", "4/5"))}
<section style="padding-top:40px"><div class="wrap">
  <p class="note">Staging note: the menu hasn't been transcribed yet. It will come from the current menu pages on carminestogo.com, with real prices.</p>
  <div class="menu-nav">${MENU.map((s, k) => `<a href="#${s.id}">${ph(s.title + " " + (k + 1))}</a>`).join("")}</div>
  <div class="menu-cols">${MENU.map((s, k) => `
  <div class="menu-section" id="${s.id}"><h2>${s.title === "Section name" ? `Section ${k + 1}` : s.title}</h2>
    ${s.items.map(itemRow).join("\n    ")}
  </div>`).join("")}</div>
  <p style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap">${orderBtn("primary")}<a class="btn ghost" href="/catering.html">Catering &amp; banquets</a></p>
</div></section>`,
  menuSchema, "/menu.html"
);

// ---------- Story ----------
// PLACEHOLDER timeline. Fill only with dates and events Kelly and Alex confirm.
// { y: "year", t: "title", d: "text", clip?: { f, alt, cite, url } } — press clips need rights checked first (CLAUDE.md).
const TIMELINE = [
  { y: "Year", t: "Event", d: "Confirmed milestone from the family", ph: true },
  { y: "Year", t: "Event", d: "Confirmed milestone from the family", ph: true },
];
const tlItem = (x) => `<li class="tl"><div class="tl-y">${x.ph ? ph(x.y) : x.y}</div><div class="tl-body"><h3>${x.ph ? ph(x.t) : x.t}</h3><p>${x.ph ? ph(x.d) : x.d}</p>${x.clip ? `
      <figure class="clip"><a href="/assets/img/press/${x.clip.f}.jpg" target="_blank" rel="noopener"><img src="/assets/img/press/${x.clip.f}-sm.jpg" alt="${x.clip.alt}" loading="lazy"></a>
        <figcaption>${x.clip.cite} · <a href="${x.clip.url}" target="_blank" rel="noopener">original page</a></figcaption></figure>` : ""}</div></li>`;
const ingRow = (x) => { const [n, q] = x.split(" — "); return q ? `<li><span>${esc(n)}</span><span>${esc(q)}</span></li>` : `<li><span>${esc(x)}</span></li>`; };
const recipeCard = (r) => `<details class="recipe-card"><summary><div class="rc-from">${esc(r.from)}</div><h3>${esc(r.title)}</h3>${r.yield ? `<p class="rc-yield">Yield: ${esc(r.yield)}</p>` : ""}<p>${esc(r.blurb)}</p><span class="rc-open">Read the card</span></summary>
      <div class="rc-body"><h4>Ingredients</h4><ul class="rc-ing">${r.ingredients.map(ingRow).join("")}</ul>${r.steps.length ? `<h4>Procedure</h4>${r.steps.map((x) => `<p>${esc(x)}</p>`).join("")}` : ""}</div></details>`;
const storyPage = page(
  "Our Story | Carmine's Italiano, Williamsville NY",
  "The story of Carmine's Italiano on Transit Road in Williamsville.",
  "Our Story",
  `
<section><div class="wrap story-head" style="max-width:820px">
  <div class="eyebrow">Our story</div>
  <h1 style="font-size:clamp(44px,6.4vw,72px);margin:14px 0 20px;line-height:1">${ph("Story headline")}</h1>
  <p class="sub">${ph("Intro written with Kelly and Alex")}</p>
  <ol class="timeline">
    ${TIMELINE.map(tlItem).join("\n    ")}
  </ol>
  ${RECIPES.length ? `<div class="eyebrow" style="margin-top:72px">From the kitchen</div><h2>Family recipes</h2><div class="recipes">${RECIPES.map(recipeCard).join("\n    ")}</div>` : ""}
</div></section>`, [], "/story.html"
);

// ---------- Catering ----------
const cateringPage = page(
  "Catering & Banquets | Carmine's Italiano, Williamsville NY",
  "Drop-off catering from Carmine's Italiano for gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week. Banquets at the restaurant.",
  "Catering",
  `
${pageHero("Catering & banquets", "Catering for the whole party", "", phPhoto("a catering spread", "4/5"))}
<section style="padding-top:48px"><div class="wrap split" style="align-items:start">
  <div>
    <p class="sub">${CATERING.intro} Call <a href="tel:${R.tel}">${R.phone}</a> to plan your order.</p>
    <h4>Drop-off packages</h4>
    <p>${phBlock("Packages, trays and per-person prices transcribed from the Catering menu page")}</p>
    <h4>Banquets at the restaurant</h4>
    <p>${phBlock("Banquet packages transcribed from the Banquet menu page")}</p>
  </div>
  <div class="quote-form sticky">
    <h3>Request a catering quote</h3>
    <form class="stack" onsubmit="event.preventDefault();this.innerHTML='<p><b>Thank you!</b> Demo only, nothing was sent. In the live site this request goes to the catering inbox in the owner dashboard.</p>'">
      <label>Name<input required></label>
      <label>Email or phone<input required></label>
      <label>Event date<input type="date" required></label>
      <label>Guests<select><option>10–25</option><option>25–50</option><option>50–100</option><option>100+</option></select></label>
      <label>What you need<select><option>Drop-off catering</option><option>Banquet at the restaurant</option></select></label>
      <label>Anything else?<textarea rows="3" placeholder="Dietary needs, favorite dishes, budget…"></textarea></label>
      <button class="btn primary">Send request</button>
    </form>
  </div>
</div></section>`, [], "/catering.html"
);

// ---------- Shared data for the admin editor and the concierge ----------
const menuData = {
  updated: null,
  source: "not transcribed yet",
  restaurant: { name: R.name, address: `${R.street}, ${R.city}, ${R.region} ${R.zip}`, phone: R.phone, tel: R.tel, ubereats: R.ubereats, hours: "Wednesday–Sunday from 4pm; closed Monday and Tuesday", catering: CATERING.intro },
  sections: MENU.map((s) => ({ id: s.id, title: s.title, items: s.items.map((i) => ({ n: i.n, d: i.d, p: typeof i.p === "number" ? i.p : null, price: priceText(i), ...(i.ph ? { ph: true } : {}) })) })),
};

// ---------- GEO / crawler files ----------
const llms = `# Carmine's Italiano

> Italian restaurant at 7170 Transit Road, Williamsville, NY 14221. Dine-in, take-out, catering and banquets. Owned by the Jacobbi family.

## Essentials
- Phone: ${R.phone}
- Hours: Wednesday–Sunday from 4pm; closed Monday and Tuesday
- Reservations: suggested for parties of 6 or more and on Fridays and Saturdays (call)
- Catering: gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week, afternoon through evening

## Pages
- [Menu](${SITE}/menu.html)
- [Our Story](${SITE}/story.html)
- [Catering](${SITE}/catering.html)
`;

writeFileSync("index.html", home);
writeFileSync("menu.html", menuPage);
writeFileSync("story.html", storyPage);
writeFileSync("catering.html", cateringPage);
writeFileSync("assets/menu-data.js", `// Generated by build.mjs. Do not edit by hand.\nwindow.SITE_DATA = ${JSON.stringify(menuData, null, 1)};\n`);
writeFileSync("llms.txt", llms);
// Staging: keep it out of search engines so it doesn't compete with the live site.
writeFileSync("robots.txt", "User-agent: *\nDisallow: /\n");
console.log("built");
