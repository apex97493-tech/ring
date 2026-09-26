"""
Apply Etsy descriptions to products-store.json
Usage: python scripts/apply_descriptions.py etsy_descriptions.json
"""
import json, sys, re

def clean_text(text):
    """Clean HTML and normalize whitespace."""
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('&amp;', '&').replace('&#39;', "'").replace('&quot;', '"').replace('&lt;', '<').replace('&gt;', '>').replace('&nbsp;', ' ')
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_features_from_description(description):
    """Extract bullet-point style features from description text."""
    lines = [l.strip() for l in description.split('\n') if l.strip()]
    features = []
    for line in lines:
        # Lines that start with bullets or dashes or are short highlights
        if line.startswith(('•', '-', '✓', '*', '►', '→')):
            clean = line.lstrip('•-✓*►→ ').strip()
            if clean and len(clean) > 5:
                features.append(clean)
        elif len(line) < 120 and ':' in line and not line.startswith('http'):
            features.append(line)
    return features[:8] if features else []

def main():
    desc_file = sys.argv[1] if len(sys.argv) > 1 else 'etsy_descriptions.json'
    store_file = 'src/lib/products-store.json'

    print(f'Loading {desc_file}...')
    with open(desc_file, 'r', encoding='utf-8') as f:
        descriptions = json.load(f)

    print(f'Loading {store_file}...')
    with open(store_file, 'r', encoding='utf-8') as f:
        products = json.load(f)

    # Build lookup by listingId
    desc_map = {d['listingId']: d for d in descriptions}
    
    updated = 0
    for product in products:
        listing_id = product['id'].replace('fjws-', '')
        desc_data = desc_map.get(listing_id)
        
        if desc_data and desc_data.get('description'):
            raw_desc = clean_text(desc_data['description'])
            if len(raw_desc) > 80:
                product['description'] = raw_desc
                
                # Extract features from description if it has bullet points
                features = extract_features_from_description(raw_desc)
                if features:
                    product['features'] = features
                
                # Add item details if available
                if desc_data.get('itemDetails'):
                    product['itemDetails'] = desc_data['itemDetails']
                
                updated += 1
                print(f'  ✓ {product["name"][:45]} — {len(raw_desc)} chars')
        else:
            print(f'  ✗ No description for {listing_id}: {product["name"][:40]}')

    with open(store_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f'\n✅ Done! Updated {updated}/{len(products)} products with real Etsy descriptions.')
    print(f'Now run: git add -A && git commit -m "feat: add real Etsy descriptions" && git push')

if __name__ == '__main__':
    main()
