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

## Kelly's answers (Nov 17, 2026)
- **Owners:** Kelly & Alex Jacobbi (not Vincent).
- **History, in her words:** Carmine's opened in 1993 (not "almost 45 years"). A devastating fire in 2015 changed its course. Reopened at **9430 Transit Rd, East Amherst** in 2017 for five years, then found its "forever home" at **7170 Transit Rd, Williamsville** in **September 2022**. The original address isn't stated on the site (old print pieces show 4715 Transit Rd.).
- **The name:** there was never a Carmine in the family; they chose the name for the casual family Italian feel. **Al's Fussili** was created by son Alex Jacobbi and is a house favorite.
- **Staff:** Chef Tim is no longer there (keep him off the site). Feature **Chef Dave Marshal**: worked for the family 1997–2001, came back in 2023. Confirm the spelling (Marshal or Marshall) before launch.
- **Taste of Buffalo:** Kelly is forwarding her records (years, awards, which risotto). Until then it stays a placeholder.
- **Menus:** the menus on carminestogo.com are current, and so is the take-out menu there (not transcribed yet). No dessert menu. The online wine list probably isn't current. Happy hour isn't defined yet; she wants help with it.
- **Hours:** Wednesday–Sunday from 4pm; closed Monday and Tuesday. Closing times stay flexible on purpose. Holiday hours are kept on Google.
- **Ordering:** she doesn't know the Uber Eats store link. She wants direct online ordering through SkyTab (pickup only, she doesn't deliver). Online reservations depend on the fees.
- **Photos:** she believes we can use the shoots. The "Smiles" photos were taken by the Buffalo News, so the paper owns them: get written permission before using any. The Jackson photos were taken by a friend of the user's: get their OK and a photo credit. No other photo library. She's open to a one-afternoon shoot of 10 dishes, and to showing staff and family faces.
- **Domain:** Kelly owns carminestogo.com, but only Jeremy can log in. Get the registrar login (or a transfer) before moving hosting.
- **Email:** the restaurant has no business email. Set one up on the domain (e.g. info@carminestogo.com) once the domain login is sorted.
- **Social:** Kelly posts herself and has access to Facebook, Instagram and Google Business Profile. She asked how much time it needs. Accounts she admires: to come.
- **Competitors to compare prices with:** Italian Village, Faletta's, Linguine's. Only real, sourced prices go next to their names.
- **Customer list:** none yet (catering customers especially worth starting with).

## Source material: Dropbox `/Carmines` (newest; the source of truth)
Her designer's InDesign packages, organized by year. Local copies of the files we use go in `source/dropbox/` (git-ignored).
- **Dinner menu:** `2025/CarminesDinnerMenu_Revision3.18.25.pdf` (newest found; Jan, Feb and Mar 2025 revisions, plus 2021–2023). 11×17, two pages.
- **Catering:** `2025/carminescatering 5.14.26.pdf` (May 2026, newest). Standard $19.99 and Deluxe $23.99 per person, parties of 10 or more. Also Sept 2025 versions.
- **Banquet:** `CarminesBanquetMenu Folder/CarminesBanquetMenu10-24.pdf` (newest found; also 3-29-23 and 10-19-22).
- `ACTUAL LOGOS/`: same logo files as Drive, plus `Carmines_Vector.pdf` and `Carmines_PNG.png`.
- `SIGN/` and `OLD_FILES/SIGN/`: photos of the building sign at 7170 Transit (red channel-letter script, green "Italiano" panel) and the old awning ("Italiano Carmine's · Cocktails & Cuisine").
- `Menu/…/Links/Carmines_pasta_*.ai`: vector line drawings of pasta shapes used on the menus. `Italylogo.ai`: the round "Italy / Republica Italiana" map stamp used as the menu watermark. Its origin isn't known (designer or stock?), so check before using it; note the stamp spells it "REPUBLICA" (Italian is "Repubblica").
- `Desserts/`, `TSHIRT/`, `Napkin/`, `OLD_FILES/Old_Menus/` (2013–2016 menus, happy hour, gluten-free, lunch).
- `Carmines_Mural/` is mostly downloaded reference images (one filename is a stock-vector preview). Don't use those. `GirlOnVespa.jpg`: origin unknown, don't use.
- Dropbox `/CarminesMenus` holds only 2017–2018 packages (older than `/Carmines`).

**Two brand looks exist.** The building sign and the 2013 logo files use the red script with a green "Italiano". Every printed menu since 2017 (dinner, catering, banquet, through May 2026) uses the script alone in charcoal `#282624` with deep wine `#5f1722`, Clarendon Text for dish names, Caecilia bold italic for prices, Mensch / TrendHM Sans wide caps for section heads with triple rules, an aged-paper background and the Italy stamp watermark. **The user chose the menu look (Nov 17, 2026)**; the sign colors are kept only as `logo-sign.svg`. Those fonts are commercial; the site needs licensed web versions or free lookalikes.

## Source material (user's Google Drive: `Carmines2.0/`, older snapshot from 2017–2018)
- `Carmine's/ACTUAL LOGOS/`: the official logo. **`LARGE_CARMINES_LOGO.ai` and `Carmines_Vector.ai` are real vector files** (PDF-compatible), so the logo was converted, not traced. Also `LARGE_CARMINES_LOGO(COLOR).jpg` (red script, green "Italiano") and black versions.
- `CarminesDinnerMenuPrinter1/2.jpg` and `.pdf` (2017): printed dinner menu. **Outdated prices**; use it only as a style reference (dark plum/charcoal, slab-serif dish names, wide display caps with triple rules, line drawings of pasta shapes).
- `CarminesCateringMenu_Final2.pdf` (2017), `Carmines logo.pdf`, `GrandOpening.jpg/png` (2017).
- `Photos/Buffalo_News_Smiles/` (DSC_*.JPG) and `Photos/Jackson/` (JAX*.jpg): photo shoots. Check who took them and whether we have rights before publishing.
- `Carmine's/`: older menus and print pieces (2011–2015): menu InDesign files, pasta-shape illustrations (`Carmines_pasta_*.ai`), dessert photos and PSDs, napkin (chef silhouette), T-shirts, Taste of Buffalo artwork, fonts the old menus used (Clarendon, Chunkfive, DIN, Bodoni Poster Italic). `MULBERRY-Menu`, `GIALOGO.png`, `CIAOLOGO.jpg` and `GUY_logo` are other restaurants' or unrelated files: don't use them.
- Download raw Drive files into `source/` (git-ignored). Only finished, web-sized assets go into `assets/img/`.

## Current menus
- **Dinner:** `content/menu.json`, transcribed Nov 2026 from the printed menu revision 3/18/2025 (Dropbox). carminestogo.com shows the 2/10/2025 version as an image; the only differences are two typos. Kelly still has to confirm nothing changed since March 2025.
- Edits made while transcribing: obvious typos fixed (olil → oil, riostto → risotto, vinaigarette → vinaigrette, mesculin → mesclun, proscuitto → prosciutto, cappicola → capicola, driedtomatoes → dried tomatoes, Ceasar → Caesar), sentence case on descriptions. Her own spellings "Fussili" and "Fruitti di Mare" are kept until she decides.
- **Catering:** `content/catering.json`, from Dropbox `2025/carminescatering 5.14.26.pdf` (same as the image on carminestogo.com). Drop-off packages, full-service party package, Just Trays.
- **Banquet:** `content/banquet.json`, from `CarminesBanquetMenu10-24.pdf`. The live site still links the **May 27, 2024** banquet PDF with higher prices (Standard $29.99 vs $25.99, Brunch $24.99 vs $22.95, Deluxe $46.99 vs $42.99, "Minimum 25 adult guests", cake-cutting fee, mini cannolis). Kelly to confirm which is current. Each JSON file has `source` and `edits` fields recording the typo fixes.
- Open question: on the catering menu, "Full: 22 rolls / Half: 12 rolls" sits between Roast Beef and BBQ Pulled Pork; we show it on both.
- The live site's other menu pages: `/Carmines/Carmines_Italiano_-_Wine_List.html`, `_Catering_Menu`, `_Banquet_Menu`, `_Take-out_Menu`.

## Structure (static, no build step needed to host)
- `content/catering.json` and `content/banquet.json` feed `catering.html`.
- `content/takeout.json`: the take-out specials (Big Bucket of Pasta $39.99, Chicken Parm Pack $64.99) from the May 19, 2026 flier on carminestogo.com's Take-out page. They show on `menu.html#takeout` and are used by the chat assistant and the owner page's take-out post template. Open question: what the "+$7" grilled chicken / mozzarella line covers. The flier also says "Across from T.J. Maxx".
- `content/market.json`: real competitor prices (Falletta's via its Toast menu, Italian Village via italianvillagewny.com, Linguine's via an older AllMenus listing), checked 2026-11-17. Carmine's side is looked up from `menu.json` at build time, and a missing dish fails the build. It shows in the Market prices tab of `admin/insights.html`. Re-check the prices every few months and update `checked`. Leave delivery-app prices out because they are marked up.
- `content/menu.json` is the dinner menu (sections → items: `n`, `d`, `p` or `v` options, `feature`, `hidden`; the bowl section adds `pasta`, `served`, `gf`; `adds` = add-ons). `build.mjs` generates `index.html`, `menu.html`, `story.html`, `catering.html`, `assets/menu-data.js` (`window.SITE_DATA`, shared by the admin and the concierge), `llms.txt` and `robots.txt`. Edit content there, then run `node build.mjs`.
- `ph("...")` renders a striped `[placeholder]` label; unpriced items show `$ —`. Placeholders never go into the JSON-LD schema.
- `logo.mjs` → `logoSVG({ script, word, italiano })` draws the logo from `logo-paths.json` (vector paths from the .ai, counters masked so they stay transparent). `node render-logo.mjs` writes `assets/img/logo*.svg`, the favicon, apple-touch-icon and og-image (headless Chrome).
- Vectorizing a raster piece (an old sign, menu art, the napkin's chef): same method as the Giacobbi's matchbook. Photograph or scan it flat, deskew, threshold, `potrace` to SVG paths, store the paths in a JSON file and draw them from a module. Never redraw lettering by hand.
- `stickers.mjs`: the round-badge engine. Its drawings and wording are placeholders until Kelly picks them. Draw our own art; never copy other restaurants' or illustrators' work.
- `pasta.mjs` draws her menus' pasta line drawings from `pasta-paths.json` (converted from `Carmines_pasta_*.ai`; confirm the designer's permission before launch).
- `assets/site.css`: the menu look (tokens at the top). `assets/chat.js`: scripted demo concierge (reads `SITE_DATA`). `assets/chart.umd.js`: vendored Chart.js.
- `admin/index.html`: **Kelly's owner home**, kept deliberately simple (big type, works on a phone). Menu editor over `SITE_DATA.menu`: edit, hide, reorder, add, delete; drafts live in localStorage (`carmines-menu-draft`); **Preview** opens `menu.html?preview=1`, where `assets/menu-preview.js` re-renders the menu from the draft; **Publish** is a demo; **Download file** exports `menu.json`. Social posts tab: captions built only from real menu text, with `[brackets]` for what only she knows.
- `admin/insights.html`: the sample-data dashboard (sales & forecast, profitability, market prices, email campaigns, "Ask your business"). Sales, profit and campaign numbers are labeled sample data; **market prices are real and sourced** (never put real names next to invented prices).
- Social plan and the open questions for Kelly: Claude Doc "Carmine's Social Plan & Questions for Kelly" (https://claude.ai/artifact/Y9SwtT9MVUY1vhu81ZD2dK).
- Later phase for real publishing: the editor commits `content/menu.json` (GitHub API or a Git-backed CMS such as Decap) and Vercel rebuilds.

## Brand: her printed menus
Charcoal `#282624` script logo (no "Italiano"), deep wine `#5f1722`, paper `#f4f0e4` with a faint grain. Bitter stands in for Clarendon Text / Caecilia, Josefin Sans for the menus' wide display caps; buy web licenses for the originals if Kelly wants an exact match. Section heads are wide caps between triple rules; a signature dish gets the menus' solid wine panel; dishes are centered with italic wine prices, as printed; the footer copies the back of the menu. Feel: classic Italian-American (Kelly, Nov 2026). Not used: the Italy stamp (origin unknown, misspelled) and the stickers (no motifs chosen).

## Rules
- **Never invent facts, dishes or prices.** Placeholders must look like placeholders (`[striped label]`, `$ —`, "Staging note", "Sample").
- **Menus are transcribed from the restaurant's real current menus**, never from memory or from the 2017 printouts.
- **Recipes stay private.** Transcriptions go in `recipes/` (git-ignored) with `approved_to_publish: false`. Only recipes the family approves get copied into `content/recipes.json`, which the story page renders.
- **Check copyright before publishing** press clips, photos someone else took, or anyone else's artwork. Record the source and permission next to each one.
- **Design must not look AI-made:** no bordered text boxes or cards, no pill buttons, no gradient heroes, no generic Inter/Fraunces type. Use a print-style layout built around her real brand: rules, columns, leader-dot menu lists, photos as snapshots.
- **Staging stays out of search engines:** `robots.txt`, the `X-Robots-Tag` header (`vercel.json` / `netlify.toml`) and the noindex meta tag. Keep all three until launch.
- Commit in small steps. GitHub: https://github.com/vincentjacobbi/carmines (public, so never commit private files, recipes or personal contact details). Staging: https://carmines-zeta.vercel.app (Vercel project `carmines` in the user's `plotifi-io` team, next to Giacobbi's; every push to `main` deploys). `carmines.vercel.app` is someone else's site. Before launch, move the project to a Carmine's-owned Vercel team: Hobby is non-commercial, so production needs Vercel Pro or Netlify.
