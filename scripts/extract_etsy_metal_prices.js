/**
 * ============================================================================
 * FOREVERJEWELLSTUDIO / ETSY — BAND COLOUR & METAL PRICE EXTRACTOR
 * ============================================================================
 * 
 * HOW TO USE:
 * 1. Open any product listing on Etsy in your browser (Chrome / Edge / Firefox)
 *    e.g. https://www.etsy.com/in-en/listing/4581012935/...
 * 2. Press F12 (or right-click anywhere and click "Inspect")
 * 3. Go to the "Console" tab
 * 4. Paste this entire script and press Enter
 * 5. It will:
 *    - Extract all Band Colour / Metal options & their exact prices
 *    - Format the snippet matching PRODUCT_METAL_PRICES in data.ts
 *    - AUTOMATICALLY COPY the code to your clipboard!
 *    - Save it to your browser history so you can export all products at once
 * ============================================================================
 */

(async function extractEtsyMetalPrices() {
  console.clear();
  console.log('%c💎 ETSY METAL PRICE EXTRACTOR', 'color: #D4AF37; font-size: 15px; font-weight: bold; background: #18181B; padding: 6px 12px; border-radius: 4px;');

  // 1. Get Listing ID & Title
  const path = window.location.pathname;
  const listingIdMatch = path.match(/\/listing\/(\d+)/);
  if (!listingIdMatch) {
    console.error('❌ Could not find Etsy listing ID in URL: ' + window.location.href);
    console.warn('Please make sure you are on an Etsy listing page (e.g., https://www.etsy.com/in-en/listing/...)');
    return;
  }

  const listingId = listingIdMatch[1];
  const productId = 'fjws-' + listingId;
  const rawTitle = document.querySelector('h1')?.innerText?.trim() || document.title || 'Product';
  const cleanTitle = rawTitle.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').slice(0, 60);

  console.log(`%c📦 Product: ${cleanTitle}`, 'color: #3B82F6; font-weight: bold;');
  console.log(`🆔 ID: ${productId} (Etsy listing #${listingId})`);

  // Canonical metals list used in your website
  const CANONICAL_KEYS = [
    '925 Sterling Silver',
    'Yellow Gold Overlay',
    'Rose Gold Overlay',
    'White Gold Overlay',
    '9k Yellow Gold',
    '9k Rose Gold',
    '9k White Gold',
    '14k Yellow Gold',
    '14k Rose Gold',
    '14k White Gold',
    '18k Yellow Gold',
    '18k Rose Gold',
    '18k White Gold'
  ];

  // Helper to normalize any metal name into one of the 13 canonical keys
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

  // Helper to parse price from string like "925 Sterling Silver (₹ 4,107)" or "(INR 4,107)"
  function parseOptionText(text) {
    let metalPart = text;
    let pricePart = '';

    // Check parenthesis e.g. "925 Sterling Silver (₹ 4,107)"
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
      if (numMatch) {
        price = Math.round(parseFloat(numMatch[1].replace(/,/g, '')));
      }
    }

    // Currency sign fallback: if price wasn't separated by parenthesis/dash
    if (!price) {
      const currMatch = text.match(/(?:₹|INR|\$|€|£)\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,7})/i);
      if (currMatch) {
        price = Math.round(parseFloat(currMatch[1].replace(/,/g, '')));
        metalPart = text.replace(currMatch[0], '').replace(/[()\-:–]/g, '').trim();
      }
    }

    return { rawMetal: metalPart.trim(), price };
  }

  // 2. Find Variation Dropdown (Band Colour / Metal)
  const selects = Array.from(document.querySelectorAll('select'));
  let bandSelect = selects.find(sel => {
    const context = [
      sel.getAttribute('aria-label') || '',
      sel.name || '',
      sel.id || '',
      sel.closest('fieldset')?.querySelector('legend')?.innerText || '',
      sel.parentElement?.querySelector('label')?.innerText || '',
      sel.previousElementSibling?.innerText || ''
    ].join(' ').toLowerCase();

    return context.includes('band') || context.includes('metal') || context.includes('colour') || context.includes('color') || context.includes('material');
  });

  // Secondary search: select that contains options with "silver" or "gold"
  if (!bandSelect) {
    bandSelect = selects.find(sel => {
      const text = sel.innerText.toLowerCase();
      return (text.includes('silver') && text.includes('gold')) || (text.includes('10k') || text.includes('14k') || text.includes('18k'));
    });
  }

  const extractedPrices = {};

  if (bandSelect) {
    console.log('🔍 Found variation dropdown: ' + (bandSelect.id || bandSelect.name || 'select'));

    const options = Array.from(bandSelect.options).filter(opt => {
      const t = opt.textContent.trim().toLowerCase();
      return t && !t.includes('select') && !t.includes('choose');
    });

    console.log(`📋 Found ${options.length} options in dropdown.`);

    // Check if options have prices in text
    let hasPricesInOptions = false;
    for (const opt of options) {
      const parsed = parseOptionText(opt.textContent);
      if (parsed.price !== null) {
        hasPricesInOptions = true;
        const norm = normalizeMetal(parsed.rawMetal);
        extractedPrices[norm] = parsed.price;
      }
    }

    // If options don't have prices in text, interactively select them to read the price on page
    if (!hasPricesInOptions && options.length > 0) {
      console.log('⏳ Option texts do not contain price. Interactively selecting each option...');
      const priceElemSelector = [
        'div[data-buy-box-region="price"]',
        'p.wt-text-title-larger',
        'span.currency-value',
        'div.wt-display-flex-xs p.wt-text-title-01',
        '[data-listing-price]'
      ].join(',');

      const originalVal = bandSelect.value;

      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        bandSelect.value = opt.value;
        bandSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(r => setTimeout(r, 350));

        const priceEl = document.querySelector(priceElemSelector);
        if (priceEl) {
          const match = priceEl.innerText.match(/₹\s*([0-9,]+)/) || priceEl.innerText.match(/([0-9,]+)/);
          if (match) {
            const price = Math.round(parseFloat(match[1].replace(/,/g, '')));
            const norm = normalizeMetal(opt.textContent);
            extractedPrices[norm] = price;
          }
        }
      }

      // Restore original selection
      bandSelect.value = originalVal;
      bandSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } else {
    // Check for radio buttons / chips
    console.warn('⚠️ No <select> dropdown found. Checking for button/radio options...');
    const radioLabels = Array.from(document.querySelectorAll('label, button')).filter(el => {
      const t = el.innerText.toLowerCase();
      return (t.includes('silver') || t.includes('gold')) && (t.includes('₹') || t.includes('overlay') || t.includes('14k'));
    });

    for (const el of radioLabels) {
      const parsed = parseOptionText(el.innerText);
      if (parsed.price) {
        const norm = normalizeMetal(parsed.rawMetal);
        extractedPrices[norm] = parsed.price;
      }
    }
  }

  // 3. Fallback / Fill Overlays and Karats if missing
  // Base silver price
  const silverPrice = extractedPrices['925 Sterling Silver']
    || extractedPrices['Yellow Gold Overlay']
    || extractedPrices['Rose Gold Overlay']
    || extractedPrices['White Gold Overlay'];

  if (silverPrice) {
    // Overlay is always identical to silver price (as established across store)
    if (!extractedPrices['925 Sterling Silver']) extractedPrices['925 Sterling Silver'] = silverPrice;
    if (!extractedPrices['Yellow Gold Overlay'])  extractedPrices['Yellow Gold Overlay'] = silverPrice;
    if (!extractedPrices['Rose Gold Overlay'])    extractedPrices['Rose Gold Overlay'] = silverPrice;
    if (!extractedPrices['White Gold Overlay'])   extractedPrices['White Gold Overlay'] = silverPrice;
  }

  // Fill in any missing karat colors from same karat tier (e.g. if 14k Yellow is present, copy to Rose & White)
  const tiers = ['9k', '10k', '14k', '18k'];
  for (const t of tiers) {
    const yellow = extractedPrices[`${t} Yellow Gold`];
    const rose = extractedPrices[`${t} Rose Gold`];
    const white = extractedPrices[`${t} White Gold`];
    const tierPrice = yellow || rose || white;
    if (tierPrice) {
      if (!extractedPrices[`${t} Yellow Gold`]) extractedPrices[`${t} Yellow Gold`] = tierPrice;
      if (!extractedPrices[`${t} Rose Gold`])   extractedPrices[`${t} Rose Gold`] = tierPrice;
      if (!extractedPrices[`${t} White Gold`])  extractedPrices[`${t} White Gold`] = tierPrice;
    }
  }

  const keysFound = Object.keys(extractedPrices);
  if (keysFound.length === 0) {
    console.error('❌ Could not extract metal prices. Please make sure the Band colour / Metal variation dropdown is visible on the page.');
    return;
  }

  console.log(`%c✅ Extracted ${keysFound.length} metal prices successfully!`, 'color: #10B981; font-weight: bold;');

  // 4. Generate the TypeScript code snippet for src/lib/data.ts
  const baseP = extractedPrices['925 Sterling Silver'] || Object.values(extractedPrices)[0];

  const codeLines = [
    `  // ── ${cleanTitle} (base ₹${baseP.toLocaleString('en-IN')}) ──`,
    `  '${productId}': {`,
    `    '925 Sterling Silver': ${extractedPrices['925 Sterling Silver'] || baseP},  'Yellow Gold Overlay': ${extractedPrices['Yellow Gold Overlay'] || baseP},`,
    `    'Rose Gold Overlay':   ${extractedPrices['Rose Gold Overlay'] || baseP},  'White Gold Overlay':  ${extractedPrices['White Gold Overlay'] || baseP},`,
  ];

  if (extractedPrices['9k Yellow Gold'] || extractedPrices['9k Rose Gold'] || extractedPrices['9k White Gold']) {
    codeLines.push(`    '9k Yellow Gold': ${extractedPrices['9k Yellow Gold'] || 0}, '9k Rose Gold': ${extractedPrices['9k Rose Gold'] || 0}, '9k White Gold': ${extractedPrices['9k White Gold'] || 0},`);
  }
  if (extractedPrices['10k Yellow Gold'] || extractedPrices['10k Rose Gold'] || extractedPrices['10k White Gold']) {
    codeLines.push(`    '10k Yellow Gold': ${extractedPrices['10k Yellow Gold'] || 0}, '10k Rose Gold': ${extractedPrices['10k Rose Gold'] || 0}, '10k White Gold': ${extractedPrices['10k White Gold'] || 0},`);
  }

  codeLines.push(`    '14k Yellow Gold': ${extractedPrices['14k Yellow Gold'] || 0}, '14k Rose Gold': ${extractedPrices['14k Rose Gold'] || 0}, '14k White Gold': ${extractedPrices['14k White Gold'] || 0},`);
  codeLines.push(`    '18k Yellow Gold': ${extractedPrices['18k Yellow Gold'] || 0}, '18k Rose Gold': ${extractedPrices['18k Rose Gold'] || 0}, '18k White Gold': ${extractedPrices['18k White Gold'] || 0},`);
  codeLines.push(`  },`);

  const formattedCode = codeLines.join('\n');

  console.log('\n%c📋 READY-TO-PASTE CODE FOR src/lib/data.ts:', 'color: #D4AF37; font-weight: bold;');
  console.log('%c' + formattedCode, 'color: #A7F3D0; font-family: monospace; font-size: 13px; line-height: 1.5;');

  // 5. Auto Copy to Clipboard
  try {
    await navigator.clipboard.writeText(formattedCode);
    console.log('%c✨ COPIED TO CLIPBOARD AUTOMATICALLY! Just paste into data.ts', 'color: #10B981; font-weight: bold; background: #064E3B; padding: 4px 8px; border-radius: 4px;');
  } catch (err) {
    console.log('ℹ️ Clipboard auto-copy restricted by browser. You can manually copy the text above from the console.');
  }

  // 6. Save to localStorage Multi-Product Store
  try {
    const storeKey = 'ETSY_SCRAPED_METAL_PRICES';
    const existing = JSON.parse(localStorage.getItem(storeKey) || '{}');
    existing[productId] = {
      title: cleanTitle,
      prices: extractedPrices,
      snippet: formattedCode
    };
    localStorage.setItem(storeKey, JSON.stringify(existing));
    const totalSaved = Object.keys(existing).length;
    console.log(`%c💾 Saved to session memory! (Total products collected: ${totalSaved})`, 'color: #60A5FA;');
    console.log('%c💡 Tip: When you finish visiting all products, type: copyAllEtsyPrices() to get all of them at once!', 'color: #9CA3AF;');
  } catch(e) {}

  // Expose global helper to dump all collected products
  window.copyAllEtsyPrices = function() {
    const existing = JSON.parse(localStorage.getItem('ETSY_SCRAPED_METAL_PRICES') || '{}');
    const allSnippets = Object.values(existing).map(item => item.snippet).join('\n');
    console.log(allSnippets);
    navigator.clipboard.writeText(allSnippets);
    alert(`Copied ${Object.keys(existing).length} product prices to clipboard!`);
  };

  return extractedPrices;
})();
