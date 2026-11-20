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
  // Shift4 Online Ordering "Menu URL" (pickup only). Paste it here once Kelly turns ordering on; every order button switches to it.
  orderOnline: "https://online.skytab.com/5236d831a504b72d60cf56459a158868",
  ubereats: null,
  // From Kelly (Nov 2026): owners Kelly & Alex Jacobbi; opened in 1993.
  owners: "Kelly & Alex Jacobbi",
  founded: 1993,
  // She keeps closing times flexible and posts holiday hours on Google.
  hoursNote: "Closing times vary by night. Holiday hours are posted on Google.",
};

// ---------- Dining menu ----------
// content/menu.json, transcribed from her newest printed dinner menu (see its "source" field). The owner menu editor
// (/admin/) edits the same shape. p: price or null; v: options as [label, price]; feature: printed in a wine band.
const MENU_DOC = JSON.parse(readFileSync("content/menu.json", "utf8"));
const MENU = MENU_DOC.sections;
const BOWL = MENU.find((s) => s.id === "bowl");
const findItem = (name) => MENU.flatMap((s) => s.items).find((i) => i.n === name);

// ---------- Catering & banquets ----------
// content/catering.json (May 14, 2026 catering menu) and content/banquet.json (October 2024 banquet menu),
// transcribed from her newest Dropbox PDFs. See each file's "source" and "edits" fields.
// Confirmed on the current site: catering for gatherings of 10 or more, delivered anywhere in the 716 area,
// seven days a week, afternoon through evening.
// content/takeout.json: the take-out specials flier (May 19, 2026) from carminestogo.com's Take-out page.
const TAKEOUT = JSON.parse(readFileSync("content/takeout.json", "utf8"));
const takeoutSpecial = (k) => `<div>
      <div class="pkg-name">${k.n} <span class="price">${money(k.p)}</span></div>
      <ul class="choice-list">${k.includes.map((t) => `<li>${t}</li>`).join("")}</ul>${k.pasta ? `
      <p class="sub-caps choose" style="margin-top:14px">${k.choose}</p>
      <div class="pick2"><div><b>Pasta</b>${k.pasta.join("<br>")}</div><div><b>Sauce</b>${k.sauces.map(([n, x]) => `${n}${x ? ` <span class="x">+${x.toFixed(2)}</span>` : ""}`).join("<br>")}</div></div>` : ""}${k.note ? `
      <p class="small" style="margin-top:10px">${k.note}</p>` : ""}
    </div>`;
const takeoutSection = () => `
<section class="tight" id="takeout"><div class="wrap">
  ${ruleHead(TAKEOUT.title)}
  <p class="sub-caps">${TAKEOUT.sub}</p>
  <div class="pkgs">
    ${TAKEOUT.specials.map(takeoutSpecial).join("\n    ")}
  </div>
  <p class="center" style="margin-top:22px">${orderBtn("primary")}</p>
</div></section>`;
const CATER = JSON.parse(readFileSync("content/catering.json", "utf8"));
const BANQ = JSON.parse(readFileSync("content/banquet.json", "utf8"));
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
// Prices print the way her menus do: 28.99, no dollar sign.
const money = (n) => (typeof n === "number" ? n.toFixed(2) : n === "mp" ? "Market" : "$ —");
const priceText = (i) => (i.p != null ? money(i.p) : i.v && i.v.length ? i.v.map(([l, p]) => `${l} ${money(p)}`).join(" · ") : "$ —");
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Stand-in for a photo that hasn't been chosen or cleared yet.
// content/photos.json: every photo, its source and the permission still needed.
const PHOTOS = JSON.parse(readFileSync("content/photos.json", "utf8"));
const dishPhoto = (n) => PHOTOS.dishes.find((d) => d.dish === n);
const STANDIN = `<span class="ph">Sample: Giacobbi’s plate, same recipe</span>`;
const CREDIT = `<span class="ph">Photo credit + OK from the photographer</span>`;
// f is a file in assets/img/photos/, or "lib:<id>" for a photo-library thumbnail (assets/img/library/<id>-t.jpg, 480 px).
const photoSrc = (f) => (f.startsWith("lib:") ? `/assets/img/library/${f.slice(4)}-t.jpg` : `/assets/img/photos/${f}.jpg`);
const snap = (f, alt, cap, tilt = "") => `<figure class="snap"${tilt ? ` style="transform:rotate(${tilt}deg)"` : ""}><img src="${photoSrc(f)}" alt="${alt}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
// content/awards.json: Kelly's Taste of Buffalo records.
const AWARDS = JSON.parse(readFileSync("content/awards.json", "utf8"));
const phPhoto = (label, ratio = "4/3") => `<div class="ph ph-block" style="aspect-ratio:${ratio};display:grid;place-items:center;text-align:center;margin:0">[Photo: ${label}]</div>`;
// Catering prices print the way her catering menu does: whole dollars without cents.
const trayPrice = (n) => (typeof n === "number" ? (Number.isInteger(n) ? String(n) : n.toFixed(2)) : n === "mp" ? "Mkt" : "—");
const extra = (x) => (x ? ` <span class="x">+${x.toFixed(2)}</span>` : "");
const choiceItem = (i) => `<li>${i.n}${i.best ? ` <span class="best">Our best seller</span>` : ""}${extra(i.x)}${i.d ? `<small>${i.d}</small>` : ""}</li>`;
const choiceGroup = (g) => `<div>${g.choose ? `<p class="sub-caps choose">Choose ${g.choose}</p>` : ""}<h3 class="rule-head sm">${g.title}</h3><ul class="choice-list">${g.items.map(choiceItem).join("")}</ul></div>`;
// Leader-dot rows: name ........ price(s)
const ledgerRow = (n, d, prices) => `<div class="lrow"><span class="nm">${n}${d ? ` <i>${d}</i>` : ""}</span><span class="dots"></span>${prices.map((p) => `<span class="pr">${p}</span>`).join("")}</div>`;
const ledgerHead = (cols) => `<div class="lrow lhead"><span class="nm"></span><span class="dots" style="border:0"></span>${cols.map((c) => `<span class="pr">${c}</span>`).join("")}</div>`;
const banquetPkg = (k) => `<article class="banquet">
    <h3 class="pkg-name">${k.n} <span class="price">${money(k.p)}</span></h3>
    <p class="small-caps">per person · children 4–10 $${k.kids}</p>${k.lead ? `<p class="center">${k.lead}</p>` : ""}
    <p class="includes"><b>Includes</b> ${k.includes.join(" · ")}</p>
    <p class="sub-caps choose">${k.choose}</p>
    <ul class="choice-list two">${k.items.map((n) => `<li>${n}${n === k.best ? ` <span class="best">Our best seller</span>` : ""}</li>`).join("")}</ul>
  </article>`;
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
  foundingDate: String(R.founded),
  url: `${SITE}/`,
  address: { "@type": "PostalAddress", streetAddress: R.street, addressLocality: R.city, addressRegion: R.region, postalCode: R.zip, addressCountry: "US" },
  areaServed: "Buffalo, NY",
  // Left out on purpose until confirmed: image, priceRange, closing times (she keeps them flexible).
  sameAs: [R.facebook, R.instagram],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "16:00" },
  ],
};

const offer = (price, name) => ({ "@type": "Offer", ...(name ? { name } : {}), price: price.toFixed(2), priceCurrency: "USD" });
const itemOffers = (i) => [...(typeof i.p === "number" ? [offer(i.p)] : []), ...(i.v || []).map(([l, p]) => offer(p, `${i.n}, ${l.toLowerCase()}`))];
const realItems = (s) => s.items.filter((i) => !i.ph && !i.hidden);
// Only real, transcribed items go into the structured data. Placeholders never do.
const menuSchema = MENU.some((s) => realItems(s).length) ? [{
  "@context": "https://schema.org", "@type": "Menu", name: "Dinner Menu", inLanguage: "en",
  hasMenuSection: MENU.filter((s) => realItems(s).length).map((s) => ({ "@type": "MenuSection", name: s.title,
    hasMenuItem: realItems(s).map((i) => { const o = itemOffers(i); return { "@type": "MenuItem", name: i.n, description: i.d, ...(o.length ? { offers: o.length === 1 ? o[0] : o } : {}) }; }) })),
}] : [];

const orderBtn = (cls = "ghost") => R.orderOnline
  ? `<a class="btn ${cls}" href="${R.orderOnline}" target="_blank" rel="noopener">Order online for pickup</a>`
  : R.ubereats
  ? `<a class="btn ${cls}" href="${R.ubereats}" target="_blank" rel="noopener">Order on Uber Eats</a>`
  : `<a class="btn ${cls}" href="tel:${R.tel}">Call for take-out</a>`;

const nav = (active) => `
<div class="demo-banner"><b>Staging preview</b> · A redesign concept for Carmine's. Striped labels are placeholders waiting on real content.</div>
<header class="nav"><div class="wrap">
  <a class="brand" href="/" aria-label="Carmine's Italiano, home">${logoSVG({ id: "hdr" })}</a>
  <button class="menu-toggle" aria-label="Menu" onclick="document.querySelector('nav.links').classList.toggle('open')">☰</button>
  <nav class="links">
    ${[["/menu.html", "Menu"], ["/takeout.html", "Take-Out"], ["/catering.html", "Catering"], ["/banquets.html", "Banquets"], ["/story.html", "Our Story"], ["/#visit", "Visit"]]
      .map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    ${R.orderOnline ? `<a class="btn ghost" href="${R.orderOnline}" target="_blank" rel="noopener">Order online</a>` : R.ubereats ? orderBtn() : ""}
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

const hoursList = `<ul class="info-list">${HOURS.map(([d, h]) => `<li><span>${d}</span><span class="${h ? "" : "closed"}">${h || "Closed"}</span></li>`).join("")}</ul>
    <p class="small">${R.hoursNote}</p>`;

// ---------- Home: laid out like the cover of her menu ----------
// Dishes the current site calls favorites. Descriptions and prices get transcribed from the menu.
// The current site names Chicken Piccata, Al's Fussili and "Risotto" as favorites. Which risotto is a question for Kelly.
const FAVORITES = ["Piccata", "Al’s Fussili w/ Chicken", "Salmon & Asparagus Risotto"];
// Stories behind dish names, in Kelly's words (Nov 2026).
const DISH_NOTES = { "Al’s Fussili w/ Chicken": "Created by our son Alex Jacobbi, and a house favorite ever since.", "Salmon & Asparagus Risotto": "Our asiago-asparagus risotto won Chairman’s Choice at the 2021 Taste of Buffalo." };

const home = page(
  "Carmine's Italiano | Italian Restaurant on Transit Road, Williamsville NY",
  "Carmine's Italiano at 7170 Transit Road in Williamsville: dine-in, take-out, catering and banquets. Open Wednesday to Sunday from 4pm.",
  "",
  `
<figure class="hero">
  <img src="/assets/img/hero-mural.jpg" srcset="/assets/img/hero-mural-sm.jpg 1200w, /assets/img/hero-mural.jpg 2400w" sizes="100vw" alt="The painted Buffalo mural on the side of our building at night: stained-glass colors around a script Carmine's over the word Buffalo" fetchpriority="high">
  <figcaption>The Buffalo mural on the side of our building · <span class="ph">Artist's name + credit</span></figcaption>
</figure>
<section class="cover"><div class="wrap">
  <h1 class="visually-hidden">Carmine's Italiano</h1>
  <p class="tagline">Dine-in · Take-out · Catering &amp; Banquets</p>
  <p class="lead">A casual family Italian restaurant on Transit Road since ${R.founded}.</p>
  <div class="ctas">
    <a class="btn primary" href="/menu.html">See the menu</a>
    <a class="btn ghost" href="tel:${R.tel}">Call ${R.phoneDots}</a>
    <a class="link" href="#" data-open-chat>or ask us a question</a>
  </div>
  <p class="facts"><span>${R.streetShort} ${R.city}</span><span>Wed–Sun from 4pm</span><span>Catering 7 days</span></p>
</div></section>

<section class="tight pasta-band"><div class="wrap">
  <div class="shelf" style="--n:${BOWL.pasta.length}">
    ${BOWL.pasta.map(([label, , art]) => `<figure>${pastaSVG(art)}<figcaption>${label}</figcaption></figure>`).join("\n    ")}
  </div>
  <p class="center pasta-line">${BOWL.pasta.length} pastas, ${BOWL.items.length} sauces, made your way. <a href="/menu.html#bowl">See the menu</a></p>
</div></section>

<section><div class="wrap">
  ${ruleHead("House Favorites")}
  <div class="dishes">
    ${FAVORITES.map((n) => { const i = n && findItem(n); return i
      ? `<article class="dish">${dishPhoto(i.n) ? snap(dishPhoto(i.n).f, dishPhoto(i.n).alt, "From our kitchen", "-1") : phPhoto(i.n)}<h3>${i.n === "Piccata" ? "Chicken Piccata" : i.n}</h3><p>${i.d}</p>${DISH_NOTES[i.n] ? `<p class="dish-note">${DISH_NOTES[i.n]}</p>` : ""}</article>`
      : `<article class="dish">${phPhoto("Risotto")}<h3>Risotto</h3><p>${ph("Award-winning risotto: Kelly is sending the Taste of Buffalo records. The menu has Filet Mignon Mushroom Risotto and Salmon & Asparagus Risotto.")}</p></article>`; }).join("\n    ")}
  </div>
  <p class="center" style="margin-top:34px"><a class="btn ghost" href="/menu.html">The full menu</a></p>
</div></section>

<section class="tight"><div class="wrap">
  ${ruleHead("In the Kitchen")}
  <div class="snaps">
    ${PHOTOS.kitchen.slice(1, 5).map((k, j) => snap(k.f, k.alt, k.cap, [1.2, -0.8, 0.9, -1.3][j])).join("\n    ")}
  </div>
  <p class="center small" style="margin-top:14px">From our East Amherst kitchen, 2017. ${CREDIT}</p>
</div></section>

<section><div class="wrap split">
  <div>
    <span class="eyebrow">Our story</span>
    <h2>A casual family Italian restaurant since ${R.founded}</h2>
    <p class="sub">Carmine's opened its doors in 1993. A fire in 2015 changed our course, and we reopened in East Amherst in 2017 before finding our forever home here at 7170 Transit Road in September 2022. Family owned and operated by ${R.owners}.</p>
    <a class="btn primary" href="/story.html">Read our story</a>
  </div>
  ${snap("ea-sign", PHOTOS.kitchen[0].alt, `East Amherst, 2017 · ${CREDIT}`, "-1.5")}
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
// As printed: name, then price in wine italics; two-way prices ("Chicken 30.99 Veal 32.99") on the same line.
const itemRow = (i) => `<div class="item${i.feature ? " feature" : ""}${i.hidden ? " is-hidden" : ""}"><div class="head"><span class="nm">${i.n}</span>${i.p != null ? `<span class="pr">${money(i.p)}</span>` : ""}${i.v && i.p == null && i.v.length <= 2 && !i.d.includes("instead") ? i.v.map(([l, p]) => ` <span class="pr"><span class="opt-l">${l}</span> ${money(p)}</span>`).join("") : ""}</div>${i.d ? `<div class="ds">${i.d}</div>` : ""}${i.v && (i.p != null) ? `<ul class="opts">${i.v.map(([l, p]) => `<li>${l} ${money(p)}</li>`).join("")}</ul>` : ""}</div>`;
const addsRow = (s) => s.adds ? `<p class="adds">${s.adds.map(([l, p]) => `${l} <b>${money(p)}</b>`).join(" · ")}</p>` : "";
const sectionBody = (s) => s.id === "bowl" ? `
    <p class="sub-caps" style="margin-top:-6px">${s.sub}</p>
    <p class="center small" style="margin:0 0 8px">${s.served}</p>
    <div class="shelf" style="--n:4">${s.pasta.map(([label, up, art]) => `<figure>${pastaSVG(art)}<figcaption>${label}${up ? ` +${up}` : ""}</figcaption></figure>`).join("")}</div>
    <p class="sub-caps" style="margin:10px 0 4px;font-size:12px">${s.gf}</p>
    ${s.items.map(itemRow).join("\n    ")}
    <h3 class="rule-head sm" style="margin-top:18px">Pasta Add-Ons</h3>${addsRow(s)}`
  : `${s.items.map(itemRow).join("\n    ")}${s.adds ? addsRow(s) : ""}`;
const menuPage = page(
  "Menu | Carmine's Italiano, Williamsville NY",
  "Dinner menu at Carmine's Italiano, 7170 Transit Road, Williamsville NY.",
  "Menu",
  `
${pageHead("The Menu", MENU_DOC.note)}
<section class="tight"><div class="wrap">
  <p class="note">Staging note: transcribed from the March 18, 2025 printed menu. Kelly to confirm nothing has changed since.</p>
  <div class="menu-nav">${MENU.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}<a href="/takeout.html">Take-Out Specials</a></div>
  <div class="snaps" style="margin-bottom:30px">
    ${PHOTOS.dishes.filter((d) => !["Piccata", "Salmon & Asparagus Risotto"].includes(d.dish)).map((d, j) => snap(d.f, d.alt, d.dish === "Parmesan" ? "Chicken Parmesan" : d.dish, [1, -1.2, 0.8, -0.6][j])).join("\n    ")}
  </div>
  <div class="menu-cols">${MENU.map((s, k) => `
  <div class="menu-section" id="${s.id}">${ruleHead(s.title)}
    ${sectionBody(s)}
  </div>`).join("")}</div>
  <p class="note" style="margin-top:30px">${MENU_DOC.allergy}</p>
  <script src="/assets/menu-preview.js"></script>
  <p class="center" style="margin-top:40px">${orderBtn("primary")} <a class="btn ghost" href="/takeout.html">Take-out specials</a> <a class="btn ghost" href="/catering.html">Catering</a></p>
</div></section>`,
  menuSchema, "/menu.html"
);

// ---------- Story ----------
// History in Kelly's own words (Nov 2026). Fill only with dates and events the family confirms.
// { y: "year", t: "title", d: "text", clip?: { f, alt, cite, url } } — press clips need rights checked first (CLAUDE.md).
const TIMELINE = [
  { y: "1993", t: "Carmine's opens", d: "We wanted a casual, family Italian restaurant. There was never a Carmine in the family; we just felt the name had exactly that feel." },
  { y: "2015", t: "The fire", d: "A devastating fire changed the course of Carmine's." },
  { y: "2017", t: "Back in business", d: "Carmine's reopened at 9430 Transit Road in East Amherst, our home for five years." },
  { y: "2022", t: "Our forever home", d: "In September 2022 we moved to 7170 Transit Road in Williamsville, where we are today." },
  { y: "2023", t: "Chef Dave comes back", d: "Dave Marshal first cooked for our family from 1997 to 2001, then went on to another career. He came back to our kitchen in 2023, and he's been a nice addition to the family." },
  { y: "2003–2022", t: "Ten Taste of Buffalo awards", d: "From Best Vegetarian in 2003 to Best Seafood in 2022, including Chairman’s Choice three times and Best Seafood five times. The full list is below." },
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
${pageHead("Our Story", `A casual family Italian restaurant since ${R.founded}, owned and operated by ${R.owners}.`)}
<section class="tight"><div class="wrap story-head" style="max-width:820px">
  <ol class="timeline">
    ${TIMELINE.map(tlItem).join("\n    ")}
  </ol>
  ${ruleHead("Taste of Buffalo")}
  <p class="sub-caps">Our ten awards</p>
  <div class="ledger awards">${AWARDS.awards.map((a) => `<div class="lrow"><span class="nm"><b>${a.y}</b> ${a.award}</span><span class="dots"></span><span class="pr">${a.dish || ph(a.ask)}</span></div>`).join("")}</div>
  ${ruleHead("The Family")}
  <div class="cols2 family">
    <div><h3>Kelly &amp; Alex Jacobbi</h3><p>Owners. Alex created Al’s Fussili, the dish that became a house favorite.</p></div>
    <div><h3>Chef Dave Marshal</h3><p>In our kitchen from 1997 to 2001, and again since 2023.</p></div>
  </div>
  <div class="snaps two" style="margin-top:30px">
    ${snap("ea-toss", PHOTOS.kitchen[5].alt, `East Amherst kitchen, 2017 · ${CREDIT}`, "-1")}
    <figure class="snap" style="transform:rotate(1deg)">${phPhoto("the family and Chef Dave at the restaurant (Kelly is OK showing faces; photo shoot planned)", "4/3")}<figcaption>Coming from the photo shoot</figcaption></figure>
  </div>
  ${RECIPES.length ? `${ruleHead("From the Kitchen")}<div class="recipes">${RECIPES.map(recipeCard).join("\n    ")}</div>` : ""}
</div></section>`, [], "/story.html"
);

// Quote / request form, shared by the catering and banquet pages.
const quoteSection = (kind) => `
<section class="tight" id="quote"><div class="wrap split" style="align-items:start">
  <div>
    ${ruleHead("Plan your party", "h2")}
    <p>Tell us the date, how many guests and what you'd like, and we'll put it together. ${kind === "banquet" ? "Banquets are in our private room at the restaurant, with seating for 40." : "Drop-off trays come family-style, ready to serve, and the full-service package brings our staff to you."}</p>
    <p>Call <a href="tel:${R.tel}">${R.phone}</a>, or send a request and we'll call you back.</p>
  </div>
  <div class="quote-form">
    <h3>${kind === "banquet" ? "Ask about a banquet" : "Request a catering quote"}</h3>
    <form class="stack" onsubmit="event.preventDefault();this.innerHTML='<p><b>Thank you!</b> Demo only, nothing was sent. In the live site this request goes to the catering inbox in the owner dashboard.</p>'">
      <label>Name<input required></label>
      <label>Email or phone<input required></label>
      <label>Event date<input type="date" required></label>
      <label>Guests<select><option>10–25</option><option>25–50</option><option>50–100</option><option>100+</option></select></label>
      <label>What you need<select>${kind === "banquet" ? "<option>Banquet at the restaurant</option><option>Drop-off catering</option>" : "<option>Drop-off catering</option><option>Full-service party</option><option>Banquet at the restaurant</option>"}</select></label>
      <label>Anything else?<textarea rows="3" placeholder="Dietary needs, favorite dishes, budget…"></textarea></label>
      <button class="btn primary">Send request</button>
    </form>
  </div>
</div></section>`;

// ---------- Catering ----------
const cateringPage = page(
  "Catering | Carmine's Italiano, Williamsville NY",
  "Drop-off catering from Carmine's Italiano for gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week.",
  "Catering",
  `
${pageHead("Catering", CATERING.intro)}
<nav class="menu-nav wrap"><a href="#dropoff">Drop-off</a><a href="#full-service">Full service</a><a href="#trays">Just trays</a><a href="/banquets.html">Banquets</a><a href="#quote">Request a quote</a></nav>

<section class="tight" id="dropoff"><div class="wrap">
  ${ruleHead(CATER.dropoff.title)}
  <p class="sub-caps">${CATER.dropoff.min}</p>
  <div class="pkgs">
    ${CATER.dropoff.packages.map((k) => `<div><div class="pkg-name">${k.n} <span class="price">${money(k.p)}</span></div><p class="small-caps">per person</p><p>${k.d}</p></div>`).join("\n    ")}
  </div>
  <p class="adds" style="margin-top:18px">${CATER.dropoff.adds}</p>
  <div class="choices">
    ${CATER.dropoff.groups.map(choiceGroup).join("\n    ")}
  </div>
  <p class="note" style="margin-top:8px"><span class="x">+1.00</span> = extra per person</p>
  <ul class="fine-print">${CATER.dropoff.fine.map((t) => `<li>${t}</li>`).join("")}</ul>
</div></section>

<section class="tight" id="full-service"><div class="wrap">
  ${ruleHead(`${CATER.fullservice.title} <span class="price">${money(CATER.fullservice.p)}</span>`)}
  <p class="sub-caps">Per person · served by our staff</p>
  <div class="choices three">
    ${CATER.fullservice.groups.map(choiceGroup).join("\n    ")}
  </div>
  <p class="center" style="max-width:720px;margin:26px auto 6px">${CATER.fullservice.includes}</p>
  <p class="center small">${CATER.fullservice.fee}</p>
  <p class="adds">${CATER.fullservice.dropoffNote}</p>
</div></section>

<section class="tight" id="trays"><div class="wrap">
  ${ruleHead(CATER.trays.title)}
  <p class="sub-caps">${CATER.trays.serves}</p>
  <div class="cols2 ledgers">
    <div>
      <div class="ledger">${ledgerHead(["Count", ""])}${CATER.trays.counted.map((t) => ledgerRow(t.n, t.d, [`<span class="ct">${t.ct} ct</span>`, trayPrice(t.p)])).join("")}</div>
      <div class="ledger" style="margin-top:22px">${ledgerHead(["Full", "Half"])}${CATER.trays.sized.slice(0, 13).map((t) => ledgerRow(t.n, t.d, [trayPrice(t.full), trayPrice(t.half)])).join("")}</div>
    </div>
    <div>
      <div class="ledger">${ledgerHead(["Full", "Half"])}${CATER.trays.sized.slice(13).map((t) => ledgerRow(t.n, t.d, [trayPrice(t.full), trayPrice(t.half)])).join("")}</div>
    </div>
  </div>
  <p class="note" style="margin-top:22px">${CATER.trays.fine}</p>
</div></section>

${quoteSection("catering")}`, [], "/catering.html"
);

// ---------- Banquets ----------
const banquetsPage = page(
  "Banquets | Carmine's Italiano, Williamsville NY",
  "Banquets and private parties in Carmine's private room, seating 40, at 7170 Transit Road, Williamsville NY.",
  "Banquets",
  `
${pageHead("Banquets", "Showers, birthdays, anniversaries and celebrations of life in our private room.")}
<section class="tight" id="banquets"><div class="wrap">
  ${ruleHead("Banquet Packages")}
  <p class="sub-caps">${BANQ.room}</p>
  ${BANQ.packages.map(banquetPkg).join("\n  ")}
  <div class="cols2 ledgers" style="margin-top:40px">
    <div>${ruleHead("Add-ons", "h3", "sm")}<div class="ledger">${BANQ.addons.map((t) => ledgerRow(t.n, t.d, [trayPrice(t.p)])).join("")}</div></div>
    <div>${ruleHead("Miscellaneous", "h3", "sm")}<div class="ledger">${BANQ.misc.map((t) => ledgerRow(t.n, t.d, [trayPrice(t.p)])).join("")}</div></div>
  </div>
  <p class="note" style="margin-top:22px">Staging note: from the October 2024 banquet menu. carminestogo.com still shows the May 2024 banquet prices, so Kelly to confirm which is current.</p>
</div></section>

${quoteSection("banquet")}`, [], "/banquets.html"
);

// ---------- Take-out ----------
const takeoutPage = page(
  "Take-Out | Carmine's Italiano, Williamsville NY",
  "Take-out from Carmine's Italiano: family-size specials that feed 4–6, and the full dinner menu. Call 716-636-3100.",
  "Take-Out",
  `
${pageHead("Take-Out", `${R.orderOnline ? `Order online and pick it up at ${R.streetShort}, across from T.J. Maxx, or call <a href="tel:${R.tel}">${R.phone}</a>.` : `Call <a href="tel:${R.tel}">${R.phone}</a> and pick it up at ${R.streetShort}, across from T.J. Maxx.`} The full dinner menu is available to go.`)}
${R.orderOnline ? `<p class="center" style="margin:-10px 0 10px"><a class="btn primary" href="${R.orderOnline}" target="_blank" rel="noopener">Order online for pickup</a></p>` : ""}
${takeoutSection()}
<section class="tight"><div class="wrap split" style="align-items:center">
  <figure class="snap" style="transform:rotate(-1.2deg);max-width:440px;margin:0 auto"><a href="/assets/img/takeout-flier-2026-05-19.jpg" target="_blank" rel="noopener"><img src="/assets/img/takeout-flier-2026-05-19.jpg" alt="Carmine's take-out specials flier: Big Bucket of Pasta $39.99 and Chicken Parm Pack $64.99, feeds 4 to 6, take-out only" style="aspect-ratio:auto"></a><figcaption>The flier, May 2026</figcaption></figure>
  <div>
    ${ruleHead("Ordering", "h2")}
    <p>Call ahead and your order will be ready when you get here. We're open for dinner Wednesday through Sunday from 4pm.</p>
    <p>${R.orderOnline ? `Or order online and pick it up: pay ahead and skip the call. <a href="${R.orderOnline}" target="_blank" rel="noopener">Order online</a>.` : ph("Online ordering (pickup only) goes here once Kelly turns on Shift4 Online Ordering and sends the Menu URL.")}</p>
    <p><a class="btn primary" href="tel:${R.tel}">Call ${R.phoneDots}</a> <a class="btn ghost" href="/menu.html">The dinner menu</a></p>
  </div>
</div></section>`, [], "/takeout.html"
);

// ---------- Market prices (admin/insights.html) ----------
// content/market.json: real competitor prices from their published menus. Carmine's price is looked up from the
// dinner menu so it stays current. A row whose Carmine's dish can't be found fails the build instead of guessing.
const MARKET_DOC = JSON.parse(readFileSync("content/market.json", "utf8"));
const carminesPrice = ([name, opt]) => {
  const i = findItem(name);
  if (!i) throw new Error(`market.json: no dish "${name}" on the dinner menu`);
  if (opt) { const v = (i.v || []).find(([l]) => l === opt); if (!v) throw new Error(`market.json: no option "${opt}" for "${name}"`); return v[1]; }
  if (typeof i.p !== "number") throw new Error(`market.json: "${name}" has no single price`);
  return i.p;
};
const MARKET = { ...MARKET_DOC, rows: MARKET_DOC.rows.map((r) => ({ ...r, carmines: carminesPrice(r.c), carminesName: r.c.join(", ") })) };

// ---------- Shared data for the admin editor and the concierge ----------
const menuData = {
  updated: MENU_DOC.updated,
  source: "printed dinner menu, " + MENU_DOC.updated,
  menu: MENU_DOC, // full document for the owner menu editor
  takeout: TAKEOUT.specials.map((k) => ({ n: k.n, p: k.p, includes: k.includes })),
  market: MARKET, // real competitor prices for the insights dashboard
  restaurant: { name: R.name, owners: R.owners, founded: R.founded, address: `${R.street}, ${R.city}, ${R.region} ${R.zip}`, phone: R.phone, tel: R.tel, orderOnline: R.orderOnline, ubereats: R.ubereats, hours: "Wednesday–Sunday from 4pm; closed Monday and Tuesday. Closing times vary by night, and holiday hours are posted on Google", catering: CATERING.intro },
  catering: { packages: CATER.dropoff.packages, fullService: CATER.fullservice.p, banquets: BANQ.packages.map((k) => ({ n: k.n, p: k.p })), room: BANQ.room },
  sections: MENU.map((s) => ({ id: s.id, title: s.title, items: s.items.filter((i) => !i.hidden).map((i) => ({ n: i.n, d: i.d, p: typeof i.p === "number" ? i.p : null, price: priceText(i) })) })),
};

// ---------- GEO / crawler files ----------
const llms = `# Carmine's Italiano

> Italian restaurant at 7170 Transit Road, Williamsville, NY 14221. Dine-in, take-out, catering and banquets. Family owned and operated by ${R.owners}; opened in ${R.founded}.

## Essentials
- Phone: ${R.phone}
- Hours: Wednesday–Sunday from 4pm; closed Monday and Tuesday. Closing times vary; holiday hours are posted on Google.
- History: opened in 1993; after a 2015 fire, reopened at 9430 Transit Road, East Amherst in 2017; at 7170 Transit Road, Williamsville since September 2022.
- Reservations: suggested for parties of 6 or more and on Fridays and Saturdays (call)
- Take-out specials (take-out only, feed 4–6): ${TAKEOUT.specials.map((k) => `${k.n} $${money(k.p)} (${k.includes.join(", ").toLowerCase()})`).join("; ")}
- Taste of Buffalo awards: ${AWARDS.awards.map((a) => `${a.y} ${a.award}${a.dish ? ` (${a.dish})` : ""}`).join("; ")}
- Catering: gatherings of 10 or more, delivered anywhere in the 716 area, seven days a week, afternoon through evening
- Drop-off catering packages: ${CATER.dropoff.packages.map((k) => `${k.n} $${money(k.p)} per person (${k.d.toLowerCase()})`).join("; ")}. Full service party package $${money(CATER.fullservice.p)} per person. Trays by the full or half.
- Banquets: private room seating 40. ${BANQ.packages.map((k) => `${k.n} $${money(k.p)} per person`).join("; ")}.

## Pages
- [Menu](${SITE}/menu.html)
- [Our Story](${SITE}/story.html)
- [Take-Out](${SITE}/takeout.html)
- [Catering](${SITE}/catering.html)
- [Banquets](${SITE}/banquets.html)
`;

writeFileSync("index.html", home);
writeFileSync("menu.html", menuPage);
writeFileSync("story.html", storyPage);
writeFileSync("catering.html", cateringPage);
writeFileSync("banquets.html", banquetsPage);
writeFileSync("takeout.html", takeoutPage);
writeFileSync("assets/menu-data.js", `// Generated by build.mjs. Do not edit by hand.\nwindow.SITE_DATA = ${JSON.stringify(menuData, null, 1)};\n`);
writeFileSync("llms.txt", llms);
// Staging: keep it out of search engines so it doesn't compete with the live site.
writeFileSync("robots.txt", "User-agent: *\nDisallow: /\n");
console.log("built");
