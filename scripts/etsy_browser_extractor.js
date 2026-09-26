/**
 * foreverjewellstudio / ANY Etsy Shop — Product Extractor
 * 
 * HOW TO USE:
 * 1. Open the Etsy shop page in your browser
 * 2. Press F12 → Console tab
 * 3. Paste this entire script and press Enter
 * 4. Wait 2-3 minutes
 * 5. A file called "etsy_products.json" will download automatically
 */

async function crawlEtsyShop() {
  const results = [];
  
  // Find all listing links on the page
  const allLinks = [...document.querySelectorAll('a[href*="/listing/"]')];
  const listingUrls = [...new Set(
    allLinks
      .map(a => a.href)
      .filter(h => h.includes('/listing/'))
      .map(h => h.split('?')[0])
  )];
  
  console.log('%c✅ Found ' + listingUrls.length + ' listings on this page', 'color: green; font-weight: bold');
  console.log('Fetching each listing... (this takes 2-3 minutes)');
  
  for (let i = 0; i < Math.min(listingUrls.length, 80); i++) {
    const url = listingUrls[i];
    const listingId = url.match(/listing\/(\d+)/)?.[1];
    if (!listingId) continue;
    
    try {
      console.log(`[${i+1}/${listingUrls.length}] Fetching listing ${listingId}...`);
      
      const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
      const html = await res.text();
      
      // Extract title
      const titleMatch = 
        html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>\s*([^<]+)\s*</) ||
        html.match(/<h1[^>]*>\s*([^<]+)\s*</);
      const title = titleMatch?.[1]?.trim().replace(/&amp;/g,'&').replace(/&#39;/g,"'") || 'Product';
      
      // Extract price (INR)
      const priceMatch = html.match(/₹[\s]*([\d,]+)/);
      const priceINR = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
      
      // Extract ALL image URLs from etsystatic CDN
      const imgMatches = [...html.matchAll(/https:\/\/i\.etsystatic\.com\/[^\s"'\\]+\.jpg/gi)]
        .map(m => m[0]);
      
      // Prefer fullxfull (largest) versions
      const fullImgs = [...new Set(imgMatches.filter(u => 
        u.includes('fullxfull') || u.includes('1588x') || u.includes('3000x')
      ))];
      
      // Fallback: convert any size to fullxfull
      let images = fullImgs;
      if (images.length === 0) {
        images = [...new Set(imgMatches)]
          .slice(0, 8)
          .map(u => u.replace(/il_\d+x\d*N?\./g, 'il_fullxfull.'));
      }
      
      // Remove duplicates between 1588xN and fullxfull versions
      const deduplicated = [];
      const seenIds = new Set();
      for (const img of images) {
        const imgId = img.match(/il_(?:fullxfull|1588xN)\.(\d+_\w+)\.jpg/)?.[1];
        if (imgId && seenIds.has(imgId)) continue;
        if (imgId) seenIds.add(imgId);
        // Only keep fullxfull
        if (img.includes('fullxfull')) deduplicated.push(img);
      }
      
      results.push({
        listingId,
        title,
        listingUrl: url,
        priceINR,
        images: (deduplicated.length > 0 ? deduplicated : images).slice(0, 6)
      });
      
    } catch(e) {
      console.error(`Error on listing ${listingId}:`, e.message);
    }
    
    // Polite delay between requests
    await new Promise(r => setTimeout(r, 400));
  }
  
  console.log('%c✅ Done! Got ' + results.length + ' products', 'color: green; font-weight: bold');
  
  // Auto-download the JSON file
  const json = JSON.stringify(results, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'etsy_products.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  console.log('%c📥 File downloaded: etsy_products.json', 'color: blue; font-weight: bold');
  console.log('Now run: python scripts/etsy_sync.py etsy_products.json');
  
  return results;
}

// START
crawlEtsyShop();
