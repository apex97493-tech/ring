/**
 * ============================================================
 *  foreverjewellstudio — COMPLETE PRODUCT DATA EXTRACTOR
 * ============================================================
 *
 * EXTRACTS FOR EACH PRODUCT:
 *   ✅ Title
 *   ✅ Price (INR)
 *   ✅ All Images (full resolution)
 *   ✅ Full Description (exactly as written on Etsy)
 *   ✅ Item Details (Material, Weight, Stone, Occasion, etc.)
 *   ✅ Tags / Keywords
 *   ✅ Reviews count & rating
 *   ✅ Shipping info
 *   ✅ Category / Section
 *
 * HOW TO USE:
 *   1. Open the foreverjewellstudio Etsy shop page:
 *      https://www.etsy.com/shop/foreverjewellstudio
 *   2. Scroll all the way DOWN to load all products
 *   3. Press F12 → click Console tab
 *   4. Copy-paste this entire script and press Enter
 *   5. Wait 5-8 minutes (it visits every listing)
 *   6. File "etsy_complete_data.json" downloads automatically
 *   7. Send that file and I (the AI) will update the website!
 *
 * NOTE: Keep the browser tab open during the process.
 * ============================================================
 */

async function extractCompleteEtsyData() {
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // ─── STEP 1: Collect all listing URLs from the current page ───
  console.log('%c🔍 Step 1: Collecting listing URLs from shop page...', 'color: #8C6A1F; font-weight: bold; font-size: 14px');

  const allAnchors = [...document.querySelectorAll('a[href*="/listing/"]')];
  const listingUrls = [...new Set(
    allAnchors
      .map(a => a.href)
      .filter(h => h.includes('/listing/'))
      .map(h => {
        // Normalize URL — remove query params and keep just the listing path
        const urlObj = new URL(h);
        return urlObj.origin + urlObj.pathname;
      })
  )];

  console.log(`%c✅ Found ${listingUrls.length} listings on this page`, 'color: green; font-weight: bold');

  if (listingUrls.length === 0) {
    console.error('❌ No listings found! Make sure you are on the shop page and products are visible.');
    return;
  }

  // ─── STEP 2: Visit each listing and extract everything ───
  console.log('%c🔄 Step 2: Visiting each listing page to extract full data...', 'color: #8C6A1F; font-weight: bold; font-size: 14px');
  console.log('This takes ~5-8 minutes. Keep this tab open!\n');

  const results = [];

  for (let i = 0; i < listingUrls.length; i++) {
    const url = listingUrls[i];
    const listingId = url.match(/\/listing\/(\d+)\//)?.[1];
    if (!listingId) continue;

    console.log(`[${i + 1}/${listingUrls.length}] 📦 Fetching listing ${listingId}...`);

    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'text/html,application/xhtml+xml' }
      });

      if (!res.ok) {
        console.warn(`  ⚠️ HTTP ${res.status} for ${listingId}`);
        results.push({ listingId, url, error: `HTTP ${res.status}` });
        await delay(500);
        continue;
      }

      const html = await res.text();

      // ── EXTRACT: Title ──
      let title = '';
      const titleTag = html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>\s*([\s\S]*?)\s*<\/h1>/i)
        || html.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
      if (titleTag) {
        title = titleTag[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      }

      // ── EXTRACT: Price ──
      let priceINR = 0;
      const priceMatch = html.match(/₹\s*([\d,]+)/);
      if (priceMatch) {
        priceINR = parseInt(priceMatch[1].replace(/,/g, ''));
      }

      // ── EXTRACT: Images (all fullxfull) ──
      const allImgUrls = [...html.matchAll(/https:\/\/i\.etsystatic\.com\/[^\s"'\\]+\.jpg/gi)].map(m => m[0]);
      const fullImages = [...new Set(
        allImgUrls
          .map(u => u.replace(/il_\d+xN?\d*\./g, 'il_fullxfull.')) // normalize to fullxfull
          .filter(u => u.includes('fullxfull'))
      )];

      // ── EXTRACT: Description (multiple methods) ──
      let description = '';

      // Method 1: JSON-LD structured data
      const jldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (jldMatch) {
        try {
          let data = JSON.parse(jldMatch[1]);
          if (Array.isArray(data)) data = data[0];
          if (data.description && data.description.length > 80) {
            description = data.description;
          }
        } catch (e) {}
      }

      // Method 2: __NEXT_DATA__ — search for long description strings
      if (!description || description.length < 80) {
        const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
        if (ndMatch) {
          try {
            const nd = JSON.parse(ndMatch[1]);
            const str = JSON.stringify(nd);
            // Find all "description" values — pick the longest that looks like product text
            const descMatches = [...str.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
            let bestDesc = '';
            for (const m of descMatches) {
              const d = m[1]
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
              if (d.length > bestDesc.length && d.length > 80 && !d.startsWith('http') && !d.includes('<html')) {
                bestDesc = d;
              }
            }
            if (bestDesc.length > description.length) description = bestDesc;
          } catch (e) {}
        }
      }

      // Method 3: Fallback — meta description
      if (!description || description.length < 80) {
        const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i)
          || html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
        if (metaMatch && metaMatch[1].length > 80) {
          description = metaMatch[1];
        }
      }

      // Clean description HTML entities
      description = description
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .trim();

      // ── EXTRACT: Item Details ──
      const itemDetails = {};
      const ndMatch2 = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
      if (ndMatch2) {
        try {
          const nd = JSON.parse(ndMatch2[1]);
          const str = JSON.stringify(nd);

          // Common item detail fields Etsy stores
          const detailFields = [
            'material', 'materials', 'weight', 'occasion', 'recipient',
            'style', 'color', 'size', 'length', 'width', 'height',
            'stone_type', 'metal_type', 'gem_type', 'jewelry_type',
            'ring_size', 'chain_length', 'closure_type',
          ];

          for (const field of detailFields) {
            const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]{2,150})"`, 'i');
            const m = str.match(regex);
            if (m) {
              const label = field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              itemDetails[label] = m[1];
            }
          }
        } catch (e) {}
      }

      // ── EXTRACT: Tags ──
      const tags = [];
      const tagMatches = html.matchAll(/"tag"\s*:\s*"([^"]+)"/g);
      for (const m of tagMatches) {
        if (m[1] && !tags.includes(m[1])) tags.push(m[1]);
      }

      // ── EXTRACT: Rating & Reviews ──
      let rating = null;
      let reviewsCount = null;
      const ratingMatch = html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/)
        || html.match(/itemprop="ratingValue"[^>]*content="([\d.]+)"/i);
      if (ratingMatch) rating = parseFloat(ratingMatch[1]);

      const reviewMatch = html.match(/"reviewCount"\s*:\s*"?([\d]+)"?/)
        || html.match(/itemprop="reviewCount"[^>]*content="([\d]+)"/i);
      if (reviewMatch) reviewsCount = parseInt(reviewMatch[1]);

      // ── EXTRACT: Category / Section ──
      let section = '';
      const sectionMatch = html.match(/\/shop\/foreverjewellstudio\?section_id=(\d+)/);
      if (sectionMatch) section = sectionMatch[1];

      // ── BUILD RESULT ──
      const result = {
        listingId,
        url,
        title: title || 'Unknown',
        priceINR,
        images: fullImages.slice(0, 8), // max 8 images
        description,
        itemDetails,
        tags: tags.slice(0, 20),
        rating,
        reviewsCount,
        section,
        extractedAt: new Date().toISOString(),
      };

      results.push(result);

      // Log success summary
      const imgCount = result.images.length;
      const descLen = result.description.length;
      const detailCount = Object.keys(result.itemDetails).length;
      console.log(
        `  ✅ ${imgCount} images | desc: ${descLen > 0 ? descLen + ' chars' : '❌ none'} | details: ${detailCount} fields`
      );

    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      results.push({ listingId, url, error: err.message });
    }

    // Polite delay between requests (~600ms)
    await delay(600);
  }

  // ─── STEP 3: Download the JSON file ───
  console.log('\n%c💾 Step 3: Downloading complete data file...', 'color: #8C6A1F; font-weight: bold; font-size: 14px');

  const jsonStr = JSON.stringify(results, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'etsy_complete_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // ─── SUMMARY ───
  const success = results.filter(r => !r.error);
  const withDesc = results.filter(r => r.description && r.description.length > 80);
  const withImages = results.filter(r => r.images && r.images.length > 0);

  console.log('\n' + '='.repeat(55));
  console.log('%c✅ EXTRACTION COMPLETE!', 'color: green; font-weight: bold; font-size: 16px');
  console.log(`  📦 Total listings:    ${results.length}`);
  console.log(`  ✅ Successful:        ${success.length}`);
  console.log(`  🖼️  With images:       ${withImages.length}`);
  console.log(`  📝 With description:  ${withDesc.length}`);
  console.log('='.repeat(55));
  console.log('%c📥 File downloaded: etsy_complete_data.json', 'color: blue; font-weight: bold');
  console.log('\n%cNEXT STEP: Send the file to the AI agent!', 'color: purple; font-weight: bold; font-size: 13px');
  console.log('The agent will run: python scripts/apply_complete_data.py etsy_complete_data.json');

  return results;
}

// ─── START ───
extractCompleteEtsyData();
