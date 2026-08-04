# FocalCalc — 5-Minute Setup Guide (analytics, Search Console, domain)

Everything below is designed so the site works perfectly with **nothing** configured
(ads inert, analytics inert, no consent spam). These steps add the growth layer.

---

## 1. Analytics (GoatCounter) — ~2 minutes, free, no consent banner needed

1. Sign up at https://www.goatcounter.com/signup (free tier). Pick a site code, e.g. `focalcalc`.
2. Open `assets/js/main.js`, find:
   ```js
   const GOATCOUNTER_CODE = ""; // e.g. "focalcalc" -> https://focalcalc.goatcounter.com
   ```
3. Set it: `const GOATCOUNTER_CODE = "focalcalc";`
4. Commit + push. That's it — the counter loads on every page.

Why GoatCounter: cookieless, no personal data, GDPR-friendly, shows in dashboards
that are actually readable. If you'd rather use something else later, the loader
lives in one place.

## 2. Google Search Console — ~3 minutes

1. Go to https://search.google.com/search-console → **Add property** → **URL prefix**.
2. Enter `https://badstrategist.github.io/focalcalc/` (use the GitHub URL for now; add
   the custom domain as a second property later).
3. Choose the **HTML file** verification method → Google shows a token like `aB3xYz9Qw`.
4. From the repo root, run:
   ```bash
   python scripts/gsc-verify.py aB3xYz9Qw
   ```
5. Commit + push `googleaB3xYz9Qw.html` (takes ~1 min to deploy), click **Verify**.
6. In the property: **Sitemaps** → submit `sitemap.xml` (the GitHub Pages URL,
   i.e. `https://badstrategist.github.io/focalcalc/sitemap.xml`).
7. Wait 24–72h for the first impression data. That's the week-4 checkpoint data.

## 3. Custom domain (when you've picked the name)

When you own the domain (e.g. focalcalc.com):

1. Tell me the domain — I'll add a `CNAME` file with it and push (10 minutes).
2. At your registrar, add DNS records:
   - `CNAME` — `www` → `badstrategist.github.io.`
   - `A` records for the bare domain: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
3. In the repo: **Settings → Pages → Custom domain** → enter it → Save (enforces HTTPS).
4. Add a second Search Console property for the custom domain and submit
   `https://<domain>/sitemap.xml`.

Note: the site is built with relative paths, so nothing breaks during the switch —
the canonical URLs already point at the custom domain.

## 4. AdSense (after ~3 weeks live with organic traffic)

1. Apply at https://adsense.google.com with the live (custom-domain) URL.
2. When approved, set `ADSENSE_CLIENT` in `assets/js/main.js`:
   ```js
   const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";
   ```
3. Ad slots are already placed on every page (marked `data-ad`), consent-gated,
   and never inside tool controls. They render the moment the client ID is set.

## Checklist

- [ ] GoatCounter account created, code set in main.js
- [ ] Search Console property added + verified
- [ ] Sitemap submitted
- [ ] Domain registered + CNAME + DNS + Pages custom domain
- [ ] AdSense applied after ~3 weeks + client ID set
