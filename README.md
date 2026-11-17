# Carmine's Italiano — staging redesign

Static demo of a redesigned carminestogo.com plus a demo owner dashboard (`/admin/`, sample data only).

- Edit content in `build.mjs`, then run `node build.mjs` to regenerate the HTML pages.
- `node render-logo.mjs` regenerates the logo SVGs, favicon and og:image from `logo-paths.json`.
- No build step is needed to host: deploy the repo root as a static site (Vercel or Netlify).
- Staging is kept out of search engines (`robots.txt`, `X-Robots-Tag`, `noindex` meta).
- Staging: https://carmines-zeta.vercel.app (owner home at /admin/)
