import json, os, re

STORE_FILE = 'src/lib/products-store.json'

def detect_category(title, desc='', item_details=None):
    if item_details is None:
        item_details = {}
    
    t = title.lower()
    d = desc.lower() if desc else ''
    j_type = (item_details.get('Jewelry Type') or '').lower()

    # 1. Lesbian ring (signature collection item)
    if 'lesbian' in t or 'lesbian' in d:
        return 'lesbian-ring'

    # 2. Belly / Navel rings
    if 'belly' in t or 'navel' in t:
        return 'belly-rings'

    # 3. Nose rings / pins
    if 'nose ring' in t or 'nose pin' in t or 'septum' in t:
        return 'nose-ring'

    # 4. Earrings / studs
    if 'earring' in t or 'huggie' in t or ('stud' in t and 'ring' not in t):
        return 'earrings'

    # 5. Bracelets / bangles
    if 'bracelet' in t or 'bangle' in t or 'cuff' in t:
        return 'bracelet'

    # 6. Necklaces
    if 'necklace' in t or 'choker' in t or 'chain' in t:
        return 'necklace'

    # 7. Pendants
    if 'pendant' in t or 'locket' in t:
        return 'pendant'

    # 8. Ring Sets / Bridal Sets
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

    # 9. Bands / Eternity Bands / Stacking Bands
    if (
        'band' in t 
        or 'eternity' in t 
        or 'chevron' in t 
        or 'contour' in t
    ) and 'solitaire' not in t and 'engagement ring set' not in t:
        return 'band'

    # 10. Default: Solitaire & Engagement Rings
    return 'rings'

def main():
    if not os.path.exists(STORE_FILE):
        print("Store file not found!")
        return

    with open(STORE_FILE, 'r', encoding='utf-8') as f:
        products = json.load(f)

    changes = []
    category_counts = {}

    for p in products:
        old_cat = p.get('category', 'rings')
        new_cat = detect_category(
            p.get('name', ''),
            p.get('description', ''),
            p.get('itemDetails', {})
        )
        p['category'] = new_cat
        category_counts[new_cat] = category_counts.get(new_cat, 0) + 1

        if old_cat != new_cat:
            changes.append((p['id'], p['name'][:50], old_cat, new_cat))

    with open(STORE_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f"Updated {len(products)} products in {STORE_FILE}!")
    print(f"\nChanged {len(changes)} product categories:")
    for pid, name, o, n in changes:
        print(f"  [{o} -> {n}] {pid}: {name}...")

    print("\nFINAL CATEGORY DISTRIBUTION:")
    for cat, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  - {cat:15}: {count} products")

if __name__ == '__main__':
    main()
