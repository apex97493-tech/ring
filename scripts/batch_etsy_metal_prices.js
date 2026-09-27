/**
 * ============================================================================
 * FOREVERJEWELLSTUDIO — BATCH METAL PRICE EXTRACTOR (FROM SHOP PAGE)
 * ============================================================================
 * 
 * HOW TO USE:
 * 1. Open your Etsy shop in your browser:
 *    https://www.etsy.com/shop/foreverjewellstudio
 * 2. Press F12 -> Console tab
 * 3. Paste this script and press Enter
 * 4. It will fetch each listing in the shop, parse its Band colour variations,
 *    and output the full PRODUCT_METAL_PRICES code block!
 * ============================================================================
 */

async function crawlShopMetalPrices(batchSize = 20, delayMs = 600) {
  console.clear();
  console.log('%c💎 FOREVERJEWELLSTUDIO — BATCH METAL PRICE SCRAPER', 'color: #D4AF37; font-size: 15px; font-weight: bold; background: #18181B; padding: 6px 12px; border-radius: 4px;');

  const delay = ms => new Promise(r => setTimeout(r, ms));

  // Find all listing links on the page
  const allLinks = Array.from(document.querySelectorAll('a[href*="/listing/"]'));
  const listingUrls = [...new Set(
    allLinks
      .map(a => a.href)
      .filter(h => h.includes('/listing/'))
      .map(h => h.split('?')[0])
  )];

  console.log(`%c🔍 Found ${listingUrls.length} listings on current shop page`, 'color: #3B82F6; font-weight: bold;');
  console.log(`Processing up to ${batchSize} listings with ${delayMs}ms delay...`);

  function normalizeMetal(raw) {
    const s = raw.toLowerCase().trim();
    if (s.includes('925') || s.includes('sterling')) return '925 Sterling Silver';
    if (s.includes('overlay') || s.includes('plated') || s.includes('vermeil')) {
      if (s.includes('rose')) return 'Rose Gold Overlay';
      if (s.includes('white')) return 'White Gold Overlay';
      return 'Yellow Gold Overlay';
    }
    if (s.includes('10k') || s.includes('10 k')) {
      if (s.includes('rose')) return '10k Rose Gold';
      if (s.includes('white')) return '10k White Gold';
      return '10k Yellow Gold';
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

  const results = {};
  const snippetList = [];
  const targetUrls = listingUrls.slice(0, batchSize);

  for (let i = 0; i < targetUrls.length; i++) {
    const url = targetUrls[i];
    const listingId = url.match(/\/listing\/(\d+)/)?.[1];
    if (!listingId) continue;

    console.log(`[${i + 1}/${targetUrls.length}] ⏳ Fetching #${listingId}...`);

    try {
      const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
      const html = await res.text();

      // Title
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 50) : 'Product';

      // Parse <select ...> tags
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

      const extractedPrices = {};

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

      // Check if price data is embedded in JSON-LD or initial data
      if (Object.keys(extractedPrices).length === 0) {
        const priceMatch = html.match(/₹\s*([0-9,]+)/);
        if (priceMatch) {
          const baseP = parseInt(priceMatch[1].replace(/,/g, ''), 10);
          extractedPrices['925 Sterling Silver'] = baseP;
        }
      }

      const silverPrice = extractedPrices['925 Sterling Silver'] || extractedPrices['Yellow Gold Overlay'];
      if (silverPrice) {
        if (!extractedPrices['925 Sterling Silver']) extractedPrices['925 Sterling Silver'] = silverPrice;
        if (!extractedPrices['Yellow Gold Overlay'])  extractedPrices['Yellow Gold Overlay'] = silverPrice;
        if (!extractedPrices['Rose Gold Overlay'])    extractedPrices['Rose Gold Overlay'] = silverPrice;
        if (!extractedPrices['White Gold Overlay'])   extractedPrices['White Gold Overlay'] = silverPrice;
      }

      for (const t of ['10k', '14k', '18k']) {
        const tierPrice = extractedPrices[`${t} Yellow Gold`] || extractedPrices[`${t} Rose Gold`] || extractedPrices[`${t} White Gold`];
        if (tierPrice) {
          if (!extractedPrices[`${t} Yellow Gold`]) extractedPrices[`${t} Yellow Gold`] = tierPrice;
          if (!extractedPrices[`${t} Rose Gold`])   extractedPrices[`${t} Rose Gold`] = tierPrice;
          if (!extractedPrices[`${t} White Gold`])  extractedPrices[`${t} White Gold`] = tierPrice;
        }
      }

      const productId = 'fjws-' + listingId;
      const baseP = extractedPrices['925 Sterling Silver'] || Object.values(extractedPrices)[0] || 4500;

      const snippet = [
        `  // ── ${title} (base ₹${baseP}) ──`,
        `  '${productId}': {`,
        `    '925 Sterling Silver': ${extractedPrices['925 Sterling Silver'] || baseP},  'Yellow Gold Overlay': ${extractedPrices['Yellow Gold Overlay'] || baseP},`,
        `    'Rose Gold Overlay':   ${extractedPrices['Rose Gold Overlay'] || baseP},  'White Gold Overlay':  ${extractedPrices['White Gold Overlay'] || baseP},`,
        `    '10k Yellow Gold': ${extractedPrices['10k Yellow Gold'] || 0}, '10k Rose Gold': ${extractedPrices['10k Rose Gold'] || 0}, '10k White Gold': ${extractedPrices['10k White Gold'] || 0},`,
        `    '14k Yellow Gold': ${extractedPrices['14k Yellow Gold'] || 0}, '14k Rose Gold': ${extractedPrices['14k Rose Gold'] || 0}, '14k White Gold': ${extractedPrices['14k White Gold'] || 0},`,
        `    '18k Yellow Gold': ${extractedPrices['18k Yellow Gold'] || 0}, '18k Rose Gold': ${extractedPrices['18k Rose Gold'] || 0}, '18k White Gold': ${extractedPrices['18k White Gold'] || 0},`,
        `  },`
      ].join('\n');

      snippetList.push(snippet);
      results[productId] = extractedPrices;
      console.log(`   ✓ Extracted ${Object.keys(extractedPrices).length} prices for ${title}`);

    } catch (err) {
      console.error(`   ❌ Failed #${listingId}:`, err.message);
    }

    await delay(delayMs);
  }

  const allCode = snippetList.join('\n');
  console.log('\n%c🎉 BATCH COMPLETE! Paste this directly into PRODUCT_METAL_PRICES in src/lib/data.ts:', 'color: #10B981; font-weight: bold;');
  console.log(allCode);

  try {
    await navigator.clipboard.writeText(allCode);
    console.log('%c✨ ALL PRICES COPIED TO CLIPBOARD!', 'color: #10B981; font-weight: bold; background: #064E3B; padding: 4px 8px;');
  } catch(e) {}

  return results;
}
