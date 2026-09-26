/**
 * foreverjewellstudio — Description + Item Details Extractor
 *
 * HOW TO USE:
 * 1. Open ONE Etsy listing page (e.g. https://www.etsy.com/in-en/listing/4582242777/...)
 * 2. Press F12 → Console tab
 * 3. Paste this entire script and press Enter
 * 4. It will run through ALL 36 listing URLs automatically
 * 5. A file called "etsy_descriptions.json" will download automatically
 *
 * ⚠️ Keep the browser tab open during the process (~3-4 minutes)
 */

async function fetchAllDescriptions() {
  // All 36 foreverjewellstudio listing IDs and URLs
  const listings = [
    { id: '4512524434', url: 'https://www.etsy.com/in-en/listing/4512524434/garnet-hexagon-and-pink-sapphire' },
    { id: '4512517618', url: 'https://www.etsy.com/in-en/listing/4512517618/radiant-cut-moissanite-engagement' },
    { id: '4582242777', url: 'https://www.etsy.com/in-en/listing/4582242777/oval-cut-rose-quartz-engagement' },
    { id: '4582254728', url: 'https://www.etsy.com/in-en/listing/4582254728/oval-black-onyx-ring-moissanite' },
    { id: '4582231925', url: 'https://www.etsy.com/in-en/listing/4582231925/elegant-oval-malachite-bezel-set' },
    { id: '4581018221', url: 'https://www.etsy.com/in-en/listing/4581018221/250ct-elongated-cushion-cut' },
    { id: '4581569462', url: 'https://www.etsy.com/in-en/listing/4581569462/crescent-moon-malachite-ring' },
    { id: '4581567484', url: 'https://www.etsy.com/in-en/listing/4581567484/14k-solid-gold-malachite-with' },
    { id: '4581565280', url: 'https://www.etsy.com/in-en/listing/4581565280/natural-malachite-marquise-cut' },
    { id: '4581555690', url: 'https://www.etsy.com/in-en/listing/4581555690/green-onyx-engagement-ring' },
    { id: '4581527793', url: 'https://www.etsy.com/in-en/listing/4581527793/personalized-birthstone-ring' },
    { id: '4516296623', url: 'https://www.etsy.com/in-en/listing/4516296623/venus-de-milo-eyes-ring' },
    { id: '4563453438', url: 'https://www.etsy.com/in-en/listing/4563453438/round-moissanite-leaf-engagement' },
    { id: '4581012935', url: 'https://www.etsy.com/in-en/listing/4581012935/oval-lab-grown-diamond-ring' },
    { id: '4576624415', url: 'https://www.etsy.com/in-en/listing/4576624415/emerald-cut-green-teal-sapphire' },
    { id: '4580293133', url: 'https://www.etsy.com/in-en/listing/4580293133/marquise-sapphire-yellow-gold' },
    { id: '4580277179', url: 'https://www.etsy.com/in-en/listing/4580277179/rose-gold-open-wedding-band' },
    { id: '4580287314', url: 'https://www.etsy.com/in-en/listing/4580287314/oval-moissanite-eternity-band' },
    { id: '4515622892', url: 'https://www.etsy.com/in-en/listing/4515622892/dainty-marquise-cut-rose-quartz' },
    { id: '4575555879', url: 'https://www.etsy.com/in-en/listing/4575555879/moissanite-signet-ring-yellow' },
    { id: '4559851298', url: 'https://www.etsy.com/in-en/listing/4559851298/oval-cut-moissanite-wide-band' },
    { id: '4527196335', url: 'https://www.etsy.com/in-en/listing/4527196335/toi-et-moi-ring-14k-solid-gold' },
    { id: '4520614290', url: 'https://www.etsy.com/in-en/listing/4520614290/oval-cut-blue-sapphire-engagement' },
    { id: '4574605185', url: 'https://www.etsy.com/in-en/listing/4574605185/14k-gold-marquise-engagement-ring' },
    { id: '4576945739', url: 'https://www.etsy.com/in-en/listing/4576945739/champagne-moissanite-engagement' },
    { id: '4576948201', url: 'https://www.etsy.com/in-en/listing/4576948201/unique-elongated-cushion-cut' },
    { id: '4576646738', url: 'https://www.etsy.com/in-en/listing/4576646738/natural-inspired-ring-6mm-round' },
    { id: '4576618399', url: 'https://www.etsy.com/in-en/listing/4576618399/sterling-silver-vintage-18k-opal' },
    { id: '4576613509', url: 'https://www.etsy.com/in-en/listing/4576613509/gold-opal-ring-october-birthstone' },
    { id: '4575565234', url: 'https://www.etsy.com/in-en/listing/4575565234/emerald-cut-engagement-ring-in-14k' },
    { id: '4558001559', url: 'https://www.etsy.com/in-en/listing/4558001559/lapis-lazuli-ring-blue-gemstone' },
    { id: '4522682939', url: 'https://www.etsy.com/in-en/listing/4522682939/14k-solid-gold-moss-agate-with' },
    { id: '4527185846', url: 'https://www.etsy.com/in-en/listing/4527185846/green-onyx-engagement-ring-oval' },
    { id: '4514456821', url: 'https://www.etsy.com/in-en/listing/4514456821/2ct-emerald-cut-moissanite' },
    { id: '4522222080', url: 'https://www.etsy.com/in-en/listing/4522222080/14k-gold-sculptural-couple' },
    { id: '4516208711', url: 'https://www.etsy.com/in-en/listing/4516208711/natural-moonstone-ring-emerald-cut' },
  ];

  const results = [];

  function extractFromHTML(html, listingId) {
    // Method 1: JSON-LD
    const jldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jldMatch) {
      try {
        let data = JSON.parse(jldMatch[1]);
        if (Array.isArray(data)) data = data[0];
        if (data.description && data.description.length > 80) {
          return { description: data.description, source: 'jsonld' };
        }
      } catch(e) {}
    }

    // Method 2: __NEXT_DATA__
    const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (ndMatch) {
      try {
        const nd = JSON.parse(ndMatch[1]);
        // Look deep for description
        const str = JSON.stringify(nd);
        // Find the listing description - usually a long string
        const descMatches = [...str.matchAll(/"description":"((?:[^"\\]|\\.)*)"/g)];
        for (const m of descMatches) {
          const desc = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g,'\\');
          if (desc.length > 100 && !desc.startsWith('http') && !desc.includes('<html')) {
            return { description: desc, source: 'nextdata' };
          }
        }
      } catch(e) {}
    }

    // Method 3: Meta description
    const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
    if (metaMatch && metaMatch[1].length > 80) {
      return { description: metaMatch[1], source: 'meta' };
    }

    return null;
  }

  function extractItemDetails(html) {
    const details = {};
    
    // Look for item details table in Next.js data
    const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (ndMatch) {
      try {
        const nd = JSON.parse(ndMatch[1]);
        const str = JSON.stringify(nd);
        
        // Extract key-value pairs that look like item details
        const kvMatches = [...str.matchAll(/"(material|materials|weight|dimensions|occasion|style|type|production)":\s*"([^"]+)"/gi)];
        for (const m of kvMatches) {
          if (m[2] && m[2].length < 200) {
            details[m[1].charAt(0).toUpperCase() + m[1].slice(1)] = m[2];
          }
        }
      } catch(e) {}
    }
    
    return details;
  }

  console.log('%c🚀 Starting description extraction for ' + listings.length + ' listings...', 'color: green; font-weight: bold');

  for (let i = 0; i < listings.length; i++) {
    const { id, url } = listings[i];
    console.log(`[${i+1}/${listings.length}] Fetching ${id}...`);
    
    try {
      const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
      const html = await res.text();
      
      const descResult = extractFromHTML(html, id);
      const itemDetails = extractItemDetails(html);
      
      if (descResult) {
        console.log(`  ✅ Got description (${descResult.description.length} chars, via ${descResult.source})`);
        results.push({
          listingId: id,
          description: descResult.description,
          source: descResult.source,
          itemDetails: itemDetails,
        });
      } else {
        console.log(`  ⚠️ No description found`);
        results.push({ listingId: id, description: null, itemDetails: {} });
      }
    } catch(e) {
      console.error(`  ❌ Error: ${e.message}`);
      results.push({ listingId: id, description: null, itemDetails: {}, error: e.message });
    }

    // Polite delay
    await new Promise(r => setTimeout(r, 600));
  }

  // Download the JSON
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'etsy_descriptions.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  const successCount = results.filter(r => r.description).length;
  console.log(`%c✅ DONE! Got descriptions for ${successCount}/${listings.length} products`, 'color: green; font-weight: bold');
  console.log('%c📥 File downloaded: etsy_descriptions.json', 'color: blue; font-weight: bold');
  console.log('Now tell the agent to run: python scripts/apply_descriptions.py etsy_descriptions.json');

  return results;
}

// START
fetchAllDescriptions();
