# Carmine's Italiano — website redesign (staging)

Redesign of carminestogo.com for **Carmine's Italiano, 7170 Transit Road, Williamsville, NY 14221, (716) 636-3100**. Owners: **Kelly & Alex Jacobbi** (Kelly is the user's mom). It's a separate business from Giacobbi's Cucina Citta (the user's dad's restaurant, repo `~/code/giacobbis/giacobbis-staging`), so nothing from that site's content belongs here. Only the build machinery was reused.

This repo is a **staging demo** to show Kelly what's possible. It is not the live site.

## Today's setup (from Kelly, Nov 2026)
- **Website:** carminestogo.com, built by "Me Web Design". Jeremy manages it, and every change goes through him. Kelly wants us to host it or teach her to edit it herself.
- **POS:** Shift4 SkyTab. **Online ordering:** Uber Eats (store link not added yet). **Reservations:** no integration; by phone.
- **Her repetitive work:** menu updates, website updates, social media posts.
- **Wishlist:** average competitor prices, all marketing campaigns, happy hour incentives, take-out specials, dessert table tents, an updated menu look and style.
- **AI today:** weekly, for social media, menus and decor ideas.

## Facts confirmed on carminestogo.com (Nov 2026)
- Name as branded: "Carmine's Italiano". Tagline: "Dine-in, Take-Out, Catering & Banquets".
- Dinner Wednesday–Sunday from 4pm; closed Monday and Tuesday. Closing times aren't listed.
- Drop-off catering seven days a week, afternoon through evening, for gatherings of 10 or more, delivered anywhere in the 716 area.
- Reservations suggested for parties of 6 or more and on Fridays and Saturdays.
- Facebook https://www.facebook.com/CarminesToGo/ · Instagram https://www.instagram.com/carminestogo/
- The site names Chicken Piccata, Al's Fussili and Risotto as favorites.

**Claims to confirm before using them:**
- The current site says "for almost 45 years" and that Carmine's was honored several times by the Taste of Buffalo (the Risotto is "award winning"). Get the years and the awards from Kelly.
- The current site lists the owners as Kelly, Vincent and Alex Jacobbi. The user says Kelly & Alex. Ask which to use.
- Older Carmine's print pieces (napkin, 2013) show **4715 Transit Rd.** and (716) 632-2318, and the Giacobbi's repo says Carmine's on Transit Road closed after a 2015 fire. Drive has "GrandOpening" files from 2017. The move to 7170 Transit and the reopening date need Kelly's own wording before any history goes on the site.
- The site's contact email is a personal address. Don't publish it in this repo; ask what address the site should use.

## Source material (user's Google Drive: `Carmines2.0/`)
- `Carmine's/ACTUAL LOGOS/`: the official logo. **`LARGE_CARMINES_LOGO.ai` and `Carmines_Vector.ai` are real vector files** (PDF-compatible), so the logo was converted, not traced. Also `LARGE_CARMINES_LOGO(COLOR).jpg` (red script, green "Italiano") and black versions.
- `CarminesDinnerMenuPrinter1/2.jpg` and `.pdf` (2017): printed dinner menu. **Outdated prices**; use it only as a style reference (dark plum/charcoal, slab-serif dish names, wide display caps with triple rules, line drawings of pasta shapes).
- `CarminesCateringMenu_Final2.pdf` (2017), `Carmines logo.pdf`, `GrandOpening.jpg/png` (2017).
- `Photos/Buffalo_News_Smiles/` (DSC_*.JPG) and `Photos/Jackson/` (JAX*.jpg): photo shoots. Check who took them and whether we have rights before publishing.
- `Carmine's/`: older menus and print pieces (2011–2015): menu InDesign files, pasta-shape illustrations (`Carmines_pasta_*.ai`), dessert photos and PSDs, napkin (chef silhouette), T-shirts, Taste of Buffalo artwork, fonts the old menus used (Clarendon, Chunkfive, DIN, Bodoni Poster Italic). `MULBERRY-Menu`, `GIALOGO.png`, `CIAOLOGO.jpg` and `GUY_logo` are other restaurants' or unrelated files: don't use them.
- Download raw Drive files into `source/` (git-ignored). Only finished, web-sized assets go into `assets/img/`.

## Current menus
The live menus are HTML pages on carminestogo.com: `Carmines_Italiano_-_Dinner_Menu.html`, `_Wine_List`, `_Catering_Menu`, `_Banquet_Menu`, `_Take-out_Menu` (all under `/Carmines/`). Transcribe `MENU` and `CATERING` in `build.mjs` from those, with real prices, and note the date. Re-check when they change.

## Structure (static, no build step needed to host)
- `build.mjs` generates `index.html`, `menu.html`, `story.html`, `catering.html`, `assets/menu-data.js` (`window.SITE_DATA`, shared by the admin and the concierge), `llms.txt` and `robots.txt`. Edit content there, then run `node build.mjs`.
- `ph("...")` renders a striped `[placeholder]` label; unpriced items show `$ —`. Placeholders never go into the JSON-LD schema.
- `logo.mjs` → `logoSVG({ script, word, italiano })` draws the logo from `logo-paths.json` (vector paths from the .ai, counters masked so they stay transparent). `node render-logo.mjs` writes `assets/img/logo*.svg`, the favicon, apple-touch-icon and og-image (headless Chrome).
- Vectorizing a raster piece (an old sign, menu art, the napkin's chef): same method as the Giacobbi's matchbook. Photograph or scan it flat, deskew, threshold, `potrace` to SVG paths, store the paths in a JSON file and draw them from a module. Never redraw lettering by hand.
- `stickers.mjs`: the round-badge engine. Its drawings and wording are placeholders until Kelly picks them. Draw our own art; never copy other restaurants' or illustrators' work.
- `assets/site.css`: reused print-style rules with placeholder tokens. `assets/chat.js`: scripted demo concierge (reads `SITE_DATA`). `assets/chart.umd.js`: vendored Chart.js.
- `admin/index.html`: demo owner dashboard. **Every number is labeled sample data.** Tabs: sales & forecast, menu editor, profitability, market prices (anonymized competitors; never put real competitor names next to invented prices), marketing campaigns, "Ask your business".

## Brand (not decided yet)
The logo is settled: the red brush-script "Carmine's" with its swash and the green slab-serif "Italiano". Sampled colors: red `#bb1016`, green `#2f6409`. Everything else (palette, type, the feel, references, stickers) waits on Kelly's answers. The current CSS tokens and system fonts are stand-ins.

## Rules
- **Never invent facts, dishes or prices.** Placeholders must look like placeholders (`[striped label]`, `$ —`, "Staging note", "Sample").
- **Menus are transcribed from the restaurant's real current menus**, never from memory or from the 2017 printouts.
- **Recipes stay private.** Transcriptions go in `recipes/` (git-ignored) with `approved_to_publish: false`. Only recipes the family approves get copied into `content/recipes.json`, which the story page renders.
- **Check copyright before publishing** press clips, photos someone else took, or anyone else's artwork. Record the source and permission next to each one.
- **Design must not look AI-made:** no bordered text boxes or cards, no pill buttons, no gradient heroes, no generic Inter/Fraunces type. Use a print-style layout built around her real brand: rules, columns, leader-dot menu lists, photos as snapshots.
- **Staging stays out of search engines:** `robots.txt`, the `X-Robots-Tag` header (`vercel.json` / `netlify.toml`) and the noindex meta tag. Keep all three until launch.
- Commit in small steps. Ask before creating the GitHub repo (public or private) and before connecting Vercel. Vercel Hobby is non-commercial, so production needs Vercel Pro or Netlify.
