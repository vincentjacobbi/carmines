// Generates the static pages from shared parts. Run: node build.mjs
// Facts here come from carminestogo.com (Nov 2026), her printed menus in Dropbox and the owners. Anything not
// confirmed is a placeholder: ph("...") renders a loud striped label, and prices are null (shown as "$ —").
// Never fill these in by guessing. Design follows her printed menus (see CLAUDE.md, "Brand").
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { logoSVG, BRAND } from "./logo.mjs";
import { pastaSVG } from "./pasta.mjs";

const SITE = "https://carminestogo.com"; // live domain (Jeremy manages it today; see CLAUDE.md)

// Family recipes approved for the site. The private transcriptions live in git-ignored recipes/.
const RECIPES = existsSync("content/recipes.json") ? JSON.parse(readFileSync("content/recipes.json", "utf8")).recipes : [];

const ph = (t) => `<span class="ph">[${t}]</span>`;
const phBlock = (t) => `<span class="ph ph-block">[${t}]</span>`;

const R = {
  name: "Carmine's Italiano",
  street: "7170 Transit Road", streetShort: "7170 Transit Rd.",
  city: "Williamsville", region: "NY", zip: "14221",
  phone: "(716) 636-3100", phoneDots: "716.636.3100", tel: "+17166363100",
  facebook: "https://www.facebook.com/CarminesToGo/",
  instagram: "https://www.instagram.com/carminestogo/",
  // Placeholders: Kelly uses Uber Eats for online ordering; the store link isn't confirmed yet. No reservation system.
  ubereats: null,
};

// ---------- Dining menu ----------
// PLACEHOLDER. Transcribe from the newest dinner menu (Dropbox 2025/CarminesDinnerMenu_Revision3.18.25.pdf),
// checked against carminestogo.com's Dinner Menu page; ask Kelly where they differ (CLAUDE.md, "Current menus").
// p: price (number), or [a, b] for two printed prices; v: options as [label, price, isAddOn].
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

// Pasta choices for "Create Your Own Bowl", as printed on the March 2025 dinner menu (names only; the $2 upcharges and
// the sauces get transcribed with the rest of the menu). [label, drawing]
const BOWL_PASTA = [["Spaghetti", "spaghetti"], ["Linguine", "linguine"], ["Angel hair", "angelhair"], ["Fussili", "fussili"], ["Penne", "penne"], ["Gnocchi", "gnocchi"], ["Ravioli", "ravioli"], ["Tortellini", "tortellini"]];

// ---------- Catering & banquets ----------
// PLACEHOLDER. Transcribe from Dropbox 2025/carminescatering 5.14.26.pdf (newest) and CarminesBanquetMenu10-24.pdf,
// checked against the Catering and Banquet pages on carminestogo.com.
// Confirmed on the current site: catering for gatherings of 10 or more, delivered anywhere in the 716 area,
// seven days a week, afternoon through evening.
const CATERING = {
  min: 10,
  intro: "Drop-off catering for gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week, afternoon through evening.",
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
// Stand-in for a photo that hasn't been chosen or cleared yet.
const phPhoto = (label, ratio = "4/3") => `<div class="ph ph-block" style="aspect-ratio:${ratio};display:grid;place-items:center;text-align:center;margin:0">[Photo: ${label}]</div>`;
const ruleHead = (t, tag = "h2", cls = "") => `<${tag} class="rule-head ${cls}">${t}</${tag}>`;

const pageHead = (title, lead = "") => `
<section class="page-head"><div class="wrap">
  <h1>${title}</h1>${lead ? `<p>${lead}</p>` : ""}
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
  // Left out on purpose until confirmed: image, priceRange, foundingDate, founder, closing times, menu items.
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
  : `<a class="btn ${cls}" href="tel:${R.tel}">Call for take-out</a>`;

const nav = (active) => `
<div class="demo-banner"><b>Staging preview</b> · A redesign concept for Carmine's. Striped labels are placeholders waiting on real content.</div>
<header class="nav"><div class="wrap">
  <a class="brand" href="/" aria-label="Carmine's Italiano, home">${logoSVG({ id: "hdr" })}</a>
  <button class="menu-toggle" aria-label="Menu" onclick="document.querySelector('nav.links').classList.toggle('open')">☰</button>
  <nav class="links">
    ${[["/menu.html", "Menu"], ["/catering.html", "Catering"], ["/story.html", "Our Story"], ["/#visit", "Visit"]]
      .map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    ${R.ubereats ? orderBtn() : ""}
    <a class="btn primary" href="tel:${R.tel}">Call ${R.phoneDots}</a>
  </nav>
</div></header>`;

// The back of her printed menu: script logo, then the address in wine caps.
const footer = `
<footer><div class="wrap">
  <a class="foot-logo" href="/">${logoSVG({ id: "ftr" })}</a>
  <div class="addr">${R.streetShort} ${R.city}, ${R.region} ${R.zip}<br><a href="tel:${R.tel}">${R.phoneDots}</a><br>carminestogo.com</div>
  <div class="social"><a href="${R.facebook}">Facebook</a><a href="${R.instagram}">Instagram</a>${R.ubereats ? `<a href="${R.ubereats}">Uber Eats</a>` : ph("Uber Eats link")}</div>
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
<meta name="theme-color" content="${BRAND.wine}">
<link rel="icon" type="image/png" href="/assets/img/favicon.png"><link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="restaurant">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}/assets/img/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Carmine's Italiano logo">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;1,400;1,700&family=Josefin+Sans:wght@600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${[schema, ...extraSchema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
</head><body>
${nav(active)}
<main>${main}</main>
${footer}
</body></html>`;

const hoursList = `<ul class="info-list">${HOURS.map(([d, h]) => `<li><span>${d}</span><span class="${h ? "" : "closed"}">${h || "Closed"}</span></li>`).join("")}</ul>`;

// ---------- Home: laid out like the cover of her menu ----------
// Dishes the current site calls favorites. Descriptions and prices get transcribed from the menu.
const FAVORITES = [
  { n: "Chicken Piccata" }, { n: "Al's Fussili" }, { n: "Risotto" },
];

const home = page(
  "Carmine's Italiano | Italian Restaurant on Transit Road, Williamsville NY",
  "Carmine's Italiano at 7170 Transit Road in Williamsville: dine-in, take-out, catering and banquets. Open Wednesday to Sunday from 4pm.",
  "",
  `
<section class="cover"><div class="wrap">
  <h1 class="mark">${logoSVG({ id: "hero" })}</h1>
  <p class="tagline">Dine-in · Take-out · Catering &amp; Banquets</p>
  <p class="lead">${ph("Opening line in Kelly's words: what Carmine's is and who it's for")}</p>
  <div class="ctas">
    <a class="btn primary" href="/menu.html">See the menu</a>
    <a class="btn ghost" href="tel:${R.tel}">Call ${R.phoneDots}</a>
    <a class="link" href="#" data-open-chat>or ask us a question</a>
  </div>
  <p class="facts"><span>${R.streetShort} ${R.city}</span><span>Wed–Sun from 4pm</span><span>Catering 7 days</span></p>
</div></section>

<section class="tight"><div class="wrap">
  ${ruleHead("Create Your Own Bowl")}
  <p class="sub-caps">Pick a pasta &amp; a sauce</p>
  <div class="shelf" style="--n:8">
    ${BOWL_PASTA.map(([label, art]) => `<figure>${pastaSVG(art)}<figcaption>${label}</figcaption></figure>`).join("\n    ")}
  </div>
  <p class="note" style="margin-top:22px">Staging note: pasta choices from the March 2025 dinner menu. Sauces and prices come in with the menu transcription.</p>
</div></section>

<div class="band"><div class="wrap">
  <div class="caps">Stuffed Eggplant Parmesan <span class="price">$ —</span></div>
  <p>${ph("Description from the current menu")}</p>
</div></div>

<section><div class="wrap">
  ${ruleHead("House Favorites")}
  <div class="dishes">
    ${FAVORITES.map((f) => `<article class="dish">${phPhoto(f.n)}<h3>${f.n}<span class="price">$ —</span></h3><p>${ph("Description from the current menu")}</p></article>`).join("\n    ")}
  </div>
  <p class="center" style="margin-top:34px"><a class="btn ghost" href="/menu.html">The full menu</a></p>
</div></section>

<section><div class="wrap split">
  <div>
    <span class="eyebrow">Our story</span>
    <h2>${ph("Headline for the Carmine's story")}</h2>
    <p class="sub">${ph("Short history, written with Kelly and Alex. The current site says almost 45 years and several Taste of Buffalo honors; confirm the dates and awards before using them.")}</p>
    <a class="btn primary" href="/story.html">Read our story</a>
  </div>
  <figure class="photo">${phPhoto("a family or archive photo, with rights confirmed", "4/5")}</figure>
</div></section>

<section><div class="wrap cols2">
  <div>
    <span class="eyebrow">Catering &amp; banquets</span>
    <h2>Feeding the whole party</h2>
    <p class="sub">${CATERING.intro}</p>
    <p><a class="btn primary" href="/catering.html">See catering</a></p>
  </div>
  <div id="visit">
    <span class="eyebrow">Visit</span>
    <h2>${R.street}</h2>
    ${hoursList}
    <p class="small">Reservations are suggested for parties of 6 or more and on Fridays and Saturdays. Call <a href="tel:${R.tel}">${R.phone}</a>.</p>
  </div>
</div></section>`
);

// ---------- Menu ----------
const itemRow = (i) => `<div class="item"><div class="head"><span class="nm">${i.ph ? ph(i.n) : i.n}</span><span class="pr">${priceText(i)}</span>${i.h ? `<span class="heritage">${i.h}</span>` : ""}</div><div class="ds">${i.ph ? ph(i.d) : i.d}</div>${i.v ? `<ul class="opts">${i.v.map(([l, p, add]) => `<li>${l} ${add ? "+" : ""}${money(p)}</li>`).join("")}</ul>` : ""}</div>`;
const menuPage = page(
  "Menu | Carmine's Italiano, Williamsville NY",
  "Dinner menu at Carmine's Italiano, 7170 Transit Road, Williamsville NY.",
  "Menu",
  `
${pageHead("The Menu", "Dishes come with soup or salad and bread &amp; butter. " + ph("confirm against the current menu"))}
<section class="tight"><div class="wrap">
  <p class="note">Staging note: the menu hasn't been transcribed yet. It will come from her newest printed menu, checked against carminestogo.com, with real prices.</p>
  <div class="menu-nav">${MENU.map((s, k) => `<a href="#${s.id}">Section ${k + 1}</a>`).join("")}</div>
  <div class="menu-cols">${MENU.map((s, k) => `
  <div class="menu-section" id="${s.id}">${ruleHead(s.title === "Section name" ? `Section ${k + 1}` : s.title)}
    ${s.items.map(itemRow).join("\n    ")}
  </div>`).join("")}</div>
  <p class="center" style="margin-top:40px">${orderBtn("primary")} <a class="btn ghost" href="/catering.html">Catering &amp; banquets</a></p>
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
const recipeCard = (r) => `<details class="recipe-card"><summary><div class="rc-from">${esc(r.from)}</div><h3>${esc(r.title)}</h3>${r.yield ? `<p>Yield: ${esc(r.yield)}</p>` : ""}<p>${esc(r.blurb)}</p><span class="rc-open">Read the card</span></summary>
      <div class="rc-body"><h4>Ingredients</h4><ul class="rc-ing">${r.ingredients.map(ingRow).join("")}</ul>${r.steps.length ? `<h4>Procedure</h4>${r.steps.map((x) => `<p>${esc(x)}</p>`).join("")}` : ""}</div></details>`;
const storyPage = page(
  "Our Story | Carmine's Italiano, Williamsville NY",
  "The story of Carmine's Italiano on Transit Road in Williamsville.",
  "Our Story",
  `
${pageHead("Our Story", ph("Intro written with Kelly and Alex"))}
<section class="tight"><div class="wrap story-head" style="max-width:820px">
  <ol class="timeline">
    ${TIMELINE.map(tlItem).join("\n    ")}
  </ol>
  ${RECIPES.length ? `${ruleHead("From the Kitchen")}<div class="recipes">${RECIPES.map(recipeCard).join("\n    ")}</div>` : ""}
</div></section>`, [], "/story.html"
);

// ---------- Catering ----------
const cateringPage = page(
  "Catering & Banquets | Carmine's Italiano, Williamsville NY",
  "Drop-off catering from Carmine's Italiano for gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week. Banquets at the restaurant.",
  "Catering",
  `
${pageHead("Catering &amp; Banquets", CATERING.intro)}
<section class="tight"><div class="wrap">
  ${ruleHead("Main Drop-Off Menu")}
  <p class="sub-caps">Parties of 10 or more</p>
  <div class="pkgs">
    <div><div class="pkg-name">${ph("Package")}</div><p class="price" style="font-size:20px">$ — <small>per person</small></p><p>${ph("What's included, from the newest catering menu")}</p></div>
    <div><div class="pkg-name">${ph("Package")}</div><p class="price" style="font-size:20px">$ — <small>per person</small></p><p>${ph("What's included, from the newest catering menu")}</p></div>
  </div>
</div></section>
<section class="tight"><div class="wrap split" style="align-items:start">
  <div>
    ${ruleHead("Appetizers · Salads · Sides · Entrées", "h3", "sm")}
    <p>${phBlock("Choices transcribed from the newest catering menu")}</p>
    ${ruleHead("Banquets", "h3", "sm")}
    <p>${phBlock("Banquet packages transcribed from the newest banquet menu")}</p>
    <p class="small">Call <a href="tel:${R.tel}">${R.phone}</a> to plan your order.</p>
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
