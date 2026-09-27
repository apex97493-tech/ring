"""
Apply Extracted Etsy Metal Prices to src/lib/data.ts

Usage:
  python scripts/apply_metal_prices.py
"""

import os
import re
import json
import glob
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DATA_TS_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'data.ts')
SCRIPTS_DIR = os.path.dirname(__file__)

def main():
    json_files = glob.glob(os.path.join(SCRIPTS_DIR, 'etsy_metal_prices*.json'))
    
    # Also check user Downloads folder if file was just downloaded by browser
    user_home = os.path.expanduser('~')
    downloads_dir = os.path.join(user_home, 'Downloads')
    json_files += glob.glob(os.path.join(downloads_dir, 'etsy_metal_prices*.json'))

    if not json_files:
        print("❌ No etsy_metal_prices*.json files found in scripts/ or Downloads/.")
        print("Please place the downloaded JSON file in the scripts/ folder and re-run.")
        return

    print(f"🔍 Found {len(json_files)} price JSON files:")
    combined_prices = {}

    for fpath in json_files:
        print(f"  Reading {os.path.basename(fpath)}...")
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                items = data if isinstance(data, list) else [data]
                for item in items:
                    pid = item.get('productId') or ('fjws-' + str(item.get('listingId', '')))
                    title = item.get('title', 'Product')
                    band_prices = item.get('bandPrices', {})
                    if pid and band_prices:
                        combined_prices[pid] = {
                            'title': title,
                            'prices': band_prices
                        }
        except Exception as e:
            print(f"  ⚠️ Error reading {fpath}: {e}")

    print(f"\n✅ Total unique products with prices: {len(combined_prices)}")

    if not os.path.exists(DATA_TS_PATH):
        print(f"❌ Could not find {DATA_TS_PATH}")
        return

    with open(DATA_TS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match PRODUCT_METAL_PRICES block
    pattern = r'(export const PRODUCT_METAL_PRICES: Record<string, Record<string, number>> = \{)([\s\S]*?)(\n\};)'
    match = re.search(pattern, content)

    if not match:
        print("❌ Could not locate PRODUCT_METAL_PRICES block in src/lib/data.ts")
        return

    existing_block = match.group(2)

    # Format new entries
    new_entries = []
    for pid, info in combined_prices.items():
        # Check if already present
        if f"'{pid}': {{" in existing_block:
            print(f"  Skipping {pid} (already in data.ts)")
            continue

        title = info['title'][:55]
        p = info['prices']
        base_p = p.get('925 Sterling Silver', 0)

        lines = [
            f"  // ── {title} (base ₹{base_p:,}) ──",
            f"  '{pid}': {{",
            f"    '925 Sterling Silver': {p.get('925 Sterling Silver', base_p)},  'Yellow Gold Overlay': {p.get('Yellow Gold Overlay', base_p)},",
            f"    'Rose Gold Overlay':   {p.get('Rose Gold Overlay', base_p)},  'White Gold Overlay':  {p.get('White Gold Overlay', base_p)},",
        ]
        if any(k.startswith('9k') for k in p):
            lines.append(f"    '9k Yellow Gold': {p.get('9k Yellow Gold', 0)}, '9k Rose Gold': {p.get('9k Rose Gold', 0)}, '9k White Gold': {p.get('9k White Gold', 0)},")
        if any(k.startswith('10k') for k in p):
            lines.append(f"    '10k Yellow Gold': {p.get('10k Yellow Gold', 0)}, '10k Rose Gold': {p.get('10k Rose Gold', 0)}, '10k White Gold': {p.get('10k White Gold', 0)},")
        lines.append(f"    '14k Yellow Gold': {p.get('14k Yellow Gold', 0)}, '14k Rose Gold': {p.get('14k Rose Gold', 0)}, '14k White Gold': {p.get('14k White Gold', 0)},")
        lines.append(f"    '18k Yellow Gold': {p.get('18k Yellow Gold', 0)}, '18k Rose Gold': {p.get('18k Rose Gold', 0)}, '18k White Gold': {p.get('18k White Gold', 0)},")
        lines.append("  },")
        entry = "\n".join(lines)
        new_entries.append(entry)

    if not new_entries:
        print("ℹ️ No new products to append to data.ts.")
        return

    updated_block = existing_block.rstrip() + "\n\n" + "\n\n".join(new_entries) + "\n"
    new_content = content[:match.start(2)] + updated_block + content[match.end(2):]

    with open(DATA_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"\n🎉 Successfully added {len(new_entries)} products with exact Etsy prices into src/lib/data.ts!")

if __name__ == '__main__':
    main()
