"""
merge_etsy_batch.py
Merges newly extracted Etsy products into products-store.json:
- Downloads up to 8 images per product to public/uploads/
- Parses rich itemDetails from Etsy description (Main stone, Stone size, Shape, Metal, Ring size, etc.)
- Updates existing products if already present, or appends new ones
- Preserves all other existing products
"""

import json, sys, re, os, time, urllib.request

UPLOAD_DIR = 'public/uploads'
STORE_FILE = 'src/lib/products-store.json'
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def clean_text(text):
    if not text: return ''
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = (text.replace('&amp;', '&').replace('&#39;', "'")
            .replace('&quot;', '"').replace('&lt;', '<')
            .replace('&gt;', '>').replace('&nbsp;', ' '))
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def make_slug(title, listing_id):
    s = re.sub(r'[^a-z0-9]+', '-', title.lower())[:60].strip('-')
    return f'{s}-{listing_id[-6:]}'

def detect_shape(title, details):
    shape_val = details.get('Stone Shape') or details.get('Cut/Shape') or ''
    if shape_val:
        for s in ['Hexagon', 'Marquise', 'Cushion', 'Emerald', 'Pear', 'Radiant', 'Oval', 'Heart', 'Princess', 'Round']:
            if s.lower() in shape_val.lower():
                return s

    t = title.lower()
    for shape, kw in [('Hexagon','hexagon'),('Marquise','marquise'),('Cushion','cushion'),
                       ('Emerald','emerald cut'),('Pear','pear'),('Radiant','radiant'),
                       ('Oval','oval'),('Heart','heart'),('Princess','princess'),('Round','round')]:
        if kw in t: return shape
    return 'Oval' if 'oval' in t else 'Round'

def detect_metal(title, details):
    m_val = details.get('Metal') or ''
    if '925' in m_val or 'silver' in m_val.lower():
        # But if title specifies 14k gold:
        if '14k solid gold' in title.lower(): return '14k Solid Gold / 925 Silver'
        return '925 Sterling Silver'

    t = title.lower()
    if '14k solid gold' in t: return '14k Solid Gold'
    if '18k solid gold' in t: return '18k Solid Gold'
    if '14k gold' in t: return '14k Gold Plated'
    if 'rose gold' in t: return '14k Rose Gold Plated'
    if '925' in t or 'sterling silver' in t: return '925 Sterling Silver'
    return '925 Sterling Silver'

def detect_gemstone(title, details):
    gem_val = details.get('Main stone') or details.get('Main Stone') or details.get('Primary Gemstone') or ''
    if gem_val and len(gem_val) < 30:
        return gem_val.title()

    t = title.lower()
    for gem in ['kammererite','aqua chalcedony','chalcedony','morganite','rose quartz','black onyx','green onyx','smoky quartz','malachite','champagne moissanite',
                'moissanite','blue sapphire','teal sapphire','pink sapphire','sapphire',
                'ruby','emerald','garnet','white opal','opal','topaz','moss agate','moonstone',
                'alexandrite','amethyst','citrine','labradorite','larimar','lapis lazuli','lapis','aquamarine','freshwater pearl','pearl','diamond']:
        if gem in t: return gem.title()
    return 'Moissanite'

def detect_category(title, details, desc=''):
    t = title.lower()
    d = desc.lower() if desc else ''
    
    # Body, Ear, Wrist, Neck jewelry checks first
    if 'belly' in t or 'navel' in t:
        return 'belly-rings'
    if 'nose ring' in t or 'nose pin' in t or 'septum' in t:
        return 'nose-ring'
    if 'earring' in t or 'huggie' in t or ('stud' in t and 'ring' not in t):
        return 'earrings'
    if 'bracelet' in t or 'bangle' in t or 'cuff' in t:
        return 'bracelet'
    if 'necklace' in t or 'choker' in t or 'chain' in t:
        return 'necklace'
    if 'pendant' in t or 'locket' in t:
        return 'pendant'
    
    # Lesbian / LGBT couple rings
    if ('lesbian' in t or 'lesbian' in d or 'venus' in t or 'lgbt' in t) and ('ring' in t or 'band' in t or 'signet' in t):
        return 'lesbian-ring'

    # Bridal / Ring Sets
    if (
        'ring set' in t 
        or 'bridal set' in t 
        or 'wedding set' in t 
        or 'bridal ring set' in t
        or 'stack set' in t 
        or 'two piece' in t 
        or 'three piece' in t
        or 'toi et moi' in t
    ):
        return 'ring-set'
        
    # Bands
    if (
        'band' in t 
        or 'eternity' in t 
        or 'chevron' in t 
        or 'contour' in t
    ) and 'solitaire' not in t and 'engagement ring set' not in t:
        return 'band'
        
    return 'rings'

def parse_item_details(description):
    """Parse structured key-value specifications from Etsy description."""
    details = {}
    lines = [l.strip() for l in description.split('\n') if l.strip()]
    for line in lines:
        cleaned = line.lstrip('*•- ✓✦►→◆').strip()
        if ':' in cleaned:
            parts = cleaned.split(':', 1)
            k = parts[0].strip()
            v = parts[1].strip()
            if 1 < len(k) < 30 and 0 < len(v) < 100:
                if k.lower() not in ['http', 'https', 'important', 'important*']:
                    details[k] = v
    return details

def extract_features(description, details):
    features = []
    # Add structured specs as key features
    if 'Main stone' in details or 'Main Stone' in details:
        gem = details.get('Main stone') or details.get('Main Stone')
        shape = details.get('Stone Shape') or details.get('Cut/Shape') or ''
        size = details.get('Stone Size') or details.get('Size') or ''
        features.append(f'Primary Gemstone: {gem} {shape} ({size})'.strip())

    if 'Secondary Stone' in details or 'Secondary Gemstone(s)' in details:
        sec = details.get('Secondary Stone') or details.get('Secondary Gemstone(s)')
        sec_shape = details.get('Stone Shape', '')
        features.append(f'Accent Stones: {sec}'.strip())

    if 'Metal' in details:
        features.append(f"Base Metal: {details['Metal']} (Customizable in 14k/18k Solid Gold)")

    if 'Ring Size' in details:
        features.append(f"Available Sizing: {details['Ring Size']}")

    features.append("Handmade by Master Artisans in Jaipur, India")
    features.append("Complimentary Velvet Luxury Gift Box Included")
    features.append("Passes Diamond & Moissanite Thermal Testers")
    return features

def download_image(url, filepath):
    url = re.sub(r'il_\d+xN?\d*\.', 'il_fullxfull.', url)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        data = urllib.request.urlopen(req, timeout=15).read()
        if len(data) > 5000:
            with open(filepath, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f'    Download failed: {e}')
    return False

def main():
    batch_file = sys.argv[1] if len(sys.argv) > 1 else 'scripts/etsy_batch_1.json'

    print(f'{"="*60}')
    print(f'  Merging Etsy Data Batch from: {batch_file}')
    print(f'{"="*60}\n')

    with open(batch_file, 'r', encoding='utf-8') as f:
        items = json.load(f)

    # Filter out Unknowns and custom listings
    valid_items = []
    for it in items:
        title = it.get('title', '').strip()
        if not title or title.lower() == 'unknown':
            continue
        if 'custom listing' in title.lower():
            continue
        valid_items.append(it)

    print(f'Found {len(valid_items)} valid listings in batch.')

    # Load existing store
    existing_products = []
    if os.path.exists(STORE_FILE):
        with open(STORE_FILE, 'r', encoding='utf-8') as f:
            existing_products = json.load(f)

    print(f'Current store has {len(existing_products)} products.')

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    products_by_id = {p['id']: p for p in existing_products}

    for idx, item in enumerate(valid_items):
        lid = item['listingId']
        pid = f'fjws-{lid}'
        title = item.get('title', 'Ring')
        price = item.get('priceINR', 4500)
        desc = clean_text(item.get('description', ''))
        parsed_details = parse_item_details(desc)
        # Merge with existing itemDetails if any
        if item.get('itemDetails'):
            parsed_details.update(item['itemDetails'])

        print(f'\n[{idx+1}/{len(valid_items)}] Processing {lid}: {title[:40]}...')

        # Filter image URLs to keep only foreverjewellstudio images (shop 40882668)
        raw_images = item.get('images', [])
        valid_images = [img for img in raw_images if '40882668' in img]
        if not valid_images:
            valid_images = raw_images

        from concurrent.futures import ThreadPoolExecutor

        def fetch_img(idx_url):
            i, img_url = idx_url
            fname = f'etsy_{lid}_img{i+1}.jpg'
            fpath = os.path.join(UPLOAD_DIR, fname)
            if os.path.exists(fpath) and os.path.getsize(fpath) > 5000:
                return (i, f'/uploads/{fname}', None)
            if download_image(img_url, fpath):
                size_kb = os.path.getsize(fpath) // 1024
                return (i, f'/uploads/{fname}', f'   Downloaded img{i+1}: {size_kb}KB')
            return (i, img_url, None)

        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(fetch_img, enumerate(valid_images[:8])))

        results.sort(key=lambda x: x[0])
        local_images = []
        for _, path, log_msg in results:
            if log_msg:
                print(log_msg)
            local_images.append(path)

        # If existing product had some images, ensure local_images isn't empty
        if not local_images and pid in products_by_id:
            local_images = products_by_id[pid].get('images', [])

        shape = detect_shape(title, parsed_details)
        metal = detect_metal(title, parsed_details)
        gem = detect_gemstone(title, parsed_details)
        features = extract_features(desc, parsed_details)

        stone_size = parsed_details.get('Stone Size') or parsed_details.get('Size') or '7x9mm'
        category = detect_category(title, parsed_details, desc)

        product_data = {
            'id': pid,
            'name': title,
            'slug': make_slug(title, lid),
            'category': category,
            'shape': shape,
            'price': price,
            'originalPrice': int(price * 1.85),
            'carat': '2.00 CT' if '2.5' not in title else '2.50 CT',
            'clarity': 'VVS1',
            'colorGrade': 'D-Colorless',
            'cut': f'{shape} Brilliant Cut',
            'certification': 'GRA Certified with Authenticity Card',
            'badge': 'BESTSELLER' if idx < 3 else ('NEW ARRIVAL' if idx < 6 else None),
            'rating': item.get('rating') or 4.9,
            'reviewsCount': item.get('reviewsCount') or (48 + idx * 15),
            'metal': metal,
            'primaryGemstone': gem,
            'secondaryGemstone': parsed_details.get('Secondary Stone') or 'CZ Diamond Accents',
            'ringStyle': f'{shape} Solitaire Promise Ring',
            'occasion': parsed_details.get('Occasion', 'Engagement, Anniversary, Promise Ring'),
            'sku': f'FJS-{lid[-6:]}',
            'grossWeight': parsed_details.get('Weight', '3.5G (approx)'),
            'karatage': metal,
            'diamondType': f'{gem} (Handmade Fine Jewelry)',
            'diamondColor': parsed_details.get('Stone Color', 'Colorless'),
            'diamondClarity': 'VVS1 Flawless',
            'settingStyle': parsed_details.get('Style', 'Art Deco / Designer Prong Setting'),
            'images': local_images,
            'description': desc,
            'features': features,
            'itemDetails': parsed_details,
            'tags': item.get('tags', []),
            'readyToShip': True,
            'deliveryTime': '3-5 Days Free Express Air Delivery',
            'prepaidDiscountNote': '₹300 OFF on prepaid orders',
            'bespokeNotice': 'BESPOKE! SHIPS IN 2-3 WEEKS!',
            'stockStatus': 'in_stock',
            'stockQuantity': 12,
            'isFeatured': idx < 4,
            'variants': [
                {'metal': '14k Yellow Gold', 'colorCode': '#CA8A04',
                 'image': local_images[0] if local_images else ''},
                {'metal': '14k Rose Gold', 'colorCode': '#FB7185',
                 'image': local_images[1] if len(local_images) > 1 else (local_images[0] if local_images else '')},
                {'metal': '925 Sterling Silver', 'colorCode': '#E2E8F0',
                 'image': local_images[2] if len(local_images) > 2 else (local_images[0] if local_images else '')},
            ],
        }

        # Update in dictionary
        products_by_id[pid] = product_data
        print(f'   -> Saved {pid} with {len(local_images)} images and {len(parsed_details)} spec details')

    # Convert back to list (new or updated first or preserving order)
    updated_products = list(products_by_id.values())

    with open(STORE_FILE, 'w', encoding='utf-8') as f:
        json.dump(updated_products, f, indent=2, ensure_ascii=False)

    print(f'\n{"="*60}')
    print(f'[OK] STORE UPDATED! Total products in catalog: {len(updated_products)}')
    print(f'{"="*60}\n')

if __name__ == '__main__':
    main()
