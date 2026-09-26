---
name: etsy-product-sync
description: >
  Complete workflow to sync ANY Etsy shop's products (real photos, real prices,
  real titles) into a Next.js website. Works for any client's Etsy shop.
  Includes browser console scraper, image downloader, and catalog builder.
---

# Etsy Product Sync — Complete Workflow

Use this skill whenever a client wants their Etsy shop products mirrored on their own website with **real photos** and **real prices**.

---

## OVERVIEW (3 Steps)

1. **EXTRACT** — Run JavaScript in the browser console to get all listing URLs + images
2. **DOWNLOAD** — Python script downloads all images locally to `/public/uploads/`
3. **BUILD** — Python script converts data into `src/lib/products-store.json`

---

## STEP 1: Extract Products from Etsy (Browser Console)

1. Open the Etsy shop in the browser
2. Press **F12** then click **Console** tab
3. Paste the script from `scripts/etsy_browser_extractor.js` and press Enter
4. Wait 2-3 minutes. A file called `etsy_products.json` downloads automatically.

---

## STEP 2: Download Images + Build Catalog

```bash
# Put etsy_products.json in project root, then run:
python scripts/etsy_sync.py etsy_products.json
```

---

## STEP 3: Commit and Deploy

```bash
git add -A
git commit -m "sync: import products from Etsy shop"
git push
```

---

## FULL WORKFLOW FOR ANY NEW PROJECT

```
1. Client gives Etsy shop URL: https://www.etsy.com/shop/SHOPNAME
2. Browser console script -> downloads etsy_products.json
3. python scripts/etsy_sync.py etsy_products.json
4. git add -A && git commit && git push
```

## TIPS

- Multiple sections: Navigate to each section on Etsy, run script each time, merge JSON arrays.
- More products: Scroll down before running (Etsy uses infinite scroll).
- Re-syncing: Script skips already-downloaded images on re-run.
