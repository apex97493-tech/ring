"""
Fetch real descriptions and item details from every Etsy listing
and update products-store.json
"""
import urllib.request, json, re, time, html as html_lib

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

LISTING_BASE = 'https://www.etsy.com/in-en/listing/'

def clean_html(text):
    """Remove HTML tags and decode entities."""
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = html_lib.unescape(text)
    return re.sub(r'\n{3,}', '\n\n', text).strip()

def extract_description(page_html):
    """Extract product description from Etsy listing HTML."""
    
    # Method 1: JSON-LD structured data (most reliable)
    jld_match = re.search(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', page_html, re.DOTALL)
    if jld_match:
        try:
            data = json.loads(jld_match.group(1))
            if isinstance(data, list):
                data = data[0]
            if 'description' in data and len(data['description']) > 50:
                return clean_html(data['description'])
        except:
            pass
    
    # Method 2: Etsy's __NEXT_DATA__ JSON
    next_data = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', page_html, re.DOTALL)
    if next_data:
        try:
            nd = json.loads(next_data.group(1))
            # Navigate to listing description in Next.js data
            listing = nd.get('props', {}).get('pageProps', {}).get('listingData', {})
            desc = listing.get('description', '')
            if desc and len(desc) > 50:
                return clean_html(desc)
        except:
            pass

    # Method 3: Meta description tag
    meta = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', page_html, re.IGNORECASE)
    if meta:
        desc = meta.group(1).strip()
        if len(desc) > 80:
            return clean_html(desc)
    
    return None

def extract_item_details(page_html):
    """Extract item details/specs table from Etsy listing."""
    details = {}
    
    # Try Next.js data for item details
    next_data = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', page_html, re.DOTALL)
    if next_data:
        try:
            nd = json.loads(next_data.group(1))
            listing = nd.get('props', {}).get('pageProps', {}).get('listingData', {})
            
            # Material
            material = listing.get('material', '')
            if material:
                details['Material'] = material
                
            # Shipping weight
            shipping = listing.get('shipping_profile', {})
            
            # Style/Production
            production = listing.get('production_type', '')
            if production:
                details['Production'] = production
                
        except:
            pass
    
    # Try to find structured details in HTML
    # Etsy puts details in a "wt-list-unstyled" or "listing-page-overview" section
    detail_patterns = [
        (r'(?:Material|Materials)[\s:]+</[^>]+>\s*<[^>]+>([^<]+)<', 'Material'),
        (r'(?:Production\s+type|Made\s+by)[\s:]+</[^>]+>\s*<[^>]+>([^<]+)<', 'Production'),
        (r'(?:Item\s+type|Type)[\s:]+</[^>]+>\s*<[^>]+>([^<]+)<', 'Type'),
    ]
    
    for pattern, key in detail_patterns:
        m = re.search(pattern, page_html, re.IGNORECASE)
        if m:
            details[key] = clean_html(m.group(1)).strip()
    
    return details

def fetch_listing(listing_id, listing_url):
    """Fetch a single Etsy listing page and extract description + details."""
    try:
        req = urllib.request.Request(listing_url, headers=HEADERS)
        response = urllib.request.urlopen(req, timeout=15)
        page_html = response.read().decode('utf-8', errors='ignore')
        
        description = extract_description(page_html)
        details = extract_item_details(page_html)
        
        return description, details
    except Exception as e:
        print(f'  ERROR fetching {listing_id}: {e}')
        return None, {}

def main():
    # Load current products
    with open('src/lib/products-store.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f'Fetching descriptions for {len(products)} products...')
    print('This will take 3-5 minutes (polite delays between requests)\n')
    
    updated = 0
    failed = 0
    
    for i, product in enumerate(products):
        pid = product.get('id', '')
        # Extract listing ID from id field (fjws-LISTINGID)
        listing_id = pid.replace('fjws-', '')
        title = product.get('name', '')[:50]
        
        # Build the listing URL
        slug_part = re.sub(r'[^a-z0-9]+', '-', product.get('name', '').lower())[:60].strip('-')
        listing_url = f'{LISTING_BASE}{listing_id}/{slug_part}'
        
        print(f'[{i+1}/{len(products)}] {title}...')
        
        description, details = fetch_listing(listing_id, listing_url)
        
        if description and len(description) > 100:
            # Clean and limit description length
            clean_desc = description[:2000]
            product['description'] = clean_desc
            
            # Update features from description if we got good content
            # Extract bullet points / key specs from description
            lines = [l.strip() for l in clean_desc.split('\n') if l.strip() and len(l.strip()) > 15]
            if len(lines) >= 3:
                # Use first 6 meaningful lines as features
                product['features'] = lines[:6]
            
            print(f'  Got description ({len(description)} chars)')
            updated += 1
        else:
            print(f'  No description found, keeping existing')
            failed += 1
        
        # Also add item details if we got any
        if details:
            product['itemDetails'] = details
        
        # Save after each product so we don't lose progress
        if (i + 1) % 5 == 0:
            with open('src/lib/products-store.json', 'w', encoding='utf-8') as f:
                json.dump(products, f, indent=2, ensure_ascii=False)
            print(f'  [Progress saved - {i+1}/{len(products)}]')
        
        # Polite delay between requests
        time.sleep(1.5)
    
    # Final save
    with open('src/lib/products-store.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f'\nDone! Updated {updated} products, {failed} had no description.')
    
    # Show sample
    print('\nSample description from first product:')
    print(products[0].get('description', 'none')[:400])

if __name__ == '__main__':
    main()
