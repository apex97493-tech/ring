/**
 * ============================================================================
 * FOREVERJEWELLSTUDIO — ALL PRODUCTS AUTOMATIC METAL PRICE EXTRACTOR
 * ============================================================================
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Open https://www.etsy.com/shop/foreverjewellstudio in Chrome / Edge
 * 2. Press F12 -> Console
 * 3. Paste this script and press Enter
 * 4. It AUTOMATICALLY:
 *    - Scans all listings in the shop (page by page)
 *    - Fetches each listing in the background
 *    - Extracts the exact price for EVERY Band Colour (Silver, Overlays, 10k, 14k, 18k)
 *    - Auto-downloads "etsy_all_metal_prices.json"
 *    - Generates the ready-to-use PRODUCT_METAL_PRICES code for src/lib/data.ts
 *    - Automatically copies it to your clipboard!
 * ============================================================================
 */

const PRICE_SCRAPER_CONFIG = {
  // Batch size: Set to null to do ALL products, or 40-50 per batch
  BATCH_SIZE: 40,
  BATCH_NUMBER: 1, // 1 = first 40 products, 2 = next 40, etc.

  // Delay between product fetches in ms (safe default: 600ms)
  DELAY_MS: 650,

  // Maximum shop pages to discover listings from
  MAX_PAGES: 12,

  SHOP_ID: '40882668',
};

async function autoExtractAllMetalPrices(config = PRICE_SCRAPER_CONFIG) {
  console.clear();
  console.log('%c💎 FOREVERJEWELLSTUDIO — AUTOMATIC SHOP-WIDE PRICE EXTRACTOR', 'color: #D4AF37; font-size: 16px; font-weight: bold; background: #18181B; padding: 8px 14px; border-radius: 6px;');

  const delay = ms => new Promise(r => setTimeout(r, ms));

  // ═════════════════════════════════════════════════════════════════
  // STEP 1: Discover all product listing URLs across shop pages
  // ═════════════════════════════════════════════════════════════════
  console.log('\n%c🔍 STEP 1: Scanning shop catalog for listings...', 'color: #3B82F6; font-weight: bold;');

  const allListingUrls = new Set();
  const baseShopUrl = 'https://www.etsy.com/shop/foreverjewellstudio';

  for (let page = 1; page <= config.MAX_PAGES; page++) {
    const pageUrl = `${baseShopUrl}?ref=pagination&page=${page}`;
    console.log(`  📄 Scanning Shop Page ${page}...`);

    try {
      let html = '';
      if (page === 1 && window.location.href.includes('/shop/foreverjewellstudio')) {
        html = document.documentElement.outerHTML;
      } else {
        const res = await fetch(pageUrl, {
          headers: { 'Accept': 'text/html,application/xhtml+xml' },
          credentials: 'include'
        });
        if (!res.ok) {
          console.warn(`    ⚠️ Page ${page} returned status ${res.status}. Stopping page scan.`);
          break;
        }
        html = await res.text();
      }

      const matches = [...html.matchAll(/\/listing\/(\d+)\/([a-zA-Z0-9_-]+)/g)];
      let newCount = 0;
      for (const m of matches) {
        const listingId = m[1];
        const slug = m[2];
        if (listingId && !slug.includes('reviews') && !slug.includes('favoriters') && !slug.includes('header')) {
          const cleanUrl = `https://www.etsy.com/in-en/listing/${listingId}/${slug}`;
          if (!allListingUrls.has(cleanUrl)) {
            allListingUrls.add(cleanUrl);
            newCount++;
          }
        }
      }

      console.log(`    ✓ Page ${page}: found ${newCount} new listings (Total so far: ${allListingUrls.size})`);
      if (newCount === 0 && page > 1) break;

      await delay(450);
    } catch (e) {
      console.error(`Error on page ${page}:`, e);
      break;
    }
  }

  const allListingsArray = Array.from(allListingUrls);
  console.log(`%c✨ Discovered total ${allListingsArray.length} unique products!`, 'color: #10B981; font-weight: bold;');

  // Determine batch slice
  let targetListings = allListingsArray;
  let batchName = 'all';
  if (config.BATCH_SIZE && config.BATCH_SIZE > 0) {
    const startIdx = (config.BATCH_NUMBER - 1) * config.BATCH_SIZE;
    const endIdx = startIdx + config.BATCH_SIZE;
    targetListings = allListingsArray.slice(startIdx, endIdx);
    batchName = `batch_${config.BATCH_NUMBER}`;
    console.log(`\n%c📦 RUNNING BATCH ${config.BATCH_NUMBER}: Products ${startIdx + 1} to ${Math.min(endIdx, allListingsArray.length)} (${targetListings.length} items)`, 'color: #F59E0B; font-weight: bold;');
  }

  // ═════════════════════════════════════════════════════════════════
  // Helper Functions for Normalizing Metals & Parsing Prices
  // ═════════════════════════════════════════════════════════════════
  function normalizeMetal(raw) {
    const s = raw.toLowerCase().trim();
    if (s.includes('925') || s.includes('sterling')) return '925 Sterling Silver';

    if (s.includes('overlay') || s.includes('plated') || s.includes('vermeil')) {
      if (s.includes('rose')) return 'Rose Gold Overlay';
      if (s.includes('white')) return 'White Gold Overlay';
      return 'Yellow Gold Overlay';
    }

    if (s.includes('9k') || s.includes('9 k') || s.includes('10k') || s.includes('10 k')) {
      if (s.includes('rose')) return '9k Rose Gold';
      if (s.includes('white')) return '9k White Gold';
      return '9k Yellow Gold';
    }

    if (s.includes('14k') || s.includes('14 k')) {
      if (s.includes('rose')) return '14k Rose Gold';
      if (s.includes('white')) return '14k White Gold';
      return '14k Yellow Gold';
    }

    if (s.includes('18k') || s.includes('18 k')) {
      if (s.includes('rose')) return '18k Rose Gold';
      if (s.includes('white')) return '18k White Gold';
      return '18k Yellow Gold';
    }

    return raw.trim();
  }

  function parseOptionText(text) {
    let metalPart = text;
    let pricePart = '';

    const parenMatch = text.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (parenMatch) {
      metalPart = parenMatch[1];
      pricePart = parenMatch[2];
    } else {
      const dashMatch = text.match(/^(.*?)\s*[-:–]\s*([₹$€£A-Za-z0-9,.\s]+)$/);
      if (dashMatch) {
        metalPart = dashMatch[1];
        pricePart = dashMatch[2];
      }
    }

    let price = null;
    if (pricePart) {
      const numMatch = pricePart.match(/([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,7}(?:\.[0-9]+)?)/);
      if (numMatch) price = Math.round(parseFloat(numMatch[1].replace(/,/g, '')));
    }

    if (!price) {
      const currMatch = text.match(/(?:₹|INR|\$|€|£)\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,7})/i);
      if (currMatch) {
        price = Math.round(parseFloat(currMatch[1].replace(/,/g, '')));
        metalPart = text.replace(currMatch[0], '').replace(/[()\-:–]/g, '').trim();
      }
    }

    return { rawMetal: metalPart.trim(), price };
  }

  // ═════════════════════════════════════════════════════════════════
  // STEP 2: Extract Band Prices for Each Product
  // ═════════════════════════════════════════════════════════════════
  console.log('\n%c🔄 STEP 2: Visiting products to extract all band variation rates...', 'color: #3B82F6; font-weight: bold;');

  const allProductPrices = {};
  const snippetList = [];
  const fullExportData = [];

  for (let i = 0; i < targetListings.length; i++) {
    const url = targetListings[i];
    const listingId = url.match(/\/listing\/(\d+)/)?.[1];
    if (!listingId) continue;

    const productId = 'fjws-' + listingId;
    const progress = `[${i + 1}/${targetListings.length}]`;

    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'text/html,application/xhtml+xml' },
        credentials: 'include'
      });

      if (!res.ok) {
        console.warn(`${progress} ⚠️ HTTP ${res.status} on #${listingId}`);
        await delay(config.DELAY_MS);
        continue;
      }

      const html = await res.text();

      // Title
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 50) : 'Product';

      // Base price in INR from page
      let baseINR = 0;
      const basePriceMatch = html.match(/₹\s*([0-9,]+)/);
      if (basePriceMatch) {
        baseINR = parseInt(basePriceMatch[1].replace(/,/g, ''), 10);
      }

      const extractedPrices = {};

      // 1. Try DOMParser to extract <select> options
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const selects = Array.from(doc.querySelectorAll('select'));
      let bandSelect = selects.find(sel => {
        const context = [
          sel.getAttribute('aria-label') || '',
          sel.name || '',
          sel.id || '',
          sel.closest('fieldset')?.querySelector('legend')?.innerText || '',
          sel.parentElement?.querySelector('label')?.innerText || ''
        ].join(' ').toLowerCase();
        return context.includes('band') || context.includes('metal') || context.includes('colour') || context.includes('color');
      }) || selects.find(sel => {
        const text = sel.innerText.toLowerCase();
        return (text.includes('silver') && text.includes('gold')) || text.includes('14k');
      });

      if (bandSelect) {
        const options = Array.from(bandSelect.options).filter(opt => {
          const t = opt.textContent.trim().toLowerCase();
          return t && !t.includes('select') && !t.includes('choose');
        });

        for (const opt of options) {
          const parsed = parseOptionText(opt.textContent);
          if (parsed.price !== null) {
            const norm = normalizeMetal(parsed.rawMetal);
            extractedPrices[norm] = parsed.price;
          }
        }
      }

      // 2. Try JSON Data / Embedded State in HTML if select was empty
      if (Object.keys(extractedPrices).length === 0) {
        // Look for JSON structures with variation data
        const jsonMatches = [...html.matchAll(/"formatted_value"\s*:\s*"([^"]+)"/g)];
        for (const jm of jsonMatches) {
          const parsed = parseOptionText(jm[1]);
          if (parsed.price !== null) {
            const norm = normalizeMetal(parsed.rawMetal);
            extractedPrices[norm] = parsed.price;
          }
        }
      }

      // 3. Fallback regex for variation options in HTML
      if (Object.keys(extractedPrices).length === 0) {
        const regexOptions = [...html.matchAll(/<option[^>]*>([^<]*(?:Silver|Gold|Overlay)[^<]*)<\/option>/gi)];
        for (const ro of regexOptions) {
          const parsed = parseOptionText(ro[1]);
          if (parsed.price !== null) {
            const norm = normalizeMetal(parsed.rawMetal);
            extractedPrices[norm] = parsed.price;
          }
        }
      }

      // Normalize base silver & overlay
      const silverPrice = extractedPrices['925 Sterling Silver']
        || extractedPrices['Yellow Gold Overlay']
        || baseINR;

      if (silverPrice) {
        if (!extractedPrices['925 Sterling Silver']) extractedPrices['925 Sterling Silver'] = silverPrice;
        if (!extractedPrices['Yellow Gold Overlay'])  extractedPrices['Yellow Gold Overlay'] = silverPrice;
        if (!extractedPrices['Rose Gold Overlay'])    extractedPrices['Rose Gold Overlay'] = silverPrice;
        if (!extractedPrices['White Gold Overlay'])   extractedPrices['White Gold Overlay'] = silverPrice;
      }

      // Fill missing karat colors from same tier
      for (const t of ['9k', '10k', '14k', '18k']) {
        const tierP = extractedPrices[`${t} Yellow Gold`] || extractedPrices[`${t} Rose Gold`] || extractedPrices[`${t} White Gold`];
        if (tierP) {
          if (!extractedPrices[`${t} Yellow Gold`]) extractedPrices[`${t} Yellow Gold`] = tierP;
          if (!extractedPrices[`${t} Rose Gold`])   extractedPrices[`${t} Rose Gold`] = tierP;
          if (!extractedPrices[`${t} White Gold`])  extractedPrices[`${t} White Gold`] = tierP;
        }
      }

      const baseP = extractedPrices['925 Sterling Silver'] || baseINR || 4500;

      // Build TypeScript Snippet
      const snippetLines = [
        `  // ── ${title} (base ₹${baseP}) ──`,
        `  '${productId}': {`,
        `    '925 Sterling Silver': ${extractedPrices['925 Sterling Silver'] || baseP},  'Yellow Gold Overlay': ${extractedPrices['Yellow Gold Overlay'] || baseP},`,
        `    'Rose Gold Overlay':   ${extractedPrices['Rose Gold Overlay'] || baseP},  'White Gold Overlay':  ${extractedPrices['White Gold Overlay'] || baseP},`,
      ];

      if (extractedPrices['9k Yellow Gold'] || extractedPrices['9k Rose Gold'] || extractedPrices['9k White Gold']) {
        snippetLines.push(`    '9k Yellow Gold': ${extractedPrices['9k Yellow Gold'] || 0}, '9k Rose Gold': ${extractedPrices['9k Rose Gold'] || 0}, '9k White Gold': ${extractedPrices['9k White Gold'] || 0},`);
      }
      if (extractedPrices['10k Yellow Gold'] || extractedPrices['10k Rose Gold'] || extractedPrices['10k White Gold']) {
        snippetLines.push(`    '10k Yellow Gold': ${extractedPrices['10k Yellow Gold'] || 0}, '10k Rose Gold': ${extractedPrices['10k Rose Gold'] || 0}, '10k White Gold': ${extractedPrices['10k White Gold'] || 0},`);
      }

      snippetLines.push(`    '14k Yellow Gold': ${extractedPrices['14k Yellow Gold'] || 0}, '14k Rose Gold': ${extractedPrices['14k Rose Gold'] || 0}, '14k White Gold': ${extractedPrices['14k White Gold'] || 0},`);
      snippetLines.push(`    '18k Yellow Gold': ${extractedPrices['18k Yellow Gold'] || 0}, '18k Rose Gold': ${extractedPrices['18k Rose Gold'] || 0}, '18k White Gold': ${extractedPrices['18k White Gold'] || 0},`);
      snippetLines.push(`  },`);

      const snippet = snippetLines.join('\n');

      allProductPrices[productId] = extractedPrices;
      snippetList.push(snippet);

      fullExportData.push({
        listingId,
        productId,
        url,
        title,
        basePriceINR: baseP,
        bandPrices: extractedPrices
      });

      console.log(`${progress} ✅ #${listingId} "${title.slice(0, 30)}..." -> 925: ₹${extractedPrices['925 Sterling Silver']} | 14k: ₹${extractedPrices['14k Yellow Gold'] || 'N/A'}`);

      // Auto-save to localStorage periodically
      if (fullExportData.length % 5 === 0) {
        try {
          localStorage.setItem(`etsy_metal_prices_${batchName}`, JSON.stringify(fullExportData));
        } catch(e) {}
      }

    } catch (err) {
      console.error(`${progress} ❌ Error #${listingId}:`, err.message);
    }

    await delay(config.DELAY_MS);
  }

  // ═════════════════════════════════════════════════════════════════
  // STEP 3: Auto-Download JSON File
  // ═════════════════════════════════════════════════════════════════
  console.log(`\n%c💾 STEP 3: Creating JSON file download for ${fullExportData.length} products...`, 'color: #3B82F6; font-weight: bold;');

  const fileName = `etsy_metal_prices_${batchName}.json`;
  const blob = new Blob([JSON.stringify(fullExportData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // ═════════════════════════════════════════════════════════════════
  // STEP 4: Copy Snippets to Clipboard
  // ═════════════════════════════════════════════════════════════════
  const allSnippetsCode = snippetList.join('\n');

  try {
    await navigator.clipboard.writeText(allSnippetsCode);
    console.log('%c✨ ALL PRODUCT METAL PRICE CODE COPIED TO CLIPBOARD!', 'color: #10B981; font-size: 14px; font-weight: bold; background: #064E3B; padding: 6px 12px; border-radius: 4px;');
  } catch(e) {}

  console.log('\n' + '='.repeat(70));
  console.log(`%c🎉 BATCH COMPLETE: Successfully extracted prices for ${fullExportData.length} products!`, 'color: #10B981; font-size: 15px; font-weight: bold;');
  console.log(`📁 Downloaded file: "${fileName}"`);
  console.log('='.repeat(70));

  if (config.BATCH_SIZE && (config.BATCH_NUMBER * config.BATCH_SIZE) < allListingsArray.length) {
    console.log(`\n💡 To run next batch: change CONFIG to BATCH_NUMBER: ${config.BATCH_NUMBER + 1} and run again.`);
  }

  return fullExportData;
}

// Automatically start extraction
autoExtractAllMetalPrices();
