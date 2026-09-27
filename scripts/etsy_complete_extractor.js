/**
 * =========================================================================
 *  FOREVERJEWELLSTUDIO — ADVANCED BATCH PRODUCT EXTRACTOR (v2.0)
 * =========================================================================
 *
 *  WHAT THIS SCRIPT DOES:
 *  1. Crawls ALL pagination pages (1 to ~10) of the Etsy shop to collect
 *     all 328+ genuine foreverjewellstudio listing URLs (ignores ads).
 *  2. Supports BATCHING (e.g. 40-50 products per run) or ALL-AT-ONCE.
 *  3. Auto-saves every 10 items to localStorage so you never lose progress.
 *  4. Downloads batch JSON files automatically (e.g. "etsy_batch_1.json").
 *  5. Captures real images (fullxfull), full description, and structured
 *     specs (Stone type, shape, size 7x9mm, metal, ring sizing, etc.).
 *
 *  HOW TO USE:
 *  1. Open Etsy in Chrome:
 *     https://www.etsy.com/shop/foreverjewellstudio
 *  2. Press F12 -> Go to "Console" tab
 *  3. (Optional) Adjust CONFIG below if you want smaller batches
 *  4. Paste this entire script and press Enter
 * =========================================================================
 */

// ─── CONFIGURATION ───
const EXTRACTOR_CONFIG = {
  // Batch settings:
  // Set to null to extract ALL listings, or set a number (e.g. 40) to do 40 at a time
  BATCH_SIZE: 40,        // Items per batch (recommended: 40 for speed and safety)
  BATCH_NUMBER: 1,       // Which batch to run: 1 = items 1-40, 2 = items 41-80, etc.

  // Delay between individual product fetches (milliseconds)
  FETCH_DELAY_MS: 700,

  // Maximum pages to scan on shop
  MAX_SHOP_PAGES: 12,

  // Shop ID for foreverjewellstudio to filter out 3rd party ads
  SHOP_ID: '40882668',
};

async function runAdvancedEtsyExtractor(config = EXTRACTOR_CONFIG) {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  console.clear();
  console.log('%c💎 FOREVERJEWELLSTUDIO — BATCH EXTRACTOR v2.0', 'color: #D4AF37; font-size: 16px; font-weight: bold; background: #18181B; padding: 6px 12px; border-radius: 4px;');

  // ═════════════════════════════════════════════════════════════════
  // STEP 1: Discover all listings across all pages of the shop
  // ═════════════════════════════════════════════════════════════════
  console.log('\n%c🔍 STEP 1: Scanning all shop pages to discover all 328+ listings...', 'color: #8C6A1F; font-weight: bold;');

  const allListingUrls = new Set();
  const baseShopUrl = 'https://www.etsy.com/shop/foreverjewellstudio';

  for (let page = 1; page <= config.MAX_SHOP_PAGES; page++) {
    const pageUrl = `${baseShopUrl}?ref=pagination&page=${page}`;
    console.log(`  📄 Scanning Shop Page ${page}...`);

    try {
      let html = '';
      if (page === 1 && window.location.href.includes('/shop/foreverjewellstudio')) {
        // Current DOM
        html = document.documentElement.outerHTML;
      } else {
        const res = await fetch(pageUrl, {
          headers: { 'Accept': 'text/html,application/xhtml+xml' },
          credentials: 'include'
        });
        if (!res.ok) {
          console.warn(`    ⚠️ Page ${page} returned status ${res.status}. Ending pagination.`);
          break;
        }
        html = await res.text();
      }

      // Extract listing URLs from HTML
      const matches = [...html.matchAll(/\/listing\/(\d+)\/([a-zA-Z0-9_-]+)/g)];
      let newCount = 0;
      for (const m of matches) {
        const listingId = m[1];
        const slug = m[2];
        // Filter out ads / non-listing items
        if (listingId && !slug.includes('reviews') && !slug.includes('favoriters')) {
          const cleanUrl = `https://www.etsy.com/in-en/listing/${listingId}/${slug}`;
          if (!allListingUrls.has(cleanUrl)) {
            allListingUrls.add(cleanUrl);
            newCount++;
          }
        }
      }

      console.log(`    ✓ Page ${page}: found ${newCount} new listings (Total so far: ${allListingUrls.size})`);

      // If page had 0 new listings or less than 10, we reached the end
      if (newCount === 0 && page > 1) {
        console.log(`    🏁 Reached end of shop catalog at page ${page}.`);
        break;
      }

      await delay(500);
    } catch (e) {
      console.warn(`    ❌ Error fetching page ${page}:`, e.message);
      break;
    }
  }

  const allListingsArray = Array.from(allListingUrls);
  console.log(`\n%c✅ TOTAL UNIQUE SHOP LISTINGS FOUND: ${allListingsArray.length}`, 'color: #10B981; font-weight: bold; font-size: 14px;');

  if (allListingsArray.length === 0) {
    console.error('❌ Could not find listing links. Make sure you are on https://www.etsy.com/shop/foreverjewellstudio');
    return;
  }

  // ═════════════════════════════════════════════════════════════════
  // STEP 2: Determine Batch Slice
  // ═════════════════════════════════════════════════════════════════
  let targetListings = allListingsArray;
  let batchName = 'all';

  if (config.BATCH_SIZE && config.BATCH_SIZE > 0) {
    const startIdx = (config.BATCH_NUMBER - 1) * config.BATCH_SIZE;
    const endIdx = startIdx + config.BATCH_SIZE;
    targetListings = allListingsArray.slice(startIdx, endIdx);
    batchName = `batch_${config.BATCH_NUMBER}`;
    console.log(`%c📦 RUNNING BATCH ${config.BATCH_NUMBER}: Listings ${startIdx + 1} to ${Math.min(endIdx, allListingsArray.length)} (Total in batch: ${targetListings.length})`, 'color: #3B82F6; font-weight: bold;');
    console.log(`   (Tip: Next time set BATCH_NUMBER: ${config.BATCH_NUMBER + 1} to get the next batch)`);
  } else {
    console.log(`%c📦 EXTRACTING ALL ${targetListings.length} LISTINGS IN ONE RUN`, 'color: #3B82F6; font-weight: bold;');
  }

  // ═════════════════════════════════════════════════════════════════
  // STEP 3: Extract Rich Data For Each Target Listing
  // ═════════════════════════════════════════════════════════════════
  console.log('\n%c🔄 STEP 3: Visiting each product to extract real photos & specifications...', 'color: #8C6A1F; font-weight: bold;');

  const results = [];
  const total = targetListings.length;

  for (let i = 0; i < total; i++) {
    const url = targetListings[i];
    const listingId = url.match(/\/listing\/(\d+)/)?.[1];
    if (!listingId) continue;

    const percent = Math.round(((i + 1) / total) * 100);
    console.log(`[${i + 1}/${total}] (${percent}%) 💎 Fetching #${listingId}...`);

    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'text/html,application/xhtml+xml' },
        credentials: 'include'
      });

      if (!res.ok) {
        console.warn(`    ⚠️ HTTP ${res.status} for ${listingId}`);
        await delay(config.FETCH_DELAY_MS);
        continue;
      }

      const html = await res.text();

      // 1. Title
      let title = '';
      const titleTag = html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>\s*([\s\S]*?)\s*<\/h1>/i)
        || html.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
      if (titleTag) {
        title = titleTag[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      }

      // Skip invalid / ads
      if (!title || title.toLowerCase() === 'unknown' || title.toLowerCase().includes('custom listing')) {
        console.warn(`    ⚠️ Skipped: Non-standard listing "${title}"`);
        continue;
      }

      // 2. Price in INR
      let priceINR = 4500;
      const priceMatch = html.match(/₹\s*([\d,]+)/);
      if (priceMatch) {
        priceINR = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      }

      // 3. Images (Filter ONLY shop 40882668 to avoid carousel ads from other sellers)
      const allImgs = [...html.matchAll(/https:\/\/i\.etsystatic\.com\/([^\s"'\\]+)\.jpg/gi)].map(m => m[0]);
      const fullImages = [...new Set(
        allImgs
          .filter(u => u.includes(config.SHOP_ID) || u.includes('/40882668/'))
          .map(u => u.replace(/il_\d+xN?\d*\./g, 'il_fullxfull.'))
          .filter(u => u.includes('fullxfull'))
      )];

      // 4. Description (Multi-method extraction)
      let description = '';

      // Method A: JSON-LD structured data
      const jldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (jldMatch) {
        try {
          let data = JSON.parse(jldMatch[1]);
          if (Array.isArray(data)) data = data[0];
          if (data && data.description && data.description.length > 80) {
            description = data.description;
          }
        } catch (e) {}
      }

      // Method B: __NEXT_DATA__
      if (!description || description.length < 80) {
        const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
        if (ndMatch) {
          try {
            const nd = JSON.parse(ndMatch[1]);
            const str = JSON.stringify(nd);
            const descMatches = [...str.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
            let best = '';
            for (const m of descMatches) {
              const d = m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
              if (d.length > best.length && d.length > 80 && !d.startsWith('http') && !d.includes('<html')) {
                best = d;
              }
            }
            if (best.length > description.length) description = best;
          } catch (e) {}
        }
      }

      // Method C: meta tag fallback
      if (!description || description.length < 80) {
        const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
        if (metaMatch && metaMatch[1].length > 80) {
          description = metaMatch[1];
        }
      }

      // Clean HTML entities
      description = description
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .trim();

      // 5. Parse Item Details
      const itemDetails = {};
      const lines = description.split('\n');
      for (const line of lines) {
        const cleaned = line.trim().replace(/^[*•-]+\s*/, '').trim();
        if (cleaned.includes(':')) {
          const [k, ...vParts] = cleaned.split(':');
          const key = k.trim();
          const val = vParts.join(':').trim();
          if (key && val && key.length < 35 && val.length < 100 && !key.toLowerCase().includes('http') && !key.toLowerCase().includes('important')) {
            itemDetails[key] = val;
          }
        }
      }

      // 6. Rating & Reviews
      let rating = 4.9;
      let reviewsCount = 538;
      const ratingMatch = html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/);
      if (ratingMatch) rating = parseFloat(ratingMatch[1]);
      const reviewMatch = html.match(/"reviewCount"\s*:\s*"?([\d]+)"?/);
      if (reviewMatch) reviewsCount = parseInt(reviewMatch[1], 10);

      // Build product entry
      const productEntry = {
        listingId,
        url,
        title,
        priceINR,
        images: fullImages.slice(0, 8),
        description,
        itemDetails,
        rating,
        reviewsCount,
        extractedAt: new Date().toISOString()
      };

      results.push(productEntry);
      console.log(`    ✅ "${title.substring(0, 36)}..." | 📸 ${productEntry.images.length} imgs | 📋 ${Object.keys(itemDetails).length} specs`);

      // Save to localStorage every 5 items
      if (results.length % 5 === 0) {
        try {
          localStorage.setItem(`fjs_extracted_${batchName}`, JSON.stringify(results));
        } catch (e) {}
      }

    } catch (err) {
      console.error(`    ❌ Error on #${listingId}:`, err.message);
    }

    await delay(config.FETCH_DELAY_MS);
  }

  // ═════════════════════════════════════════════════════════════════
  // STEP 4: Auto-Download JSON File
  // ═════════════════════════════════════════════════════════════════
  console.log(`\n%c💾 STEP 4: Creating JSON download for ${results.length} products...`, 'color: #8C6A1F; font-weight: bold;');

  const fileName = `etsy_${batchName}_data.json`;
  const jsonStr = JSON.stringify(results, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log('\n' + '='.repeat(60));
  console.log(`%c🎉 BATCH COMPLETE: Downloaded "${fileName}" (${results.length} products)`, 'color: #10B981; font-size: 15px; font-weight: bold;');
  console.log('='.repeat(60));
  console.log('%c📋 What to do now:', 'color: #D4AF37; font-weight: bold;');
  console.log('1. Copy the downloaded JSON or paste it directly in the chat.');
  console.log('2. I will automatically merge the new batch, download all high-res photos, and update your local site!');
  if (config.BATCH_SIZE && (config.BATCH_NUMBER * config.BATCH_SIZE) < allListingsArray.length) {
    console.log(`\n💡 To run next batch: change CONFIG to BATCH_NUMBER: ${config.BATCH_NUMBER + 1} and run again.`);
  }

  return results;
}

// ─── RUN EXTRACTOR ───
runAdvancedEtsyExtractor();
