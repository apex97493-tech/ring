#!/usr/bin/env python3
"""
Etsy Shop Product Sync Script
================================
Downloads real product photos from any Etsy shop and builds a products-store.json

USAGE:
  python scripts/etsy_sync.py etsy_products.json
  python scripts/etsy_sync.py etsy_products.json --output src/lib/products-store.json
  python scripts/etsy_sync.py etsy_products.json --shop-id 40882668

WHAT IT DOES:
  1. Reads etsy_products.json (from the browser extractor script)
  2. Filters to keep only products from the main shop (removes ads/other sellers)
  3. Downloads all images locally to public/uploads/etsy_LISTINGID_imgN.jpg
  4. Builds a complete products-store.json with all fields needed by the website
"""

import json
import re
import os
import sys
import time
import argparse
import urllib.request

# ─────────────────────────────────────────
# CONFIGURATION — Edit these for each project
# ─────────────────────────────────────────
UPLOAD_DIR = 'public/uploads'        # Where images are saved
OUTPUT_FILE = 'src/lib/products-store.json'  # Product catalog output
SHOP_NAME = 'foreverjewellstudio'    # Change to client's shop name
IMAGES_PER_PRODUCT = 3               # How many images to download per product
REQUEST_DELAY = 0.1                  # Seconds between image downloads

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# ─────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────

def make_slug(title, listing_id):
    s = re.sub(r'[^a-z0-9]+', '-', title.lower())[:60].strip('-')
    return f'{s}-{listing_id[-6:]}'

def detect_shape(title):
    t = title.lower()
    if 'hexagon' in t: return 'Hexagon'
    if 'marquise' in t: return 'Marquise'
    if 'cushion' in t: return 'Cushion'
    if 'emerald cut' in t: return 'Emerald'
    if 'pear' in t: return 'Pear'
    if 'radiant' in t: return 'Radiant'
    if 'oval' in t: return 'Oval'
    if 'round' in t: return 'Round'
    if 'princess' in t: return 'Princess'
    if 'heart' in t: return 'Heart'
    if 'asscher' in t: return 'Asscher'
    return 'Round'

def detect_metal(title):
    t = title.lower()
    if '14k solid gold' in t: return '14k Solid Gold'
    if '18k solid gold' in t: return '18k Solid Gold'
    if '14k gold' in t or '14k yellow gold' in t: return '14k Gold Plated'
    if '18k gold' in t: return '18k Gold Plated'
    if 'rose gold' in t: return '14k Rose Gold Plated'
    if 'silver' in t or '925' in t: return '925 Sterling Silver'
    if 'gold filled' in t: return '14k Gold Filled'
    if 'gold' in t: return '14k Gold Plated'
    return '925 Sterling Silver'

def detect_gemstone(title):
    t = title.lower()
    gems = [
        'rose quartz', 'black onyx', 'green onyx', 'malachite', 'moissanite',
        'blue sapphire', 'teal sapphire', 'pink sapphire', 'sapphire',
        'ruby', 'emerald', 'garnet', 'white opal', 'opal', 'topaz',
        'lapis lazuli', 'moss agate', 'labradorite', 'moonstone',
        'amethyst', 'peridot', 'turquoise', 'pearl', 'diamond',
        'london blue topaz', 'champagne moissanite',
    ]
    for gem in gems:
        if gem in t:
            return gem.title()
    return 'Moissanite'

def detect_badge(index, title):
    t = title.lower()
    if index < 2: return 'BESTSELLER'
    if 'personalized' in t or 'custom' in t: return 'CUSTOM ORDER'
    if 'limited' in t or 'toi et moi' in t or 'unique' in t: return 'LIMITED EDITION'
    if 'new' in t: return 'NEW ARRIVAL'
    badges = ['BESTSELLER', None, None, '50% OFF', None, None, 'NEW ARRIVAL', None]
    return badges[index % len(badges)]

def download_image(url, filepath):
    """Download a single image. Returns True if successful."""
    # Convert 1588xN URLs to fullxfull for better quality
    url = re.sub(r'il_\d+xN?\.', 'il_fullxfull.', url)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        data = urllib.request.urlopen(req, timeout=12).read()
        if len(data) > 5000:  # At least 5KB = valid image
            with open(filepath, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f'    ⚠ Download failed: {e}')
    return False

def build_product(item, index):
    """Convert a raw Etsy listing dict into a full website product object."""
    lid = item['listingId']
    title = item.get('title', 'Ring')
    price = item.get('priceINR', 0)
    local_imgs = item.get('localImages', item.get('images', []))

    shape = detect_shape(title)
    metal = detect_metal(title)
    gem = detect_gemstone(title)
    badge = detect_badge(index, title)
    orig = int(price * 1.85)  # Show ~85% discount

    return {
        'id': f'fjws-{lid}',
        'name': title,
        'slug': make_slug(title, lid),
        'category': 'rings',
        'shape': shape,
        'price': price,
        'originalPrice': orig,
        'carat': '2.00 CT',
        'clarity': 'VVS1',
        'colorGrade': 'D Color',
        'cut': f'{shape} Brilliant Cut',
        'certification': 'GRA Certified with Authenticity Card',
        'badge': badge,
        'rating': round(4.8 + (index % 3) * 0.07, 1),
        'reviewsCount': 45 + (index * 23) % 500,
        'metal': metal,
        'primaryGemstone': gem,
        'secondaryGemstone': 'GRA Certified Moissanite Accents',
        'ringStyle': f'{shape} Solitaire',
        'occasion': 'Engagement, Anniversary, Promise Ring',
        'sku': f'{SHOP_NAME[:3].upper()}-{lid[-6:]}',
        'grossWeight': '3.5G',
        'karatage': metal,
        'diamondType': f'{gem} (GRA Certified)',
        'diamondColor': 'D-Colorless',
        'diamondClarity': 'VVS1',
        'settingStyle': 'Artisan Prong / Bezel Setting',
        'images': local_imgs,
        'description': (
            f'Handcrafted with passion by master artisans at {SHOP_NAME}. '
            f'{title}. Each piece is crafted to perfection with premium certified metals '
            f'and genuine gemstones. Available in multiple metal options. '
            f'Arrives gift-ready in our signature luxury jewelry box.'
        ),
        'features': [
            f'Handcrafted by master artisans at {SHOP_NAME}',
            'GRA Certified with Authenticity Card & Warranty',
            'Arrives in Signature Luxury Ring Box',
            '925 Sterling Silver / 14K Gold options available',
            'Passes Standard Diamond Thermal Testers',
            '3-5 Days Free Express Delivery Across India',
        ],
        'readyToShip': True,
        'deliveryTime': '3-5 Days Free Express Air Delivery',
        'prepaidDiscountNote': '₹300 OFF on prepaid orders',
        'bespokeNotice': 'BESPOKE! SHIPS IN 2-3 WEEKS!',
        'stockStatus': 'in_stock',
        'stockQuantity': 12,
        'isFeatured': index < 6,
        'variants': [
            {'metal': '14k Yellow Gold', 'colorCode': '#CA8A04',
             'image': local_imgs[0] if local_imgs else ''},
            {'metal': '14k Rose Gold', 'colorCode': '#FB7185',
             'image': local_imgs[1] if len(local_imgs) > 1 else (local_imgs[0] if local_imgs else '')},
            {'metal': '925 Sterling Silver', 'colorCode': '#E2E8F0',
             'image': local_imgs[2] if len(local_imgs) > 2 else (local_imgs[0] if local_imgs else '')},
        ],
    }

# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Sync Etsy shop products to website')
    parser.add_argument('input', help='Path to etsy_products.json from browser extractor')
    parser.add_argument('--output', default=OUTPUT_FILE, help='Output products-store.json path')
    parser.add_argument('--upload-dir', default=UPLOAD_DIR, help='Directory to save images')
    parser.add_argument('--shop-id', default=None, help='Etsy shop ID to filter (auto-detected if not given)')
    args = parser.parse_args()

    print(f'\n{"="*50}')
    print(f'  Etsy Product Sync — {SHOP_NAME}')
    print(f'{"="*50}\n')

    # Load raw data
    print(f'📂 Loading {args.input}...')
    with open(args.input, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    print(f'   Found {len(raw_data)} raw listings')

    # Auto-detect shop ID if not provided
    shop_id = args.shop_id
    if not shop_id:
        shop_id_counts = {}
        for item in raw_data:
            for img_url in item.get('images', []):
                m = re.search(r'etsystatic\.com/(\d+)/', img_url)
                if m:
                    sid = m.group(1)
                    shop_id_counts[sid] = shop_id_counts.get(sid, 0) + 1
        if shop_id_counts:
            shop_id = max(shop_id_counts, key=shop_id_counts.get)
            print(f'   Auto-detected shop ID: {shop_id}')

    # Filter to only products from this shop
    if shop_id:
        filtered = [p for p in raw_data if any(
            shop_id in img for img in p.get('images', [])
        )]
        skipped = len(raw_data) - len(filtered)
        print(f'   Kept {len(filtered)} shop products, skipped {skipped} from other shops/ads\n')
    else:
        filtered = raw_data
        print('   No shop ID filter applied\n')

    # Download images
    os.makedirs(args.upload_dir, exist_ok=True)
    print(f'📥 Downloading images to {args.upload_dir}/')
    print(f'   ({len(filtered)} products × {IMAGES_PER_PRODUCT} images = up to {len(filtered)*IMAGES_PER_PRODUCT} files)\n')

    total_ok = 0
    total_fail = 0

    for idx, item in enumerate(filtered):
        lid = item['listingId']
        local_imgs = []
        print(f'  [{idx+1}/{len(filtered)}] {item.get("title","?")[:45]}...')

        for i, url in enumerate(item.get('images', [])[:IMAGES_PER_PRODUCT]):
            fname = f'etsy_{lid}_img{i+1}.jpg'
            fpath = os.path.join(args.upload_dir, fname)

            if os.path.exists(fpath) and os.path.getsize(fpath) > 5000:
                local_imgs.append(f'/uploads/{fname}')
                total_ok += 1
                continue

            if download_image(url, fpath):
                size_kb = os.path.getsize(fpath) // 1024
                print(f'    ✓ {fname} ({size_kb}KB)')
                local_imgs.append(f'/uploads/{fname}')
                total_ok += 1
            else:
                print(f'    ✗ Failed — using CDN URL')
                local_imgs.append(url)
                total_fail += 1

            time.sleep(REQUEST_DELAY)

        item['localImages'] = local_imgs

    print(f'\n📊 Download results: {total_ok} OK, {total_fail} failed\n')

    # Build product catalog
    print(f'🔨 Building product catalog...')
    products = [build_product(item, i) for i, item in enumerate(filtered)]

    # Save output
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f'\n{"="*50}')
    print(f'✅ SUCCESS! {len(products)} products synced.')
    print(f'   Catalog: {args.output}')
    print(f'   Images:  {args.upload_dir}/')
    print(f'{"="*50}\n')

    print('📋 Products synced:')
    for p in products:
        print(f"  • {p['name'][:55]} — ₹{p['price']:,}")

    print(f'\n🚀 Next steps:')
    print(f'   1. Check your site at http://localhost:3000/shop')
    print(f'   2. git add -A && git commit -m "sync: import products from Etsy" && git push')


if __name__ == '__main__':
    main()
