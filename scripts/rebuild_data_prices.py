"""
Rebuild PRODUCT_METAL_PRICES in src/lib/data.ts cleanly from verified batch files.
Removes:
- Old hardcoded formula estimates
- Any zero-price entries ('14k Yellow Gold': 0, etc.)
- Duplicate entries
"""

import os
import re
import json
import glob
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DATA_TS_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'data.ts')
SCRIPTS_DIR = os.path.dirname(__file__)

def main():
    batch_files = sorted(glob.glob(os.path.join(SCRIPTS_DIR, 'etsy_metal_prices_batch_*.json')))
    print(f"🔍 Reading {len(batch_files)} batch files...")

    all_products = {}
    for bf in batch_files:
        try:
            with open(bf, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data:
                    pid = item.get('productId') or ('fjws-' + str(item.get('listingId', '')))
                    title = item.get('title', 'Product')[:55]
                    # only keep positive non-zero prices
                    band_prices = {k: v for k, v in item.get('bandPrices', {}).items() if isinstance(v, (int, float)) and v > 0}
                    if pid and band_prices:
                        all_products[pid] = {
                            'title': title,
                            'prices': band_prices
                        }
        except Exception as e:
            print(f"Error reading {bf}: {e}")

    # Also keep the verified Oval Lab Grown screenshot product (fjws-4581012935)
    if 'fjws-4581012935' not in all_products:
        all_products['fjws-4581012935'] = {
            'title': 'Oval Lab Grown Diamond Ring',
            'prices': {
                '925 Sterling Silver': 4107,
                'Yellow Gold Overlay': 4107,
                'Rose Gold Overlay': 4107,
                'White Gold Overlay': 4107,
                '9k Yellow Gold': 37568,
                '9k Rose Gold': 37568,
                '9k White Gold': 37568,
                '14k Yellow Gold': 52596,
                '14k Rose Gold': 52596,
                '14k White Gold': 52596,
                '18k Yellow Gold': 70128,
                '18k Rose Gold': 70128,
                '18k White Gold': 70128
            }
        }

    print(f"✅ Total clean products: {len(all_products)}")

    # Build clean TypeScript entries
    formatted_entries = []
    for pid, info in all_products.items():
        title = info['title']
        p = info['prices']
        base_p = p.get('925 Sterling Silver') or p.get('Yellow Gold Overlay') or 0

        lines = [
            f"  // ── {title} (base ₹{base_p:,}) ──",
            f"  '{pid}': {{"
        ]

        # Silver and overlays
        silver_opts = []
        for m in ['925 Sterling Silver', 'Yellow Gold Overlay', 'Rose Gold Overlay', 'White Gold Overlay']:
            if m in p and p[m] > 0:
                silver_opts.append(f"'{m}': {p[m]}")
        if silver_opts:
            lines.append(f"    {',  '.join(silver_opts)},")

        # 9k Gold
        gold_9k = [f"'{m}': {p[m]}" for m in ['9k Yellow Gold', '9k Rose Gold', '9k White Gold'] if m in p and p[m] > 0]
        if gold_9k:
            lines.append(f"    {', '.join(gold_9k)},")

        # 10k Gold
        gold_10k = [f"'{m}': {p[m]}" for m in ['10k Yellow Gold', '10k Rose Gold', '10k White Gold'] if m in p and p[m] > 0]
        if gold_10k:
            lines.append(f"    {', '.join(gold_10k)},")

        # 14k Gold
        gold_14k = [f"'{m}': {p[m]}" for m in ['14k Yellow Gold', '14k Rose Gold', '14k White Gold'] if m in p and p[m] > 0]
        if gold_14k:
            lines.append(f"    {', '.join(gold_14k)},")

        # 18k Gold
        gold_18k = [f"'{m}': {p[m]}" for m in ['18k Yellow Gold', '18k Rose Gold', '18k White Gold'] if m in p and p[m] > 0]
        if gold_18k:
            lines.append(f"    {', '.join(gold_18k)},")

        lines.append("  },")
        formatted_entries.append("\n".join(lines))

    # Replace in data.ts
    with open(DATA_TS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'(export const PRODUCT_METAL_PRICES: Record<string, Record<string, number>> = \{)([\s\S]*?)(\n\};)'
    match = re.search(pattern, content)
    if not match:
        print("❌ Could not find PRODUCT_METAL_PRICES block in data.ts")
        return

    new_block = "\n" + "\n\n".join(formatted_entries) + "\n"
    new_content = content[:match.start(2)] + new_block + content[match.end(2):]

    with open(DATA_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"🎉 Successfully rebuilt PRODUCT_METAL_PRICES with {len(formatted_entries)} 100% verified clean products!")

if __name__ == '__main__':
    main()
