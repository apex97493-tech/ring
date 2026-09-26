"""
Apply complete Etsy data (images + descriptions + details) to products-store.json
Usage: python scripts/apply_complete_data.py etsy_complete_data.json
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

def detect_shape(title):
    t = title.lower()
    for shape, kw in [('Hexagon','hexagon'),('Marquise','marquise'),('Cushion','cushion'),
                       ('Emerald','emerald cut'),('Pear','pear'),('Radiant','radiant'),
                       ('Oval','oval'),('Heart','heart'),('Princess','princess'),('Round','round')]:
        if kw in t: return shape
    return 'Round'

def detect_metal(title):
    t = title.lower()
    if '14k solid gold' in t: return '14k Solid Gold'
    if '18k solid gold' in t: return '18k Solid Gold'
    if '14k gold' in t: return '14k Gold Plated'
    if '18k gold' in t: return '18k Gold Plated'
    if 'rose gold' in t: return '14k Rose Gold Plated'
    if '925' in t or 'sterling silver' in t: return '925 Sterling Silver'
    if 'gold' in t: return '14k Gold Plated'
    return '925 Sterling Silver'

def detect_gemstone(title):
    t = title.lower()
    for gem in ['rose quartz','black onyx','green onyx','malachite','champagne moissanite',
                'moissanite','blue sapphire','teal sapphire','pink sapphire','sapphire',
                'ruby','emerald','garnet','white opal','opal','london blue topaz','topaz',
                'lapis lazuli','moss agate','labradorite','moonstone','amethyst','diamond']:
        if gem in t: return gem.title()
    return 'Moissanite'

def detect_badge(index, title):
    t = title.lower()
    if index < 2: return 'BESTSELLER'
    if 'personalized' in t or 'custom' in t: return 'CUSTOM ORDER'
    if 'toi et moi' in t or 'unique' in t: return 'LIMITED EDITION'
    options = ['BESTSELLER', None, None, '50% OFF', None, None, 'NEW ARRIVAL', None]
    return options[index % len(options)]

def download_image(url, filepath):
    url = re.sub(r'il_\d+xN?\d*\.', 'il_fullxfull.', url)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        data = urllib.request.urlopen(req, timeout=12).read()
        if len(data) > 5000:
            with open(filepath, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f'    Download failed: {e}')
    return False

def extract_features(description):
    """Pull out bullet-point features from the description."""
    lines = [l.strip() for l in description.split('\n') if l.strip()]
    features = []
    for line in lines:
        if line.startswith(('•', '-', '✓', '✦', '*', '►', '→', '◆')):
            clean = line.lstrip('•-✓✦*►→◆ ').strip()
            if 5 < len(clean) < 150:
                features.append(clean)
        elif ':' in line and len(line) < 120 and not line.startswith('http'):
            features.append(line)
    return features[:8]

def build_product(etsy_item, index, local_images):
    """Build a complete product object from Etsy data."""
    lid = etsy_item['listingId']
    title = etsy_item.get('title', 'Ring')
    price = etsy_item.get('priceINR', 0)
    description = clean_text(etsy_item.get('description', ''))
    item_details = etsy_item.get('itemDetails', {})
    tags = etsy_item.get('tags', [])
    rating = etsy_item.get('rating') or round(4.8 + (index % 3) * 0.07, 1)
    reviews = etsy_item.get('reviewsCount') or 45 + (index * 23) % 500

    shape = detect_shape(title)
    metal = detect_metal(title)
    gem = detect_gemstone(title)
    badge = detect_badge(index, title)

    # Build features from description or use defaults
    features = extract_features(description)
    if len(features) < 4:
        features = [
            f'Handcrafted by master artisans at foreverjewellstudio, Jaipur India',
            'GRA Certified with Authenticity Card & Warranty',
            'Arrives in Signature Luxury Ring Box',
            '925 Sterling Silver / 14K Gold options available',
            'Passes Standard Diamond Thermal Testers',
            '3-5 Days Free Express Delivery Across India',
        ]

    return {
        'id': f'fjws-{lid}',
        'name': title,
        'slug': make_slug(title, lid),
        'category': 'rings',
        'shape': shape,
        'price': price,
        'originalPrice': int(price * 1.85),
        'carat': '2.00 CT',
        'clarity': 'VVS1',
        'colorGrade': 'D Color',
        'cut': f'{shape} Brilliant Cut',
        'certification': 'GRA Certified with Authenticity Card',
        'badge': badge,
        'rating': rating,
        'reviewsCount': reviews,
        'metal': metal,
        'primaryGemstone': gem,
        'secondaryGemstone': 'GRA Certified Moissanite Accents',
        'ringStyle': f'{shape} Solitaire',
        'occasion': item_details.get('Occasion', 'Engagement, Anniversary, Promise Ring'),
        'sku': f'FJS-{lid[-6:]}',
        'grossWeight': item_details.get('Weight', '3.5G'),
        'karatage': metal,
        'diamondType': f'{gem} (GRA Certified)',
        'diamondColor': 'D-Colorless',
        'diamondClarity': 'VVS1',
        'settingStyle': item_details.get('Style', 'Artisan Prong / Bezel Setting'),
        'images': local_images,
        'description': description,
        'features': features,
        'itemDetails': item_details,
        'tags': tags,
        'readyToShip': True,
        'deliveryTime': '3-5 Days Free Express Air Delivery',
        'prepaidDiscountNote': '₹300 OFF on prepaid orders',
        'bespokeNotice': 'BESPOKE! SHIPS IN 2-3 WEEKS!',
        'stockStatus': 'in_stock',
        'stockQuantity': 12,
        'isFeatured': index < 6,
        'variants': [
            {'metal': '14k Yellow Gold', 'colorCode': '#CA8A04',
             'image': local_images[0] if local_images else ''},
            {'metal': '14k Rose Gold', 'colorCode': '#FB7185',
             'image': local_images[1] if len(local_images) > 1 else (local_images[0] if local_images else '')},
            {'metal': '925 Sterling Silver', 'colorCode': '#E2E8F0',
             'image': local_images[2] if len(local_images) > 2 else (local_images[0] if local_images else '')},
        ],
    }

def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'etsy_complete_data.json'

    print(f'\n{"="*55}')
    print(f'  Applying Complete Etsy Data to Website')
    print(f'{"="*55}\n')

    with open(input_file, 'r', encoding='utf-8') as f:
        etsy_items = json.load(f)

    print(f'📂 Loaded {len(etsy_items)} items from {input_file}')

    # Filter: skip items with errors, keep only items with images
    valid = [item for item in etsy_items if not item.get('error') and item.get('images')]
    print(f'✅ Valid items with images: {len(valid)}\n')

    # Auto-detect main shop ID from image URLs
    shop_id_counts = {}
    for item in valid:
        for img in item.get('images', []):
            m = re.search(r'etsystatic\.com/(\d+)/', img)
            if m:
                sid = m.group(1)
                shop_id_counts[sid] = shop_id_counts.get(sid, 0) + 1
    if shop_id_counts:
        main_shop_id = max(shop_id_counts, key=shop_id_counts.get)
        print(f'🏪 Main shop ID detected: {main_shop_id}')
        # Keep only products from this shop
        filtered = [p for p in valid if any(main_shop_id in img for img in p.get('images', []))]
        print(f'   Filtered to {len(filtered)} products from main shop\n')
    else:
        filtered = valid

    # Download all images
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    print(f'📥 Downloading images to {UPLOAD_DIR}/')

    ok_imgs = 0
    fail_imgs = 0

    for idx, item in enumerate(filtered):
        lid = item['listingId']
        local_images = []
        print(f'  [{idx+1}/{len(filtered)}] {item.get("title","?")[:45]}...')

        for i, img_url in enumerate(item.get('images', [])[:5]):  # up to 5 images
            fname = f'etsy_{lid}_img{i+1}.jpg'
            fpath = os.path.join(UPLOAD_DIR, fname)

            if os.path.exists(fpath) and os.path.getsize(fpath) > 5000:
                local_images.append(f'/uploads/{fname}')
                ok_imgs += 1
                continue

            if download_image(img_url, fpath):
                size_kb = os.path.getsize(fpath) // 1024
                print(f'    ✓ img{i+1} ({size_kb}KB)')
                local_images.append(f'/uploads/{fname}')
                ok_imgs += 1
            else:
                local_images.append(img_url)  # CDN fallback
                fail_imgs += 1

            time.sleep(0.1)

        item['localImages'] = local_images

    print(f'\n📊 Images: {ok_imgs} downloaded, {fail_imgs} failed\n')

    # Build product catalog
    print('🔨 Building product catalog...')
    products = []
    for i, item in enumerate(filtered):
        product = build_product(item, i, item.get('localImages', item.get('images', [])))
        products.append(product)

    # Save
    with open(STORE_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f'\n{"="*55}')
    print(f'✅ SUCCESS! {len(products)} products saved to {STORE_FILE}')
    print(f'{"="*55}\n')

    # Summary table
    with_desc = sum(1 for p in products if len(p.get('description', '')) > 100)
    with_details = sum(1 for p in products if p.get('itemDetails'))
    print(f'  📝 With real description:  {with_desc}/{len(products)}')
    print(f'  🔖 With item details:      {with_details}/{len(products)}')
    print(f'  🖼️  Images per product:     avg {ok_imgs//max(len(products),1)} per product\n')

    print('🚀 Next steps:')
    print('   git add -A && git commit -m "sync: complete Etsy data with descriptions & images" && git push')

if __name__ == '__main__':
    main()
