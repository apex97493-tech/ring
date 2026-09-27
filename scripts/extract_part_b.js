/**
 * EXTRACTOR PART B — LAST 12 PRODUCTS (~7 seconds)
 */
(async function extractPartB() {
  console.clear();
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const targetListings = [
    'https://www.etsy.com/in-en/listing/4559851298',
    'https://www.etsy.com/in-en/listing/4527196335',
    'https://www.etsy.com/in-en/listing/4520614290',
    'https://www.etsy.com/in-en/listing/4574605185',
    'https://www.etsy.com/in-en/listing/4576945739',
    'https://www.etsy.com/in-en/listing/4576948201',
    'https://www.etsy.com/in-en/listing/4576646738',
    'https://www.etsy.com/in-en/listing/4576618399',
    'https://www.etsy.com/in-en/listing/4576613509',
    'https://www.etsy.com/in-en/listing/4575565234',
    'https://www.etsy.com/in-en/listing/4558001559',
    'https://www.etsy.com/in-en/listing/4574617829'
  ];

  function normalizeMetal(raw) {
    const s = raw.toLowerCase().trim();
    if (s.includes('925') || s.includes('sterling')) return '925 Sterling Silver';
    if (s.includes('overlay') || s.includes('plated') || s.includes('vermeil')) {
      if (s.includes('rose')) return 'Rose Gold Overlay';
      if (s.includes('white')) return 'White Gold Overlay';
      return 'Yellow Gold Overlay';
    }
    if (s.includes('9k') || s.includes('9 k')) {
      if (s.includes('rose')) return '9k Rose Gold';
      if (s.includes('white')) return '9k White Gold';
      return '9k Yellow Gold';
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

  const results = [];
  for (let i = 0; i < targetListings.length; i++) {
    const url = targetListings[i];
    const listingId = url.match(/\/listing\/(\d+)/)?.[1];
    const productId = 'fjws-' + listingId;
    try {
      const res = await fetch(url, { headers: { 'Accept': 'text/html,application/xhtml+xml' }, credentials: 'include' });
      if (!res.ok) { await delay(500); continue; }
      const html = await res.text();
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 50) : 'Product';
      let baseINR = 0;
      const basePriceMatch = html.match(/₹\s*([0-9,]+)/);
      if (basePriceMatch) baseINR = parseInt(basePriceMatch[1].replace(/,/g, ''), 10);
      const extractedPrices = {};
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const selects = Array.from(doc.querySelectorAll('select'));
      let bandSelect = selects.find(sel => {
        const context = [sel.getAttribute('aria-label') || '', sel.name || '', sel.id || '', sel.closest('fieldset')?.querySelector('legend')?.innerText || '', sel.parentElement?.querySelector('label')?.innerText || ''].join(' ').toLowerCase();
        return context.includes('band') || context.includes('metal') || context.includes('colour') || context.includes('color');
      }) || selects.find(sel => {
        const text = sel.innerText.toLowerCase();
        return (text.includes('silver') && text.includes('gold')) || text.includes('14k');
      });
      if (bandSelect) {
        for (const opt of Array.from(bandSelect.options)) {
          const t = opt.textContent.trim().toLowerCase();
          if (t && !t.includes('select') && !t.includes('choose')) {
            const parsed = parseOptionText(opt.textContent);
            if (parsed.price !== null && parsed.price > 0) extractedPrices[normalizeMetal(parsed.rawMetal)] = parsed.price;
          }
        }
      }
      if (baseINR > 0) {
        if (!extractedPrices['925 Sterling Silver']) extractedPrices['925 Sterling Silver'] = baseINR;
        if (!extractedPrices['Yellow Gold Overlay']) extractedPrices['Yellow Gold Overlay'] = baseINR;
        if (!extractedPrices['Rose Gold Overlay']) extractedPrices['Rose Gold Overlay'] = baseINR;
        if (!extractedPrices['White Gold Overlay']) extractedPrices['White Gold Overlay'] = baseINR;
      }
      console.log(`[${i+1}/${targetListings.length}] ✓ ${title}`);
      results.push({ listingId, productId, url, title, basePriceINR: baseINR, bandPrices: extractedPrices });
      await delay(500);
    } catch(e) {
      console.error(e);
    }
  }
  console.log('COPY THIS:');
  console.log(JSON.stringify(results));
  try { await navigator.clipboard.writeText(JSON.stringify(results)); console.log('Copied to clipboard!'); } catch(e){}
  return results;
})();
